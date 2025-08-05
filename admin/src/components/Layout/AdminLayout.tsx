import React from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  FileOutlined,
  UserOutlined,
  TagOutlined,
  CommentOutlined,
  SettingOutlined,
  CrownOutlined,
  TransactionOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import { Link, Outlet, useLocation } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

const menuItems = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: <Link to="/">仪表盘</Link>,
  },
  {
    key: 'articles',
    icon: <FileOutlined />,
    label: <Link to="/articles">文章管理</Link>,
  },
  {
    key: 'categories',
    icon: <TagOutlined />,
    label: <Link to="/categories">分类管理</Link>,
  },
  {
    key: 'tags',
    icon: <TagOutlined />,
    label: <Link to="/tags">标签管理</Link>,
  },
  {
    key: 'comments',
    icon: <CommentOutlined />,
    label: <Link to="/comments">评论管理</Link>,
  },
  {
    key: 'users',
    icon: <UserOutlined />,
    label: <Link to="/users">用户管理</Link>,
  },
  {
    key: 'membership',
    icon: <CrownOutlined />,
    label: '会员管理',
    children: [
      {
        key: 'membership-types',
        label: <Link to="/membership-types">会员类型</Link>,
      },
      {
        key: 'transactions',
        icon: <TransactionOutlined />,
        label: <Link to="/transactions">交易记录</Link>,
      },
    ],
  },
  {
    key: 'points',
    icon: <GiftOutlined />,
    label: <Link to="/points">积分管理</Link>,
  },
  {
    key: 'settings',
    icon: <SettingOutlined />,
    label: <Link to="/settings">系统设置</Link>,
  },
];

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const path = location.pathname.split('/')[1] || 'dashboard';
  
  // 处理特殊的菜单项选中状态
  let selectedKey = path;
  if (path === 'membership-types' || path === 'transactions') {
    selectedKey = 'membership';
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="flex items-center px-6">
        <div className="text-white text-xl font-bold">管理后台</div>
      </Header>
      <Layout>
        <Sider width={200} className="bg-white">
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;