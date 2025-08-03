import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Popconfirm,
  message,
  Typography,
  Card,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { tagAPI } from '../../services/api';
import type { Tag } from '../../types/api';
import dayjs from 'dayjs';

const { Title } = Typography;

const TagList: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const response = await tagAPI.getTags();
      setTags(response);
    } catch (error) {
      message.error('获取标签列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingTag(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    form.setFieldsValue({
      label: tag.label,
      value: tag.value,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await tagAPI.deleteTag(id);
      message.success('删除成功');
      fetchTags();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingTag) {
        await tagAPI.updateTag(editingTag.id, values);
        message.success('更新成功');
      } else {
        await tagAPI.createTag(values);
        message.success('创建成功');
      }
      
      setModalVisible(false);
      fetchTags();
    } catch (error) {
      message.error(editingTag ? '更新失败' : '创建失败');
    }
  };

  const columns = [
    {
      title: '标签名称',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: '标签值',
      dataIndex: 'value',
      key: 'value',
      render: (text: string) => (
        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
          {text}
        </code>
      ),
    },
    {
      title: '文章数量',
      dataIndex: 'articles',
      key: 'articleCount',
      render: (articles: any[]) => articles?.length || 0,
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      key: 'createAt',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record: Tag) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个标签吗？"
            description="删除后，相关文章将不再包含此标签。"
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
          标签管理
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          新建标签
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={tags}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
        />
      </Card>

      <Modal
        title={editingTag ? '编辑标签' : '新建标签'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Form.Item
            name="label"
            label="标签名称"
            rules={[
              { required: true, message: '请输入标签名称' },
              { max: 50, message: '标签名称不能超过50个字符' },
            ]}
          >
            <Input placeholder="请输入标签名称" />
          </Form.Item>

          <Form.Item
            name="value"
            label="标签值"
            rules={[
              { required: true, message: '请输入标签值' },
              { max: 50, message: '标签值不能超过50个字符' },
              { pattern: /^[a-zA-Z0-9_-]+$/, message: '标签值只能包含字母、数字、下划线和连字符' },
            ]}
          >
            <Input placeholder="请输入标签值（用于URL，如：javascript）" />
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                {editingTag ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TagList;