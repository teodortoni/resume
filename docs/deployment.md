# Deployment

This project is designed for static deployment to GitHub Pages.

## Build

```bash
npm install
npm run build
```

The generated `dist/` folder is the deployment artifact.

## GitHub Pages

The repository already includes a GitHub Actions workflow at:

- `.github/workflows/deploy.yml`

It performs the standard steps:

1. Check out the repo
2. Install dependencies
3. Build the app
4. Upload the `dist/` artifact
5. Deploy to GitHub Pages

## Important note

Vite is configured for a repo-based GitHub Pages path. If the project is moved to a different GitHub Pages setup, review the `base` setting in `vite.config.js`.
