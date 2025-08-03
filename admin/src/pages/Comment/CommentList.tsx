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
  Modal,
  Avatar,
} from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  SearchOutlined,
  UserOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { commentAPI } from '../../services/api';
import type { Comment } from '../../types/api';
import dayjs from 'dayjs';

const { Title, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const CommentList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [current, pageSize, searchText, statusFilter]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: current,
        pageSize,
      };
      
      if (searchText) params.search = searchText;
      if (statusFilter) params.status = statusFilter;

      const response = await commentAPI.getComments(params);
      setComments(response.data);
      setTotal(response.total);
    } catch (error) {
      message.error('获取评论列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await commentAPI.updateComment(id, { pass: true });
      message.success('评论已通过审核');
      fetchComments();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await commentAPI.updateComment(id, { pass: false });
      message.success('评论已拒绝');
      fetchComments();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await commentAPI.deleteComment(id);
      message.success('删除成功');
      fetchComments();
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

  const showDetail = (comment: Comment) => {
    setSelectedComment(comment);
    setDetailVisible(true);
  };

  const columns = [
    {
      title: '用户信息',
      key: 'user',
      width: 150,
      render: (_, record: Comment) => (
        <div className="flex items-center space-x-2">
          <Avatar size="small" icon={<UserOutlined />} />
          <div>
            <div className="font-medium">{record.name}</div>
            <div className="text-xs text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: '评论内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (text: string, record: Comment) => (
        <div>
          <Paragraph
            ellipsis={{ rows: 2, expandable: true }}
            className="mb-0"
          >
            {text}
          </Paragraph>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => showDetail(record)}
            className="p-0 h-auto"
          >
            查看详情
          </Button>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'pass',
      key: 'pass',
      width: 80,
      render: (pass: boolean) => (
        <Tag color={pass ? 'green' : 'orange'}>
          {pass ? '已通过' : '待审核'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      key: 'createAt',
      width: 120,
      render: (date: string) => dayjs(date).format('MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record: Comment) => (
        <Space size="small">
          {!record.pass && (
            <Button
              type="link"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => handleApprove(record.id)}
              className="text-green-600"
            >
              通过
            </Button>
          )}
          {record.pass && (
            <Button
              type="link"
              size="small"
              icon={<CloseOutlined />}
              onClick={() => handleReject(record.id)}
              className="text-orange-600"
            >
              拒绝
            </Button>
          )}
          <Popconfirm
            title="确定要删除这条评论吗？"
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
          评论管理
        </Title>
      </div>

      <Card>
        {/* 搜索和筛选 */}
        <Row gutter={16} className="mb-4">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="搜索评论内容或用户名"
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
              <Option value="true">已通过</Option>
              <Option value="false">待审核</Option>
            </Select>
          </Col>
        </Row>

        {/* 评论表格 */}
        <Table
          columns={columns}
          dataSource={comments}
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
          scroll={{ x: 800 }}
        />
      </Card>

      {/* 评论详情模态框 */}
      <Modal
        title="评论详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={600}
      >
        {selectedComment && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">用户信息</h4>
              <div className="flex items-center space-x-3">
                <Avatar icon={<UserOutlined />} />
                <div>
                  <div className="font-medium">{selectedComment.name}</div>
                  <div className="text-sm text-gray-500">{selectedComment.email}</div>
                </div>
                <Tag color={selectedComment.pass ? 'green' : 'orange'}>
                  {selectedComment.pass ? '已通过' : '待审核'}
                </Tag>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">评论内容</h4>
              <div className="bg-gray-50 p-3 rounded">
                {selectedComment.content}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">评论时间</h4>
              <div>{dayjs(selectedComment.createAt).format('YYYY-MM-DD HH:mm:ss')}</div>
            </div>

            {selectedComment.userAgent && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">用户代理</h4>
                <div className="text-sm text-gray-600 break-all">
                  {selectedComment.userAgent}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4 border-t">
              {!selectedComment.pass && (
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={() => {
                    handleApprove(selectedComment.id);
                    setDetailVisible(false);
                  }}
                >
                  通过审核
                </Button>
              )}
              {selectedComment.pass && (
                <Button
                  icon={<CloseOutlined />}
                  onClick={() => {
                    handleReject(selectedComment.id);
                    setDetailVisible(false);
                  }}
                >
                  拒绝审核
                </Button>
              )}
              <Popconfirm
                title="确定要删除这条评论吗？"
                onConfirm={() => {
                  handleDelete(selectedComment.id);
                  setDetailVisible(false);
                }}
                okText="确定"
                cancelText="取消"
              >
                <Button danger icon={<DeleteOutlined />}>
                  删除评论
                </Button>
              </Popconfirm>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CommentList;