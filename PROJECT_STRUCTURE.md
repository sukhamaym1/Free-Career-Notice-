# Project Structure

```
├── content/                # JSON CMS database (stored on GitHub)
│   ├── posts/              # Individual JSON files for every job notification/result
│   ├── categories.json     # Site categories
│   ├── tags.json           # Site tags
│   ├── homepage.json       # Homepage layout config
│   ├── menu.json           # Navigation menus
│   └── settings.json       # SEO and site global settings
├── public/                 # Static assets (images, fonts, icons)
│   └── uploads/            # Media library uploads folder
├── src/                    # React source code
│   ├── admin/              # Admin CMS specific module
│   │   ├── components/     # Admin-only components (RichTextEditor, SEOCalculator, WebsiteSettings, etc.)
│   │   ├── pages/          # Admin sub-pages (DashboardPage, EditorPage, PostsPage, MediaLibraryPage, etc.)
│   │   ├── AdminDashboard.tsx # Main admin dashboard component
│   │   ├── AdminLogin.tsx  # Admin login page
│   │   └── AdminPage.tsx   # Admin route wrapper
│   ├── components/         # Reusable UI components (Public)
│   ├── pages/              # Public page views (Home, Category, Post, etc.)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities
│   │   ├── github.ts       # GitHub REST API client (Core CMS engine)
│   │   └── utils.ts        # Common utility functions (Tailwind cn, etc.)
│   ├── data.ts             # Dynamic static data compiler
│   ├── App.tsx             # Main routing component
│   ├── main.tsx            # Vite entry point
│   └── types.ts            # TypeScript definitions
├── _scripts/               # Utility scripts (patches, fixes, generation scripts)
├── server.ts               # Express server entry point (handles local fs writes and Vite middleware)
├── package.json            # Dependencies
├── vite.config.ts          # Vite build configuration
└── tailwind.config.js      # Tailwind CSS styling
```
