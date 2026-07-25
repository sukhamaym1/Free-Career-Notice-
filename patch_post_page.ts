import fs from 'fs';
let content = fs.readFileSync('src/pages/PostPage.tsx', 'utf-8');

if (!content.includes('import { Helmet }')) {
  content = content.replace("import { motion, useScroll, useSpring } from 'motion/react';", "import { motion, useScroll, useSpring } from 'motion/react';\nimport { Helmet } from 'react-helmet-async';");
}

const targetReturn = `return (
    <>
      <motion.div`;

const replacementReturn = `const displayTitle = post.seoTitle || \`\${post.title} - Career Notice\`;
  const displayDescription = post.seoDescription || post.title;
  const displayImage = post.featuredImage || (window.location.origin + '/default-og.jpg');
  const postUrl = window.location.href;

  return (
    <>
      <Helmet>
        <title>{displayTitle}</title>
        <meta name="description" content={displayDescription} />
        <meta property="og:title" content={displayTitle} />
        <meta property="og:description" content={displayDescription} />
        <meta property="og:image" content={displayImage} />
        <meta property="og:url" content={postUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={displayTitle} />
        <meta name="twitter:description" content={displayDescription} />
        <meta name="twitter:image" content={displayImage} />
      </Helmet>
      <motion.div`;

content = content.replace(targetReturn, replacementReturn);
fs.writeFileSync('src/pages/PostPage.tsx', content);
console.log('Replaced PostPage.tsx successfully.');
