import Header from "../../components/Header";
import HeroSection from "../../components/HeroSection";
import ExperienceSection from "../../components/ExperienceSection";
import SkillsSection from "../../components/SkillsSection";
import ProjectsSection from "../../components/ProjectsSection";
import ContactSection from "../../components/ContactSection";
import "./theme.css";

function DefaultTheme({ resume, config, activeExperienceId, onSelectExperience }) {
  const activeExperience =
    resume.experience.find((item) => item.id === activeExperienceId) ?? resume.experience[0];

  return (
    <div className="app-shell theme-default">
      <Header config={config} />
      <main id="main-content">
        <HeroSection config={config} profile={resume.profile} />
        {config.showExperience && (
          <ExperienceSection
            items={resume.experience}
            activeExperience={activeExperience}
            onSelectExperience={onSelectExperience}
          />
        )}
        {config.showSkills && <SkillsSection skills={resume.skills} />}
        {config.showProjects && <ProjectsSection items={resume.projects} />}
        <ContactSection config={config} />
      </main>
    </div>
  );
}

export default DefaultTheme;
