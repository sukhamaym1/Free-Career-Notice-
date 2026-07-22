import { Post, Category, Tag } from '../types';

// The base URL should be configured via environment variables.
// Defaulting to the local Wrangler dev port for Cloudflare Workers.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';

class ApiService {
  private getToken(): string | null {
    // In a real application, the JWT should ideally be stored in an HttpOnly cookie
    // for enhanced security, or memory. For standard integrations, localStorage is used.
    return localStorage.getItem('cf_jwt_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
      throw new Error(error.message || `API Error: ${response.status} ${response.statusText}`);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // ==========================================
  // Posts CRUD Operations (Cloudflare D1 Backed)
  // ==========================================

  /**
   * Fetch all posts, optionally filtered by status
   */
  async getPosts(status?: string): Promise<Post[]> {
    const query = status ? `?status=${status}` : '';
    return this.request<Post[]>(`/posts${query}`);
  }

  /**
   * Fetch a single post by ID
   */
  async getPost(id: string): Promise<Post> {
    return this.request<Post>(`/posts/${id}`);
  }

  /**
   * Fetch a single post by slug
   */
  async getPostBySlug(slug: string): Promise<Post> {
    return this.request<Post>(`/posts/slug/${slug}`);
  }

  /**
   * Create a new post
   */
  async createPost(postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
    return this.request<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  /**
   * Update an existing post
   */
  async updatePost(id: string, postData: Partial<Post>): Promise<Post> {
    return this.request<Post>(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  }

  /**
   * Save a post (Create or Update based on presence of ID)
   */
  async savePost(post: Partial<Post>): Promise<Post> {
    if (post.id) {
      return this.updatePost(post.id, post);
    }
    return this.createPost(post as Omit<Post, 'id' | 'createdAt' | 'updatedAt'>);
  }

  /**
   * Delete a post
   */
  async deletePost(id: string): Promise<void> {
    return this.request<void>(`/posts/${id}`, {
      method: 'DELETE',
    });
  }

  // ==========================================
  // Categories CRUD Operations
  // ==========================================

  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/categories');
  }

  async createCategory(categoryData: Omit<Category, 'id'>): Promise<Category> {
    return this.request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id: string): Promise<void> {
    return this.request<void>(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // ==========================================
  // Tags CRUD Operations
  // ==========================================

  async getTags(): Promise<Tag[]> {
    return this.request<Tag[]>('/tags');
  }

  async createTag(tagData: Omit<Tag, 'id'>): Promise<Tag> {
    return this.request<Tag>('/tags', {
      method: 'POST',
      body: JSON.stringify(tagData),
    });
  }

  async deleteTag(id: string): Promise<void> {
    return this.request<void>(`/tags/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiService();
