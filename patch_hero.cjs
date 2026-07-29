const fs = require('fs');
let code = fs.readFileSync('src/components/Hero.tsx', 'utf8');

const targetTrending = `        {['SBI', 'SSC', 'Railway', 'IBPS'].map(tag => (`;
const replaceTrending = `        {((SITE_SETTINGS as any).featuredCategories 
            ? ((SITE_SETTINGS as any).featuredCategories as string).split(',').map(s => s.trim()).filter(Boolean)
            : ['SBI', 'SSC', 'Railway', 'IBPS']
          ).map(tag => (`;

const targetFormEnd = `      </form>`;
const replaceFormEnd = `      </form>
      
      {(SITE_SETTINGS as any).heroButtonText && (SITE_SETTINGS as any).heroButtonLink && (
        <a 
          href={(SITE_SETTINGS as any).heroButtonLink} 
          className="mb-8 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          target={((SITE_SETTINGS as any).heroButtonLink.startsWith('http') ? '_blank' : undefined)}
          rel="noopener noreferrer"
        >
          {(SITE_SETTINGS as any).heroButtonText}
        </a>
      )}`;

code = code.replace(targetTrending, replaceTrending);
code = code.replace(targetFormEnd, replaceFormEnd);
fs.writeFileSync('src/components/Hero.tsx', code);
console.log("Hero patched");
