import fs from 'fs';

const content = fs.readFileSync('src/pages/PostPage.tsx', 'utf-8');
const newContent = content.replace(
  `  // Mock data for the post
  const post = {
    title: "WBPSC Miscellaneous Services Recruitment 2026 – Apply Online, Eligibility, Dates",
    category: "Job Notifications",
    categorySlug: "job-notifications",
    date: "April 25, 2026",
    author: "Sukhamay",
    readTime: "5 min read",
    imgGradient: "from-blue-600 to-indigo-800",
    tags: ["WBPSC", "Govt Jobs", "West Bengal", "Miscellaneous"],
  };`,
  `  import { ALL_POSTS } from '../data';
  const foundPost = ALL_POSTS.find((p: any) => p.id === postId);
  
  const post = foundPost || {
    title: "Post Not Found",
    category: "Unknown",
    categorySlug: "unknown",
    date: "",
    author: "",
    readTime: "",
    imgGradient: "from-blue-600 to-indigo-800",
    tags: [],
    content: "<p>The requested post could not be found.</p>"
  };
  
  const categoryName = post.categorySlug ? post.categorySlug.split('-').map((s:string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') : post.category || '';
  post.category = categoryName;
  `
).replace(`import { useParams, Link } from 'react-router-dom';`, `import { useParams, Link } from 'react-router-dom';\nimport { ALL_POSTS } from '../data';\nimport RichTextEditor from '../components/admin/RichTextEditor';`);
fs.writeFileSync('src/pages/PostPage.tsx', newContent);
