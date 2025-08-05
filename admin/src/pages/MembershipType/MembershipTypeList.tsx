import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  message,
  Popconfirm,
  Card,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { membershipTypeAPI } from '../../services/membershipType';

const { Title } = Typography;

const MembershipTypeList: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await membershipTypeAPI.getMembershipTypes();
      setData(response);
    } catch (error) {
      message.error('获取会员类型列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    form.resetFields();
    setEditingId(null);
    setModalVisible(true);
  };

  const handleEdit = (record: any) => {
    form.setFieldsValue({
      name: record.name,
      type: record.type,
      description: record.description,
      price: record.price,
      duration: record.duration,
      isActive: record.isActive,
    });
    setEditingId(record.id);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await membershipTypeAPI.deleteMembershipType(id);
      message.success('删除成功');
      fetchData();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingId) {
        await membershipTypeAPI.updateMembershipType(editingId, values);
        message.success('更新成功');
      } else {
        await membershipTypeAPI.createMembershipType(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchData();
    } catch (error) {
      message.error(editingId ? '更新失败' : '创建失败');
    }
  };

  const columns = [
    {
      title: '会员名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型编号',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `¥${price}`,
    },
    {
      title: '有效期(天)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (isActive ? '启用' : '禁用'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除吗？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Title level={2}>会员类型管理</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          新增会员类型
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
        />
      </Card>

      <Modal
        title={editingId ? '编辑会员类型' : '新增会员类型'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            isActive: true,
          }}
        >
          <Form.Item
            name="name"
            label="会员名称"
            rules={[{ required: true, message: '请输入会员名称' }]}
          >
            <Input placeholder="请输入会员名称" />
          </Form.Item>

          <Form.Item
            name="type"
            label="类型编号"
          >
            <InputNumber placeholder="请输入类型编号" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea rows={4} placeholder="请输入描述" />
          </Form.Item>

          <Form.Item
            name="price"
            label="价格"
            rules={[{ required: true, message: '请输入价格' }]}
          >
            <InputNumber
              min={0}
              precision={2}
              placeholder="请输入价格"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="duration"
            label="有效期(天)"
            rules={[{ required: true, message: '请输入有效期' }]}
          >
            <InputNumber
              min={1}
              placeholder="请输入有效期天数"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="是否启用"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MembershipTypeList;