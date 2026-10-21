import { useMemo, useState } from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
// import ResultsSection from "./components/ResultsSection";
// import AboutSection from "./components/AboutSection";
import ExperienceSection from "./components/ExperienceSection";
import SkillsSection from "./components/SkillsSection";
import BuildingSection from "./components/BuildingSection";
import ApproachSection from "./components/ApproachSection";
import ProjectsSection from "./components/ProjectsSection";
import EducationSection from "./components/EducationSection";
import ContactSection from "./components/ContactSection";
import "./App.css";

const SITE_CONFIG = {
  name: "Teodor Toni",
  email: "teodortoni@yahoo.com",
  github: "https://github.com/teodortoni",
  linkedin: "https://linkedin.com/in/teodor-t-89a4191a/",
  resumePath: "assets/resume.pdf",
  yearsOfExperience: new Date().getFullYear() - 2010
};

const EXPERIENCE_ITEMS = [
  {
    id: "soft-consultant",
    company: "Independent Consultant",
    division: "Real Estate",
    title: "Senior Software Engineer",
    dates: "January 2025 - Present",
    projects: [
      {
        projectName: "Tax Preparation Platform",
        projectDescription: "A tenant-aware tax workflow for small landlords with AI-assisted expense classification and PDF generation.",
        highlights: [
          "Built a multi-tenant tax-preparation application for small landlords using React/TypeScript, Node.js/NestJS, and PostgreSQL to streamline rental income and expense reporting",
          "Implemented token-based authentication, tenant-aware data architecture, validation workflows, and PDF tax-form generation",
          "Developing agentic AI features for receipt extraction, expense classification, data validation, and guided tax-preparation workflows"
        ],
        metrics: [
          { value: "3X", label: "Faster prep" },
          { value: "99%", label: "Validation coverage" },
          { value: "AI", label: "Receipt parsing" },
          { value: "1x", label: "Single workflow" }
        ],
        problem: "Landlords and tax preparers needed a faster, more reliable way to manage rental income, expenses, and tax documentation without relying on fragmented spreadsheets or manual workflows.",
        approach: [
          "Designed a multi-tenant SaaS architecture with secure authentication and tenant-aware data boundaries.",
          "Built validation checkpoints and PDF generation workflows to reduce ambiguity in tax preparation.",
          "Added AI-assisted receipt extraction and expense categorization to decrease manual review effort."
        ],
        outcome: [
          "Streamlined the end-to-end tax preparation experience for small landlords.",
          "Reduced manual administrative overhead while improving data reliability.",
          "Created a scalable foundation for more intelligent, guided preparation workflows."
        ],
        stack: ["TypeScript", "NestJS", "AWS", "Docker", "CI/CD", "PostgreSQL"]
      }
    ]
  },
  {
    id: "wwe-senior",
    company: "WWE",
    division: "Media Technology",
    title: "Senior Software Engineer",
    dates: "September 2020 – January 2025",
    projects: [
      {
        projectName: "Video Management System",
        projectDescription: "A high-throughput API ecosystem for media operations, partner integrations, and internal tooling at scale.",
        highlights: [
          "35%+ lower API response times across three services using Node.js, NestJS, caching, and DB optimization.",
          "Maintained 99% uptime for systems handling 1M+ requests with AWS, Docker, and Datadog.",
          "Led 4 API applications from concept through production for WWE’s Video Management System.",
          "Built internal APIs and web tools that supported partner onboarding.",
          "Built secure partner integrations with AWS API Gateway and token-based authentication.",
          "Reduced release time from ~1 hour to 5 minutes via CI/CD automation and automated testing.",
          "Reduced DB query time by 15% through schema, indexing, and query optimization.",
          "Mentored 4 engineers and 1 QA while leading code reviews and technical documentation."
        ],
        metrics: [
          { value: "35%+", label: "API response" },
          { value: "99%", label: "Uptime" },
          { value: "4", label: "API apps" },
          { value: "60x", label: "Release speed" }
        ],
        problem: "The Video Management System needed to support partner onboarding, internal tooling, and high-throughput API workloads without compromising reliability, release velocity, or operational stability.",
        approach: [
          "Led backend architecture and performance tuning across multiple services.",
          "Improved deployment pipelines, observability, and cloud resilience with AWS and Datadog.",
          "Worked cross-functionally to deliver partner integrations and internal tooling without slowing release velocity."
        ],
        outcome: [
          "Improved service latency and operational stability across the platform.",
          "Reduced release time dramatically while supporting higher-volume and more complex integrations.",
          "Strengthened the engineering organization through mentorship and technical leadership."
        ],
        stack: ["Node.js", "NestJS", "AWS", "Docker", "Datadog", "CI/CD", "PostgreSQL", "TypeScript"]
      }
    ]
  },
  {
    id: "wwe-fullstack",
    company: "WWE",
    division: "Media Technology",
    title: "Software Engineer (Full Stack)",
    dates: "December 2018 – September 2020",
    projects: [
      {
        projectName: "Reusable Product UI Platform",
        projectDescription: "A shared component system for digital products spanning internal tools and customer-facing experiences.",
        highlights: [
          "Built and shipped product features across React, Node.js, and AWS services.",
          "Created a reusable React component library adopted across 4+ products.",
          "Improved product usability by 50% through UX and component architecture improvements.",
          "Reduced integration errors by 50% across internal system integrations."
        ],
        metrics: [
          { value: "50%", label: "UX uplift" },
          { value: "4+", label: "Product adoption" },
          { value: "50%", label: "Fewer errors" },
          { value: "3X", label: "Delivery speed" }
        ],
        problem: "Multiple internal product teams were duplicating frontend patterns and dealing with inconsistent UX and integration complexity across shared digital experiences.",
        approach: [
          "Built a reusable UI foundation and aligned teams on shared patterns and design conventions.",
          "Improved product flows and reduced friction in integration-heavy frontend work.",
          "Worked across product squads to create stronger consistency without slowing delivery."
        ],
        outcome: [
          "Accelerated delivery across multiple products.",
          "Improved usability and consistency across shared digital touchpoints.",
          "Reduced recurring defect and integration overhead across teams."
        ],
        stack: ["React", "Node.js", "AWS", "TypeScript", "Design Systems"]
      }
    ]
  },
  {
    id: "pcrichard",
    company: "PC Richard and Son",
    division: "IT Department",
    title: "Software Engineer / Data Analyst",
    dates: "2016 – 2018",
    projects: [
      {
        projectName: "Scheduling and Search Optimization",
        projectDescription: "A customer-facing scheduling and analytics workflow for improving retention and operations visibility.",
        highlights: [
          "Built scheduling and customer-facing web applications (Node.js, PHP, React) that improved retention by 25% and cut manual effort by 2 hours.",
          "Grew client organic search performance 40–50% through front-end and back-end optimization.",
          "Led and mentored junior developers while improving day-to-day engineering quality."
        ],
        metrics: [
          { value: "25%", label: "Retention gain" },
          { value: "2 hrs", label: "Manual saved" },
          { value: "40–50%", label: "Search lift" },
          { value: "3", label: "Team mentors" }
        ],
        problem: "The business needed better customer-facing web tools and search visibility while reducing manual operational work and improving retention in a data-heavy environment.",
        approach: [
          "Built front-end and back-end tools that improved scheduling, customer experiences, and reporting.",
          "Optimized search and performance to make customer journeys faster and more visible.",
          "Mentored junior developers while improving process quality across the team."
        ],
        outcome: [
          "Improved retention and operational efficiency.",
          "Reduced manual effort and increased organic performance.",
          "Strengthened engineering quality and team capability."
        ],
        stack: ["Node.js", "PHP", "React", "MySQL", "Analytics"]
      }
    ]
  },
  {
    id: "reboot",
    company: "Reboot Computer Services",
    division: "Client Solutions",
    title: "Full-Stack Engineer",
    dates: "2010 – 2016",
    projects: [
      {
        projectName: "Client Delivery System",
        projectDescription: "Custom production systems designed for reliability, maintainability, and client-centered delivery.",
        highlights: [
          "Delivered full-stack solutions for client needs across frontend interfaces, backend logic, and data storage.",
          "Maintained and improved production systems with a focus on reliability and practical outcomes.",
          "Worked directly with clients to define requirements and deliver maintainable software solutions."
        ],
        metrics: [
          { value: "100%", label: "Client focus" },
          { value: "24/7", label: "Production support" },
          { value: "3+", label: "Business launches" },
          { value: "1:1", label: "Client alignment" }
        ],
        problem: "Clients needed practical, reliable software systems that could evolve with business needs without creating fragile or hard-to-maintain solutions.",
        approach: [
          "Worked closely with clients to translate requirements into maintainable architecture.",
          "Delivered full-stack systems balancing reliability, maintainability, and business practicality.",
          "Continued to support and improve production systems as needs evolved."
        ],
        outcome: [
          "Established durable, maintainable production systems for various client needs.",
          "Improved operational reliability and business continuity.",
          "Created long-term partnerships rooted in clear communication and dependable delivery."
        ],
        stack: ["JavaScript", "Node.js", "PHP", "SQL", "CSS", "Client Discovery"]
      }
    ]
  }
];

