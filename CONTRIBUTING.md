# Contributing

Thanks for helping improve this project. We welcome bug reports, feature ideas, accessibility feedback, and pull requests.

## Project goals

This project is a static, GitHub Pages-friendly portfolio and resume site built with React, Vite, and JSON-driven content. The project aims to be:

- easy to customize for personal use
- lightweight and static-hosted
- accessible and responsive to common modern browsers
- simple to maintain without a backend or database

## How to contribute

### 1) Start with an issue

Before making a large change, please open an issue so we can confirm the direction and avoid duplicate work.

Use:

- a bug report for reproducible defects
- a feature request for new functionality or UX improvements
- an accessibility report for barriers or usability issues

### 2) Keep changes focused

Please keep pull requests small and scoped to a single improvement or fix. This makes review easier and reduces regression risk.

### 3) Match the project structure

Most content lives under:

- `src/resume/data/resume.json` for personal data
- `src/resume/data/site.config.json` for site-level settings
- `src/themes/` for theme-specific presentation
- `src/components/` for reusable UI blocks
- `src/dashboard/` for the local editor experience

When editing shared UI, prefer small, reusable changes over broad rewrites.

## Local development

```bash
git clone https://github.com/teodortoni/resume.git
cd resume
npm install
npm run dev
```

Useful local URLs:

- `http://localhost:5173/` for the resume site
- `http://localhost:5173/dashboard` for the local dashboard editor

## Coding expectations

- keep the app static and GitHub Pages friendly
- avoid introducing a backend or server dependency for core functionality
- prefer simple, readable React components
- preserve the current JSON-driven approach unless the change specifically requires a schema update
- test the build with `npm run build` before submitting a pull request

## Accessibility expectations

Contributions should support keyboard navigation, semantic HTML, visible focus states, readable contrast, and clear labeling.

If you are changing UI, please consider:

- heading hierarchy and landmarks
- visible focus styling
- alternative text or accessible naming
- reduced motion and animation tolerance
- screen reader clarity for form and list controls

## Supported environments

This project targets modern evergreen browsers, including:

- the latest Chrome, Edge, Firefox, and Safari versions
- desktop and mobile browsers on common modern operating systems
- static hosting on GitHub Pages and similar static hosts

We do not guarantee support for legacy browsers, outdated mobile browsers, or unsupported assistive technology combinations.

## Reporting barriers

If you run into an accessibility issue or other barrier while using the site or dashboard, please open an issue using the relevant template and include:

- browser and version
- operating system and device
- assistive technology used, if any
- steps to reproduce
- expected behavior and actual result
- impact on your ability to use the project

## Pull request checklist

Before opening a pull request, please confirm:

- the change is documented where needed
- the app still builds (`npm run build`)
- the PR description explains the problem and solution
- screenshots or examples are included when the UI changes materially

## Code of conduct

This project follows the Contributor Covenant. Please read [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) before participating.

## Security

If you believe you have found a security vulnerability, do not open a public issue. Please review [SECURITY.md](./SECURITY.md) for the appropriate reporting process.
