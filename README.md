# Open Source Resume Platform

> Build a professional developer resume and portfolio with React and TypeScript — then deploy it for free to GitHub Pages.

A clean, open-source, configuration-driven developer resume website and portfolio template designed for a modern developer profile. The project keeps content separate from presentation so you can edit a JSON resume, switch themes, build the static app, and ship it to GitHub Pages without a backend or database.

## Features

- React + TypeScript-ready architecture
- JSON-driven resume content
- Multiple free themes
- Local dashboard preview
- Responsive design
- SEO-ready metadata
- Accessible UI patterns
- Print/PDF support
- GitHub Pages deployment
- No backend required
- No database required

## Quick start

```bash
git clone https://github.com/teodortoni/resume.git
cd resume
npm install
npm run dev
```

## Customize your resume

Edit the source content in:

- `src/resume/data/resume.json`
- `src/resume/data/site.config.json`

The public resume loads this data and renders the selected theme automatically.

## Themes

Themes live in:

- `src/themes/`

The default registry supports:

- `default`
- `modern`

To select a theme, change the `theme` value in `src/resume/data/site.config.json`.

## Build

```bash
npm run build
```

## Deploy to GitHub Pages

This project includes a GitHub Actions workflow in:

- `.github/workflows/deploy.yml`

It builds the application and deploys the generated `dist/` directory to GitHub Pages.

## Architecture

```text
Resume JSON
     ↓
TypeScript Models
     ↓
Theme Registry
     ↓
React
     ↓
Vite
     ↓
Static dist/
     ↓
GitHub Pages
```

## Roadmap

### V1

- JSON-driven content
- Theme system
- Local dashboard
- Responsive static portfolio
- GitHub Pages deployment

### V2

- Premium themes
- Advanced editing workflows
- Optional hosted version

## Contributing

Contributions are welcome. Fork the repository, create a theme, improve the component structure, or open a pull request with a small, well-scoped improvement.

## License

This project is available under the existing repository license. If you are forking it for a new project, choose a permissive open-source license that fits your goals.

## Why this project matters

This is an open source resume builder, developer resume website, developer portfolio template, and GitHub Pages portfolio solution built for the static web. It is a customizable resume that works as a React resume, TypeScript resume, and a GitHub portfolio without a database or custom backend.
Teodor Toni's resume
