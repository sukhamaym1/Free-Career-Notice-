const fs = require('fs');
let code = fs.readFileSync('src/admin/AdminDashboard.tsx', 'utf8');

const target = `      const newPost = {
        ...editingPost,
        id: postId,
        title: formData.get('title'),
        seoTitle: formData.get('seoTitle'),
        seoDescription: formData.get('seoDescription'),
        focusKeyword: formData.get('focusKeyword'),
        featuredImage: formData.get('featuredImage'),
        categorySlug: formData.get('categorySlug'),
        content: formData.get('content') || \`<p>\${formData.get('title')}</p>\`,
        author: formData.get('author'),
        date: formData.get('date') ? new Date(formData.get('date') as string).toISOString() : new Date().toISOString(),
        tags: formData.getAll('tag').filter(Boolean) as string[],
        tagColor: formData.get('tagColor') || 'bg-green-500', 
        imgGradient: formData.get('imgGradient') || 'from-blue-500 to-indigo-600',
        salary: formData.get('salary'),
        jobType: formData.get('jobType'),
        location: formData.get('location'),
        status: formData.get('status') === 'draft' ? 'draft' : 'published'
      };`;

const replacement = `      const newPost: any = {
        ...editingPost,
        id: postId,
        title: formData.has('title') ? formData.get('title') : (editingPost?.title || ''),
        seoTitle: formData.has('seoTitle') ? formData.get('seoTitle') : (editingPost?.seoTitle || ''),
        seoDescription: formData.has('seoDescription') ? formData.get('seoDescription') : (editingPost?.seoDescription || ''),
        focusKeyword: formData.has('focusKeyword') ? formData.get('focusKeyword') : (editingPost?.focusKeyword || ''),
        featuredImage: formData.has('featuredImage') ? formData.get('featuredImage') : (editingPost?.featuredImage || ''),
        categorySlug: formData.has('categorySlug') ? formData.get('categorySlug') : (editingPost?.categorySlug || ''),
        content: formData.has('content') ? formData.get('content') : (editingPost?.content || \`<p>\${formData.get('title')}</p>\`),
        author: formData.has('author') ? formData.get('author') : (editingPost?.author || ''),
        date: formData.get('date') ? new Date(formData.get('date') as string).toISOString() : (editingPost?.date || new Date().toISOString()),
        tags: formData.has('tag') ? formData.getAll('tag').filter(Boolean) as string[] : (editingPost?.tags || []),
        tagColor: formData.has('tagColor') ? formData.get('tagColor') : (editingPost?.tagColor || 'bg-green-500'), 
        imgGradient: formData.has('imgGradient') ? formData.get('imgGradient') : (editingPost?.imgGradient || 'from-blue-500 to-indigo-600'),
        salary: formData.has('salary') ? formData.get('salary') : editingPost?.salary,
        jobType: formData.has('jobType') ? formData.get('jobType') : editingPost?.jobType,
        location: formData.has('location') ? formData.get('location') : editingPost?.location,
        status: formData.has('status') ? (formData.get('status') === 'draft' ? 'draft' : 'published') : (editingPost?.status || 'published')
      };
      
      // Clean up undefined/null fields for optional metadata
      ['salary', 'jobType', 'location', 'tagColor', 'imgGradient'].forEach(key => {
        if (newPost[key] === undefined || newPost[key] === null || newPost[key] === '') {
          delete newPost[key];
        }
      });`;

code = code.replace(target, replacement);
fs.writeFileSync('src/admin/AdminDashboard.tsx', code);
