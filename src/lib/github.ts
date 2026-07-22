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
