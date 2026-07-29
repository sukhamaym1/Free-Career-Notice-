const fs = require('fs');
let code = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');

const importTarget = `import { useData } from '../components/DataProvider';`;
const importReplacement = `import { useData } from '../components/DataProvider';
import HomepagePopup from '../components/HomepagePopup';`;

const returnTarget = `    <motion.main`;
const returnReplacement = `    <>
      <HomepagePopup />
      <motion.main`;

const endTarget = `    </motion.main>
  );
}`;
const endReplacement = `    </motion.main>
    </>
  );
}`;

code = code.replace(importTarget, importReplacement);
code = code.replace(returnTarget, returnReplacement);
code = code.replace(endTarget, endReplacement);

fs.writeFileSync('src/pages/HomePage.tsx', code);
console.log("HomePage Popup patched");
