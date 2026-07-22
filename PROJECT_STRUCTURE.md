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
│   ├── components/         # Reusable UI components
│   │   ├── admin/          # CMS specific components (Editor, layout)
│   │   ├── layout/         # Public site layout (Header, Footer, Sidebar)
│   │   └── home/           # Homepage widgets
│   ├── pages/              # Page views (Home, Category, Post, Admin)
│   ├── lib/                # Utilities
│   │   └── github.ts       # GitHub REST API client (Core CMS engine)
│   ├── data.ts             # Dynamic static data compiler using import.meta.glob
│   ├── App.tsx             # Main routing
│   └── main.tsx            # Vite entry point
├── package.json            # Dependencies
├── vite.config.ts          # Vite build configuration
└── tailwind.config.js      # Tailwind CSS styling
```
