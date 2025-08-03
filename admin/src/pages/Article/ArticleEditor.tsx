import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Typography,
  Row,
  Col,
  Switch,
  DatePicker,
  Upload,
  message,
  Space,
} from 'antd';
import {
  SaveOutlined,
  EyeOutlined,
  UploadOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { articleAPI, categoryAPI, tagAPI, fileAPI } from '../../services/api';
import type { Article, Category, Tag } from '../../types/api';
import dayjs from 'dayjs';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ArticleEditor: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchCategories();
    fetchTags();
    
    if (id) {
      setIsEdit(true);
      fetchArticle(id);
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getCategories();
      setCategories(response);
    } catch (error) {
      message.error('获取分类失败');
    }
  };

  const fetchTags = async () => {
    try {
      const response = await tagAPI.getTags();
      setTags(response);
    } catch (error) {
      message.error('获取标签失败');
    }
  };

  const fetchArticle = async (articleId: string) => {
    setLoading(true);
    try {
      const article = await articleAPI.getArticleById(articleId);
      form.setFieldsValue({
        title: article.title,
        summary: article.summary,
        content: article.content,
        cover: article.cover,
        categoryId: article.category?.id,
        tagIds: article.tags?.map(tag => tag.id),
        status: article.status,
        isRecommended: article.isRecommended,
        needPassword: article.needPassword,
        password: '',
        isCommentable: article.isCommentable,
        publishAt: article.publishAt ? dayjs(article.publishAt) : null,
      });
    } catch (error) {
      message.error('获取文章详情失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const data = {
        ...values,
        publishAt: values.publishAt ? values.publishAt.toISOString() : null,
        tagIds: values.tagIds || [],
      };

      if (isEdit && id) {
        await articleAPI.updateArticle(id, data);
        message.success('文章更新成功');
      } else {
        await articleAPI.createArticle(data);
        message.success('文章创建成功');
      }
      
      navigate('/articles');
    } catch (error) {
      message.error(isEdit ? '更新失败' : '创建失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    const values = await form.validateFields();
    values.status = 'draft';
    handleSubmit(values);
  };

  const handlePublish = async () => {
    const values = await form.validateFields();
    values.status = 'publish';
    if (!values.publishAt) {
      values.publishAt = dayjs();
    }
    handleSubmit(values);
  };

  const handleUpload = async (file: any) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fileAPI.uploadFile(formData);
      form.setFieldsValue({ cover: response.url });
      message.success('上传成功');
    } catch (error) {
      message.error('上传失败');
    }
    
    return false; // 阻止默认上传行为
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/articles')}
          >
            返回列表
          </Button>
          <Title level={2} className="mb-0">
            {isEdit ? '编辑文章' : '新建文章'}
          </Title>
        </div>
        
        <Space>
          <Button
            icon={<SaveOutlined />}
            onClick={handleSaveDraft}
            loading={loading}
          >
            保存草稿
          </Button>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={handlePublish}
            loading={loading}
          >
            发布文章
          </Button>
        </Space>
      </div>

      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <Card title="文章内容">
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                status: 'draft',
                isRecommended: false,
                needPassword: false,
                isCommentable: true,
              }}
            >
              <Form.Item
                name="title"
                label="文章标题"
                rules={[{ required: true, message: '请输入文章标题' }]}
              >
                <Input placeholder="请输入文章标题" size="large" />
              </Form.Item>

              <Form.Item
                name="summary"
                label="文章摘要"
              >
                <TextArea
                  placeholder="请输入文章摘要（可选，系统会自动生成）"
                  rows={3}
                />
              </Form.Item>

              <Form.Item
                name="content"
                label="文章内容"
                rules={[{ required: true, message: '请输入文章内容' }]}
              >
                <TextArea
                  placeholder="请输入文章内容（支持 Markdown 格式）"
                  rows={20}
                />
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <div className="space-y-6">
            {/* 发布设置 */}
            <Card title="发布设置" size="small">
              <Form form={form} layout="vertical">
                <Form.Item name="publishAt" label="发布时间">
                  <DatePicker
                    showTime
                    placeholder="选择发布时间"
                    className="w-full"
                  />
                </Form.Item>

                <Form.Item name="status" label="文章状态">
                  <Select placeholder="选择状态">
                    <Option value="draft">草稿</Option>
                    <Option value="publish">发布</Option>
                  </Select>
                </Form.Item>
              </Form>
            </Card>

            {/* 分类和标签 */}
            <Card title="分类和标签" size="small">
              <Form form={form} layout="vertical">
                <Form.Item name="categoryId" label="文章分类">
                  <Select placeholder="选择分类" allowClear>
                    {categories.map((category) => (
                      <Option key={category.id} value={category.id}>
                        {category.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item name="tagIds" label="文章标签">
                  <Select
                    mode="multiple"
                    placeholder="选择标签"
                    allowClear
                  >
                    {tags.map((tag) => (
                      <Option key={tag.id} value={tag.id}>
                        {tag.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Form>
            </Card>

            {/* 封面图片 */}
            <Card title="封面图片" size="small">
              <Form form={form} layout="vertical">
                <Form.Item name="cover" label="封面URL">
                  <Input placeholder="输入图片URL或上传图片" />
                </Form.Item>
                
                <Upload
                  beforeUpload={handleUpload}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />} block>
                    上传封面图片
                  </Button>
                </Upload>
              </Form>
            </Card>

            {/* 高级设置 */}
            <Card title="高级设置" size="small">
              <Form form={form} layout="vertical">
                <Form.Item name="isRecommended" valuePropName="checked">
                  <Switch /> 推荐到首页
                </Form.Item>

                <Form.Item name="isCommentable" valuePropName="checked">
                  <Switch /> 允许评论
                </Form.Item>

                <Form.Item name="needPassword" valuePropName="checked">
                  <Switch /> 需要密码访问
                </Form.Item>

                <Form.Item
                  name="password"
                  label="访问密码"
                  dependencies={['needPassword']}
                  style={{ display: form.getFieldValue('needPassword') ? 'block' : 'none' }}
                >
                  <Input.Password placeholder="设置访问密码" />
                </Form.Item>
              </Form>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ArticleEditor;