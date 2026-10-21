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
import Footer from "./components/Footer";
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
    id: "wwe-senior",
    company: "WWE",
    division: "Video Management Systems Division",
    title: "Senior Software Engineer",
    dates: "September 2020 – January 2025",
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
    tools: ["Node.js", "NestJS", "AWS", "Docker", "Datadog", "CI/CD", "PostgreSQL", "TypeScript"]
  },
  {
    id: "wwe-fullstack",
    company: "WWE",
    division: "Digital Product Engineering",
    title: "Software Engineer (Full Stack)",
    dates: "December 2018 – September 2020",
    highlights: [
      "Built and shipped product features across React, Node.js, and AWS services.",
      "Created a reusable React component library adopted across 4+ products.",
      "Improved product usability by 50% through UX and component architecture improvements.",
      "Reduced integration errors by 50% across internal system integrations."
    ],
    tools: ["React", "Node.js", "AWS", "TypeScript", "Design Systems"]
  },
  {
    id: "pcrichard",
    company: "PC Richard and Son",
    division: "Business Intelligence & Analytics",
    title: "Software Engineer / Data Analyst",
    dates: "2016 – 2018",
    highlights: [
      "Built scheduling and customer-facing web applications (Node.js, PHP, React) that improved retention by 25% and cut manual effort by 2 hours.",
      "Grew client organic search performance 40–50% through front-end and back-end optimization.",
      "Led and mentored junior developers while improving day-to-day engineering quality."
    ],
    tools: ["Node.js", "PHP", "React", "MySQL", "Analytics"]
  },
  {
    id: "reboot",
    company: "Reboot Computer Services",
    division: "Client Solutions",
    title: "Full-Stack Engineer",
    dates: "2010 – 2016",
    highlights: [
      "Delivered full-stack solutions for client needs across frontend interfaces, backend logic, and data storage.",
      "Maintained and improved production systems with a focus on reliability and practical outcomes.",
      "Worked directly with clients to define requirements and deliver maintainable software solutions."
    ],
    tools: ["JavaScript", "Node.js", "PHP", "SQL", "CSS", "Client Discovery"]
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
        <BuildingSection />
        <ApproachSection />
        <ProjectsSection />
        <EducationSection />
        <ContactSection config={SITE_CONFIG} />
      </main>
      <Footer config={SITE_CONFIG} />
    </div>
  );
}

export default App;
