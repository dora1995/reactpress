import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  Popconfirm,
  message,
  Typography,
  Row,
  Col,
  Card,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { articleAPI, categoryAPI } from '../../services/api';
import type { Article, Category } from '../../types/api';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const ArticleList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, [current, pageSize, searchText, statusFilter, categoryFilter]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: current,
        pageSize,
      };
      
      if (searchText) params.search = searchText;
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.categoryId = categoryFilter;

      const response = await articleAPI.getArticles(params);
      setArticles(response);
      setTotal(response.length);
    } catch (error) {
      message.error('获取文章列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getCategories();
      setCategories(response);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await articleAPI.deleteArticle(id);
      message.success('删除成功');
      fetchArticles();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrent(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrent(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    setCurrent(1);
  };

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (text: string, record: Article) => (
        <div>
          <div className="font-medium">{text}</div>
          {record.summary && (
            <div className="text-sm text-gray-500 mt-1 line-clamp-2">
              {record.summary}
            </div>
          )}
        </div>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: Category) => (
        category ? <Tag color="blue">{category.label}</Tag> : '-'
      ),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 150,
      render: (tags: any[]) => (
        <div>
          {tags?.map((tag) => (
            <Tag key={tag.id} size="small">
              {tag.label}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={status === 'publish' ? 'green' : 'orange'}>
          {status === 'publish' ? '已发布' : '草稿'}
        </Tag>
      ),
    },
    {
      title: '统计',
      key: 'stats',
      width: 120,
      render: (_, record: Article) => (
        <Space direction="vertical" size="small">
          <span>
            <EyeOutlined /> {record.views}
          </span>
          <span>
            <HeartOutlined /> {record.likes}
          </span>
        </Space>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      key: 'createAt',
      width: 120,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record: Article) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/articles/${record.id}/edit`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这篇文章吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Title level={2} className="mb-0">
          文章管理
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/articles/new')}
        >
          新建文章
        </Button>
      </div>

      <Card>
        {/* 搜索和筛选 */}
        <Row gutter={16} className="mb-4">
          <Col xs={24} sm={8} md={6}>
            <Search
              placeholder="搜索文章标题"
              allowClear
              onSearch={handleSearch}
              className="w-full"
            />
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Select
              placeholder="选择状态"
              allowClear
              onChange={handleStatusChange}
              className="w-full"
            >
              <Option value="publish">已发布</Option>
              <Option value="draft">草稿</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Select
              placeholder="选择分类"
              allowClear
              onChange={handleCategoryChange}
              className="w-full"
            >
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.label}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>

        {/* 文章表格 */}
        <Table
          columns={columns}
          dataSource={articles}
          rowKey="id"
          loading={loading}
          pagination={{
            current,
            pageSize,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            onChange: (page, size) => {
              setCurrent(page);
              setPageSize(size || 10);
            },
          }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
};

export default ArticleList;