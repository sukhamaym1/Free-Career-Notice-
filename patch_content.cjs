const fs = require('fs');
let code = fs.readFileSync('src/lib/storage/contentService.ts', 'utf8');

const target = `  async saveSettings(settings: SiteSettings): Promise<void> {
    try {
      await this.provider.saveSettings(settings);
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw new Error('Failed to save site settings.');
    }
  }
}`;

const replacement = `  async saveSettings(settings: SiteSettings): Promise<void> {
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
      throw new Error('Failed to save page.');
    }
  }
}`;

code = code.replace(target, replacement);
fs.writeFileSync('src/lib/storage/contentService.ts', code);
