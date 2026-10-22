
const DEFAULT_SKILLS = [
  {
    title: "Backend & APIs",
    items: ["Node.js", "NestJS", "TypeScript", "REST", "GraphQL", "API design", "Token-based authentication", "Microservices"]
  },
  {
    title: "Cloud & Distributed Systems",
    items: ["AWS", "EC2", "RDS", "SQS", "S3", "Lambda", "API Gateway", "ElastiCache", "Docker", "Datadog"]
  },
  {
    title: "Data",
    items: ["PostgreSQL", "MySQL", "NoSQL", "JSON Schema", "Query optimization", "Indexing"]
  },
  {
    title: "Frontend",
    items: ["React", "TypeScript", "Component architecture"]
  },
  {
    title: "Engineering",
    items: ["CI/CD", "Automated testing", "Code review", "System design", "Technical documentation", "Mentoring"]
  },
  {
    title: "AI Development",
    items: ["GitHub Copilot", "Agentic AI", "AI-assisted workflows", "AI application development"]
  }
];

function SkillsSection({ skills = DEFAULT_SKILLS }) {
  const skillGroups = skills?.length ? skills : DEFAULT_SKILLS;

  return (
    <section id="skills" className="section" aria-labelledby="skills-heading">
      <div className="container">
        <h2 id="skills-heading" className="section-heading">Skills</h2>
        <div className="skills-list">
          {skillGroups.map((group) => (
            <article key={group.title} className="skills-row">
              <h3 className="skills-core-name">{group.title}</h3>
              <ul className="skills-bubbles" aria-label={`${group.title} tools`}>
                {group.items.map((item) => (
                  <li key={item} className="skill-bubble">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SkillsSection;
