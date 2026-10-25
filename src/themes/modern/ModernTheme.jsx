import Header from "../../components/Header";
import HeroSection from "../../components/HeroSection";
import ExperienceSection from "../../components/ExperienceSection";
import SkillsSection from "../../components/SkillsSection";
import ProjectsSection from "../../components/ProjectsSection";
import ContactSection from "../../components/ContactSection";
import "./theme.css";

function ModernTheme({ resume, config, activeExperienceId, onSelectExperience, isDarkMode, onToggleTheme }) {
  const activeExperience =
    resume.experience.find((item) => item.id === activeExperienceId) ?? resume.experience[0];

  const fallbackHighlights = [
    { value: `${resume.profile?.yearsOfExperience ?? 10}+`, label: "Years building" },
    { value: "Product", label: "Focus" },
    { value: "TypeScript", label: "Core stack" },
    { value: "Full-cycle", label: "Delivery" }
  ];
  const profileHighlights = (resume.profile?.highlights?.length ? resume.profile.highlights : fallbackHighlights)
    .filter((item) => item?.value || item?.label);

  return (
    <div className="app-shell theme-modern" data-variant={isDarkMode ? "dark" : "light"}>
      <Header config={config} profile={resume.profile} isDarkMode={isDarkMode} onToggleTheme={onToggleTheme} />
      <main id="main-content" className="modern-main">
        {config.showProfile !== false && <HeroSection config={config} profile={resume.profile} />}

        {config.showHighlights !== false && profileHighlights.length > 0 && (
          <section id="highlights" className="modern-proof-strip section" aria-label="Profile highlights">
            <div className="container">
              <div className="modern-proof-grid">
                {profileHighlights.map(({ value, label }, index) => (
                  <div key={`${label}-${index}`} className="modern-proof-card">
                    <div className="modern-proof-value">{value}</div>
                    <div className="modern-proof-label">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {config.showExperience && (
          <ExperienceSection
            items={resume.experience}
            activeExperience={activeExperience}
            onSelectExperience={onSelectExperience}
          />
        )}

        {config.showProjects && (
          <div className="modern-featured-projects">
            <ProjectsSection items={resume.projects} />
          </div>
        )}

        {config.showSkills && (
          <div className="modern-skills-shell">
            <SkillsSection skills={resume.skills} />
          </div>
        )}

        {config.showCertifications && resume.certifications?.length > 0 && (
          <section id="certifications" className="section" aria-labelledby="modern-certifications-heading">
            <div className="container">
              <div className="section-heading-block section-heading-block--compact">
                <span className="section-heading-label">Credentials</span>
                <h2 id="modern-certifications-heading" className="section-heading">Certifications</h2>
              </div>
              <div className="skills-grid">
                {resume.certifications.map((certification) => (
                  <div key={`${certification.name}-${certification.issuer}`} className="skill-group-card">
                    <h3>{certification.name}</h3>
                    <p>{certification.issuer}</p>
                    <span>{certification.year}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="modern-contact-panel">
          <ContactSection config={config} profile={resume.profile} />
        </div>
      </main>
    </div>
  );
}

export default ModernTheme;
