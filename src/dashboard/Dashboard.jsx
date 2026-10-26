import { useEffect, useMemo, useRef, useState } from "react";
import {
  Award,
  BarChart3,
  BookOpenText,
  BriefcaseBusiness,
  Clock3,
  ChevronRight,
  Check,
  Copy,
  Flag,
  FileText,
  FolderKanban,
  GitBranch,
  GraduationCap,
  LayoutDashboard,
  Mail,
  MapPin,
  PencilLine,
  Plus,
  Save,
  Settings2,
  ShieldCheck,
  Sparkles,
  SquareUserRound,
  Trash2,
  UserRound,
  Waypoints
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

const PROFILE_SUBSECTIONS = [
  { key: "basics", label: "Basics", icon: UserRound },
  { key: "headline", label: "Headline", icon: FileText },
  { key: "heroCopy", label: "Stack & Supporting", icon: Sparkles },
  { key: "education", label: "Education", icon: GraduationCap },
  { key: "highlights", label: "Highlights", icon: BarChart3 },
  { key: "languages", label: "Languages", icon: Flag },
  { key: "contact", label: "Contact & Social", icon: Mail }
];

const DASHBOARD_SECTIONS = [
  { key: "siteSettings", label: "Site settings" },
  { key: "profile", label: "Profile" },
  { key: "experience", label: "Experience" },
  { key: "projects", label: "Projects" },
  { key: "skills", label: "Skills" },
  { key: "certifications", label: "Certifications" }
];

const SECTIONS_WITH_SUBMENU = ["profile", "experience", "projects", "skills", "certifications"];

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
  const [selectedSubsection, setSelectedSubsection] = useState({
    profile: "all",
    experience: "all",
    projects: "all",
    skills: "all",
    certifications: "all"
  });
  const [openSubmenus, setOpenSubmenus] = useState({
    profile: false,
    experience: false,
    projects: false,
    skills: false,
    certifications: false
  });
  const [draggedItem, setDraggedItem] = useState(null);
  const [portraitError, setPortraitError] = useState(false);

  const openOnlySubmenu = (sectionKey) => {
    setOpenSubmenus(() => Object.fromEntries(
      SECTIONS_WITH_SUBMENU.map((key) => [key, key === sectionKey])
    ));
  };

  useEffect(() => {
    setSiteDraft(initialConfig);
  }, [initialConfig]);

  useEffect(() => {
    setResumeDraft(resume);
  }, [resume]);

  useEffect(() => {
    setSelectedSubsection((current) => {
      const normalizeItemSubkey = (subkey, length) => {
        if (!subkey || subkey === "all") {
          return "all";
        }

        if (!subkey.startsWith("item-")) {
          return subkey;
        }

        const index = Number(subkey.replace("item-", ""));
        if (!Number.isInteger(index) || index < 0 || index >= length) {
          return "all";
        }

        return subkey;
      };

      const next = {
        ...current,
        experience: normalizeItemSubkey(current.experience, resumeDraft.experience?.length ?? 0),
        projects: normalizeItemSubkey(current.projects, resumeDraft.projects?.length ?? 0),
        skills: normalizeItemSubkey(current.skills, resumeDraft.skills?.length ?? 0),
        certifications: normalizeItemSubkey(current.certifications, resumeDraft.certifications?.length ?? 0)
      };

      return JSON.stringify(next) === JSON.stringify(current) ? current : next;
    });
  }, [resumeDraft.experience, resumeDraft.projects, resumeDraft.skills, resumeDraft.certifications]);

  const normalizeAuthorization = (authorizationValue) => {
    const defaults = {
      authorizedToWorkInUS: {
        enabled: false,
        text: "Authorized to work in the US"
      },
      noSponsorshipRequired: {
        enabled: false,
        text: "No sponsorship required"
      }
    };

    if (!authorizationValue) {
      return defaults;
    }

    if (typeof authorizationValue === "string") {
      return {
        authorizedToWorkInUS: {
          ...defaults.authorizedToWorkInUS,
          enabled: authorizationValue.includes(defaults.authorizedToWorkInUS.text)
        },
        noSponsorshipRequired: {
          ...defaults.noSponsorshipRequired,
          enabled: authorizationValue.includes(defaults.noSponsorshipRequired.text)
        }
      };
    }

    return {
      authorizedToWorkInUS: {
        text: authorizationValue.authorizedToWorkInUS?.text || defaults.authorizedToWorkInUS.text,
        enabled: Boolean(authorizationValue.authorizedToWorkInUS?.enabled)
      },
      noSponsorshipRequired: {
        text: authorizationValue.noSponsorshipRequired?.text || defaults.noSponsorshipRequired.text,
        enabled: Boolean(authorizationValue.noSponsorshipRequired?.enabled)
      }
    };
  };

  const profileName = useMemo(() => resumeDraft?.profile?.name || "Your profile", [resumeDraft]);
  const profileTitle = useMemo(() => resumeDraft?.profile?.title || "Professional headline", [resumeDraft]);
  const portraitSrc = resumeDraft?.profile?.portrait || "/resume/assets/portrait.jpg";
  const authorizationFlags = useMemo(
    () => normalizeAuthorization(resumeDraft?.profile?.authorization),
    [resumeDraft]
  );

  const isSectionVisible = (sectionKey) => selectedSection === sectionKey;

  const selectPrimarySection = (sectionKey) => {
    setSelectedSection(sectionKey);
    if (SECTIONS_WITH_SUBMENU.includes(sectionKey)) {
      setSelectedSubsection((current) => ({
        ...current,
        [sectionKey]: "all"
      }));
      openOnlySubmenu(sectionKey);
    } else {
      setOpenSubmenus((current) => Object.fromEntries(
        SECTIONS_WITH_SUBMENU.map((key) => [key, current[key] && key === sectionKey])
      ));
    }
    setExpanded((current) => ({
      ...current,
      [sectionKey]: true
    }));
  };

  const selectSubsection = (sectionKey, subsectionKey) => {
    setSelectedSection(sectionKey);
    setSelectedSubsection((current) => ({
      ...current,
      [sectionKey]: subsectionKey
    }));
    openOnlySubmenu(sectionKey);
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

  const updateAuthorizationFlag = (flag, checked) => {
    setResumeDraft((current) => {
      const currentAuthorization = normalizeAuthorization(current.profile?.authorization);
      const nextAuthorization = {
        ...currentAuthorization,
        [flag]: {
          ...currentAuthorization[flag],
          enabled: checked
        }
      };

      return {
        ...current,
        profile: {
          ...(current.profile ?? {}),
          authorization: nextAuthorization
        }
      };
    });
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

  const updateProjectTool = (projectIndex, toolIndex, nextValue) => {
    setResumeDraft((current) => ({
      ...current,
      projects: (current.projects ?? []).map((project, index) => {
        if (index !== projectIndex) {
          return project;
        }

        return {
          ...project,
          tools: (project.tools ?? []).map((tool, currentToolIndex) => currentToolIndex === toolIndex ? nextValue : tool)
        };
      })
    }));
  };

  const addProjectTool = (projectIndex, rawValue) => {
    const nextValue = rawValue.trim();
    if (!nextValue) {
      return;
    }

    setResumeDraft((current) => ({
      ...current,
      projects: (current.projects ?? []).map((project, index) => {
        if (index !== projectIndex) {
          return project;
        }

        return {
          ...project,
          tools: [...(project.tools ?? []), nextValue]
        };
      })
    }));
  };

  const removeProjectTool = (projectIndex, toolIndex) => {
    setResumeDraft((current) => ({
      ...current,
      projects: (current.projects ?? []).map((project, index) => {
        if (index !== projectIndex) {
          return project;
        }

        return {
          ...project,
          tools: (project.tools ?? []).filter((_, currentToolIndex) => currentToolIndex !== toolIndex)
        };
      })
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

  const addProfileHighlight = () => {
    setResumeDraft((current) => ({
      ...current,
      profile: {
        ...(current.profile ?? {}),
        highlights: [
          ...(current.profile?.highlights ?? []),
          { value: "New value", label: "New highlight" }
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

  const duplicateProfileHighlight = (index) => {
    setResumeDraft((current) => {
      const items = current.profile?.highlights ?? [];
      if (!items[index]) {
        return current;
      }

      const nextItem = cloneItem(items[index]);
      return {
        ...current,
        profile: {
          ...(current.profile ?? {}),
          highlights: [
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

  const removeProfileHighlight = (index) => {
    setResumeDraft((current) => ({
      ...current,
      profile: {
        ...(current.profile ?? {}),
        highlights: (current.profile?.highlights ?? []).filter((_, itemIndex) => itemIndex !== index)
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

  const updateProfileHighlight = (index, field, value) => {
    setResumeDraft((current) => ({
      ...current,
      profile: {
        ...(current.profile ?? {}),
        highlights: (current.profile?.highlights ?? []).map((highlight, highlightIndex) => highlightIndex === index
          ? { ...highlight, [field]: value }
          : highlight)
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
    highlights: BarChart3,
    experience: BriefcaseBusiness,
    projects: FolderKanban,
    skills: Sparkles,
    certifications: Award
  };

  const sectionHeadings = {
    siteSettings: { kicker: "Studio", title: "Site settings editor" },
    profile: { kicker: "Profile", title: "Profile editor" },
    experience: { kicker: "Experience", title: "Career timeline editor" },
    projects: { kicker: "Projects", title: "Portfolio editor" },
    skills: { kicker: "Skills", title: "Skills editor" },
    certifications: { kicker: "Credentials", title: "Certifications editor" }
  };

  const profileSubsectionHeadings = {
    all: sectionHeadings.profile,
    basics: { kicker: "Profile", title: "Basics editor" },
    headline: { kicker: "Profile", title: "Headline editor" },
    heroCopy: { kicker: "Profile", title: "Stack & supporting editor" },
    education: { kicker: "Profile", title: "Education editor" },
    highlights: { kicker: "Profile", title: "Highlights editor" },
    languages: { kicker: "Profile", title: "Languages editor" },
    contact: { kicker: "Profile", title: "Contact & social editor" }
  };

  const sectionSubmenus = useMemo(() => ({
    profile: PROFILE_SUBSECTIONS,
    experience: [
      ...(resumeDraft.experience ?? []).map((item, index) => ({
        key: `item-${index}`,
        label: item.company?.trim() || `Role ${index + 1}`,
        icon: BriefcaseBusiness
      }))
    ],
    projects: [
      ...(resumeDraft.projects ?? []).map((item, index) => ({
        key: `item-${index}`,
        label: item.title?.trim() || `Project ${index + 1}`,
        icon: FolderKanban
      }))
    ],
    skills: [
      ...(resumeDraft.skills ?? []).map((item, index) => ({
        key: `item-${index}`,
        label: item.title?.trim() || `Group ${index + 1}`,
        icon: Sparkles
      }))
    ],
    certifications: [
      ...(resumeDraft.certifications ?? []).map((item, index) => ({
        key: `item-${index}`,
        label: item.name?.trim() || `Credential ${index + 1}`,
        icon: Award
      }))
    ]
  }), [resumeDraft]);

  const selectedSectionSubkey = selectedSubsection[selectedSection] ?? "all";
  const selectedItemIndex = selectedSectionSubkey.startsWith("item-")
    ? Number(selectedSectionSubkey.replace("item-", ""))
    : null;

  const activeHeading = (() => {
    if (selectedSection === "profile") {
      return profileSubsectionHeadings[selectedSectionSubkey] ?? profileSubsectionHeadings.all;
    }

    if (selectedItemIndex !== null && Number.isInteger(selectedItemIndex) && selectedItemIndex >= 0) {
      const itemLabel = collectionItemLabelBySection[selectedSection] ?? "Item";
      return {
        kicker: sectionHeadings[selectedSection]?.kicker ?? "Section",
        title: `${sectionHeadings[selectedSection]?.title ?? "Editor"} · ${itemLabel} ${selectedItemIndex + 1}`
      };
    }

    return sectionHeadings[selectedSection] ?? sectionHeadings.siteSettings;
  })();

  const isProfileCardVisible = (cardKey) => selectedSectionSubkey === "all" || selectedSectionSubkey === cardKey;
  const isCollectionCardVisible = (sectionKey, index) => {
    const subkey = selectedSubsection[sectionKey] ?? "all";
    return subkey === "all" || subkey === `item-${index}`;
  };
  const visibilityToggles = useMemo(
    () =>
      Object.keys(siteDraft ?? {})
        .filter((key) => /^show[A-Z]/.test(key) && typeof siteDraft[key] === "boolean")
        .map((name) => {
          const rawSection = name.replace(/^show/, "");
          const sectionKey = rawSection.charAt(0).toLowerCase() + rawSection.slice(1);
          const Icon = sectionIcons[sectionKey] ?? Settings2;

          return {
            name,
            label: rawSection.replace(/([a-z])([A-Z])/g, "$1 $2").trim(),
            icon: Icon
          };
        }),
    [siteDraft]
  );

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
      <div className="dashboard-section-toggle dashboard-section-toggle-static" aria-label={label}>
        <span className="dashboard-section-toggle-meta" aria-label={meta || label}>
          <Icon size={14} aria-hidden="true" />
        </span>
      </div>
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
        <div className="dashboard-sidebar-top">
          <span className="dashboard-top-link" aria-label="Dashboard">
            <span>Dashboard</span>
          </span>
        </div>

        <div className="dashboard-brand-block">
          <div className="dashboard-portrait-shell" aria-hidden="true">
            <div className="dashboard-portrait-frame">
              {portraitError ? (
                <div className="dashboard-portrait-fallback" aria-label="Profile portrait placeholder">
                  <SquareUserRound size={46} aria-hidden="true" />
                </div>
              ) : (
                <img
                  src={portraitSrc}
                  alt=""
                  onError={() => setPortraitError(true)}
                />
              )}
            </div>
          </div>
          <h1 className="dashboard-profile-name">{profileName}</h1>
          <p className="dashboard-profile-title">{profileTitle}</p>
        </div>

        <nav className="dashboard-nav" aria-label="Dashboard sections">
          {DASHBOARD_SECTIONS.map((item) => {
            const Icon = sectionIcons[item.key] ?? Settings2;
            const isActive = selectedSection === item.key;
            const hasSubmenu = SECTIONS_WITH_SUBMENU.includes(item.key);
            const isExpanded = hasSubmenu && openSubmenus[item.key];
            const submenuItems = sectionSubmenus[item.key] ?? [];

            return (
              <div key={item.key} className="dashboard-nav-group">
                <button
                  type="button"
                  className={isActive ? "dashboard-nav-item is-active" : "dashboard-nav-item"}
                  onClick={() => selectPrimarySection(item.key)}
                >
                  <span className="dashboard-nav-item-main">
                    <Icon size={14} aria-hidden="true" />
                    <span>{item.label}</span>
                  </span>
                  {hasSubmenu && (
                    <ChevronRight
                      size={13}
                      className={isExpanded ? "dashboard-nav-arrow is-open" : "dashboard-nav-arrow"}
                      aria-hidden="true"
                    />
                  )}
                </button>

                {isExpanded && (
                  <div className="dashboard-nav-submenu" aria-label={`${item.label} subsections`}>
                    {submenuItems.map((subsection) => {
                      const SubIcon = subsection.icon;
                      const isSubsectionActive =
                        selectedSection === item.key && (selectedSubsection[item.key] ?? "all") === subsection.key;

                      return (
                        <button
                          key={subsection.key}
                          type="button"
                          className={isSubsectionActive ? "dashboard-nav-subitem is-active" : "dashboard-nav-subitem"}
                          onClick={() => selectSubsection(item.key, subsection.key)}
                        >
                          <span className="dashboard-nav-item-main">
                            <SubIcon size={12} aria-hidden="true" />
                            <span>{subsection.label}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <footer className="dashboard-sidebar-footer">
          <a className="dashboard-back" href="./" title="Open and review the resume">
            <FileText size={15} aria-hidden="true" />
            <span>Review resume</span>
          </a>
        </footer>
      </aside>

      <main className="dashboard-panel">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-kicker">{activeHeading.kicker}</p>
            <h2>{activeHeading.title}</h2>
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
              <div className="dashboard-site-groups">
                <div className="dashboard-grid">
                  <label>
                    <input aria-label="Site title" placeholder="Site title" name="siteTitle" value={siteDraft.siteTitle ?? ""} onChange={updateSiteField} />
                  </label>

                  <label>
                    <select aria-label="Theme" name="theme" value={siteDraft.theme || "default"} onChange={updateSiteField}>
                      <option value="default">Default theme</option>
                      <option value="modern">Modern theme</option>
                    </select>
                  </label>

                  <label>
                    <input aria-label="Resume PDF path" placeholder="Resume PDF path" name="resumePath" value={siteDraft.resumePath ?? ""} onChange={updateSiteField} />
                  </label>
                </div>

                <div className="dashboard-site-divider" />

                <div className="dashboard-site-visibility">
                  <p className="dashboard-mini-heading">Visible sections</p>
                  <div className="dashboard-visibility-grid">
                    {visibilityToggles.map((toggle) => {
                      const ToggleIcon = toggle.icon;

                      return (
                        <label key={toggle.name} className="dashboard-visibility-toggle">
                          <span className="dashboard-visibility-main">
                            <span className="dashboard-visibility-icon" aria-hidden="true">
                              <ToggleIcon size={14} />
                            </span>
                            <span>{toggle.label}</span>
                          </span>
                          <input
                            type="checkbox"
                            name={toggle.name}
                            checked={Boolean(siteDraft[toggle.name])}
                            onChange={updateSiteField}
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
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
              <div className="dashboard-profile-cards">
                {isProfileCardVisible("basics") && (
                <section className="dashboard-profile-card dashboard-profile-card-animated profile-card-basics">
                  <h3 className="dashboard-subcard-title">Basics</h3>
                  <div className="dashboard-grid">
                    <label className="dashboard-field-inline">
                      <span className="dashboard-field-icon" aria-hidden="true"><UserRound size={14} /></span>
                      <input
                        aria-label="Name"
                        placeholder="Name"
                        value={resumeDraft.profile?.name ?? ""}
                        onChange={(event) => updateProfileField("name", event.target.value)}
                      />
                    </label>

                    <label className="dashboard-field-inline">
                      <span className="dashboard-field-icon" aria-hidden="true"><BriefcaseBusiness size={14} /></span>
                      <input
                        aria-label="Title"
                        placeholder="Title"
                        value={resumeDraft.profile?.title ?? ""}
                        onChange={(event) => updateProfileField("title", event.target.value)}
                      />
                    </label>

                    <label className="dashboard-field-inline">
                      <span className="dashboard-field-icon" aria-hidden="true"><MapPin size={14} /></span>
                      <input
                        aria-label="Location"
                        placeholder="Location"
                        value={resumeDraft.profile?.location ?? ""}
                        onChange={(event) => updateProfileField("location", event.target.value)}
                      />
                    </label>

                    <label className="dashboard-field-inline">
                      <span className="dashboard-field-icon" aria-hidden="true"><Clock3 size={14} /></span>
                      <input
                        aria-label="Years of experience"
                        placeholder="Years of experience"
                        type="number"
                        value={resumeDraft.profile?.yearsOfExperience ?? 0}
                        onChange={(event) => updateProfileField("yearsOfExperience", Number(event.target.value))}
                      />
                    </label>

                    <div className="dashboard-auth-field full-width">
                      <div className="dashboard-auth-options">
                        <label className="dashboard-visibility-toggle dashboard-auth-toggle">
                          <span className="dashboard-visibility-main">
                            <span className="dashboard-visibility-icon" aria-hidden="true">
                              <ShieldCheck size={14} />
                            </span>
                            <span>{authorizationFlags.authorizedToWorkInUS.text}</span>
                          </span>
                          <input
                            type="checkbox"
                            checked={authorizationFlags.authorizedToWorkInUS.enabled}
                            onChange={(event) => updateAuthorizationFlag("authorizedToWorkInUS", event.target.checked)}
                          />
                        </label>
                        <label className="dashboard-visibility-toggle dashboard-auth-toggle">
                          <span className="dashboard-visibility-main">
                            <span className="dashboard-visibility-icon" aria-hidden="true">
                              <ShieldCheck size={14} />
                            </span>
                            <span>{authorizationFlags.noSponsorshipRequired.text}</span>
                          </span>
                          <input
                            type="checkbox"
                            checked={authorizationFlags.noSponsorshipRequired.enabled}
                            onChange={(event) => updateAuthorizationFlag("noSponsorshipRequired", event.target.checked)}
                          />
                        </label>
                      </div>
                    </div>

                    <label className="dashboard-field-inline">
                      <span className="dashboard-field-icon" aria-hidden="true"><Waypoints size={14} /></span>
                      <input
                        aria-label="Job preference"
                        placeholder="Job preference"
                        value={resumeDraft.profile?.jobPreference ?? ""}
                        onChange={(event) => updateProfileField("jobPreference", event.target.value)}
                      />
                    </label>
                  </div>
                </section>
                )}

                {isProfileCardVisible("headline") && (
                <section className="dashboard-profile-card dashboard-profile-card-animated profile-card-summary">
                  <h3 className="dashboard-subcard-title">Headline</h3>
                  <div className="dashboard-grid">
                    <label className="full-width dashboard-field-inline dashboard-field-inline-textarea">
                      <span className="dashboard-field-icon" aria-hidden="true"><FileText size={14} /></span>
                      <textarea
                        aria-label="Headline"
                        placeholder="Headline"
                        rows="4"
                        value={resumeDraft.profile?.headline ?? ""}
                        onChange={(event) => updateProfileField("headline", event.target.value)}
                      />
                    </label>
                  </div>
                </section>
                )}

                {isProfileCardVisible("heroCopy") && (
                <section className="dashboard-profile-card dashboard-profile-card-animated profile-card-hero-copy">
                  <h3 className="dashboard-subcard-title">Stack & supporting</h3>
                  <div className="dashboard-grid">
                    <label className="full-width dashboard-field-inline">
                      <span className="dashboard-field-icon" aria-hidden="true"><Sparkles size={14} /></span>
                      <input
                        aria-label="Stack"
                        placeholder="Stack"
                        value={resumeDraft.profile?.stack ?? ""}
                        onChange={(event) => updateProfileField("stack", event.target.value)}
                      />
                    </label>

                    <label className="full-width dashboard-field-inline dashboard-field-inline-textarea">
                      <span className="dashboard-field-icon" aria-hidden="true"><FileText size={14} /></span>
                      <textarea
                        aria-label="Supporting"
                        placeholder="Supporting"
                        rows="4"
                        value={resumeDraft.profile?.supporting ?? ""}
                        onChange={(event) => updateProfileField("supporting", event.target.value)}
                      />
                    </label>
                  </div>
                </section>
                )}

                {isProfileCardVisible("education") && (
                <section className="dashboard-profile-card dashboard-profile-card-animated profile-card-education">
                  <h3 className="dashboard-subcard-title">Education</h3>
                  <div className="dashboard-grid">
                    <label className="dashboard-field-inline">
                      <span className="dashboard-field-icon" aria-hidden="true"><GraduationCap size={14} /></span>
                      <input
                        aria-label="Degree"
                        placeholder="Degree"
                        value={resumeDraft.profile?.education?.degree ?? ""}
                        onChange={(event) => updateEducationField("degree", event.target.value)}
                      />
                    </label>

                    <label className="dashboard-field-inline">
                      <span className="dashboard-field-icon" aria-hidden="true"><BookOpenText size={14} /></span>
                      <input
                        aria-label="Major"
                        placeholder="Major"
                        value={resumeDraft.profile?.education?.major ?? ""}
                        onChange={(event) => updateEducationField("major", event.target.value)}
                      />
                    </label>

                    <label className="dashboard-field-inline">
                      <span className="dashboard-field-icon" aria-hidden="true"><BriefcaseBusiness size={14} /></span>
                      <input
                        aria-label="School"
                        placeholder="School"
                        value={resumeDraft.profile?.education?.school ?? ""}
                        onChange={(event) => updateEducationField("school", event.target.value)}
                      />
                    </label>
                  </div>
                </section>
                )}

                {isProfileCardVisible("highlights") && (
                <section className="dashboard-profile-card dashboard-profile-card-animated profile-card-highlights">
                  <div className="dashboard-item-toolbar">
                    <h3 className="dashboard-subcard-title">Highlights</h3>
                    <div className="dashboard-item-actions">
                      <button
                        type="button"
                        className="dashboard-icon-button dashboard-icon-button-compact"
                        onClick={() => duplicateProfileHighlight((resumeDraft.profile?.highlights ?? []).length - 1)}
                        title="Duplicate highlight"
                        aria-label="Duplicate highlight"
                      >
                        <Copy size={13} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="dashboard-icon-button dashboard-icon-button-compact"
                        onClick={addProfileHighlight}
                        title="Add highlight"
                        aria-label="Add highlight"
                      >
                        <Plus size={13} aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <div className="dashboard-highlight-editor">
                    {(resumeDraft.profile?.highlights ?? []).map((highlight, index) => (
                      <div key={`highlight-${index}`} className="dashboard-grid dashboard-highlight-row">
                        <label className="dashboard-field-inline">
                          <span className="dashboard-field-icon" aria-hidden="true"><BarChart3 size={14} /></span>
                          <input
                            aria-label="Highlight value"
                            placeholder="Value"
                            value={highlight.value ?? ""}
                            onChange={(event) => updateProfileHighlight(index, "value", event.target.value)}
                          />
                        </label>

                        <label className="dashboard-field-inline">
                          <span className="dashboard-field-icon" aria-hidden="true"><FileText size={14} /></span>
                          <input
                            aria-label="Highlight label"
                            placeholder="Label"
                            value={highlight.label ?? ""}
                            onChange={(event) => updateProfileHighlight(index, "label", event.target.value)}
                          />
                        </label>

                        <div className="dashboard-highlight-row-actions">
                          <button
                            type="button"
                            className="dashboard-icon-button dashboard-icon-button-compact dashboard-remove-icon-button"
                            onClick={() => removeProfileHighlight(index)}
                            title="Remove highlight"
                            aria-label="Remove highlight"
                          >
                            <Trash2 size={13} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
                )}

                {isProfileCardVisible("languages") && (
                <section className="dashboard-profile-card dashboard-profile-card-animated profile-card-languages">
                  <div className="dashboard-item-toolbar">
                    <h3 className="dashboard-subcard-title">Languages</h3>
                    <div className="dashboard-item-actions">
                      <button
                        type="button"
                        className="dashboard-icon-button dashboard-icon-button-compact"
                        onClick={() => duplicateLanguage((resumeDraft.profile?.languages ?? []).length - 1)}
                        title="Duplicate language"
                        aria-label="Duplicate language"
                      >
                        <Copy size={13} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="dashboard-icon-button dashboard-icon-button-compact"
                        onClick={addLanguage}
                        title="Add language"
                        aria-label="Add language"
                      >
                        <Plus size={13} aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <div className="dashboard-language-editor">
                    {(resumeDraft.profile?.languages ?? []).map((language, index) => (
                      <div key={`${language.name || "language"}-${index}`} className="dashboard-grid dashboard-language-row">
                        <label className="dashboard-field-inline">
                          <span className="dashboard-field-icon" aria-hidden="true">
                            {language.code ? (
                              <span className="dashboard-language-code-icon">{language.code.toUpperCase()}</span>
                            ) : (
                              <Flag size={14} />
                            )}
                          </span>
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

                        <label className="dashboard-field-inline">
                          <span className="dashboard-field-icon" aria-hidden="true"><Sparkles size={14} /></span>
                          <select
                            aria-label="Language proficiency"
                            value={language.proficiency ?? "Fluent"}
                            onChange={(event) => updateLanguage(index, { proficiency: event.target.value })}
                          >
                            <option value="Native">Native</option>
                            <option value="Fluent">Fluent</option>
                            <option value="Professional">Professional</option>
                            <option value="Conversational">Conversational</option>
                            <option value="Basic">Basic</option>
                          </select>
                        </label>

                        <div className="dashboard-language-row-actions">
                          <button
                            type="button"
                            className="dashboard-icon-button dashboard-icon-button-compact dashboard-remove-icon-button"
                            onClick={() => removeLanguage(index)}
                            title="Remove language"
                            aria-label="Remove language"
                          >
                            <Trash2 size={13} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
                )}

                {isProfileCardVisible("contact") && (
                <section className="dashboard-profile-card dashboard-profile-card-animated profile-card-contact">
                  <h3 className="dashboard-subcard-title">Contact & social</h3>
                  <div className="dashboard-grid">
                    <label className="dashboard-field-inline">
                      <span className="dashboard-field-icon" aria-hidden="true"><Mail size={14} /></span>
                      <input
                        aria-label="Email"
                        placeholder="Email"
                        value={resumeDraft.profile?.email ?? ""}
                        onChange={(event) => updateProfileField("email", event.target.value)}
                      />
                    </label>

                    <label className="dashboard-field-inline">
                      <span className="dashboard-field-icon" aria-hidden="true"><GitBranch size={14} /></span>
                      <input
                        aria-label="GitHub URL"
                        placeholder="GitHub URL"
                        value={resumeDraft.profile?.socialLinks?.github ?? ""}
                        onChange={(event) => updateSocialField("github", event.target.value)}
                      />
                    </label>

                    <label className="dashboard-field-inline">
                      <span className="dashboard-field-icon" aria-hidden="true"><BriefcaseBusiness size={14} /></span>
                      <input
                        aria-label="LinkedIn URL"
                        placeholder="LinkedIn URL"
                        value={resumeDraft.profile?.socialLinks?.linkedin ?? ""}
                        onChange={(event) => updateSocialField("linkedin", event.target.value)}
                      />
                    </label>
                  </div>
                </section>
                )}
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
                isCollectionCardVisible("experience", index) ? (
                <div
                  key={item.id || `experience-${index}`}
                  className="dashboard-collection-item dashboard-collection-item-animated"
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
                      <button
                        type="button"
                        className="dashboard-icon-button dashboard-icon-button-compact"
                        onClick={() => duplicateExperience(index)}
                        title="Duplicate role"
                        aria-label="Duplicate role"
                      >
                        <Copy size={13} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="dashboard-icon-button dashboard-icon-button-compact dashboard-remove-icon-button"
                        onClick={() => removeExperience(index)}
                        title="Remove role"
                        aria-label="Remove role"
                      >
                        <Trash2 size={13} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  <div className="dashboard-grid">
                    <label>
                      <input aria-label="Company" placeholder="Company" value={item.company ?? ""} onChange={(event) => updateExperienceField(index, "company", event.target.value)} />
                    </label>

                    <label>
                      <input aria-label="Division" placeholder="Division" value={item.division ?? ""} onChange={(event) => updateExperienceField(index, "division", event.target.value)} />
                    </label>

                    <label>
                      <input aria-label="Role" placeholder="Role" value={item.title ?? ""} onChange={(event) => updateExperienceField(index, "title", event.target.value)} />
                    </label>

                    <label>
                      <input aria-label="Dates" placeholder="Dates" value={item.dates ?? ""} onChange={(event) => updateExperienceField(index, "dates", event.target.value)} />
                    </label>

                    <label className="full-width">
                      <input aria-label="Project name" placeholder="Project name" value={item.projects?.[0]?.projectName ?? ""} onChange={(event) => updateExperienceProjectField(index, "projectName", event.target.value)} />
                    </label>

                    <label className="full-width">
                      <textarea aria-label="Project summary" placeholder="Project summary" rows="4" value={item.projects?.[0]?.projectDescription ?? ""} onChange={(event) => updateExperienceProjectField(index, "projectDescription", event.target.value)} />
                    </label>
                  </div>
                </div>
                ) : null
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
                isCollectionCardVisible("projects", index) ? (
                <div
                  key={project.id || `project-${index}`}
                  className="dashboard-collection-item dashboard-collection-item-animated"
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
                      <button
                        type="button"
                        className="dashboard-icon-button dashboard-icon-button-compact"
                        onClick={() => duplicateProject(index)}
                        title="Duplicate project"
                        aria-label="Duplicate project"
                      >
                        <Copy size={13} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="dashboard-icon-button dashboard-icon-button-compact dashboard-remove-icon-button"
                        onClick={() => removeProject(index)}
                        title="Remove project"
                        aria-label="Remove project"
                      >
                        <Trash2 size={13} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  <div className="dashboard-grid">
                    <label>
                      <input aria-label="Title" placeholder="Title" value={project.title ?? ""} onChange={(event) => updateProjectField(index, "title", event.target.value)} />
                    </label>

                    <label>
                      <input aria-label="Date" placeholder="Date" value={project.date ?? ""} onChange={(event) => updateProjectField(index, "date", event.target.value)} />
                    </label>

                    <label>
                      <input aria-label="Badge" placeholder="Badge" value={project.badge ?? ""} onChange={(event) => updateProjectField(index, "badge", event.target.value)} />
                    </label>

                    <label className="full-width">
                      <textarea aria-label="Summary" placeholder="Summary" rows="4" value={project.summary ?? ""} onChange={(event) => updateProjectField(index, "summary", event.target.value)} />
                    </label>

                    <label className="full-width">
                      <span className="dashboard-chip-label" aria-label="Project tools">
                        <Sparkles size={14} aria-hidden="true" />
                      </span>
                      <div className="dashboard-skill-chip-list">
                        {(project.tools ?? []).map((tool, toolIndex) => (
                          <span key={`${project.id || index}-tool-${toolIndex}`} className="dashboard-skill-chip">
                            <input
                              value={tool}
                              onChange={(event) => updateProjectTool(index, toolIndex, event.target.value)}
                            />
                            <button type="button" className="dashboard-chip-remove" onClick={() => removeProjectTool(index, toolIndex)}>
                              ×
                            </button>
                          </span>
                        ))}
                        <div className="dashboard-skill-add-row">
                          <input
                            type="text"
                            placeholder="Add a tool"
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                addProjectTool(index, event.target.value);
                                event.target.value = "";
                              }
                            }}
                          />
                          <button type="button" className="dashboard-inline-button dashboard-inline-button-small" onClick={(event) => {
                            const input = event.currentTarget.parentElement.querySelector("input");
                            if (input) {
                              addProjectTool(index, input.value);
                              input.value = "";
                            }
                          }}>
                            Add
                          </button>
                        </div>
                      </div>
                    </label>

                    <label>
                      <input aria-label="GitHub URL" placeholder="GitHub URL" value={project.githubUrl ?? ""} onChange={(event) => updateProjectField(index, "githubUrl", event.target.value)} />
                    </label>

                    <label>
                      <input aria-label="Live URL" placeholder="Live URL" value={project.liveUrl ?? ""} onChange={(event) => updateProjectField(index, "liveUrl", event.target.value)} />
                    </label>
                  </div>
                </div>
                ) : null
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
                isCollectionCardVisible("skills", groupIndex) ? (
                <div key={`${group.title}-${groupIndex}`} className="dashboard-collection-item dashboard-collection-item-animated">
                  <div className="dashboard-item-toolbar">
                    <span>Group {groupIndex + 1}</span>
                    <div className="dashboard-item-actions">
                      <button
                        type="button"
                        className="dashboard-icon-button dashboard-icon-button-compact"
                        onClick={() => duplicateSkillGroup(groupIndex)}
                        title="Duplicate skill group"
                        aria-label="Duplicate skill group"
                      >
                        <Copy size={13} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="dashboard-icon-button dashboard-icon-button-compact dashboard-remove-icon-button"
                        onClick={() => removeSkillGroup(groupIndex)}
                        title="Remove skill group"
                        aria-label="Remove skill group"
                      >
                        <Trash2 size={13} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  <div className="dashboard-grid">
                    <label>
                      <input aria-label="Group title" placeholder="Group title" value={group.title ?? ""} onChange={(event) => updateSkillGroupField(groupIndex, "title", event.target.value)} />
                    </label>

                    <label className="full-width">
                      <span className="dashboard-chip-label" aria-label="Skills">
                        <Sparkles size={14} aria-hidden="true" />
                      </span>
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
                ) : null
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
                isCollectionCardVisible("certifications", index) ? (
                <div key={`${certification.name}-${index}`} className="dashboard-collection-item dashboard-collection-item-animated">
                  <div className="dashboard-item-toolbar">
                    <span>Credential {index + 1}</span>
                    <div className="dashboard-item-actions">
                      <button
                        type="button"
                        className="dashboard-icon-button dashboard-icon-button-compact"
                        onClick={() => duplicateCertification(index)}
                        title="Duplicate credential"
                        aria-label="Duplicate credential"
                      >
                        <Copy size={13} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="dashboard-icon-button dashboard-icon-button-compact dashboard-remove-icon-button"
                        onClick={() => removeCertification(index)}
                        title="Remove credential"
                        aria-label="Remove credential"
                      >
                        <Trash2 size={13} aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <div className="dashboard-grid">
                    <label>
                      <input aria-label="Certification name" placeholder="Name" value={certification.name ?? ""} onChange={(event) => setResumeDraft((current) => ({
                        ...current,
                        certifications: (current.certifications ?? []).map((item, currentIndex) => currentIndex === index ? {
                          ...item,
                          name: event.target.value
                        } : item)
                      }))} />
                    </label>

                    <label>
                      <input aria-label="Certification issuer" placeholder="Issuer" value={certification.issuer ?? ""} onChange={(event) => setResumeDraft((current) => ({
                        ...current,
                        certifications: (current.certifications ?? []).map((item, currentIndex) => currentIndex === index ? {
                          ...item,
                          issuer: event.target.value
                        } : item)
                      }))} />
                    </label>

                    <label>
                      <input aria-label="Certification year" placeholder="Year" value={certification.year ?? ""} onChange={(event) => setResumeDraft((current) => ({
                        ...current,
                        certifications: (current.certifications ?? []).map((item, currentIndex) => currentIndex === index ? {
                          ...item,
                          year: event.target.value
                        } : item)
                      }))} />
                    </label>
                  </div>
                </div>
                ) : null
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
  const collectionItemLabelBySection = {
    experience: "Role",
    projects: "Project",
    skills: "Group",
    certifications: "Credential"
  };
