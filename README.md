# Free Career Notice

A modern, responsive, and beautifully animated web application for tracking the latest government jobs, admit cards, and exam results. Built with a focus on performance, accessibility, and user experience.

## ✨ Features

- **Real-Time Search**: Global search functionality with animated typing placeholders.
- **Theme Switching**: Built-in support for Light and Dark modes.
- **Modern Animations**: Powered by Framer Motion for smooth, engaging user interactions.
- **Responsive Design**: Fully responsive UI built with Tailwind CSS, working seamlessly on desktop, tablet, and mobile devices.
- **Routing**: Client-side routing with React Router for fast page transitions.

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router](https://reactrouter.com/)

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn or bun

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/free-career-notice.git
   cd free-career-notice
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## 📦 Build for Production

To create a production-ready build:

```bash
npm run build
```
The optimized files will be generated in the `dist` directory.

## 📁 Project Structure

```text
src/
├── components/       # Reusable UI components (Header, Hero, etc.)
├── hooks/            # Custom React hooks (useTheme, useTypingPlaceholder)
├── pages/            # Application routes/pages
├── data.ts           # Mock data for jobs, admit cards, and results
├── index.css         # Global styles and Tailwind configuration
├── main.tsx          # Application entry point
└── App.tsx           # Main App component and route definitions
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
