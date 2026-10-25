import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createHtmlPlugin } from "vite-plugin-html";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.resolve(__dirname, "src/resume/data/site.config.json");
const resumePath = path.resolve(__dirname, "src/resume/data/resume.json");

const readJsonFile = async (filePath) => {
  const content = await readFile(filePath, "utf-8");
  return JSON.parse(content);
};

const writeJsonFile = async (filePath, payload) => {
  await writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
};

const stripTrailingSlash = (value) => value.replace(/\/+$/, "");
const ensureTrailingSlash = (value) => `${stripTrailingSlash(value)}/`;
const toArray = (value) => (Array.isArray(value) ? value : []);
const uniq = (items) => [...new Set(items.filter(Boolean))];
const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const sectionList = (items, formatter) => {
  if (!items.length) {
    return "";
  }

  return `<ul>${items.map((item) => `<li>${formatter(item)}</li>`).join("")}</ul>`;
};

const buildPersonJsonLd = (siteConfig, resumeData, siteUrl) => {
  const profile = resumeData.profile ?? {};
  const socialLinks = profile.socialLinks ?? {};
  const sameAs = uniq([socialLinks.github, socialLinks.linkedin, socialLinks.website]);
  const allSkillKeywords = uniq(
    toArray(resumeData.skills).flatMap((group) => toArray(group.items))
  );

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    description: profile.headline,
    email: profile.email,
    address: profile.location ? { "@type": "PostalAddress", addressLocality: profile.location } : undefined,
    knowsAbout: allSkillKeywords,
    knowsLanguage: toArray(profile.languages).map((language) => language.name),
    sameAs,
    url: siteUrl,
    alumniOf: profile.education?.school
      ? {
          "@type": "EducationalOrganization",
          name: profile.education.school
        }
      : undefined,
    worksFor: toArray(resumeData.experience)[0]?.company
      ? {
          "@type": "Organization",
          name: toArray(resumeData.experience)[0].company
        }
      : undefined,
    image: siteConfig.profileImage
  };
};

const buildNoscriptResume = (siteConfig, resumeData) => {
  const profile = resumeData.profile ?? {};
  const socialLinks = profile.socialLinks ?? {};
  const experiences = toArray(resumeData.experience);
  const projects = toArray(resumeData.projects);
  const skills = toArray(resumeData.skills);
  const certifications = toArray(resumeData.certifications);
  const languages = toArray(profile.languages);
  const highlights = toArray(profile.highlights);
  const visible = {
    profile: siteConfig.showProfile !== false,
    highlights: siteConfig.showHighlights !== false,
    experience: siteConfig.showExperience !== false,
    projects: siteConfig.showProjects !== false,
    skills: siteConfig.showSkills !== false,
    certifications: siteConfig.showCertifications === true
  };

  const socialItems = uniq([
    socialLinks.github ? `<a href="${escapeHtml(socialLinks.github)}">${escapeHtml(socialLinks.github)}</a>` : "",
    socialLinks.linkedin ? `<a href="${escapeHtml(socialLinks.linkedin)}">${escapeHtml(socialLinks.linkedin)}</a>` : "",
    socialLinks.website ? `<a href="${escapeHtml(socialLinks.website)}">${escapeHtml(socialLinks.website)}</a>` : ""
  ]);

  const profileSection = visible.profile
    ? `
        <section aria-labelledby="noscript-profile">
          <h2 id="noscript-profile">Profile</h2>
          <p><strong>${escapeHtml(profile.name)}</strong> — ${escapeHtml(profile.title)}</p>
          <p>${escapeHtml(profile.headline)}</p>
          ${profile.location ? `<p>Location: ${escapeHtml(profile.location)}</p>` : ""}
          ${profile.email ? `<p>Email: <a href="mailto:${escapeHtml(profile.email)}">${escapeHtml(profile.email)}</a></p>` : ""}
          ${socialItems.length ? `<p>${socialItems.join(" · ")}</p>` : ""}
        </section>
      `
    : "";

  const experienceSection = visible.experience
    ? `
        <section aria-labelledby="noscript-experience">
          <h2 id="noscript-experience">Experience</h2>
          ${experiences
            .map((item) => {
              const projectsHtml = toArray(item.projects)
                .map((project) => {
                  const stackHtml = sectionList(toArray(project.stack), (stackItem) => escapeHtml(stackItem));
                  const highlightsHtml = sectionList(toArray(project.highlights), (highlight) => escapeHtml(highlight));

                  return `
                    <article>
                      <h4>${escapeHtml(project.projectName)}</h4>
                      <p>${escapeHtml(project.projectDescription)}</p>
                      ${highlightsHtml ? `<h5>Highlights</h5>${highlightsHtml}` : ""}
                      ${stackHtml ? `<h5>Tech Stack</h5>${stackHtml}` : ""}
                    </article>
                  `;
                })
                .join("");

              return `
                <article>
                  <h3>${escapeHtml(item.company)} — ${escapeHtml(item.title)}</h3>
                  <p>${escapeHtml(item.dates)}</p>
                  ${projectsHtml}
                </article>
              `;
            })
            .join("")}
        </section>
      `
    : "";

  const highlightsSection = visible.highlights && highlights.length
    ? `
        <section aria-labelledby="noscript-highlights">
          <h2 id="noscript-highlights">Highlights</h2>
          ${sectionList(highlights, (item) =>
            [item.value, item.label]
              .filter(Boolean)
              .map((part) => escapeHtml(part))
              .join(" — ")
          )}
        </section>
      `
    : "";

  const projectsSection = visible.projects
    ? `
        <section aria-labelledby="noscript-projects">
          <h2 id="noscript-projects">Projects</h2>
          ${projects
            .map(
              (project) => `
                <article>
                  <h3>${escapeHtml(project.title)}</h3>
                  <p>${escapeHtml(project.summary)}</p>
                  ${
                    toArray(project.tools).length
                      ? `<p>Tools: ${toArray(project.tools).map((tool) => escapeHtml(tool)).join(", ")}</p>`
                      : ""
                  }
                </article>
              `
            )
            .join("")}
        </section>
      `
    : "";

  const skillsSection = visible.skills
    ? `
        <section aria-labelledby="noscript-skills">
          <h2 id="noscript-skills">Skills</h2>
          ${skills
            .map(
              (group) => `
                <article>
                  <h3>${escapeHtml(group.title)}</h3>
                  ${sectionList(toArray(group.items), (item) => escapeHtml(item))}
                </article>
              `
            )
            .join("")}
        </section>
      `
    : "";

  const certificationsSection = visible.certifications && certifications.length
    ? `
        <section aria-labelledby="noscript-certifications">
          <h2 id="noscript-certifications">Certifications</h2>
          ${sectionList(certifications, (item) =>
            [item.name, item.issuer, item.year].filter(Boolean).map((part) => escapeHtml(part)).join(" — ")
          )}
        </section>
      `
    : "";

  const educationSection = profile.education
    ? `
        <section aria-labelledby="noscript-education">
          <h2 id="noscript-education">Education</h2>
          <p>
            ${escapeHtml(profile.education.degree ?? "")}
            ${profile.education.major ? `, ${escapeHtml(profile.education.major)}` : ""}
            ${profile.education.school ? ` — ${escapeHtml(profile.education.school)}` : ""}
          </p>
        </section>
      `
    : "";

  const languagesSection = languages.length
    ? `
        <section aria-labelledby="noscript-languages">
          <h2 id="noscript-languages">Languages</h2>
          ${sectionList(languages, (language) =>
            [language.name, language.nativeName, language.proficiency]
              .filter(Boolean)
              .map((part) => escapeHtml(part))
              .join(" — ")
          )}
        </section>
      `
    : "";

  return `
    <main>
      <h1>${escapeHtml(profile.name || siteConfig.siteTitle || "Resume")}</h1>
      ${profileSection}
      ${highlightsSection}
      ${experienceSection}
      ${projectsSection}
      ${skillsSection}
      ${certificationsSection}
      ${educationSection}
      ${languagesSection}
    </main>
  `;
};

