
import {
  BadgeCheck,
  BriefcaseBusiness,
  Download,
  GitBranch,
  GraduationCap,
  MapPin,
  ShieldCheck
} from "lucide-react";

function HeroSection({ config, profile }) {
  const profileName = profile?.name || config.siteTitle || "Developer";
  const title = profile?.title || "Senior Full-Stack Software Engineer";
  const headline = profile?.headline || "Building reliable backend systems, APIs, and production web applications.";
  const stack = profile?.stack || "TypeScript · React · Node.js · AWS · AI-Assisted Development";
  const yearsOfExperience = profile?.yearsOfExperience ?? 10;
  const supporting = profile?.supporting ||
    `${title} with ${yearsOfExperience} years of experience building and scaling production software, with a strong focus on backend engineering, APIs, AWS, and end-to-end product delivery.`;
  const education = profile?.education;
  const location = profile?.location;
  const jobPreference = profile?.jobPreference;
  const authorization = (() => {
    const value = profile?.authorization;
    if (!value) return "";

    if (typeof value === "string") {
      return value;
    }

    const parts = [];
    if (value.authorizedToWorkInUS?.enabled && value.authorizedToWorkInUS?.text) {
      parts.push(value.authorizedToWorkInUS.text);
    }
    if (value.noSponsorshipRequired?.enabled && value.noSponsorshipRequired?.text) {
      parts.push(value.noSponsorshipRequired.text);
    }

    return parts.join(" · ");
  })();
  const languages = (profile?.languages ?? []).filter((language) => language?.name).map((language) => language.name).join(", ");

  const metaItems = [
    education && { icon: <GraduationCap size={16} aria-hidden="true" />, text: `${education.major} · ${education.school} (${education.degree})` },
    jobPreference && { icon: <MapPin size={16} aria-hidden="true" />, text: jobPreference },
    location && { icon: <MapPin size={16} aria-hidden="true" />, text: location },
    authorization && { icon: <ShieldCheck size={16} aria-hidden="true" />, text: authorization },
    languages && { icon: <BadgeCheck size={16} aria-hidden="true" />, text: `Languages: ${languages}` }
  ].filter(Boolean);

  return (
    <section id="home" className="hero section">
      <div className="container hero-shell">
        <div className="hero-copy">
          <h1 className="hero-heading">{profileName}</h1>
          <p className="kicker">{title}</p>
          <p className="stack">{stack}</p>
          <p className="headline">{headline}</p>
          <p className="supporting">{supporting}</p>

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
            <a className="light-action" href={profile?.socialLinks?.github || "#"} target="_blank" rel="noopener">
              <GitBranch size={18} aria-hidden="true" />
              <span>GitHub</span>
            </a>
            <a className="light-action" href={profile?.socialLinks?.linkedin || "#"} target="_blank" rel="noopener">
              <BriefcaseBusiness size={18} aria-hidden="true" />
              <span>LinkedIn</span>
            </a>
            <a className="light-action" href={config.resumePath || "#"} target="_blank" rel="noopener">
              <Download size={18} aria-hidden="true" />
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
