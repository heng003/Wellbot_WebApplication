# Copilot Instructions for This Project

## Overview
This project is a full-stack web application with a React frontend (using Tailwind CSS and custom configuration) and a Node.js/Express backend. The frontend is styled to match the horizon-tailwind-react dashboard, with custom utility classes, Google Fonts, and Chart.js integrations. The backend provides RESTful APIs and uses Supabase for authentication and data storage.

## Key Conventions & Architecture
- **Frontend:**
  - Located in `frontend/`.
  - Uses React 18, Tailwind CSS (with custom config), Chart.js, react-chartjs-2, and react-wordcloud.
  - Custom Tailwind classes and global CSS are used for exact UI fidelity.
  - Google Fonts (DM Sans) are imported in `public/index.html`.
  - All dashboard UI should use card-based layouts, responsive grids, and custom SVG icons as in horizon-tailwind-react.
  - Use functional components and hooks (no class components).
  - Place new pages in `src/pages/`, components in `src/components/`, and utilities in `src/utils/`.
  - Run `npm start` to launch the frontend, `npm run build` to build for production, and `npm test` for tests.

- **Backend:**
  - Located in `backend/`.
  - Uses Node.js, Express, and Supabase for authentication and data.
  - API routes are defined in `routes/`, controllers in `controllers/`, and models in `models/`.
  - Use `nodemon` for development (`npm run dev`), and `npm start` for production.
  - Environment variables are managed via `.env` files (not committed).

## Workflows
- **Frontend:**
  - Use Tailwind utility classes and custom classes from `tailwind.config.js` and global CSS.
  - For new UI, match the structure and classes from horizon-tailwind-react.
  - Use Chart.js for charts, react-wordcloud for word clouds.
  - All new code should be functional, modular, and placed in the correct directory.
  - Run tests with `npm test` before submitting changes.

- **Backend:**
  - Add new API endpoints in `routes/` and implement logic in `controllers/`.
  - Use Supabase client for authentication and data access.
  - Test endpoints with Postman or similar tools.

## Integration
- **Frontend and backend communicate via RESTful APIs.**
- **Supabase** is used for authentication and as a backend service.

## Best Practices
- Follow existing file and folder structure.
- Use descriptive commit messages.
- Write clear, maintainable, and well-documented code.
- Keep UI consistent with horizon-tailwind-react.
- Do not commit `.env` or sensitive files.

## External References
- [horizon-tailwind-react](https://github.com/horizon-ui/horizon-tailwind-react)
- [Create React App Docs](https://facebook.github.io/create-react-app/docs/getting-started)
- [Tailwind CSS Docs](https://tailwindcss.com/docs/installation)
- [Supabase Docs](https://supabase.com/docs)

---

*Update this file if project conventions or architecture change. AI agents should follow these instructions for all code generation, refactoring, and onboarding tasks.*
