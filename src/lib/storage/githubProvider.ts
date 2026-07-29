import { GitHubClient } from '../github';
import { StorageProvider, Post, Category, Tag, SiteSettings, MediaFile } from './types';

export class GitHubProvider implements StorageProvider {
  private client: GitHubClient;
  private postShaMap: Map<string, string> = new Map();
  private categoriesSha: string | undefined;
  private tagsSha: string | undefined;
  private settingsSha: string | undefined;
  private menuSha: string | undefined;
  
  private contentRoot: string;
  private uploadsRoot: string;

  constructor(pat: string, owner: string, repo: string, branch: string, contentRoot: string, uploadsRoot: string) {
    this.client = new GitHubClient(pat, owner, repo, branch);
    this.contentRoot = contentRoot;
    this.uploadsRoot = uploadsRoot;
  }

  private async putWithRetry(path: string, content: string, message: string, sha: string | undefined, setShaCallback: (newSha: string) => void) {
    let currentSha = sha;
    if (!currentSha) {
      const existing = await this.client.getFile(path);
      if (existing && existing.sha) {
        currentSha = existing.sha;
      }
    }
    
    try {
      const res = await this.client.putFile(path, content, message, currentSha);
      if (res && res.content && res.content.sha) {
        setShaCallback(res.content.sha);
      }
      return res;
    } catch (e: any) {
      if (e.message && (e.message.includes('409') || e.message.includes('422'))) {
        const existing = await this.client.getFile(path);
        if (existing && existing.sha) {
          const res = await this.client.putFile(path, content, message, existing.sha);
          if (res && res.content && res.content.sha) {
            setShaCallback(res.content.sha);
          }
          return res;
        }
      }
      throw e;
    }
  }

  private async deleteWithRetry(path: string, message: string, sha: string | undefined) {
    let currentSha = sha;
    if (!currentSha) {
      const existing = await this.client.getFile(path);
      if (existing && existing.sha) {
        currentSha = existing.sha;
      } else {
        throw new Error(`File not found for deletion: ${path}`);
      }
    }
    
    try {
      return await this.client.deleteFile(path, message, currentSha);
    } catch (e: any) {
      if (e.message && e.message.includes('409')) {
        const existing = await this.client.getFile(path);
        if (existing && existing.sha) {
          return await this.client.deleteFile(path, message, existing.sha);
        }
      }
      throw e;
    }
  }

  // --- Posts ---
  async getPosts(): Promise<Post[]> {
    try {
      // 1. Try to fetch the pre-built index first (No rate limits, fast!)
      const indexRes = await fetch(`https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.branch}/${this.contentRoot}/posts.json?t=${Date.now()}`);
      if (indexRes.ok) {
        const posts = await indexRes.json();
        if (Array.isArray(posts)) {
          // Store shas for future updates
          posts.forEach(p => {
            if (p.id && p._sha) this.postShaMap.set(p.id, p._sha);
          });
          posts.sort((a, b) => ((b.id || '') > (a.id || '') ? -1 : 1));
          return posts;
        }
      }
    } catch (e) {
      console.warn("Failed to fetch posts.json index, falling back to API", e);
    }

    // 2. Fallback to API (Subject to rate limits for anonymous visitors)
    const files = await this.client.listDirectory(`${this.contentRoot}/posts`);
    if (!Array.isArray(files) || files.length === 0) return [];
    
    const posts: Post[] = [];
    const chunkSize = 5;
    for (let i = 0; i < files.length; i += chunkSize) {
      const chunk = files.slice(i, i + chunkSize);
      const postPromises = chunk.map(async (f: any) => {
        let fileStr = '';
        if (f.download_url) {
          try {
            const res = await fetch(f.download_url + `?t=${Date.now()}`, { cache: 'no-store' });
            if (res.ok) fileStr = await res.text();
          } catch (e) { /* ignore and fallback */ }
        }
        
        if (!fileStr) {
          const res = await this.client.getFile(f.path);
          if (res && res.content) {
            fileStr = res.content;
            f.sha = res.sha || f.sha;
          }
        }

        if (fileStr) {
          try {
            const post = JSON.parse(fileStr);
            post._path = f.path;
            post._sha = f.sha;
            this.postShaMap.set(post.id, f.sha);
            return post;
          } catch (e) {
            console.error("Failed to parse post JSON", e);
            return null;
          }
        }
        return null;
      });
      const results = await Promise.all(postPromises);
      posts.push(...results.filter((r: any) => r !== null));
    }
    
    posts.sort((a, b) => ((b.id || '') > (a.id || '') ? -1 : 1));
    return posts;
  }

