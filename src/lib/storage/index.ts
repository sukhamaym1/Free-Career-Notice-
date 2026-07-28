import { GitHubProvider } from './githubProvider';
import { ContentService } from './contentService';
import { MediaService } from './mediaService';
import { StorageProvider } from './types';

// Configuration interface to switch providers easily in the future
export interface StorageConfig {
  provider: 'github' | 'cloudflare_d1' | 'supabase' | 'firebase' | 'local';
  github?: {
    pat: string;
    repo: string;
    branch: string;
  };
  // Future provider configs...
}

export function createStorageProvider(config: StorageConfig): StorageProvider {
  switch (config.provider) {
    case 'github':
      if (!config.github) throw new Error("GitHub config missing");
      return new GitHubProvider(
        config.github.pat,
        config.github.repo,
        config.github.branch
      );
    // case 'supabase':
    //   return new SupabaseProvider(config.supabase);
    default:
      throw new Error(`Storage provider ${config.provider} is not supported yet.`);
  }
}

export { ContentService, MediaService, GitHubProvider };
export * from './types';
