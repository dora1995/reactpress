import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Typography, List, Tag, Space, Spin } from 'antd';
import {
  FileTextOutlined,
  CommentOutlined,
  UserOutlined,
  EyeOutlined,
  HeartOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { articleAPI, commentAPI, userAPI } from '../services/api';
import type { Article, Comment } from '../types/api';
import dayjs from 'dayjs';

const { Title } = Typography;

interface DashboardStats {
  totalArticles: number;
  totalComments: number;
  totalUsers: number;
  totalViews: number;
  totalLikes: number;
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalArticles: 0,
    totalComments: 0,
    totalUsers: 0,
    totalViews: 0,
    totalLikes: 0,
  });
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [recentComments, setRecentComments] = useState<Comment[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // 获取统计数据
      const [articlesRes, commentsRes, usersRes] = await Promise.all([
        articleAPI.getArticles({ pageSize: 10 }),
        commentAPI.getComments({ pageSize: 10 }),
        userAPI.getUsers({ pageSize: 10 }),
      ]);

      // 计算统计数据
      const totalViews = articlesRes.reduce((sum, article) => sum + article.views, 0);
      const totalLikes = articlesRes.reduce((sum, article) => sum + article.likes, 0);

      setStats({
        totalArticles: articlesRes.length,
        totalComments: commentsRes.length,
        totalUsers: usersRes.length,
        totalViews,
        totalLikes,
      });

      setRecentArticles(articlesRes);
      setRecentComments(commentsRes);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Title level={2} className="mb-6">
          仪表盘
        </Title>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="文章总数"
              value={stats.totalArticles}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="评论总数"
              value={stats.totalComments}
              prefix={<CommentOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="用户总数"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总浏览量"
              value={stats.totalViews}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 最近文章 */}
        <Col xs={24} lg={12}>
          <Card title="最近文章" className="h-full">
            <List
              dataSource={recentArticles}
              renderItem={(article) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Space>
                        <span>{article.title}</span>
                        <Tag color={article.status === 'publish' ? 'green' : 'orange'}>
                          {article.status === 'publish' ? '已发布' : '草稿'}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Space size="large">
                        <span>
                          <EyeOutlined /> {article.views}
                        </span>
                        <span>
                          <HeartOutlined /> {article.likes}
                        </span>
                        <span>
                          <CalendarOutlined /> {dayjs(article.createAt).format('YYYY-MM-DD')}
                        </span>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 最近评论 */}
        <Col xs={24} lg={12}>
          <Card title="最近评论" className="h-full">
            <List
              dataSource={recentComments}
              renderItem={(comment) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Space>
                        <span>{comment.name}</span>
                        <Tag color={comment.pass ? 'green' : 'red'}>
                          {comment.pass ? '已通过' : '待审核'}
                        </Tag>
                      </Space>
                    }
                    description={
                      <div>
                        <p className="mb-2 text-gray-600 line-clamp-2">
                          {comment.content}
                        </p>
                        <span className="text-sm text-gray-400">
                          <CalendarOutlined /> {dayjs(comment.createAt).format('YYYY-MM-DD HH:mm')}
                        </span>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;