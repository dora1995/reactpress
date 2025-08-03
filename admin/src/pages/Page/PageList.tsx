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
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { pageAPI } from '../../services/api';
import type { Page } from '../../types/api';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const PageList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState<Page[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchPages();
  }, [current, pageSize, searchText, statusFilter]);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: current,
        pageSize,
      };
      
      if (searchText) params.search = searchText;
      if (statusFilter) params.status = statusFilter;

      const response = await pageAPI.getPages(params);
      setPages(response.data);
      setTotal(response.total);
    } catch (error) {
      message.error('获取页面列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await pageAPI.deletePage(id);
      message.success('删除成功');
      fetchPages();
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

  const columns = [
    {
      title: '页面名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '页面路径',
      dataIndex: 'path',
      key: 'path',
      render: (text: string) => (
        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
          {text}
        </code>
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
      title: '浏览量',
      dataIndex: 'views',
      key: 'views',
      width: 100,
      render: (views: number) => (
        <span>
          <EyeOutlined /> {views}
        </span>
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
      render: (_, record: Page) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/pages/${record.id}/edit`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个页面吗？"
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
          页面管理
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/pages/new')}
        >
          新建页面
        </Button>
      </div>

      <Card>
        {/* 搜索和筛选 */}
        <Row gutter={16} className="mb-4">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="搜索页面名称"
              allowClear
              onSearch={handleSearch}
              className="w-full"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
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
        </Row>

        {/* 页面表格 */}
        <Table
          columns={columns}
          dataSource={pages}
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
        />
      </Card>
    </div>
  );
};

export default PageList;