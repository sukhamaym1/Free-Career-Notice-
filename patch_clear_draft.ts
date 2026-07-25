import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf-8');

const targetSuccess = `      await fetchData();
      setActiveTab('All Posts');
      setEditingPost(null);
    } catch (error) {`;

const replacementSuccess = `      
      // Clear draft after successful save
      localStorage.removeItem(isEdit ? \`draftPost-\${editingPost.id}\` : 'draftPost-new');
      
      await fetchData();
      setActiveTab('All Posts');
      setEditingPost(null);
    } catch (error) {`;

if (content.includes(targetSuccess)) {
  content = content.replace(targetSuccess, replacementSuccess);
  fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', content);
  console.log('Patched clear draft successfully.');
} else {
  console.log('targetSuccess not found');
}
