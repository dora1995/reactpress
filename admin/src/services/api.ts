import api from '../utils/api';
import type {
  User,
  Article,
  Category,
  Tag,
  Page,
  Comment,
  File,
  Setting,
  LoginRequest,
  LoginResponse,
  PaginationParams,
  PaginationResponse,
} from '../types/api';

// Auth API
export const authAPI = {
  login: (data: LoginRequest): Promise<LoginResponse> =>
    api.post('/auth/login', data),
  
  checkAdmin: (): Promise<any> =>
    api.post('/auth/admin'),
};

// User API
export const userAPI = {
  getUsers: (params?: PaginationParams): Promise<User[]> =>
    api.get('/user', { params }),
  
  getUserById: (id: string): Promise<User> =>
    api.get(`/user/${id}`),
  
  updateUser: (id: string, data: Partial<User>): Promise<User> =>
    api.patch(`/user/${id}`, data),
  
  deleteUser: (id: string): Promise<void> =>
    api.delete(`/user/${id}`),
};

// Article API
export const articleAPI = {
  getArticles: (params?: PaginationParams): Promise<PaginationResponse<Article>> =>
    api.get('/article', { params }),
  
  getArticleById: (id: string, status?: string): Promise<Article> =>
    api.get(`/article/${id}`, { params: { status } }),
  
  createArticle: (data: Partial<Article>): Promise<Article> =>
    api.post('/article', data),
  
  updateArticle: (id: string, data: Partial<Article>): Promise<Article> =>
    api.patch(`/article/${id}`, data),
  
  deleteArticle: (id: string): Promise<void> =>
    api.delete(`/article/${id}`),
  
  getRecommendArticles: (): Promise<Article[]> =>
    api.get('/article/all/recommend'),
  
  getArchives: (): Promise<{ [key: string]: Article[] }> =>
    api.get('/article/archives'),
};

// Category API
export const categoryAPI = {
  getCategories: (params?: PaginationParams): Promise<Category[]> =>
    api.get('/category', { params }),
  
  getCategoryById: (id: string): Promise<Category> =>
    api.get(`/category/${id}`),
  
  createCategory: (data: Partial<Category>): Promise<Category> =>
    api.post('/category', data),
  
  updateCategory: (id: string, data: Partial<Category>): Promise<Category> =>
    api.patch(`/category/${id}`, data),
  
  deleteCategory: (id: string): Promise<void> =>
    api.delete(`/category/${id}`),
};

// Tag API
export const tagAPI = {
  getTags: (params?: PaginationParams): Promise<Tag[]> =>
    api.get('/tag', { params }),
  
  getTagById: (id: string): Promise<Tag> =>
    api.get(`/tag/${id}`),
  
  createTag: (data: Partial<Tag>): Promise<Tag> =>
    api.post('/tag', data),
  
  updateTag: (id: string, data: Partial<Tag>): Promise<Tag> =>
    api.patch(`/tag/${id}`, data),
  
  deleteTag: (id: string): Promise<void> =>
    api.delete(`/tag/${id}`),
};

// Page API
export const pageAPI = {
  getPages: (params?: PaginationParams): Promise<PaginationResponse<Page>> =>
    api.get('/page', { params }),
  
  getPageById: (id: string): Promise<Page> =>
    api.get(`/page/${id}`),
  
  createPage: (data: Partial<Page>): Promise<Page> =>
    api.post('/page', data),
  
  updatePage: (id: string, data: Partial<Page>): Promise<Page> =>
    api.patch(`/page/${id}`, data),
  
  deletePage: (id: string): Promise<void> =>
    api.delete(`/page/${id}`),
};

// Comment API
export const commentAPI = {
  getComments: (params?: PaginationParams): Promise<Comment[]> =>
    api.get('/comment', { params }),
  
  getCommentById: (id: string): Promise<Comment> =>
    api.get(`/comment/${id}`),
  
  getArticleComments: (hostId: string, params?: any): Promise<Comment[]> =>
    api.get(`/comment/host/${hostId}`, { params }),
  
  updateComment: (id: string, data: Partial<Comment>): Promise<Comment> =>
    api.patch(`/comment/${id}`, data),
  
  deleteComment: (id: string): Promise<void> =>
    api.delete(`/comment/${id}`),
};

// File API
export const fileAPI = {
  getFiles: (params?: PaginationParams): Promise<PaginationResponse<File>> =>
    api.get('/file', { params }),
  
  getFileById: (id: string): Promise<File> =>
    api.get(`/file/${id}`),
  
  uploadFile: (file: FormData, unique?: boolean): Promise<File> =>
    api.post('/file/upload', file, {
      headers: { 'Content-Type': 'multipart/form-data' },
      params: { unique },
    }),
  
  deleteFile: (id: string): Promise<void> =>
    api.delete(`/file/${id}`),
};

// Setting API
export const settingAPI = {
  getSettings: (): Promise<Setting> =>
    api.post('/setting/get'),
  
  updateSettings: (data: any): Promise<Setting> =>
    api.post('/setting', data),
};