  async rebuildPostsIndex(): Promise<void> {
    // This is called by the admin to generate the posts.json file
    const files = await this.client.listDirectory(`${this.contentRoot}/posts`);
    if (!Array.isArray(files)) return;
    
    const posts: Post[] = [];
    for (const f of files) {
      if (!f.name.endsWith('.json')) continue;
      let fileStr = '';
      if (f.download_url) {
        try {
          const res = await fetch(f.download_url + `?t=${Date.now()}`, { cache: 'no-store' });
          if (res.ok) fileStr = await res.text();
        } catch (e) {}
      }
      if (!fileStr) {
        const res = await this.client.getFile(f.path);
        if (res && res.content) fileStr = res.content;
      }
      if (fileStr) {
        try {
          const post = JSON.parse(fileStr);
          post._path = f.path;
          post._sha = f.sha;
          posts.push(post);
        } catch(e) {}
      }
    }
    
    // Check if posts.json exists to get its SHA for update
    let indexSha: string | undefined;
    try {
      const existing = await this.client.getFile(`${this.contentRoot}/posts.json`);
      if (existing && existing.sha) indexSha = existing.sha;
    } catch(e) {}

    await this.client.putFile(
      `${this.contentRoot}/posts.json`,
      JSON.stringify(posts, null, 2),
      'Update posts index',
      indexSha
    );
  }

