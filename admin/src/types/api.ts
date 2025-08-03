export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: 'admin' | 'visitor';
    status: 'locked' | 'active';
    type: string;
    createAt: string;
    updateAt: string;
  }
  
  export interface Article {
    id: string;
    title: string;
    cover: string;
    summary: string;
    content: string;
    html: string;
    toc: string;
    category: Category;
    tags: Tag[];
    status: 'draft' | 'publish';
    views: number;
    likes: number;
    isRecommended: boolean;
    needPassword: boolean;
    isCommentable: boolean;
    publishAt: string;
    createAt: string;
    updateAt: string;
  }
  
  export interface Category {
    id: string;
    label: string;
    value: string;
    articles: Article[];
    createAt: string;
    updateAt: string;
  }
  
  export interface Tag {
    id: string;
    label: string;
    value: string;
    articles: Article[];
    createAt: string;
    updateAt: string;
  }
  
  export interface Page {
    id: string;
    name: string;
    path: string;
    cover: string;
    content: string;
    html: string;
    toc: string;
    status: 'draft' | 'publish';
    views: number;
    needPassword: boolean;
    isCommentable: boolean;
    publishAt: string;
    createAt: string;
    updateAt: string;
  }
  
  export interface Comment {
    id: string;
    name: string;
    email: string;
    content: string;
    html: string;
    pass: boolean;
    createAt: string;
    updateAt: string;
    children: Comment[];
    hostId: string;
    parentCommentId: string;
    replyUserName: string;
    replyUserEmail: string;
    userAgent: string;
  }
  
  export interface File {
    id: string;
    originalname: string;
    filename: string;
    type: string;
    size: number;
    url: string;
    createAt: string;
    updateAt: string;
  }
  
  export interface Setting {
    id: string;
    label: string;
    name: string;
    value: string;
    options: string;
    type: string;
    createAt: string;
    updateAt: string;
  }
  
  export interface LoginRequest {
    name: string;
    password: string;
  }
  
  export interface LoginResponse {
    /** 用户名 */
    name: string;
    /** 用户头像URL */
    avatar: string;
    /** 用户邮箱 */
    email: string;
    /** 认证token */
    token: string;
    /** 用户角色(可选) */
    role?: string;
  }
  
  export interface PaginationParams {
    page?: number;
    pageSize?: number;
    [key: string]: any;
  }
  
  export interface PaginationResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
  }