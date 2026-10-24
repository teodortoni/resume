import { useEffect, useMemo, useState } from "react";
import themeRegistry from "./themes/registry";
import Dashboard from "./dashboard/Dashboard";
import resumeData from "./resume/data/resume.json";
import siteConfigSeed from "./resume/data/site.config.json";
import "./styles/print.css";

async function loadConfig() {
  try {
    const response = await fetch("./api/config");
    if (!response.ok) {
      return siteConfigSeed;
    }

    return await response.json();
  } catch {
    return siteConfigSeed;
  }
}

async function loadResume() {
  try {
    const response = await fetch("./api/resume");
    if (!response.ok) {
      return resumeData;
    }

    return await response.json();
  } catch {
    return resumeData;
  }
}

function App() {
  const [siteConfig, setSiteConfig] = useState(siteConfigSeed);
  const [resumeContent, setResumeContent] = useState(resumeData);
  const [activeExperienceId, setActiveExperienceId] = useState(resumeData.experience[0]?.id ?? "");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    let active = true;

    Promise.all([loadConfig(), loadResume()]).then(([config, resume]) => {
      if (active) {
        setSiteConfig(config);
        setResumeContent(resume);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  const activeExperience = useMemo(
    () => resumeContent.experience.find((item) => item.id === activeExperienceId) ?? resumeContent.experience[0],
    [activeExperienceId, resumeContent.experience]
  );

  const hasDashboardRoute =
    typeof window !== "undefined" &&
    (window.location.pathname.includes("/dashboard") || window.location.hash.includes("/dashboard"));

  const ThemeComponent = themeRegistry[siteConfig.theme] ?? themeRegistry.default;

  if (hasDashboardRoute) {
    return <Dashboard initialConfig={siteConfig} onSave={setSiteConfig} resume={resumeContent} onSaveResume={setResumeContent} />;
  }

  return (
    <ThemeComponent
      resume={resumeContent}
      config={siteConfig}
      activeExperienceId={activeExperience?.id ?? activeExperienceId}
      onSelectExperience={setActiveExperienceId}
      isDarkMode={isDarkMode}
      onToggleTheme={() => setIsDarkMode((value) => !value)}
    />
  );
}

export default App;