  async getPost(id: string): Promise<Post | null> {
    const res = await this.client.getFile(`${this.contentRoot}/posts/${id}.json`);
    if (res && res.content) {
      this.postShaMap.set(id, res.sha);
      try {
        const post = JSON.parse(res.content);
        post._path = `${this.contentRoot}/posts/${id}.json`;
        post._sha = res.sha;
        return post;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  async createPost(post: Post): Promise<void> {
    let sha = this.postShaMap.get(post.id);
    if (!sha) {
      const existing = await this.client.getFile(`${this.contentRoot}/posts/${post.id}.json`);
      if (existing && existing.sha) {
        sha = existing.sha;
      }
    }
    const res = await this.client.putFile(
      `${this.contentRoot}/posts/${post.id}.json`,
      JSON.stringify(post, null, 2),
      `Create post ${post.id}`,
      sha
    );
    if (res && res.content && res.content.sha) {
      this.postShaMap.set(post.id, res.content.sha);
    }
    // Update the index asynchronously so it doesn't block
    this.rebuildPostsIndex().catch(e => console.error('Failed to rebuild posts index', e));
  }

  async updatePost(id: string, post: Post): Promise<void> {
    let sha = this.postShaMap.get(id);
    if (!sha) {
      const existing = await this.client.getFile(`${this.contentRoot}/posts/${id}.json`);
      if (existing && existing.sha) {
        sha = existing.sha;
      } else {
        throw new Error(`Cannot update post ${id}: unable to retrieve its current SHA. File might not exist or rate limited.`);
      }
    }
    
    await this.putWithRetry(
      `${this.contentRoot}/posts/${id}.json`,
      JSON.stringify(post, null, 2),
      `Update post ${id}`,
      sha,
      (newSha) => { this.postShaMap.set(id, newSha); }
    );
    // Update the index asynchronously
    this.rebuildPostsIndex().catch(e => console.error('Failed to rebuild posts index', e));
  }

  async deletePost(id: string): Promise<void> {
    await this.deleteWithRetry(`${this.contentRoot}/posts/${id}.json`, `Delete post ${id}`, this.postShaMap.get(id));
    this.postShaMap.delete(id);
    // Update the index asynchronously
    this.rebuildPostsIndex().catch(e => console.error('Failed to rebuild posts index', e));
  }

  // --- Helper to fetch JSON directly without API rate limits ---
  private async fetchPublicJson(path: string): Promise<any> {
    try {
      const res = await fetch(`https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.branch}/${path}?t=${Date.now()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn(`Failed to fetch public JSON for ${path}, falling back to API`);
    }
    
    const apiRes = await this.client.getFile(path);
    if (apiRes && apiRes.content) {
      try { return JSON.parse(apiRes.content); } catch (e) {}
    }
    return null;
  }

  // --- Categories ---
  async getCategories(): Promise<Category[]> {
    const data = await this.fetchPublicJson(`${this.contentRoot}/categories.json`);
    return Array.isArray(data) ? data : [];
  }

  async saveCategories(categories: Category[]): Promise<void> {
    try {
      const existing = await this.client.getFile(`${this.contentRoot}/categories.json`);
      if (existing && existing.sha) this.categoriesSha = existing.sha;
    } catch(e) {}
    
    await this.putWithRetry(
      `${this.contentRoot}/categories.json`,
      JSON.stringify(categories, null, 2),
      'Update categories',
      this.categoriesSha,
      (newSha) => { this.categoriesSha = newSha; }
    );
  }

  // --- Tags ---
  async getTags(): Promise<Tag[]> {
    const data = await this.fetchPublicJson(`${this.contentRoot}/tags.json`);
    return Array.isArray(data) ? data : [];
  }

  async saveTags(tags: Tag[]): Promise<void> {
    try {
      const existing = await this.client.getFile(`${this.contentRoot}/tags.json`);
      if (existing && existing.sha) this.tagsSha = existing.sha;
    } catch(e) {}

    await this.putWithRetry(
      `${this.contentRoot}/tags.json`,
      JSON.stringify(tags, null, 2),
      'Update tags',
      this.tagsSha,
      (newSha) => { this.tagsSha = newSha; }
    );
  }

  // --- Settings ---
  async getSettings(): Promise<SiteSettings> {
    const data = await this.fetchPublicJson(`${this.contentRoot}/settings.json`);
    return data || {};
  }

  async saveSettings(settings: SiteSettings): Promise<void> {
    try {
      const existing = await this.client.getFile(`${this.contentRoot}/settings.json`);
      if (existing && existing.sha) this.settingsSha = existing.sha;
    } catch(e) {}

    await this.putWithRetry(
      `${this.contentRoot}/settings.json`,
      JSON.stringify(settings, null, 2),
      'Update settings',
      this.settingsSha,
      (newSha) => { this.settingsSha = newSha; }
    );
  }

  // --- Menu ---
  async getMenu(): Promise<any> {
    const data = await this.fetchPublicJson(`${this.contentRoot}/menu.json`);
    return Array.isArray(data) ? data : [];
  }

  async saveMenu(menu: any): Promise<void> {
    try {
      const existing = await this.client.getFile(`${this.contentRoot}/menu.json`);
      if (existing && existing.sha) this.menuSha = existing.sha;
    } catch(e) {}

    await this.putWithRetry(
      `${this.contentRoot}/menu.json`,
      JSON.stringify(menu, null, 2),
      'Update menu',
      this.menuSha,
      (newSha) => { this.menuSha = newSha; }
    );
  }

  // --- Media ---
  async listImages(): Promise<MediaFile[]> {
    const files = await this.client.listDirectory(this.uploadsRoot);
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
          let sha: string | undefined;
          const existing = await this.client.getFile(`${this.uploadsRoot}/${fileName}`);
          if (existing && existing.sha) {
            sha = existing.sha;
          }
          await this.client.putBinaryFile(`${this.uploadsRoot}/${fileName}`, base64Content, `Upload ${fileName}`, sha);
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
      await this.deleteWithRetry(path, `Delete ${file.name}`, file.sha);
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
