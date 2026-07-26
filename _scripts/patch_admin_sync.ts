import fs from 'fs';

let content = fs.readFileSync('src/admin/AdminDashboard.tsx', 'utf-8');

const oldFetchData = `
  const fetchData = async () => {
    setSyncStatus('syncing');
    try {
      const files = await client.listDirectory('content/posts');
      const postPromises = files.map((f: any) => client.getFile(f.path).then(res => ({ ...res, path: f.path })));
      const postResults = await Promise.all(postPromises);
      const posts = postResults.filter((r: any) => r && r.content).map((r: any) => ({ ...JSON.parse(r.content), _sha: r.sha, _path: r.path }));
`;

const newFetchData = `
  const fetchData = async () => {
    setSyncStatus('syncing');
    try {
      const files = await client.listDirectory('content/posts');
      const postPromises = files.map((f: any) => client.getFile(f.path).then(async res => {
        if (res && res.content) {
          // Sync to local filesystem
          try {
            await fetch('/api/fs/write', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ filePath: f.path, content: res.content })
            });
          } catch (e) {
            console.error('Failed to sync locally', e);
          }
        }
        return { ...res, path: f.path };
      }));
      const postResults = await Promise.all(postPromises);
      const posts = postResults.filter((r: any) => r && r.content).map((r: any) => ({ ...JSON.parse(r.content), _sha: r.sha, _path: r.path }));
`;

content = content.replace(oldFetchData, newFetchData);


const oldMediaFetch = `
      const mediaList = await client.listDirectory('public/uploads');
      const mediaFiles = mediaList.filter((f: any) => f.type === 'file').map((f: any) => ({
        name: f.name,
        path: f.path,
        sha: f.sha,
        url: \`https://raw.githubusercontent.com/\${githubConfig.repo}/\${githubConfig.branch}/\${f.path}\`
      }));
      setMediaFiles(mediaFiles);
`;

const newMediaFetch = `
      const mediaList = await client.listDirectory('public/uploads');
      const mediaFiles = mediaList.filter((f: any) => f.type === 'file').map((f: any) => ({
        name: f.name,
        path: f.path,
        sha: f.sha,
        url: \`https://raw.githubusercontent.com/\${githubConfig.repo}/\${githubConfig.branch}/\${f.path}\`
      }));
      setMediaFiles(mediaFiles);
      
      // Sync media files to local filesystem in the background
      mediaList.filter((f: any) => f.type === 'file').forEach(async (f: any) => {
        try {
          const fileData = await client.getRawFile(f.path);
          if (fileData && fileData.content) {
            await fetch('/api/fs/write', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ filePath: f.path, content: fileData.content, encoding: 'base64' })
            });
          }
        } catch (e) {
          console.error('Failed to sync media locally', e);
        }
      });
`;

content = content.replace(oldMediaFetch, newMediaFetch);

fs.writeFileSync('src/admin/AdminDashboard.tsx', content);
console.log("Patched AdminDashboard.tsx sync");
