export interface Category {
  articleCount: number;
  createAt: string;
  id: string;
  label: string;
  updateAt: string;
  value: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Article {
  id: string;
  title: string;
  cover?: string;
  summary?: string;
  content: string;
  html: string;
  toc?: string;
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
  points: number;
  needVip: boolean;
}