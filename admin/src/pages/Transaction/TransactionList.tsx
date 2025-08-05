import React, { useEffect, useState } from 'react';
import {
  Table,
  Card,
  Typography,
  Tag,
  Input,
  message,
  Button,
  Popconfirm,
} from 'antd';
import { transactionAPI } from '../../services/transaction';

const { Title } = Typography;

const TransactionList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const fetchTransactions = async (userId: string) => {
    setLoading(true);
    try {
      const response = await transactionAPI.getMembershipTransactions(userId);
      setTransactions(response);
    } catch (error) {
      message.error('获取交易记录失败');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (orderId: string) => {
    try {
      await transactionAPI.handlePaymentSuccess({ orderId });
      message.success('处理成功');
      if (selectedUserId) {
        fetchTransactions(selectedUserId);
      }
    } catch (error) {
      message.error('处理失败');
    }
  };

  const handlePaymentFailure = async (orderId: string) => {
    try {
      await transactionAPI.handlePaymentFailure({ orderId });
      message.success('处理成功');
      if (selectedUserId) {
        fetchTransactions(selectedUserId);
      }
    } catch (error) {
      message.error('处理失败');
    }
  };

  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: '会员类型',
      dataIndex: 'membershipType',
      key: 'membershipType',
      render: (membershipType: any) => membershipType?.name,
    },
    {
      title: '支付金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `¥${amount.toFixed(2)}`,
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      key: 'createAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '支付时间',
      dataIndex: 'paidAt',
      key: 'paidAt',
      render: (date: string) => date ? new Date(date).toLocaleString() : '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          pending: { color: 'warning', text: '待支付' },
          success: { color: 'success', text: '支付成功' },
          failed: { color: 'error', text: '支付失败' },
        };
        const { color, text } = statusMap[status] || { color: 'default', text: status };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: any) => {
        if (record.status === 'pending') {
          return (
            <div className="space-x-2">
              <Popconfirm
                title="确认将此订单标记为支付成功？"
                onConfirm={() => handlePaymentSuccess(record.orderId)}
              >
                <Button type="link" size="small">标记成功</Button>
              </Popconfirm>
              <Popconfirm
                title="确认将此订单标记为支付失败？"
                onConfirm={() => handlePaymentFailure(record.orderId)}
              >
                <Button type="link" danger size="small">标记失败</Button>
              </Popconfirm>
            </div>
          );
        }
        return null;
      },
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Title level={2}>会员交易记录</Title>
      </div>

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
    </div>
  );
};

export default TransactionList;