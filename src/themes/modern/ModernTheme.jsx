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

  const proofStats = [
    { value: `${resume.profile?.yearsOfExperience ?? 10}+`, label: "Years building" },
    { value: "Product", label: "Focus" },
    { value: "TypeScript", label: "Core stack" },
    { value: "Full-cycle", label: "Delivery" }
  ];

  return (
    <div className="app-shell theme-modern" data-variant={isDarkMode ? "dark" : "light"}>
      <Header config={config} isDarkMode={isDarkMode} onToggleTheme={onToggleTheme} />
      <main id="main-content" className="modern-main">
        <HeroSection config={config} profile={resume.profile} />

        <section className="modern-proof-strip section" aria-label="Profile highlights">
          <div className="container">
            <div className="modern-proof-grid">
              {proofStats.map(({ value, label }) => (
                <div key={label} className="modern-proof-card">
                  <div className="modern-proof-value">{value}</div>
                  <div className="modern-proof-label">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

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

        <div className="modern-contact-panel">
          <ContactSection config={config} />
        </div>
      </main>
    </div>
  );
}

export default ModernTheme;