const buildSeoPayload = (siteConfig, resumeData, basePath) => {
  const profile = resumeData.profile ?? {};
  const rawSiteUrl = siteConfig.siteUrl || `https://teodortoni.github.io${basePath}`;
  const siteUrl = ensureTrailingSlash(rawSiteUrl);
  const title = profile.name && profile.title
    ? `${profile.name} — ${profile.title}`
    : siteConfig.siteTitle || "Resume";
  const description = siteConfig.seoDescription || profile.headline || `${title} resume`;
  const keywords = uniq(
    toArray(resumeData.skills).flatMap((group) => toArray(group.items))
  ).join(", ");
  const personJsonLd = JSON.stringify(buildPersonJsonLd(siteConfig, resumeData, siteUrl));
  const noscriptResumeHtml = buildNoscriptResume(siteConfig, resumeData);

  return {
    SEO_TITLE: title,
    SEO_SITE_TITLE: siteConfig.siteTitle || title,
    SEO_DESCRIPTION: description,
    SEO_KEYWORDS: keywords,
    SEO_URL: siteUrl,
    PERSON_JSON_LD: personJsonLd,
    NOSCRIPT_RESUME_HTML: noscriptResumeHtml
  };
};

const configApiPlugin = {
  name: "config-api",
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const requestPath = req.url?.split("?")[0] ?? "/";
      const normalizedPath = requestPath.startsWith("/resume") ? requestPath.replace("/resume", "") : requestPath;

      if (normalizedPath !== "/api/config" && normalizedPath !== "/api/resume") {
        next();
        return;
      }

      const targetPath = normalizedPath === "/api/config" ? configPath : resumePath;
      const resourceName = normalizedPath === "/api/config" ? "site config" : "resume data";

      if (req.method === "GET") {
        try {
          const payload = await readJsonFile(targetPath);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(payload));
        } catch (error) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: `Unable to read ${resourceName}.` }));
        }
        return;
      }

      if (req.method === "PUT") {
        let body = "";

        req.on("data", (chunk) => {
          body += chunk;
        });

        req.on("end", async () => {
          try {
            const parsed = JSON.parse(body || "{}");
            await writeJsonFile(targetPath, parsed);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(parsed));
          } catch (error) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: `Invalid ${resourceName} payload.` }));
          }
        });
        return;
      }

      res.statusCode = 405;
      res.end(JSON.stringify({ error: "Method not allowed." }));
    });
  }
};

const base = "/resume/";
const initialSiteConfig = JSON.parse(await readFile(configPath, "utf-8"));
const initialResume = JSON.parse(await readFile(resumePath, "utf-8"));
const seoPayload = buildSeoPayload(initialSiteConfig, initialResume, base);

export default defineConfig({
  plugins: [
    react(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: seoPayload
      }
    }),
    configApiPlugin
  ],
  base
});
