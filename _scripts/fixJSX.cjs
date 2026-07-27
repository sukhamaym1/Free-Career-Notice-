const fs = require('fs');
let content = fs.readFileSync('src/admin/pages/EditorPage.tsx', 'utf8');

content = content.replace(
  '<SEOCalculator />\n        </div>\n      </form>',
  '<SEOCalculator />\n        </div>\n      )}\n      </form>'
);

fs.writeFileSync('src/admin/pages/EditorPage.tsx', content);
