# Project Structure

The project follows a standard modern React application structure, organized for scalability and separation of concerns.

## Directory Layout

```
.
├── public/                 # Static assets (favicon, manifest, robots.txt)
├── src/                    # Main application source code
│   ├── components/         # Reusable UI components
│   │   ├── admin/          # Admin-specific components (Sidebar, Editor)
│   │   ├── layout/         # Public layout components (Header, Footer)
│   │   └── ui/             # Generic UI elements (Buttons, Inputs, Modals)
│   ├── hooks/              # Custom React hooks (useTheme, useAuth)
│   ├── pages/              # Route components (Views)
│   │   ├── admin/          # CMS Dashboard views (Dashboard, PostEditor, Media)
│   │   └── public/         # Public facing website views (Home, Post, Category)
│   ├── lib/                # Utilities and API service layers
│   │   ├── api.ts          # Axios/Fetch configurations for the Worker API
│   │   └── utils.ts        # Helper functions
│   ├── types/              # TypeScript interface definitions (Post, User)
│   ├── App.tsx             # Main router configuration
│   ├── main.tsx            # React entry point
│   └── index.css           # Global Tailwind CSS entry
├── .env.example            # Example environment variables
├── package.json            # Node dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
└── tailwind.config.js      # Tailwind CSS configuration
```

## Important Files

- **`src/App.tsx`**: Defines the public and protected routes. Admin routes are guarded by an authentication wrapper.
- **`src/pages/admin/AdminDashboard.tsx`**: The main entry point for the CMS dashboard, managing the state of the sidebar and rendering child admin views.
- **`src/data.ts`**: (Legacy) Currently holds hardcoded array data. This will be deprecated as data is migrated to the Cloudflare D1 database.
- **`src/lib/api.ts`**: (Planned) Will centralize all communication with the Cloudflare Worker API.
