const postsModules = import.meta.glob('../content/posts/*.json', { eager: true });
const rawPosts = Object.values(postsModules).map((mod: any) => mod.default || mod);

export const NEW_UPDATES = rawPosts
  .filter(p => p.categorySlug === 'new-updates')
  .map(p => p.title);

export const COLOR_BLOCKS = rawPosts
  .filter(p => p.categorySlug === 'color-blocks')
  .map(p => ({ title: p.title, bgClass: p.bgClass }));

export const JOB_NOTIFICATIONS = rawPosts
  .filter(p => p.categorySlug === 'job-notifications')
  .map(p => ({
    title: p.title,
    author: p.author,
    date: p.date,
    tag: p.tags?.[0] || '',
    tagColor: p.tagColor,
    imgGradient: p.imgGradient,
    salary: p.salary,
    jobType: p.jobType,
    location: p.location,
  }));

export const ADMIT_CARDS = rawPosts
  .filter(p => p.categorySlug === 'admit-cards')
  .map(p => ({
    title: p.title,
    author: p.author,
    date: p.date,
    tag: p.tags?.[0] || '',
    tagColor: p.tagColor,
    imgGradient: p.imgGradient,
  }));

export const RESULTS = rawPosts
  .filter(p => p.categorySlug === 'results')
  .map(p => ({
    title: p.title,
    author: p.author,
    date: p.date,
    tag: p.tags?.[0] || '',
    tagColor: p.tagColor,
    imgGradient: p.imgGradient,
  }));

// Also export the full list for admin dashboard
export const ALL_POSTS = rawPosts;
