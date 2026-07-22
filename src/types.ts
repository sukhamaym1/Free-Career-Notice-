export type PostStatus = 'draft' | 'published' | 'scheduled' | 'archived' | 'trash';

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: string;
  categoryId: string;
  tags: string[];
  status: PostStatus;
  featuredImage?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'author' | 'viewer';
}
