# Project Structure

```
├── content/                # JSON CMS database (stored on GitHub)
│   ├── posts/              # Individual JSON files for every job notification/result
│   ├── categories.json     # Site categories
│   ├── tags.json           # Site tags
│   ├── homepage.json       # Homepage layout config
│   └── menu.json           # Navigation menus
├── website/                
│   └── settings.json       # SEO and site global settings
├── public/                 # Static assets (images, fonts, icons)
│   └── uploads/            # Media library uploads folder
├── src/                    # React source code
│   ├── admin/              # Admin CMS specific module
│   │   ├── components/     # Admin-only components (RichTextEditor, SEOCalculator, etc.)
│   │   ├── AdminDashboard.tsx
│   │   └── AdminLogin.tsx
│   ├── components/         # Reusable UI components (Public)
│   ├── pages/              # Page views (Home, Category, Post, etc.)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities
│   │   └── github.ts       # GitHub REST API client (Core CMS engine)
│   ├── data.ts             # Dynamic static data compiler
│   ├── App.tsx             # Main routing
│   └── main.tsx            # Vite entry point
├── _scripts/               # Utility scripts (patches, fixes, generation scripts)
├── package.json            # Dependencies
├── vite.config.ts          # Vite build configuration
└── tailwind.config.js      # Tailwind CSS styling
```
