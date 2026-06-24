# README.md Creator

A clean and practical README generator that lets users build customizable documentation pages without needing coding experience. The app gives a polished UI for composing markdown, previewing content, and managing a simulated repository workspace so anyone can generate professional README files quickly.

## Description

This is a README file creator designed for users who want to produce strong project documentation without writing raw markdown manually. It provides easy insertion tools, workspace simulation, live preview, and convenient export options so feedback and content can be crafted with minimal effort.

## Tech Used

- React
- TypeScript
- Vite
- Tailwind-style CSS classes
- `react-markdown`
- `remark-gfm`
- `rehype-raw`

## File Structure

- `index.html` — application entry HTML
- `package.json` — project metadata and scripts
- `tsconfig.json` — TypeScript configuration
- `vite.config.ts` — Vite configuration
- `server.ts` — local development server setup
- `src/` — application source code
  - `App.tsx` — main application UI and logic
  - `main.tsx` — React entry point
  - `index.css` — global styles
  - `types.ts` — shared type definitions
  - `data/` — reusable data assets
    - `badges.ts`
    - `templates.ts`
- `assets/` — static images and assets

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd readme.md-creator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open the app in your browser at the address shown by Vite.

## License

This project is available under the MIT License.

## About

`Developed:` Raj Prajapati - 24th June 2026