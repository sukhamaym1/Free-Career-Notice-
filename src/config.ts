export const CMS_CONFIG = {
  provider: 'github' as 'github' | 'cloudflare_d1' | 'supabase' | 'firebase' | 'local',
  github: {
    owner: 'sukhamaym1',
    repo: 'free-career-content',
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
