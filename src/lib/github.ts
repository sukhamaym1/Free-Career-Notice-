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

  public hasToken(): boolean {
    return !!this.pat;
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

    let url = this.pat 
      ? `https://api.github.com/repos/${this.owner}/${this.repo}${endpoint}`
      : `/api/github/repos/${this.owner}/${this.repo}${endpoint}`;

    let res: Response;
    try {
      res = await fetch(url, {
        cache: 'no-store',
        ...options,
        headers
      });
      // If deployed as static site (Cloudflare Pages), /api/github/... will return 404 Not Found
      // or 200 with HTML (because of SPA fallback routing).
      const contentType = res.headers.get('content-type') || '';
      if (!this.pat && (res.status === 404 || contentType.includes('text/html'))) {
        throw new Error('Proxy not found or returned HTML, fallback to direct API');
      }
    } catch (e) {
      if (!this.pat) {
        url = `https://api.github.com/repos/${this.owner}/${this.repo}${endpoint}`;
        res = await fetch(url, {
          cache: 'no-store',
          ...options,
          headers
        });
      } else {
        throw e;
      }
    }

    if (!res.ok) {
      const errBody = await res.text().catch(() => '');
      if (res.status !== 404 && res.status !== 403) {
        console.error('GitHub API Error body:', errBody);
      } else if (res.status === 403 && this.pat) {
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

  async triggerWorkflow(workflowId: string) {
    return this.request(`/actions/workflows/${workflowId}/dispatches`, {
      method: 'POST',
      body: JSON.stringify({
        ref: this.branch
      })
    });
  }
}
