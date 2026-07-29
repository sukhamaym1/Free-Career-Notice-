const fs = require('fs');

let code = fs.readFileSync('src/lib/storage/githubProvider.ts', 'utf8');

const target = `  async getPages(): Promise<Record<string, string>> {
    const pages: Record<string, string> = {};
    if (!this.client) {
      return pages;
    }
    
    try {
      const files = await this.client.listDirectory(\`\${this.contentRoot}/pages\`);
      for (const file of files) {
        if (file.name.endsWith('.json')) {
          const id = file.name.replace('.json', '');
          const pageStr = await this.client.getFile(file.path);
          if (pageStr) {
            const pageObj = JSON.parse(pageStr);
            pages[id] = pageObj.content || '';
            this.pageShaMap.set(id, file.sha);
          }
        }
      }
    } catch (err: any) {
      if (err.status !== 404) {
        console.error('Error fetching pages from GitHub:', err);
      }
    }
    return pages;
  }

  async getPage(id: string): Promise<string | null> {
    if (!this.client) {
      try {
        const data = await this.fetchPublicJson(\`\${this.contentRoot}/pages/\${id}.json\`);
        return data ? data.content : null;
      } catch (err) {
        return null;
      }
    }
    try {
      const existing = await this.client.getFile(\`\${this.contentRoot}/pages/\${id}.json\`);
      if (existing) {
        const pageObj = JSON.parse(existing);
        return pageObj.content;
      }
      return null;
    } catch (err: any) {
      return null;
    }
  }

  async savePage(id: string, content: string): Promise<void> {
    if (!this.client) throw new Error("Cannot save page without authentication");
    let sha = this.pageShaMap.get(id);
    if (!sha) {
      try {
        const existing = await this.client.getFile(\`\${this.contentRoot}/pages/\${id}.json\`);
      } catch (e) {
      }
    }
    await this.saveWithRetry(
      \`\${this.contentRoot}/pages/\${id}.json\`,
      \`Update page \${id}\`,
      JSON.stringify({ content }, null, 2),
      sha
    );
    this.pageShaMap.delete(id);
  }`;

const replacement = `  async getPages(): Promise<Record<string, string>> {
    const pages: Record<string, string> = {};
    if (!this.client) {
      return pages;
    }
    
    try {
      const files = await this.client.listDirectory(\`\${this.contentRoot}/pages\`);
      for (const file of files) {
        if (file.name.endsWith('.json')) {
          const id = file.name.replace('.json', '');
          const res = await this.client.getFile(file.path);
          if (res && res.content) {
            const pageObj = JSON.parse(res.content);
            pages[id] = pageObj.content || '';
            this.pageShaMap.set(id, res.sha);
          }
        }
      }
    } catch (err: any) {
      if (err.status !== 404) {
        console.error('Error fetching pages from GitHub:', err);
      }
    }
    return pages;
  }

  async getPage(id: string): Promise<string | null> {
    if (!this.client) {
      try {
        const data = await this.fetchPublicJson(\`\${this.contentRoot}/pages/\${id}.json\`);
        return data ? data.content : null;
      } catch (err) {
        return null;
      }
    }
    try {
      const res = await this.client.getFile(\`\${this.contentRoot}/pages/\${id}.json\`);
      if (res && res.content) {
        const pageObj = JSON.parse(res.content);
        return pageObj.content;
      }
      return null;
    } catch (err: any) {
      return null;
    }
  }

  async savePage(id: string, content: string): Promise<void> {
    if (!this.client) throw new Error("Cannot save page without authentication");
    let sha = this.pageShaMap.get(id);
    if (!sha) {
      try {
        const existing = await this.client.getFile(\`\${this.contentRoot}/pages/\${id}.json\`);
        if (existing && existing.sha) {
          sha = existing.sha;
        }
      } catch (e) {
      }
    }
    await this.saveWithRetry(
      \`\${this.contentRoot}/pages/\${id}.json\`,
      \`Update page \${id}\`,
      JSON.stringify({ content }, null, 2),
      sha
    );
    this.pageShaMap.delete(id);
  }`;

code = code.replace(target, replacement);
fs.writeFileSync('src/lib/storage/githubProvider.ts', code);
