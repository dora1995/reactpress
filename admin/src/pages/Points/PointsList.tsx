import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Card,
  Typography,
  Tag,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { pointsAPI } from '../../services/points';

const { Title } = Typography;
const { Option } = Select;

const PointsList: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState<number>(0);

  const fetchTransactions = async (userId: string) => {
    setLoading(true);
    try {
      const response = await pointsAPI.getTransactionHistory(userId);
      setTransactions(response);
      
      const points = await pointsAPI.getUserPoints(userId);
      setUserPoints(points);
    } catch (error) {
      message.error('获取积分记录失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPoints = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const isDeduct = values.operation === 'deduct';
      
      if (isDeduct) {
        await pointsAPI.deductPoints({
          userId: selectedUserId,
          points: values.points,
          type: 'system_deduct',
          description: values.description,
        });
      } else {
        await pointsAPI.addPoints({
          userId: selectedUserId,
          points: values.points,
          type: 'system_grant',
          description: values.description,
        });
      }

      message.success(isDeduct ? '扣除积分成功' : '增加积分成功');
      setModalVisible(false);
      fetchTransactions(selectedUserId);
    } catch (error) {
      message.error('操作失败');
    }
  };

  const columns = [
    {
      title: '时间',
      dataIndex: 'createAt',
      key: 'createAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap = {
          purchase: '购买积分',
          article_read: '阅读文章',
          system_grant: '系统赠送',
          system_deduct: '系统扣除',
          refund: '退款',
        };
        return typeMap[type] || type;
      },
    },
    {
      title: '积分变动',
      dataIndex: 'points',
      key: 'points',
      render: (points: number) => (
        <span style={{ color: points >= 0 ? '#52c41a' : '#f5222d' }}>
          {points >= 0 ? '+' : ''}{points}
        </span>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          pending: { color: 'warning', text: '处理中' },
          success: { color: 'success', text: '成功' },
          failed: { color: 'error', text: '失败' },
        };
        const { color, text } = statusMap[status] || { color: 'default', text: status };
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Title level={2}>积分管理</Title>
          {selectedUserId && (
            <div className="text-gray-500">
              当前积分余额：
              <span className="text-blue-600 font-bold">{userPoints}</span>
            </div>
          )}
        </div>
        {selectedUserId && (
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddPoints}
            >
              积分操作
            </Button>
          </Space>
        )}
      </div>

      {/* 用户选择和积分记录 */}
      <Card>
        <div className="mb-4">
          <Input.Search
            placeholder="请输入用户ID"
            enterButton="查询"
            onSearch={(value) => {
              if (value) {
                setSelectedUserId(value);
                fetchTransactions(value);
              }
            }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={transactions}
          rowKey="id"
          loading={loading}
        />
      </Card>

      {/* 积分操作弹窗 */}
      <Modal
        title="积分操作"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            operation: 'add',
          }}
        >
          <Form.Item
            name="operation"
            label="操作类型"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="add">增加积分</Option>
              <Option value="deduct">扣除积分</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="points"
            label="积分数量"
            rules={[
              { required: true, message: '请输入积分数量' },
              { type: 'number', min: 1, message: '积分必须大于0' },
            ]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="请输入积分数量" />
          </Form.Item>

          <Form.Item
            name="description"
            label="操作说明"
            rules={[{ required: true, message: '请输入操作说明' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入操作说明" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PointsList;