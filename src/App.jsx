import { useEffect, useMemo, useState } from "react";
import themeRegistry from "./themes/registry";
import Dashboard from "./dashboard/Dashboard";
import resumeData from "./resume/data/resume.json";
import siteConfigSeed from "./resume/data/site.config.json";
import "./App.css";
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

function App() {
  const [siteConfig, setSiteConfig] = useState(siteConfigSeed);
  const [activeExperienceId, setActiveExperienceId] = useState(resumeData.experience[0]?.id ?? "");

  useEffect(() => {
    let active = true;

    loadConfig().then((config) => {
      if (active) {
        setSiteConfig(config);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const activeExperience = useMemo(
    () => resumeData.experience.find((item) => item.id === activeExperienceId) ?? resumeData.experience[0],
    [activeExperienceId]
  );

  const hasDashboardRoute =
    typeof window !== "undefined" &&
    (window.location.pathname.includes("/dashboard") || window.location.hash.includes("/dashboard"));

  const ThemeComponent = themeRegistry[siteConfig.theme] ?? themeRegistry.default;

  if (hasDashboardRoute) {
    return <Dashboard initialConfig={siteConfig} onSave={setSiteConfig} resume={resumeData} />;
  }

  return (
    <ThemeComponent
      resume={resumeData}
      config={siteConfig}
      activeExperienceId={activeExperience?.id ?? activeExperienceId}
      onSelectExperience={setActiveExperienceId}
    />
  );
}

export default App;
