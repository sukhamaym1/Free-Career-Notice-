import fs from 'fs';
import path from 'path';
import { JOB_NOTIFICATIONS, ADMIT_CARDS, RESULTS, NEW_UPDATES, COLOR_BLOCKS } from './src/data';

const postsDir = path.join(process.cwd(), 'content', 'posts');
if (!fs.existsSync(postsDir)) fs.mkdirSync(postsDir, { recursive: true });

let id = 1;

const writePost = (data: any, categorySlug: string) => {
  const post = {
    id: `post-${String(id++).padStart(3, '0')}`,
    title: data.title || data,
    categorySlug,
    content: `<p>${data.title || data}</p>`,
    author: data.author || 'Sukhamay',
    date: data.date || new Date().toISOString(),
    tags: [data.tag].filter(Boolean),
    tagColor: data.tagColor || '',
    imgGradient: data.imgGradient || '',
    salary: data.salary || '',
    jobType: data.jobType || '',
    location: data.location || '',
    bgClass: data.bgClass || '', // for color blocks
    status: 'published'
  };
  fs.writeFileSync(path.join(postsDir, `${post.id}.json`), JSON.stringify(post, null, 2));
};

NEW_UPDATES.forEach(item => writePost(item, 'new-updates'));
COLOR_BLOCKS.forEach(item => writePost(item, 'color-blocks'));
JOB_NOTIFICATIONS.forEach(item => writePost(item, 'job-notifications'));
ADMIT_CARDS.forEach(item => writePost(item, 'admit-cards'));
RESULTS.forEach(item => writePost(item, 'results'));

console.log('Migration complete');
