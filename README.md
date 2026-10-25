# Resume

A reusable, configuration-driven resume platform built with React, Vite, and GitHub Pages.

<p align="center">
  <a href="https://teodortoni.github.io/resume/">Live demo</a>
  ·
  <a href="https://github.com/teodortoni/resume">GitHub</a>
</p>

## Overview

This project is a static resume and portfolio template designed for developers who want a polished personal site without a backend. Content is stored in JSON, the layout is theme-based, and the site can be deployed directly to GitHub Pages.

## Features

- JSON-driven resume content
- Dashboard for editing profile, experience, skills, and projects
- `default` and `modern` theme variants
- Responsive resume layout
- Static deployment to GitHub Pages
- Print-friendly styling
- No database or backend required

## Quick start

```bash
git clone https://github.com/teodortoni/resume.git
cd resume
npm install
npm run dev
```

Open:

- `http://localhost:5173/`
- `http://localhost:5173/dashboard`

## How it works

### Resume content

The main content lives in:

- `src/resume/data/resume.json`

This file contains the profile, experience, projects, skills, languages, and optional certifications.

### Site configuration

Site-level configuration lives in:

- `src/resume/data/site.config.json`

This controls:

- `siteTitle`
- `theme`
- section visibility (`showProfile`, `showExperience`, etc.)
- optional resume asset path

### Theme system

Themes are registered in:

- `src/themes/registry.js`

Available themes:

- `default`
- `modern`

### Dashboard

The dashboard is the editing surface for local updates. It reads and writes the JSON files so changes can be made without a backend. This makes the app easy to maintain as a lightweight static portfolio.

## Customize your resume

Update the project files below to fit your own profile:

```text
src/resume/data/resume.json
src/resume/data/site.config.json
```

Typical edits include:

- your name, title, location, email, and social links
- work experience and project details
- skills groups and certifications
- visibility of each section of the resume
- theme selection

## Deployment

This project is configured for GitHub Pages.

```text
clone → update content → run locally → commit → push to main → GitHub Actions builds → Pages deploys
```

Workflow file:

- `.github/workflows/deploy.yml`

The project is published under:

- https://teodortoni.github.io/resume/

GitHub Pages configuration in the app is set with:

- `package.json` → `"homepage": "https://teodortoni.github.io/resume/"`
- `vite.config.js` → `base: "/resume/"`

## Project structure

```text
resume/
├── .github/workflows/deploy.yml
├── src/
│   ├── App.jsx
│   ├── components/
│   ├── dashboard/
│   ├── resume/
│   │   ├── data/
│   │   └── types/
│   ├── styles/
│   └── themes/
├── package.json
├── vite.config.js
├── README.md
└── dist/
```

## Roadmap

Current V1 scope:

- JSON-driven resume content
- theme switching
- local dashboard editing
- responsive static portfolio
- GitHub Pages deployment

## Contributing

Contributions are welcome. Keep changes focused and aligned with the project’s static, configuration-driven structure.

## License

This project is licensed under the [MIT License](./LICENSE).
