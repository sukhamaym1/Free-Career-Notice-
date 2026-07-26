import fs from 'fs';
let content = fs.readFileSync('src/components/Footer.tsx', 'utf-8');
content = content.replace(
  `to="/terms-of-service"`,
  `to="/terms-and-conditions"`
).replace(
  `Terms of Service`,
  `Terms & Conditions`
);
fs.writeFileSync('src/components/Footer.tsx', content);
