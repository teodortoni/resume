
function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.94 8.5A1.56 1.56 0 1 1 6.94 5.4a1.56 1.56 0 0 1 0 3.1ZM5.5 9.5h2.9v8.8H5.5V9.5Zm5.2 0h2.8v1.2h.04c.39-.74 1.35-1.52 2.78-1.52 2.97 0 3.52 1.95 3.52 4.48V18.3h-2.9v-16.7h2.9v2.08h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6V18.3h-2.9v-16.7h-2.9v1.8h-.04c-.4-.76-1.4-1.56-2.9-1.56-2.87 0-3.38 1.98-3.38 4.39V18.3H10.7V9.5Z" fill="currentColor"/>
    </svg>
  );
}

function IconGitHub() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 .75A11.25 11.25 0 0 0 8.58 22.4c.56.1.76-.24.76-.54v-1.93c-3.1.67-3.75-1.33-3.75-1.33-.5-1.3-1.24-1.65-1.24-1.65-.99-.68.07-.67.07-.67 1.1.08 1.68 1.14 1.68 1.14.97 1.66 2.55 1.18 3.17.9.1-.7.38-1.18.69-1.45-2.47-.28-5.08-1.24-5.08-5.5 0-1.21.42-2.2 1.12-2.97-.11-.28-.49-1.41.11-2.94 0 0 .92-.29 3.02 1.12a10.52 10.52 0 0 1 5.49 0c2.1-1.41 3.02-1.12 3.02-1.12.6 1.53.22 2.66.11 2.94.7.77 1.12 1.76 1.12 2.97 0 4.27-2.62 5.22-5.11 5.5.39.34.74 1.02.74 2.06v3.06c0 .3.2.65.77.54A11.25 11.25 0 0 0 12 .75Z" fill="currentColor"/>
    </svg>
  );
}

function IconDownload() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.75a.75.75 0 0 1 .75.75v8.77l2.72-2.72a.75.75 0 1 1 1.06 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 0 1 1.06-1.06l2.72 2.72V3.5a.75.75 0 0 1 .75-.75Zm-7 14.5a.75.75 0 0 1 .75.75v1.25h14.5v-1.25a.75.75 0 0 1 1.5 0v2a.75.75 0 0 1-.75.75H5.75A.75.75 0 0 1 5 20.25v-2a.75.75 0 0 1 .75-.75Z" fill="currentColor"/>
    </svg>
  );
}

function IconLocation() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Zm0-8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" fill="currentColor"/>
    </svg>
  );
}

function IconEducation() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.5 2.5 8l9.5 4.5L21.5 8 12 3.5Zm-7.5 5.5L12 13.5l7.5-4.5V14l-7.5 3.5L4.5 14v-5Zm0 3.5L12 18l7.5-4.5v2.5L12 21l-7.5-4.5v-2.5Z" fill="currentColor"/>
    </svg>
  );
}

function IconCheckShield() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.5 5.5 5v6.1c0 4.3 2.7 8.2 6.5 10.4 3.8-2.2 6.5-6.1 6.5-10.4V5L12 2.5Zm3.8 7.3-4.4 4.4-2.1-2.1 1.1-1.1 1 1 3.3-3.3 1.1 1.1Z" fill="currentColor"/>
    </svg>
  );
}

function HeroSection({ config, profile }) {
  const profileName = config.siteTitle || profile?.name || config.name || "Developer";
  const title = config.title || profile?.title || "Senior Full-Stack Software Engineer";
  const headline = config.description || profile?.summary || "Building reliable backend systems, APIs, and production web applications.";
  const yearsOfExperience = config.yearsOfExperience || profile?.yearsOfExperience || 10;
  const education = profile?.education;
  const location = profile?.location;
  const jobPreference = profile?.jobPreference;
  const authorization = profile?.authorization;

  const metaItems = [
    education && { icon: <IconEducation />, text: `${education.major} · ${education.school} (${education.degree})` },
    jobPreference && { icon: <IconLocation />, text: jobPreference },
    location && { icon: <IconLocation />, text: location },
    authorization && { icon: <IconCheckShield />, text: authorization }
  ].filter(Boolean);

  return (
    <section id="home" className="hero section">
      <div className="container hero-shell">
        <div className="hero-copy">
          <h1 className="hero-heading">{profileName}</h1>
          <p className="kicker">{title}</p>
          <p className="stack">TypeScript · React · Node.js · AWS · AI-Assisted Development</p>
          <p className="headline">{headline}</p>
          <p className="supporting">
            {title} with {yearsOfExperience} years of experience building and scaling production software, with a strong focus on backend engineering,
            APIs, AWS, and end-to-end product delivery.
          </p>

          {metaItems.length > 0 && (
            <div className="hero-meta-badges" aria-label="Profile summary">
              {metaItems.map((item, index) => (
                <span key={`${item.text}-${index}`} className="meta-badge">
                  <span className="meta-badge-icon" aria-hidden="true">{item.icon}</span>
                  <span>{item.text}</span>
                </span>
              ))}
            </div>
          )}

          <div className="hero-actions">
            <a className="light-action" href={config.github} target="_blank" rel="noopener">
              <IconGitHub />
              <span>GitHub</span>
            </a>
            <a className="light-action" href={config.linkedin} target="_blank" rel="noopener">
              <IconLinkedIn />
              <span>LinkedIn</span>
            </a>
            <a className="light-action" href={config.resumePath} target="_blank" rel="noopener">
              <IconDownload />
              <span>Download Resume</span>
            </a>
          </div>
        </div>

        <div className="hero-art" aria-label="Portrait image">
          <div className="portrait-card">
            <div className="portrait-glow" />
            <img
              className="portrait-image"
              src="/resume/assets/portrait.jpg"
              alt="Portrait"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
