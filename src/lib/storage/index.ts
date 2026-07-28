import { GitHubProvider } from './githubProvider';
import { ContentService } from './contentService';
import { MediaService } from './mediaService';
import { StorageProvider } from './types';
import { CMS_CONFIG } from '../../config';

export function createStorageProvider(pat?: string): StorageProvider {
  switch (CMS_CONFIG.provider) {
    case 'github':
      // The pat can be provided by the admin login, otherwise it's undefined (for public frontend)
      return new GitHubProvider(
        pat || '',
        CMS_CONFIG.github.owner,
        CMS_CONFIG.github.repo,
        CMS_CONFIG.github.branch,
        CMS_CONFIG.github.contentRoot,
        CMS_CONFIG.github.uploadsRoot
      );
    default:
      throw new Error(`Storage provider ${CMS_CONFIG.provider} is not supported yet.`);
  }
}

export { ContentService, MediaService, GitHubProvider };
export * from './types';
