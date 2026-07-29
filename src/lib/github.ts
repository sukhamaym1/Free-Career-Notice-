export class GitHubClient {
  private pat: string;
  private owner: string;
  private repo: string;
  private branch: string;

  constructor(pat: string, owner: string, repo: string, branch: string) {
    this.pat = pat;
    this.owner = owner;
    this.repo = repo;
    this.branch = branch;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: any = {
      'Accept': 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...options.headers,
    };

    if (this.pat) {
      headers['Authorization'] = `Bearer ${this.pat}`;
    }

    const res = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}${endpoint}`, {
      cache: 'no-store',
      ...options,
      headers
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => '');
      if (res.status !== 404) {
        console.error('GitHub API Error body:', errBody);
      }
      const error = new Error(`GitHub API Error: ${res.status} ${res.statusText}`);
      (error as any).status = res.status;
      throw error;
    }
    
    // For 204 No Content
    if (res.status === 204) return null;

    return res.json();
  }

  async getFile(path: string) {
    try {
      const data = await this.request(`/contents/${path}?ref=${this.branch}&t=${Date.now()}`);
      if (data.content) {
        return {
          sha: data.sha,
          content: decodeURIComponent(escape(window.atob(data.content)))
        };
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  async getRawFile(path: string) {
    try {
      const data = await this.request(`/contents/${path}?ref=${this.branch}&t=${Date.now()}`);
      if (data.content) {
        return {
          sha: data.sha,
          content: data.content // keep base64 string
        };
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  async listDirectory(path: string) {
    try {
      const data = await this.request(`/contents/${path}?ref=${this.branch}&t=${Date.now()}`);
      if (Array.isArray(data)) {
        return data;
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  async putFile(path: string, content: string, message: string, sha?: string) {
    const encodedContent = window.btoa(unescape(encodeURIComponent(content)));
    return this.request(`/contents/${path}`, {
      method: 'PUT',
      body: JSON.stringify({
        message,
        content: encodedContent,
        branch: this.branch,
        ...(sha ? { sha } : {})
      })
    });
  }

  async putBinaryFile(path: string, base64Content: string, message: string, sha?: string) {
    return this.request(`/contents/${path}`, {
      method: 'PUT',
      body: JSON.stringify({
        message,
        content: base64Content,
        branch: this.branch,
        ...(sha ? { sha } : {})
      })
    });
  }

  async deleteFile(path: string, message: string, sha: string) {
    return this.request(`/contents/${path}`, {
      method: 'DELETE',
      body: JSON.stringify({
        message,
        branch: this.branch,
        sha
      })
    });
  }
}
