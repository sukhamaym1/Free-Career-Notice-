import fs from 'fs';

// Header.tsx
let headerContent = fs.readFileSync('src/components/Header.tsx', 'utf-8');
headerContent = headerContent.replace(
  /\/category\/admit-card"/g,
  '/category/admit-cards"'
);
fs.writeFileSync('src/components/Header.tsx', headerContent);

// Footer.tsx
let footerContent = fs.readFileSync('src/components/Footer.tsx', 'utf-8');
footerContent = footerContent.replace(
  /\/category\/admit-card"/g,
  '/category/admit-cards"'
);
fs.writeFileSync('src/components/Footer.tsx', footerContent);

// HomePage.tsx
let homeContent = fs.readFileSync('src/pages/HomePage.tsx', 'utf-8');
homeContent = homeContent.replace(
  /\/category\/admit-card"/g,
  '/category/admit-cards"'
);
fs.writeFileSync('src/pages/HomePage.tsx', homeContent);
