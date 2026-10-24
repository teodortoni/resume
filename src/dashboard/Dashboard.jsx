import { useEffect, useMemo, useRef, useState } from "react";
import {
  Award,
  BriefcaseBusiness,
  Check,
  Copy,
  FolderKanban,
  PencilLine,
  Plus,
  Save,
  Settings2,
  Sparkles,
  Trash2,
  UserRound
} from "lucide-react";
import { MAJOR_WORLD_LANGUAGES, formatLanguageLabel } from "../resume/data/languages";
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

async function saveResume(resume) {
  const response = await fetch("./api/resume", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(resume)
  });

  if (!response.ok) {
    throw new Error("Unable to save resume data.");
  }

  return response.json();
}

const defaultExpandedState = {
  siteSettings: true,
  profile: true,
  experience: true,
  projects: true,
  skills: true,
  certifications: true
};

const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

function LanguageSearchInput({ value, onSelect }) {
  const initialQuery = value?.name ? formatLanguageLabel(value) : "";
  const [query, setQuery] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const suggestions = useMemo(() => {
    const trimmed = query.trim().toLowerCase();

    if (!trimmed) {
      return MAJOR_WORLD_LANGUAGES.slice(0, 12);
    }

    return MAJOR_WORLD_LANGUAGES.filter((language) =>
      language.name.toLowerCase().includes(trimmed) ||
      language.nativeName.toLowerCase().includes(trimmed) ||
      language.code.toLowerCase().includes(trimmed)
    ).slice(0, 12);
  }, [query]);

  useEffect(() => {
    setQuery(value?.name ? formatLanguageLabel(value) : "");
  }, [value]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const handleSelect = (language) => {
    const label = formatLanguageLabel(language);
    setQuery(label);
    onSelect(language);
    setIsOpen(false);
  };

  return (
    <div className="dashboard-language-picker" ref={containerRef}>
      <input
        type="text"
        value={query}
        dir={value?.direction ?? "ltr"}
        placeholder="Search language"
        autoComplete="off"
        onFocus={() => setIsOpen(true)}
        onBlur={() => {
          const resetValue = value?.name ? formatLanguageLabel(value) : "";
          window.setTimeout(() => {
            setQuery(resetValue);
          }, 80);
        }}
        onChange={(event) => {
          const nextValue = event.target.value;
          setQuery(nextValue);
          setIsOpen(true);
        }}
      />

      {isOpen && suggestions.length > 0 && (
        <div className="dashboard-language-menu" role="listbox" aria-label="Language suggestions">
          {suggestions.map((language) => (
            <button
              key={language.code}
              type="button"
              className="dashboard-language-option"
              onMouseDown={(event) => {
                event.preventDefault();
                handleSelect(language);
              }}
            >
              <span>
                {language.name}
                {" — "}
                <span dir={language.direction}>{language.nativeName}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const cloneItem = (item) => {
  if (typeof structuredClone === "function") {
    return structuredClone(item);
  }

  return JSON.parse(JSON.stringify(item));
};

const reorderList = (items, fromIndex, toIndex) => {
  if (!Array.isArray(items) || fromIndex === toIndex) {
    return items;
  }

  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, movedItem);

  return nextItems;
};

function Dashboard({ initialConfig, onSave, resume, onSaveResume }) {
  const [siteDraft, setSiteDraft] = useState(initialConfig);
  const [resumeDraft, setResumeDraft] = useState(resume);
  const [siteSavedAt, setSiteSavedAt] = useState("Not saved yet");
  const [resumeSavedAt, setResumeSavedAt] = useState("Not saved yet");
  const [expanded, setExpanded] = useState(defaultExpandedState);
  const [selectedSection, setSelectedSection] = useState("siteSettings");
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    setSiteDraft(initialConfig);
  }, [initialConfig]);

  useEffect(() => {
    setResumeDraft(resume);
  }, [resume]);

  const profileSummary = useMemo(
    () => `${resumeDraft?.profile?.name || "Your profile"} · ${resumeDraft?.profile?.title || "Professional summary"}`,
    [resumeDraft]
  );

  const isSectionVisible = (sectionKey) => selectedSection === sectionKey;

  const toggleSection = (sectionKey) => {
    setSelectedSection(sectionKey);
    setExpanded((current) => ({
      ...current,
      [sectionKey]: true
    }));
  };

  const updateSiteField = (event) => {
    const { name, value, type, checked } = event.target;
    setSiteDraft((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const updateProfileField = (field, value) => {
    setResumeDraft((current) => ({
      ...current,
      profile: {
        ...(current.profile ?? {}),
        [field]: value
      }
    }));
  };

  const updateEducationField = (field, value) => {
    setResumeDraft((current) => ({
      ...current,
      profile: {
        ...(current.profile ?? {}),
        education: {
          ...(current.profile?.education ?? {}),
          [field]: value
        }
      }
    }));
  };

  const updateSocialField = (field, value) => {
    setResumeDraft((current) => ({
      ...current,
      profile: {
        ...(current.profile ?? {}),
        socialLinks: {
          ...(current.profile?.socialLinks ?? {}),
          [field]: value
        }
      }
    }));
  };

  const updateExperienceField = (index, field, value) => {
    setResumeDraft((current) => ({
      ...current,
      experience: (current.experience ?? []).map((item, itemIndex) => itemIndex === index
        ? { ...item, [field]: value }
        : item)
    }));
  };

  const updateExperienceProjectField = (experienceIndex, field, value) => {
    setResumeDraft((current) => ({
      ...current,
      experience: (current.experience ?? []).map((item, itemIndex) => {
        if (itemIndex !== experienceIndex) {
          return item;
        }

        const project = Array.isArray(item.projects) && item.projects.length > 0 ? item.projects[0] : {};
        return {
          ...item,
          projects: [{ ...project, [field]: value }]
        };
      })
    }));
  };

  const updateProjectField = (index, field, value) => {
    setResumeDraft((current) => ({
      ...current,
      projects: (current.projects ?? []).map((project, projectIndex) => projectIndex === index
        ? { ...project, [field]: value }
        : project)
    }));
  };

  const updateSkillGroupField = (index, field, value) => {
    setResumeDraft((current) => ({
      ...current,
      skills: (current.skills ?? []).map((group, groupIndex) => groupIndex === index
        ? { ...group, [field]: value }
        : group)
    }));
  };

  const addExperience = () => {
    setResumeDraft((current) => ({
      ...current,
      experience: [
        ...(current.experience ?? []),
        {
          id: `new-role-${Date.now()}`,
          company: "New company",
          division: "Strategy",
          title: "Senior Engineer",
          dates: "Present",
          projects: [{
            projectName: "New initiative",
            projectDescription: "Describe the work and impact.",
            highlights: ["One headline outcome."],
            metrics: [{ value: "0", label: "Metric" }],
            problem: "What problem were you solving?",
            approach: ["Describe the approach."],
            outcome: ["Describe the result."],
            stack: ["TypeScript"]
          }]
        }
      ]
    }));
  };

  const addProject = () => {
    setResumeDraft((current) => ({
      ...current,
      projects: [
        ...(current.projects ?? []),
        {
          id: `new-project-${Date.now()}`,
          title: "New project",
          date: "Current",
          badge: "Portfolio",
          summary: "Describe the project impact.",
          tools: ["React", "TypeScript"],
          githubUrl: "",
          liveUrl: ""
        }
      ]
    }));
  };

  const addSkillGroup = () => {
    setResumeDraft((current) => ({
      ...current,
      skills: [
        ...(current.skills ?? []),
        {
          title: "New skill area",
          items: ["Skill 1", "Skill 2"]
        }
      ]
    }));
  };

  const addCertification = () => {
    setResumeDraft((current) => ({
      ...current,
      certifications: [
        ...(current.certifications ?? []),
        { name: "New certification", issuer: "Issuer", year: "Year" }
      ]
    }));
  };

  const addLanguage = () => {
    setResumeDraft((current) => ({
      ...current,
      profile: {
        ...(current.profile ?? {}),
        languages: [
          ...((current.profile?.languages ?? [])),
          { code: "", name: "", nativeName: "", direction: "ltr", proficiency: "Fluent" }
        ]
      }
    }));
  };

  const duplicateExperience = (index) => {
    setResumeDraft((current) => {
      const items = current.experience ?? [];
      if (!items[index]) {
        return current;
      }

      const nextItem = cloneItem(items[index]);
      nextItem.id = makeId("experience");

      return {
        ...current,
        experience: [
          ...items.slice(0, index + 1),
          nextItem,
          ...items.slice(index + 1)
        ]
      };
    });
  };

  const duplicateProject = (index) => {
    setResumeDraft((current) => {
      const items = current.projects ?? [];
      if (!items[index]) {
        return current;
      }

      const nextItem = cloneItem(items[index]);
      nextItem.id = makeId("project");

      return {
        ...current,
        projects: [
          ...items.slice(0, index + 1),
          nextItem,
          ...items.slice(index + 1)
        ]
      };
    });
  };

  const duplicateSkillGroup = (index) => {
    setResumeDraft((current) => {
      const items = current.skills ?? [];
      if (!items[index]) {
        return current;
      }

      const nextItem = cloneItem(items[index]);
      return {
        ...current,
        skills: [
          ...items.slice(0, index + 1),
          nextItem,
          ...items.slice(index + 1)
        ]
      };
    });
  };

  const duplicateCertification = (index) => {
    setResumeDraft((current) => {
      const items = current.certifications ?? [];
      if (!items[index]) {
        return current;
      }

      const nextItem = cloneItem(items[index]);
      return {
        ...current,
        certifications: [
          ...items.slice(0, index + 1),
          nextItem,
          ...items.slice(index + 1)
        ]
      };
    });
  };

  const duplicateLanguage = (index) => {
    setResumeDraft((current) => {
      const items = current.profile?.languages ?? [];
      if (!items[index]) {
        return current;
      }

      const nextItem = cloneItem(items[index]);
      return {
        ...current,
        profile: {
          ...(current.profile ?? {}),
          languages: [
            ...items.slice(0, index + 1),
            nextItem,
            ...items.slice(index + 1)
          ]
        }
      };
    });
  };

  const reorderExperience = (fromIndex, toIndex) => {
    setResumeDraft((current) => ({
      ...current,
      experience: reorderList(current.experience ?? [], fromIndex, toIndex)
    }));
  };

  const reorderProject = (fromIndex, toIndex) => {
    setResumeDraft((current) => ({
      ...current,
      projects: reorderList(current.projects ?? [], fromIndex, toIndex)
    }));
  };

  const removeExperience = (index) => {
    setResumeDraft((current) => ({
      ...current,
      experience: (current.experience ?? []).filter((_, itemIndex) => itemIndex !== index)
    }));
  };

  const removeProject = (index) => {
    setResumeDraft((current) => ({
      ...current,
      projects: (current.projects ?? []).filter((_, itemIndex) => itemIndex !== index)
    }));
  };

  const removeSkillGroup = (index) => {
    setResumeDraft((current) => ({
      ...current,
      skills: (current.skills ?? []).filter((_, itemIndex) => itemIndex !== index)
    }));
  };

  const removeCertification = (index) => {
    setResumeDraft((current) => ({
      ...current,
      certifications: (current.certifications ?? []).filter((_, itemIndex) => itemIndex !== index)
    }));
  };

  const removeLanguage = (index) => {
    setResumeDraft((current) => ({
      ...current,
      profile: {
        ...(current.profile ?? {}),
        languages: (current.profile?.languages ?? []).filter((_, itemIndex) => itemIndex !== index)
      }
    }));
  };

  const updateLanguage = (index, updates) => {
    setResumeDraft((current) => ({
      ...current,
      profile: {
        ...(current.profile ?? {}),
        languages: (current.profile?.languages ?? []).map((language, languageIndex) => languageIndex === index ? {
          ...language,
          ...updates
        } : language)
      }
    }));
  };

  const updateSkillItem = (groupIndex, itemIndex, nextValue) => {
    setResumeDraft((current) => ({
      ...current,
      skills: (current.skills ?? []).map((group, index) => {
        if (index !== groupIndex) {
          return group;
        }

        return {
          ...group,
          items: (group.items ?? []).map((item, skillIndex) => skillIndex === itemIndex ? nextValue : item)
        };
      })
    }));
  };

  const addSkillItem = (groupIndex, rawValue) => {
    const nextValue = rawValue.trim();
    if (!nextValue) {
      return;
    }

    setResumeDraft((current) => ({
      ...current,
      skills: (current.skills ?? []).map((group, index) => {
        if (index !== groupIndex) {
          return group;
        }

        return {
          ...group,
          items: [...(group.items ?? []), nextValue]
        };
      })
    }));
  };

  const removeSkillItem = (groupIndex, itemIndex) => {
    setResumeDraft((current) => ({
      ...current,
      skills: (current.skills ?? []).map((group, index) => {
        if (index !== groupIndex) {
          return group;
        }

        return {
          ...group,
          items: (group.items ?? []).filter((_, skillIndex) => skillIndex !== itemIndex)
        };
      })
    }));
  };

  const handleSaveSite = async () => {
    const nextConfig = {
      ...siteConfigSeed,
      ...initialConfig,
      ...siteDraft
    };

    try {
      const savedConfig = await saveConfig(nextConfig);
      onSave(savedConfig);
      setSiteSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    } catch (error) {
      setSiteSavedAt(error.message || "Save failed");
    }
  };

  const handleSaveResume = async () => {
    try {
      const savedResume = await saveResume(resumeDraft);
      onSaveResume(savedResume);
      setResumeSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    } catch (error) {
      setResumeSavedAt(error.message || "Save failed");
    }
  };

  const sectionIcons = {
    siteSettings: Settings2,
    profile: UserRound,
    experience: BriefcaseBusiness,
    projects: FolderKanban,
    skills: Sparkles,
    certifications: Award
  };

  const isSectionDirty = (sectionKey) => {
    switch (sectionKey) {
      case "siteSettings":
        return JSON.stringify(siteDraft) !== JSON.stringify(initialConfig);
      case "profile":
        return JSON.stringify(resumeDraft?.profile ?? {}) !== JSON.stringify(resume?.profile ?? {});
      case "experience":
        return JSON.stringify(resumeDraft?.experience ?? []) !== JSON.stringify(resume?.experience ?? []);
      case "projects":
        return JSON.stringify(resumeDraft?.projects ?? []) !== JSON.stringify(resume?.projects ?? []);
      case "skills":
        return JSON.stringify(resumeDraft?.skills ?? []) !== JSON.stringify(resume?.skills ?? []);
      case "certifications":
        return JSON.stringify(resumeDraft?.certifications ?? []) !== JSON.stringify(resume?.certifications ?? []);
      default:
        return false;
    }
  };

  const handleSectionSave = (sectionKey) => {
    if (sectionKey === "siteSettings") {
      handleSaveSite();
      return;
    }

    handleSaveResume();
  };

  const renderSectionToggle = (sectionKey, label, meta) => {
    const Icon = sectionIcons[sectionKey] ?? Settings2;

    return (
      <button
        type="button"
        className="dashboard-section-toggle"
        onClick={() => toggleSection(sectionKey)}
        aria-expanded={expanded[sectionKey]}
      >
        <span>{label}</span>
        <span className="dashboard-section-toggle-meta" aria-label={meta || label}>
          <Icon size={14} aria-hidden="true" />
        </span>
      </button>
    );
  };

  const renderSectionSaveActions = (sectionKey, extraActions = null) => {
    const dirty = isSectionDirty(sectionKey);
    const StatusIcon = dirty ? PencilLine : Check;
    const statusLabel = dirty ? "Needs saving" : "Up to date";

    return (
      <div className="dashboard-card-actions">
        {extraActions}
        <button
          type="button"
          className="dashboard-icon-button"
          aria-label={dirty ? `Save ${sectionKey}` : `${sectionKey} is up to date`}
          title={dirty ? `Save ${sectionKey}` : `${sectionKey} is up to date`}
          onClick={() => handleSectionSave(sectionKey)}
          disabled={!dirty}
        >
          <Save size={16} aria-hidden="true" />
        </button>
        <span className={`dashboard-status-icon ${dirty ? "is-dirty" : "is-synced"}`} aria-label={statusLabel} title={statusLabel}>
          <StatusIcon size={14} aria-hidden="true" />
        </span>
      </div>
    );
  };

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand-block">
          <p className="dashboard-label">Resume Atelier</p>
          <h1>Control room</h1>
          <p className="dashboard-identity">{profileSummary}</p>
        </div>

        <nav className="dashboard-nav" aria-label="Dashboard sections">
          {[
            { key: "siteSettings", label: "Site settings" },
            { key: "profile", label: "Profile" },
            { key: "experience", label: "Experience" },
            { key: "projects", label: "Projects" },
            { key: "skills", label: "Skills" },
            { key: "certifications", label: "Certifications" }
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              className={selectedSection === item.key ? "dashboard-nav-item is-active" : "dashboard-nav-item"}
              onClick={() => setSelectedSection(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button type="button" className="dashboard-back" onClick={() => setSelectedSection("siteSettings")}>
          Back to resume
        </button>
      </aside>

      <main className="dashboard-panel">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-kicker">Studio</p>
            <h2>Portfolio editor</h2>
          </div>
        </header>

        {isSectionVisible("siteSettings") && (
        <section id="site-settings" className={`dashboard-card ${expanded.siteSettings ? "is-open" : "is-collapsed"}`}>
          <div className="dashboard-card-header">
            {renderSectionToggle("siteSettings", "Site settings", "Config")}
            {renderSectionSaveActions("siteSettings")}
          </div>

          {expanded.siteSettings && (
            <div className="dashboard-section-body">
              <div className="dashboard-grid">
                <label>
                  Site title
                  <input name="siteTitle" value={siteDraft.siteTitle ?? ""} onChange={updateSiteField} />
                </label>

                <label>
                  Theme
                  <select name="theme" value={siteDraft.theme || "default"} onChange={updateSiteField}>
                    <option value="default">Default</option>
                    <option value="modern">Modern</option>
                  </select>
                </label>

                <label>
                  Resume PDF path
                  <input name="resumePath" value={siteDraft.resumePath ?? ""} onChange={updateSiteField} />
                </label>

                <label className="checkbox-row">
                  <input type="checkbox" name="showProfile" checked={Boolean(siteDraft.showProfile)} onChange={updateSiteField} />
                  Show profile
                </label>

                <label className="checkbox-row">
                  <input type="checkbox" name="showExperience" checked={Boolean(siteDraft.showExperience)} onChange={updateSiteField} />
                  Show experience
                </label>

                <label className="checkbox-row">
                  <input type="checkbox" name="showProjects" checked={Boolean(siteDraft.showProjects)} onChange={updateSiteField} />
                  Show projects
                </label>

                <label className="checkbox-row">
                  <input type="checkbox" name="showSkills" checked={Boolean(siteDraft.showSkills)} onChange={updateSiteField} />
                  Show skills
                </label>

                <label className="checkbox-row">
                  <input type="checkbox" name="showCertifications" checked={Boolean(siteDraft.showCertifications)} onChange={updateSiteField} />
                  Show certifications
                </label>
              </div>
            </div>
          )}
        </section>
        )}

        {isSectionVisible("profile") && (
        <section id="resume-profile" className={`dashboard-card ${expanded.profile ? "is-open" : "is-collapsed"}`}>
          <div className="dashboard-card-header">
            {renderSectionToggle("profile", "Resume profile", "Profile")}
            {renderSectionSaveActions("profile")}
          </div>

          {expanded.profile && (
            <div className="dashboard-section-body">
              <div className="dashboard-grid">
                <label>
                  Name
                  <input value={resumeDraft.profile?.name ?? ""} onChange={(event) => updateProfileField("name", event.target.value)} />
                </label>

                <label>
                  Title
                  <input value={resumeDraft.profile?.title ?? ""} onChange={(event) => updateProfileField("title", event.target.value)} />
                </label>

                <label>
                  Location
                  <input value={resumeDraft.profile?.location ?? ""} onChange={(event) => updateProfileField("location", event.target.value)} />
                </label>

                <label>
                  Years of experience
                  <input type="number" value={resumeDraft.profile?.yearsOfExperience ?? 0} onChange={(event) => updateProfileField("yearsOfExperience", Number(event.target.value))} />
                </label>

                <label>
                  Authorization
                  <input value={resumeDraft.profile?.authorization ?? ""} onChange={(event) => updateProfileField("authorization", event.target.value)} />
                </label>

                <label>
                  Job preference
                  <input value={resumeDraft.profile?.jobPreference ?? ""} onChange={(event) => updateProfileField("jobPreference", event.target.value)} />
                </label>

                <label className="full-width">
                  Summary
                  <textarea rows="4" value={resumeDraft.profile?.summary ?? ""} onChange={(event) => updateProfileField("summary", event.target.value)} />
                </label>

                <label>
                  Education degree
                  <input value={resumeDraft.profile?.education?.degree ?? ""} onChange={(event) => updateEducationField("degree", event.target.value)} />
                </label>

                <label>
                  Major
                  <input value={resumeDraft.profile?.education?.major ?? ""} onChange={(event) => updateEducationField("major", event.target.value)} />
                </label>

                <label>
                  School
                  <input value={resumeDraft.profile?.education?.school ?? ""} onChange={(event) => updateEducationField("school", event.target.value)} />
                </label>

                <label>
                  Email
                  <input value={resumeDraft.profile?.email ?? ""} onChange={(event) => updateProfileField("email", event.target.value)} />
                </label>

                <div className="dashboard-collection-item" style={{ gridColumn: "1 / -1" }}>
                  <div className="dashboard-item-toolbar">
                    <span>Languages</span>
                    <div className="dashboard-item-actions">
                      <button type="button" className="dashboard-inline-button dashboard-inline-button-small" onClick={() => duplicateLanguage((resumeDraft.profile?.languages ?? []).length - 1)}>
                        Duplicate
                      </button>
                      <button type="button" className="dashboard-inline-button dashboard-inline-button-small" onClick={addLanguage}>
                        Add
                      </button>
                    </div>
                  </div>

                  {(resumeDraft.profile?.languages ?? []).map((language, index) => (
                    <div key={`${language.name || "language"}-${index}`} className="dashboard-grid" style={{ marginTop: "1rem" }}>
                      <label>
                        Name
                        <LanguageSearchInput
                          value={language}
                          onSelect={(selectedLanguage) => {
                            updateLanguage(index, {
                              code: selectedLanguage.code,
                              name: selectedLanguage.name,
                              nativeName: selectedLanguage.nativeName,
                              direction: selectedLanguage.direction
                            });
                          }}
                        />
                      </label>

                      <label>
                        Proficiency
                        <select value={language.proficiency ?? "Fluent"} onChange={(event) => updateLanguage(index, { proficiency: event.target.value })}>
                          <option value="Native">Native</option>
                          <option value="Fluent">Fluent</option>
                          <option value="Professional">Professional</option>
                          <option value="Conversational">Conversational</option>
                          <option value="Basic">Basic</option>
                        </select>
                      </label>

                      <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end" }}>
                        <button type="button" className="dashboard-remove-button" onClick={() => removeLanguage(index)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <label>
                  GitHub URL
                  <input value={resumeDraft.profile?.socialLinks?.github ?? ""} onChange={(event) => updateSocialField("github", event.target.value)} />
                </label>

                <label>
                  LinkedIn URL
                  <input value={resumeDraft.profile?.socialLinks?.linkedin ?? ""} onChange={(event) => updateSocialField("linkedin", event.target.value)} />
                </label>
              </div>
            </div>
          )}
        </section>
        )}

        {isSectionVisible("experience") && (
        <section id="resume-experience" className={`dashboard-card ${expanded.experience ? "is-open" : "is-collapsed"}`}>
          <div className="dashboard-card-header">
            {renderSectionToggle("experience", "Career timeline", "Experience")}
            {renderSectionSaveActions("experience", (
              <>
                <button type="button" className="dashboard-inline-button" onClick={() => duplicateExperience((resumeDraft.experience ?? []).length - 1)} title="Duplicate section">⧉</button>
                <button type="button" className="dashboard-inline-button" onClick={addExperience} title="Add experience">＋</button>
              </>
            ))}
          </div>

          {expanded.experience && (
            <div className="dashboard-section-body">
              {(resumeDraft.experience ?? []).map((item, index) => (
                <div
                  key={item.id || `experience-${index}`}
                  className="dashboard-collection-item"
                  draggable
                  onDragStart={() => setDraggedItem({ section: "experience", index })}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => {
                    if (draggedItem?.section === "experience") {
                      reorderExperience(draggedItem.index, index);
                    }
                    setDraggedItem(null);
                  }}
                >
                  <div className="dashboard-item-toolbar">
                    <span className="dashboard-item-label">
                      <span className="dashboard-drag-handle" aria-hidden="true">⋮⋮</span>
                      Role {index + 1}
                    </span>
                    <div className="dashboard-item-actions">
                      <button type="button" className="dashboard-inline-button dashboard-inline-button-small" onClick={() => duplicateExperience(index)}>
                        Duplicate
                      </button>
                      <button type="button" className="dashboard-remove-button" onClick={() => removeExperience(index)}>
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="dashboard-grid">
                    <label>
                      Company
                      <input value={item.company ?? ""} onChange={(event) => updateExperienceField(index, "company", event.target.value)} />
                    </label>

                    <label>
                      Division
                      <input value={item.division ?? ""} onChange={(event) => updateExperienceField(index, "division", event.target.value)} />
                    </label>

                    <label>
                      Role
                      <input value={item.title ?? ""} onChange={(event) => updateExperienceField(index, "title", event.target.value)} />
                    </label>

                    <label>
                      Dates
                      <input value={item.dates ?? ""} onChange={(event) => updateExperienceField(index, "dates", event.target.value)} />
                    </label>

                    <label className="full-width">
                      Project name
                      <input value={item.projects?.[0]?.projectName ?? ""} onChange={(event) => updateExperienceProjectField(index, "projectName", event.target.value)} />
                    </label>

                    <label className="full-width">
                      Project summary
                      <textarea rows="4" value={item.projects?.[0]?.projectDescription ?? ""} onChange={(event) => updateExperienceProjectField(index, "projectDescription", event.target.value)} />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        )}

        {isSectionVisible("projects") && (
        <section id="resume-projects" className={`dashboard-card ${expanded.projects ? "is-open" : "is-collapsed"}`}>
          <div className="dashboard-card-header">
            {renderSectionToggle("projects", "Personal projects", "Projects")}
            {renderSectionSaveActions("projects", (
              <>
                <button type="button" className="dashboard-inline-button" onClick={() => duplicateProject((resumeDraft.projects ?? []).length - 1)} title="Duplicate section">⧉</button>
                <button type="button" className="dashboard-inline-button" onClick={addProject} title="Add project">＋</button>
              </>
            ))}
          </div>

          {expanded.projects && (
            <div className="dashboard-section-body">
              {(resumeDraft.projects ?? []).map((project, index) => (
                <div
                  key={project.id || `project-${index}`}
                  className="dashboard-collection-item"
                  draggable
                  onDragStart={() => setDraggedItem({ section: "projects", index })}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => {
                    if (draggedItem?.section === "projects") {
                      reorderProject(draggedItem.index, index);
                    }
                    setDraggedItem(null);
                  }}
                >
                  <div className="dashboard-item-toolbar">
                    <span className="dashboard-item-label">
                      <span className="dashboard-drag-handle" aria-hidden="true">⋮⋮</span>
                      Project {index + 1}
                    </span>
                    <div className="dashboard-item-actions">
                      <button type="button" className="dashboard-inline-button dashboard-inline-button-small" onClick={() => duplicateProject(index)}>
                        Duplicate
                      </button>
                      <button type="button" className="dashboard-remove-button" onClick={() => removeProject(index)}>
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="dashboard-grid">
                    <label>
                      Title
                      <input value={project.title ?? ""} onChange={(event) => updateProjectField(index, "title", event.target.value)} />
                    </label>

                    <label>
                      Date
                      <input value={project.date ?? ""} onChange={(event) => updateProjectField(index, "date", event.target.value)} />
                    </label>

                    <label>
                      Badge
                      <input value={project.badge ?? ""} onChange={(event) => updateProjectField(index, "badge", event.target.value)} />
                    </label>

                    <label className="full-width">
                      Summary
                      <textarea rows="4" value={project.summary ?? ""} onChange={(event) => updateProjectField(index, "summary", event.target.value)} />
                    </label>

                    <label className="full-width">
                      Tools
                      <input value={(project.tools ?? []).join(", ")} onChange={(event) => updateProjectField(index, "tools", event.target.value.split(",").map((item) => item.trim()).filter(Boolean))} />
                    </label>

                    <label>
                      GitHub URL
                      <input value={project.githubUrl ?? ""} onChange={(event) => updateProjectField(index, "githubUrl", event.target.value)} />
                    </label>

                    <label>
                      Live URL
                      <input value={project.liveUrl ?? ""} onChange={(event) => updateProjectField(index, "liveUrl", event.target.value)} />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        )}

        {isSectionVisible("skills") && (
        <section id="resume-skills" className={`dashboard-card ${expanded.skills ? "is-open" : "is-collapsed"}`}>
          <div className="dashboard-card-header">
            {renderSectionToggle("skills", "Skills", "Capabilities")}
            {renderSectionSaveActions("skills", (
              <>
                <button type="button" className="dashboard-inline-button" onClick={() => duplicateSkillGroup((resumeDraft.skills ?? []).length - 1)} title="Duplicate section">⧉</button>
                <button type="button" className="dashboard-inline-button" onClick={addSkillGroup} title="Add skill group">＋</button>
              </>
            ))}
          </div>

          {expanded.skills && (
            <div className="dashboard-section-body">
              {(resumeDraft.skills ?? []).map((group, groupIndex) => (
                <div key={`${group.title}-${groupIndex}`} className="dashboard-collection-item">
                  <div className="dashboard-item-toolbar">
                    <span>Group {groupIndex + 1}</span>
                    <div className="dashboard-item-actions">
                      <button type="button" className="dashboard-inline-button dashboard-inline-button-small" onClick={() => duplicateSkillGroup(groupIndex)}>
                        Duplicate
                      </button>
                      <button type="button" className="dashboard-remove-button" onClick={() => removeSkillGroup(groupIndex)}>
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="dashboard-grid">
                    <label>
                      Group title
                      <input value={group.title ?? ""} onChange={(event) => updateSkillGroupField(groupIndex, "title", event.target.value)} />
                    </label>

                    <label className="full-width">
                      <span className="dashboard-chip-label">Skills</span>
                      <div className="dashboard-skill-chip-list">
                        {(group.items ?? []).map((item, itemIndex) => (
                          <span key={`${group.title}-${itemIndex}`} className="dashboard-skill-chip">
                            <input
                              value={item}
                              onChange={(event) => updateSkillItem(groupIndex, itemIndex, event.target.value)}
                            />
                            <button type="button" className="dashboard-chip-remove" onClick={() => removeSkillItem(groupIndex, itemIndex)}>
                              ×
                            </button>
                          </span>
                        ))}
                        <div className="dashboard-skill-add-row">
                          <input
                            type="text"
                            placeholder="Add a skill"
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                addSkillItem(groupIndex, event.target.value);
                                event.target.value = "";
                              }
                            }}
                          />
                          <button type="button" className="dashboard-inline-button dashboard-inline-button-small" onClick={(event) => {
                            const input = event.currentTarget.parentElement.querySelector("input");
                            if (input) {
                              addSkillItem(groupIndex, input.value);
                              input.value = "";
                            }
                          }}>
                            Add
                          </button>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        )}

        {isSectionVisible("certifications") && (
        <section id="resume-certifications" className={`dashboard-card ${expanded.certifications ? "is-open" : "is-collapsed"}`}>
          <div className="dashboard-card-header">
            {renderSectionToggle("certifications", "Certifications", "Credentials")}
            {renderSectionSaveActions("certifications", (
              <>
                <button type="button" className="dashboard-inline-button" onClick={() => duplicateCertification((resumeDraft.certifications ?? []).length - 1)} title="Duplicate section">⧉</button>
                <button type="button" className="dashboard-inline-button" onClick={addCertification} title="Add certification">＋</button>
              </>
            ))}
          </div>

          {expanded.certifications && (
            <div className="dashboard-section-body">
              {(resumeDraft.certifications ?? []).map((certification, index) => (
                <div key={`${certification.name}-${index}`} className="dashboard-collection-item">
                  <div className="dashboard-item-toolbar">
                    <span>Credential {index + 1}</span>
                    <div className="dashboard-item-actions">
                      <button type="button" className="dashboard-inline-button dashboard-inline-button-small" onClick={() => duplicateCertification(index)}>
                        Duplicate
                      </button>
                      <button type="button" className="dashboard-remove-button" onClick={() => removeCertification(index)}>
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="dashboard-grid">
                    <label>
                      Name
                      <input value={certification.name ?? ""} onChange={(event) => setResumeDraft((current) => ({
                        ...current,
                        certifications: (current.certifications ?? []).map((item, currentIndex) => currentIndex === index ? {
                          ...item,
                          name: event.target.value
                        } : item)
                      }))} />
                    </label>

                    <label>
                      Issuer
                      <input value={certification.issuer ?? ""} onChange={(event) => setResumeDraft((current) => ({
                        ...current,
                        certifications: (current.certifications ?? []).map((item, currentIndex) => currentIndex === index ? {
                          ...item,
                          issuer: event.target.value
                        } : item)
                      }))} />
                    </label>

                    <label>
                      Year
                      <input value={certification.year ?? ""} onChange={(event) => setResumeDraft((current) => ({
                        ...current,
                        certifications: (current.certifications ?? []).map((item, currentIndex) => currentIndex === index ? {
                          ...item,
                          year: event.target.value
                        } : item)
                      }))} />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        )}

      </main>
    </div>
  );
}

export default Dashboard;