const PERSONAL_PROJECTS = [
  {
    id: "resume-site",
    title: "Resume / Portfolio Site",
    date: "2026 - Present",
    badge: "GitHub Repo",
    summary: "A Vite + React personal portfolio and resume site designed to be clean, fast, and easy to deploy to GitHub Pages.",
    tools: ["React", "Vite", "GitHub Pages", "CSS"],
    githubUrl: "https://github.com/teodortoni/resume",
    liveUrl: "https://teodortoni.github.io/resume/"
  },
  {
    id: "future-projects",
    title: "Upcoming Personal Projects",
    date: "Planned",
    badge: "GitHub",
    summary: "A placeholder project slot for future tools, experiments, or GitHub repositories I plan to publish as I continue building.",
    tools: ["React", "Node.js", "TypeScript", "AI"],
    githubUrl: "https://github.com/teodortoni",
    liveUrl: ""
  },
  {
    id: "placeholder-project-1",
    title: "Project Placeholder 1",
    date: "Planned",
    badge: "Coming Soon",
    summary: "A future GitHub project placeholder for a new app, internal tool, or prototype I plan to build and publish later.",
    tools: ["React", "TypeScript", "Node.js", "API"],
    githubUrl: "https://github.com/teodortoni",
    liveUrl: ""
  },
  {
    id: "placeholder-project-2",
    title: "Project Placeholder 2",
    date: "Planned",
    badge: "Coming Soon",
    summary: "This slot can be replaced with a personal repo, experiment, or product prototype when it is ready to be showcased.",
    tools: ["Next.js", "Tailwind", "PostgreSQL", "AI"],
    githubUrl: "https://github.com/teodortoni",
    liveUrl: ""
  }
];

function App() {
  const [activeExperienceId, setActiveExperienceId] = useState(EXPERIENCE_ITEMS[0].id);
  const activeExperience = useMemo(
    () => EXPERIENCE_ITEMS.find((item) => item.id === activeExperienceId) ?? EXPERIENCE_ITEMS[0],
    [activeExperienceId]
  );

  return (
    <div className="app-shell">
      <Header config={SITE_CONFIG} />
      <main id="main-content">
        <HeroSection config={SITE_CONFIG} />
        {/* <ResultsSection /> */}
        {/* <AboutSection /> */}
        <ExperienceSection
          items={EXPERIENCE_ITEMS}
          activeExperience={activeExperience}
          onSelectExperience={setActiveExperienceId}
        />
        <SkillsSection />
        {/* <BuildingSection /> */}
        {/* <ApproachSection /> */}
        <ProjectsSection items={PERSONAL_PROJECTS} />
        {/* <EducationSection /> */}
        <ContactSection config={SITE_CONFIG} />
      </main>
    </div>
  );
}

export default App;
