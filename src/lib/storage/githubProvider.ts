import { GitHubClient } from '../github';
import { StorageProvider, Post, Category, Tag, SiteSettings, MediaFile } from './types';

export class GitHubProvider implements StorageProvider {
  private client: GitHubClient;
  private postShaMap: Map<string, string> = new Map();
  private categoriesSha: string | undefined;
  private tagsSha: string | undefined;
  private settingsSha: string | undefined;
  private menuSha: string | undefined;

  constructor(pat: string, repo: string, branch: string) {
    this.client = new GitHubClient(pat, repo, branch);
  }

  // --- Posts ---
  async getPosts(): Promise<Post[]> {
    const files = await this.client.listDirectory('content/posts');
    if (!Array.isArray(files)) return [];
    
    const postPromises = files.map(async (f: any) => {
      const res = await this.client.getFile(f.path);
      if (res && res.content) {
        // Sync to local filesystem
        try {
          await fetch('/api/fs/write', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filePath: f.path, content: res.content })
          });
        } catch (e) {
          console.error('Failed to sync locally', e);
        }
        
        const post = JSON.parse(res.content);
        post._path = f.path;
        post._sha = res.sha;
        this.postShaMap.set(post.id, res.sha);
        return post;
      }
      return null;
    });

    const postResults = await Promise.all(postPromises);
    const posts = postResults.filter((r: any) => r !== null);
    posts.sort((a, b) => ((b.id || '') > (a.id || '') ? 1 : -1));
    return posts;
  }

  async getPost(id: string): Promise<Post | null> {
    const res = await this.client.getFile(`content/posts/${id}.json`);
    if (res && res.content) {
      this.postShaMap.set(id, res.sha);
      const post = JSON.parse(res.content);
      post._path = `content/posts/${id}.json`;
      post._sha = res.sha;
      return post;
    }
    return null;
  }

  async createPost(post: Post): Promise<void> {
    const res = await this.client.putFile(
      `content/posts/${post.id}.json`,
      JSON.stringify(post, null, 2),
      `Create post ${post.id}`
    );
    if (res && res.content && res.content.sha) {
      this.postShaMap.set(post.id, res.content.sha);
    }
  }

  async updatePost(id: string, post: Post): Promise<void> {
    const sha = this.postShaMap.get(id);
    const res = await this.client.putFile(
      `content/posts/${id}.json`,
      JSON.stringify(post, null, 2),
      `Update post ${id}`,
      sha
    );
    if (res && res.content && res.content.sha) {
      this.postShaMap.set(id, res.content.sha);
    }
  }

  async deletePost(id: string): Promise<void> {
    const sha = this.postShaMap.get(id);
    if (!sha) {
        const post = await this.getPost(id);
        if (!post) throw new Error("Post not found to delete");
    }
    const currentSha = this.postShaMap.get(id);
    if (currentSha) {
      await this.client.deleteFile(`content/posts/${id}.json`, `Delete post ${id}`, currentSha);
      this.postShaMap.delete(id);
    }
  }

  // --- Categories ---
  async getCategories(): Promise<Category[]> {
    const res = await this.client.getFile('content/categories.json');
    if (res && res.content) {
      this.categoriesSha = res.sha;
      return JSON.parse(res.content);
    }
    return [];
  }

  async saveCategories(categories: Category[]): Promise<void> {
    const res = await this.client.putFile(
      'content/categories.json',
      JSON.stringify(categories, null, 2),
      'Update categories',
      this.categoriesSha
    );
    if (res && res.content && res.content.sha) {
      this.categoriesSha = res.content.sha;
    }
  }

  // --- Tags ---
  async getTags(): Promise<Tag[]> {
    const res = await this.client.getFile('content/tags.json');
    if (res && res.content) {
      this.tagsSha = res.sha;
      return JSON.parse(res.content);
    }
    return [];
  }

  async saveTags(tags: Tag[]): Promise<void> {
    const res = await this.client.putFile(
      'content/tags.json',
      JSON.stringify(tags, null, 2),
      'Update tags',
      this.tagsSha
    );
    if (res && res.content && res.content.sha) {
      this.tagsSha = res.content.sha;
    }
  }

  // --- Settings ---
  async getSettings(): Promise<SiteSettings> {
    const res = await this.client.getFile('content/settings.json');
    if (res && res.content) {
      this.settingsSha = res.sha;
      return JSON.parse(res.content);
    }
    return {};
  }

  async saveSettings(settings: SiteSettings): Promise<void> {
    const res = await this.client.putFile(
      'content/settings.json',
      JSON.stringify(settings, null, 2),
      'Update settings',
      this.settingsSha
    );
    if (res && res.content && res.content.sha) {
      this.settingsSha = res.content.sha;
    }
  }

  // --- Menu ---
  async getMenu(): Promise<any> {
    const res = await this.client.getFile('content/menu.json');
    if (res && res.content) {
      this.menuSha = res.sha;
      return JSON.parse(res.content);
    }
    return [];
  }

  async saveMenu(menu: any): Promise<void> {
    const res = await this.client.putFile(
      'content/menu.json',
      JSON.stringify(menu, null, 2),
      'Update menu',
      this.menuSha
    );
    if (res && res.content && res.content.sha) {
      this.menuSha = res.content.sha;
    }
  }

  // --- Media ---
  async listImages(): Promise<MediaFile[]> {
    const files = await this.client.listDirectory('public/uploads');
    if (!Array.isArray(files)) return [];
    return files.map((f: any) => ({
      name: f.name,
      path: f.path,
      sha: f.sha,
      url: f.download_url,
      size: f.size
    }));
  }

  async uploadImage(file: File, fileName: string): Promise<void> {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = async () => {
        try {
          const base64Content = (reader.result as string).split(',')[1];
          await this.client.putBinaryFile(`public/uploads/${fileName}`, base64Content, `Upload ${fileName}`);
          resolve();
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async deleteImage(path: string): Promise<void> {
    const files = await this.listImages();
    const file = files.find(f => f.path === path);
    if (file) {
      await this.client.deleteFile(path, `Delete ${file.name}`, file.sha);
    }
  }

  async renameImage(oldPath: string, newPath: string): Promise<void> {
    const files = await this.listImages();
    const file = files.find(f => f.path === oldPath);
    if (!file) throw new Error("File not found");
    
    const fileData = await this.client.getRawFile(oldPath);
    if (!fileData) throw new Error("Failed to read file data");

    const newName = newPath.split('/').pop() || newPath;
    await this.client.putBinaryFile(newPath, fileData.content, `Rename to ${newName}`);
    await this.client.deleteFile(oldPath, `Delete old ${file.name}`, file.sha);
  }
}
