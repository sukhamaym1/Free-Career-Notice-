export const CMS_CONFIG = {
  provider: 'github' as 'github' | 'cloudflare_d1' | 'supabase' | 'firebase' | 'local',
  github: {
    owner: 'your-username', // Replace with content repo owner
    repo: 'free-career-notice-content', // Replace with content repo name
    branch: 'main',
    contentRoot: 'content',
    uploadsRoot: 'public/uploads',
  },
  // Future providers
  cloudflare: {
    d1DatabaseId: '',
    r2BucketName: '',
  }
};
