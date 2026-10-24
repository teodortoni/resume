import Header from "../../components/Header";
import HeroSection from "../../components/HeroSection";
import ExperienceSection from "../../components/ExperienceSection";
import SkillsSection from "../../components/SkillsSection";
import ProjectsSection from "../../components/ProjectsSection";
import ContactSection from "../../components/ContactSection";
import "./theme.css";

function DefaultTheme({ resume, config, activeExperienceId, onSelectExperience, isDarkMode, onToggleTheme }) {
  const activeExperience =
    resume.experience.find((item) => item.id === activeExperienceId) ?? resume.experience[0];

  return (
    <div className="app-shell theme-default" data-variant={isDarkMode ? "dark" : "light"}>
      <Header config={config} profile={resume.profile} isDarkMode={isDarkMode} onToggleTheme={onToggleTheme} />
      <main id="main-content">
        {config.showProfile !== false && <HeroSection config={config} profile={resume.profile} />}
        {config.showExperience && (
          <ExperienceSection
            items={resume.experience}
            activeExperience={activeExperience}
            onSelectExperience={onSelectExperience}
          />
        )}
        {config.showSkills && <SkillsSection skills={resume.skills} />}
        {config.showProjects && <ProjectsSection items={resume.projects} />}
        {config.showCertifications && resume.certifications?.length > 0 && (
          <section className="section" aria-labelledby="certifications-heading">
            <div className="container">
              <div className="section-heading-block section-heading-block--compact">
                <span className="section-heading-label">Credentials</span>
                <h2 id="certifications-heading" className="section-heading">Certifications</h2>
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
        <ContactSection config={config} profile={resume.profile} />
      </main>
    </div>
  );
}

export default DefaultTheme;
