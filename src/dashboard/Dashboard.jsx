import { useEffect, useMemo, useState } from "react";
import siteConfigSeed from "../resume/data/site.config.json";
import "./Dashboard.css";

async function saveConfig(config) {
  const response = await fetch("./api/config", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(config)
  });

  if (!response.ok) {
    throw new Error("Unable to save configuration.");
  }

  return response.json();
}

function Dashboard({ initialConfig, onSave, resume }) {
  const [draft, setDraft] = useState(initialConfig);
  const [savedAt, setSavedAt] = useState("Not saved yet");

  useEffect(() => {
    setDraft(initialConfig);
  }, [initialConfig]);

  const profileSummary = useMemo(
    () => `${resume.profile.name} · ${resume.profile.title}`,
    [resume]
  );

  const handleFieldChange = (event) => {
    const { name, value, type, checked } = event.target;
    setDraft((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSave = async () => {
    const nextConfig = {
      ...siteConfigSeed,
      ...initialConfig,
      ...draft,
    };

    try {
      const savedConfig = await saveConfig(nextConfig);
      onSave(savedConfig);
      setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    } catch (error) {
      setSavedAt(error.message || "Save failed");
    }
  };

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <p className="dashboard-label">Resume Studio</p>
        <h1>Local configuration</h1>
        <p>{profileSummary}</p>
        <button type="button" className="dashboard-back" onClick={() => window.location.hash = ""}>
          Back to resume
        </button>
      </aside>

      <main className="dashboard-panel">
        <div className="dashboard-topbar">
          <div>
            <h2>Site settings</h2>
            <p>V1 editor foundation for local preview and customization.</p>
          </div>
          <button type="button" className="dashboard-save" onClick={handleSave}>Save preview</button>
        </div>

        <div className="dashboard-grid">
          <label>
            Site title
            <input name="siteTitle" value={draft.siteTitle} onChange={handleFieldChange} />
          </label>

          <label>
            Description
            <input name="description" value={draft.description} onChange={handleFieldChange} />
          </label>

          <label>
            Theme
            <select name="theme" value={draft.theme || "default"} onChange={handleFieldChange}>
              <option value="default">Default</option>
            </select>
          </label>

          <label>
            Email
            <input name="email" value={draft.email} onChange={handleFieldChange} />
          </label>

          <label>
            GitHub
            <input name="github" value={draft.github} onChange={handleFieldChange} />
          </label>

          <label>
            LinkedIn
            <input name="linkedin" value={draft.linkedin} onChange={handleFieldChange} />
          </label>

          <label className="checkbox-row">
            <input type="checkbox" name="showExperience" checked={draft.showExperience} onChange={handleFieldChange} />
            Show experience
          </label>

          <label className="checkbox-row">
            <input type="checkbox" name="showProjects" checked={draft.showProjects} onChange={handleFieldChange} />
            Show projects
          </label>

          <label className="checkbox-row">
            <input type="checkbox" name="showSkills" checked={draft.showSkills} onChange={handleFieldChange} />
            Show skills
          </label>
        </div>

        <p className="dashboard-status">Last saved: {savedAt}</p>
      </main>
    </div>
  );
}

export default Dashboard;
