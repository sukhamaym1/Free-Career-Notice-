import fs from 'fs';

let content = fs.readFileSync('src/admin/AdminDashboard.tsx', 'utf-8');

const oldFetchCategories = `
      const catRes = await client.getFile('content/categories.json');
      if (catRes) {
        setCategories(JSON.parse(catRes.content));
        setCategoriesSha(catRes.sha);
      }
      
      const tagRes = await client.getFile('content/tags.json');
      if (tagRes) {
        setTags(JSON.parse(tagRes.content));
        setTagsSha(tagRes.sha);
      }
      
      const settingsRes = await client.getFile('content/settings.json');
      if (settingsRes) {
        setSettingsData(JSON.parse(settingsRes.content));
        setSettingsSha(settingsRes.sha);
      }
`;

const newFetchCategories = `
      const catRes = await client.getFile('content/categories.json');
      if (catRes) {
        setCategories(JSON.parse(catRes.content));
        setCategoriesSha(catRes.sha);
        try {
            await fetch('/api/fs/write', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filePath: 'content/categories.json', content: catRes.content })
            });
        } catch (e) {}
      }
      
      const tagRes = await client.getFile('content/tags.json');
      if (tagRes) {
        setTags(JSON.parse(tagRes.content));
        setTagsSha(tagRes.sha);
        try {
            await fetch('/api/fs/write', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filePath: 'content/tags.json', content: tagRes.content })
            });
        } catch (e) {}
      }
      
      const settingsRes = await client.getFile('content/settings.json');
      if (settingsRes) {
        setSettingsData(JSON.parse(settingsRes.content));
        setSettingsSha(settingsRes.sha);
        try {
            await fetch('/api/fs/write', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filePath: 'content/settings.json', content: settingsRes.content })
            });
        } catch (e) {}
      }
`;

content = content.replace(oldFetchCategories, newFetchCategories);
fs.writeFileSync('src/admin/AdminDashboard.tsx', content);
console.log("Patched AdminDashboard.tsx sync rest");
