# Customization

This project is intentionally simple: resume content lives in JSON, while presentation is handled by theme components.

## Edit the resume content

Update:

- `src/resume/data/resume.json`
- `src/resume/data/site.config.json`

The public resume reads these files and renders the selected theme without needing a backend.

## Recommended flow

1. Update your profile, experience, projects, and education data.
2. Adjust the site title and description in `site.config.json`.
3. Switch the theme value between `default` and `modern`.
4. Run `npm run build` and deploy the `dist/` output to GitHub Pages.

## Keep V1 simple

This is a static, open-source resume platform. The dashboard is a local preview tool only; it does not modify the repository files directly.
