import settingsData from '../content/settings.json';

const postsModules = import.meta.glob('../content/posts/*.json', { eager: true });
const rawPosts = Object.values(postsModules).map((mod: any) => mod.default || mod);
const publishedPosts = rawPosts.filter((p: any) => {
  if (p.status === 'draft') return false;
  if (p.date) {
    const d = new Date(p.date);
    if (!isNaN(d.getTime()) && d > new Date()) {
      return false; // Scheduled for future
    }
  }
  return true;
});



export const COLOR_BLOCKS = publishedPosts
  .filter(p => p.categorySlug === 'highlight-updates')
  .map(p => ({ title: p.title, bgClass: p.bgClass, id: p.id }));

export const JOB_NOTIFICATIONS = publishedPosts
  .filter(p => p.categorySlug === 'job-notifications')
  .map(p => ({
    id: p.id,
    title: p.title,
    author: p.author,
    date: p.date,
    tag: p.tags?.[0] || '', tags: p.tags || [],
    tagColor: p.tagColor,
    imgGradient: p.imgGradient,
    salary: p.salary,
    jobType: p.jobType,
    location: p.location,
  }));

export const ADMIT_CARDS = publishedPosts
  .filter(p => p.categorySlug === 'admit-card')
  .map(p => ({
    id: p.id,
    title: p.title,
    author: p.author,
    date: p.date,
    tag: p.tags?.[0] || '', tags: p.tags || [],
    tagColor: p.tagColor,
    imgGradient: p.imgGradient,
  }));

export const RESULTS = publishedPosts
  .filter(p => p.categorySlug === 'results')
  .map(p => ({
    id: p.id,
    title: p.title,
    author: p.author,
    date: p.date,
    tag: p.tags?.[0] || '', tags: p.tags || [],
    tagColor: p.tagColor,
    imgGradient: p.imgGradient,
  }));

// Also export the full list for admin dashboard
export const ALL_POSTS = rawPosts;
export const PUBLISHED_POSTS = publishedPosts;

export const SITE_SETTINGS = settingsData;
