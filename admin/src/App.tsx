import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import AdminLayout from './components/Layout/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ArticleList from './pages/Article/ArticleList';
import ArticleEditor from './pages/Article/ArticleEditor';
import CategoryList from './pages/Category/CategoryList';
import TagList from './pages/Tag/TagList';
import PageList from './pages/Page/PageList';
import PageEditor from './pages/Page/PageEditor';
import CommentList from './pages/Comment/CommentList';
import FileList from './pages/File/FileList';
import UserList from './pages/User/UserList';
import Settings from './pages/Settings';

// 检查是否已登录
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// 受保护的路由组件
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    
                    {/* 文章管理 */}
                    <Route path="/articles" element={<ArticleList />} />
                    <Route path="/articles/new" element={<ArticleEditor />} />
                    <Route path="/articles/:id/edit" element={<ArticleEditor />} />
                    
                    {/* 分类管理 */}
                    <Route path="/categories" element={<CategoryList />} />
                    
                    {/* 标签管理 */}
                    <Route path="/tags" element={<TagList />} />
                    
                    {/* 页面管理 */}
                    <Route path="/pages" element={<PageList />} />
                    <Route path="/pages/new" element={<PageEditor />} />
                    <Route path="/pages/:id/edit" element={<PageEditor />} />
                    
                    {/* 评论管理 */}
                    <Route path="/comments" element={<CommentList />} />
                    {/* 用户管理 */}
                    <Route path="/users" element={<UserList />} />
                    {/* 系统设置 */}
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
