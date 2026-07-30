import { StorageProvider, Post, Category, Tag, SiteSettings } from './types';

export class ContentService {
  private provider: StorageProvider;

  constructor(provider: StorageProvider) {
    this.provider = provider;
  }

  // --- Posts ---
  async getPosts(): Promise<Post[]> {
    try {
      return await this.provider.getPosts();
    } catch (error) {
      console.error('Failed to get posts:', error);
      throw new Error('Failed to load posts.');
    }
  }

  async getPost(id: string): Promise<Post | null> {
    try {
      return await this.provider.getPost(id);
    } catch (error) {
      console.error(`Failed to get post ${id}:`, error);
      throw new Error(`Failed to load post ${id}.`);
    }
  }

  async savePost(post: Post, isEdit: boolean): Promise<void> {
    try {
      if (isEdit) {
        await this.provider.updatePost(post.id, post);
      } else {
        await this.provider.createPost(post);
      }
    } catch (error) {
      console.error(`Failed to save post ${post.id}:`, error);
      throw new Error('Failed to save post. Please check the content and try again.');
    }
  }

  async deletePost(id: string): Promise<void> {
    try {
      await this.provider.deletePost(id);
    } catch (error) {
      console.error(`Failed to delete post ${id}:`, error);
      throw new Error('Failed to delete post.');
    }
  }

  // --- Categories ---
  async getCategories(): Promise<Category[]> {
    try {
      return await this.provider.getCategories();
    } catch (error) {
      console.error('Failed to get categories:', error);
      throw new Error('Failed to load categories.');
    }
  }

  async saveCategories(categories: Category[]): Promise<void> {
    try {
      await this.provider.saveCategories(categories);
    } catch (error) {
      console.error('Failed to save categories:', error);
      throw new Error('Failed to save categories.');
    }
  }

  // --- Tags ---
  async getTags(): Promise<Tag[]> {
    try {
      return await this.provider.getTags();
    } catch (error) {
      console.error('Failed to get tags:', error);
      throw new Error('Failed to load tags.');
    }
  }

  async saveTags(tags: Tag[]): Promise<void> {
    try {
      await this.provider.saveTags(tags);
    } catch (error) {
      console.error('Failed to save tags:', error);
      throw new Error('Failed to save tags.');
    }
  }

  // --- Settings ---
  async getSettings(): Promise<SiteSettings> {
    try {
      return await this.provider.getSettings();
    } catch (error) {
      console.error('Failed to get settings:', error);
      throw new Error('Failed to load site settings.');
    }
  }

  async saveSettings(settings: SiteSettings): Promise<void> {
    try {
      await this.provider.saveSettings(settings);
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw new Error('Failed to save site settings.');
    }
  }

  // --- Pages ---
  async getPages(): Promise<Record<string, string>> {
    try {
      return await this.provider.getPages();
    } catch (error) {
      console.error('Failed to get pages:', error);
      return {};
    }
  }

  async getPage(id: string): Promise<string | null> {
    try {
      return await this.provider.getPage(id);
    } catch (error) {
      console.error('Failed to get page:', error);
      return null;
    }
  }

  async savePage(id: string, content: string): Promise<void> {
    try {
      await this.provider.savePage(id, content);
    } catch (error) {
      console.error('Failed to save page:', error);
      throw error;
    }
  }

  async clearCache(): Promise<void> {
    try {
      if (this.provider.clearCache) {
        await this.provider.clearCache();
      }
    } catch (error) {
      console.error('Failed to clear cache:', error);
      throw error;
    }
  }

  async rebuildSite(): Promise<void> {
    try {
      if (this.provider.rebuildSite) {
        await this.provider.rebuildSite();
      }
    } catch (error) {
      console.error('Failed to rebuild site:', error);
      throw error;
    }
  }
}
