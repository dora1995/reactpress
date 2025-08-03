import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
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
  Select,
} from 'antd';
import {
  SaveOutlined,
  EyeOutlined,
  UploadOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { pageAPI, fileAPI } from '../../services/api';
import type { Page } from '../../types/api';
import dayjs from 'dayjs';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const PageEditor: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      fetchPage(id);
    }
  }, [id]);

  const fetchPage = async (pageId: string) => {
    setLoading(true);
    try {
      const page = await pageAPI.getPageById(pageId);
      form.setFieldsValue({
        name: page.name,
        path: page.path,
        content: page.content,
        cover: page.cover,
        status: page.status,
        needPassword: page.needPassword,
        password: '',
        isCommentable: page.isCommentable,
        publishAt: page.publishAt ? dayjs(page.publishAt) : null,
      });
    } catch (error) {
      message.error('获取页面详情失败');
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
      };

      if (isEdit && id) {
        await pageAPI.updatePage(id, data);
        message.success('页面更新成功');
      } else {
        await pageAPI.createPage(data);
        message.success('页面创建成功');
      }
      
      navigate('/pages');
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
    
    return false;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/pages')}
          >
            返回列表
          </Button>
          <Title level={2} className="mb-0">
            {isEdit ? '编辑页面' : '新建页面'}
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
            发布页面
          </Button>
        </Space>
      </div>

      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <Card title="页面内容">
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                status: 'draft',
                needPassword: false,
                isCommentable: false,
              }}
            >
              <Form.Item
                name="name"
                label="页面名称"
                rules={[{ required: true, message: '请输入页面名称' }]}
              >
                <Input placeholder="请输入页面名称" size="large" />
              </Form.Item>

              <Form.Item
                name="path"
                label="页面路径"
                rules={[
                  { required: true, message: '请输入页面路径' },
                  { pattern: /^\/[a-zA-Z0-9_/-]*$/, message: '路径格式不正确，应以/开头' },
                ]}
              >
                <Input
                  placeholder="请输入页面路径（如：/about）"
                  addonBefore="域名"
                />
              </Form.Item>

              <Form.Item
                name="content"
                label="页面内容"
                rules={[{ required: true, message: '请输入页面内容' }]}
              >
                <TextArea
                  placeholder="请输入页面内容（支持 Markdown 格式）"
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

                <Form.Item name="status" label="页面状态">
                  <Select placeholder="选择状态">
                    <Option value="draft">草稿</Option>
                    <Option value="publish">发布</Option>
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

export default PageEditor;