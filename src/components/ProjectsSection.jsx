import "./ProjectsSection.css";

function ProjectsSection() {
  return (
    <section id="projects" className="section" aria-labelledby="projects-heading">
      <div className="container">
        <h2 id="projects-heading" className="section-heading">Selected Projects</h2>
        <div className="projects-grid">
          <article className="project-card">
            <h3>Tax Preparation Platform for Small Landlords</h3>
            <p>Multi-tenant tax reporting platform focused on reducing manual landlord tax-prep workflows.</p>
            <p className="mono">React · TypeScript · Node.js · NestJS · PostgreSQL</p>
            <div className="project-links">
              <a href="#" aria-disabled="true">
                GitHub (TODO)
              </a>
              <a href="#" aria-disabled="true">
                Live Demo (TODO)
              </a>
            </div>
          </article>
          <article className="project-card">
            <h3>Project Placeholder</h3>
            <p>Add an additional project with metrics and links.</p>
            <p className="mono">Technology stack</p>
            <div className="project-links">
              <a href="#" aria-disabled="true">
                GitHub (TODO)
              </a>
              <a href="#" aria-disabled="true">
                Live Demo (TODO)
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default ProjectsSection;
