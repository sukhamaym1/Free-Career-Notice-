export class GitHubClient {
  private pat: string;
  private owner: string;
  private repo: string;
  private branch: string;

  constructor(pat: string, fullRepo: string, branch: string) {
    this.pat = pat;
    const parts = fullRepo.replace('https://github.com/', '').split('/').filter(Boolean);
    this.owner = parts[parts.length - 2] || parts[0];
    this.repo = parts[parts.length - 1] || parts[1];
    this.branch = branch;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const res = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.pat}`,
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...options.headers,
      }
    });

    if (!res.ok) {
      throw new Error(`GitHub API Error: ${res.status} ${res.statusText}`);
    }
    
    // For 204 No Content
    if (res.status === 204) return null;
    return res.json();
  }

  async getFile(path: string) {
    try {
      const data = await this.request(`/contents/${path}?ref=${this.branch}`);
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
      const data = await this.request(`/contents/${path}?ref=${this.branch}`);
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
      const data = await this.request(`/contents/${path}?ref=${this.branch}`);
      if (Array.isArray(data)) {
        return data;
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  async putFile(path: string, content: string, message: string, sha?: string) {
    // Also write locally so AI Studio export doesn't delete it
    try {
      await fetch('/api/fs/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath: path, content })
      });
    } catch (e) {
      console.error('Failed to write locally', e);
    }

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
    // Also write locally so AI Studio export doesn't delete it
    try {
      await fetch('/api/fs/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath: path, content: base64Content, encoding: 'base64' })
      });
    } catch (e) {
      console.error('Failed to write locally', e);
    }

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
    // Also delete locally
    try {
      await fetch('/api/fs/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath: path })
      });
    } catch (e) {
      console.error('Failed to delete locally', e);
    }

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
