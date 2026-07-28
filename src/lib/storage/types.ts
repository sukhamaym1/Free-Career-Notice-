export interface Post {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'published';
  date: string;
  [key: string]: any; // Allow other dynamic fields like seoTitle, categorySlug, etc.
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  [key: string]: any;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  [key: string]: any;
}

export interface SiteSettings {
  siteName?: string;
  description?: string;
  seoTitle?: string;
  keywords?: string;
  googleAnalyticsId?: string;
  publisherId?: string;
  [key: string]: any;
}

export interface MediaFile {
  name: string;
  path: string;
  sha: string;
  url: string;
  size: number;
}

export interface StorageProvider {
  // Posts
  getPosts(): Promise<Post[]>;
  getPost(id: string): Promise<Post | null>;
  createPost(post: Post): Promise<void>;
  updatePost(id: string, post: Post): Promise<void>;
  deletePost(id: string): Promise<void>;

  // Categories
  getCategories(): Promise<Category[]>;
  saveCategories(categories: Category[]): Promise<void>;

  // Tags
  getTags(): Promise<Tag[]>;
  saveTags(tags: Tag[]): Promise<void>;

  // Settings
  getSettings(): Promise<SiteSettings>;
  saveSettings(settings: SiteSettings): Promise<void>;

  // Menu (for completeness based on prompt)
  getMenu(): Promise<any>;
  saveMenu(menu: any): Promise<void>;

  // Media
  uploadImage(file: File, fileName: string): Promise<void>;
  deleteImage(path: string): Promise<void>;
  listImages(): Promise<MediaFile[]>;
  renameImage(oldPath: string, newPath: string): Promise<void>;
}
