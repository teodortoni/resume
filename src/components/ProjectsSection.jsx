import { useRef } from "react";
import "./ProjectsSection.css";

function ProjectsSection({ items = [] }) {
  const trackRef = useRef(null);

  const scrollProjects = (direction) => {
    const track = trackRef.current;
    if (!track) return;

    const firstCard = track.querySelector(".project-card");
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width + 16 : 360;
    track.scrollBy({
      left: direction === "next" ? cardWidth : -cardWidth,
      behavior: "smooth"
    });
  };

  return (
    <section id="projects" className="section" aria-labelledby="projects-heading">
      <div className="container">
        <div className="projects-header-row">
          <h2 id="projects-heading" className="section-heading">Personal Projects</h2>

          {items.length > 1 && (
            <div className="projects-controls" aria-label="Project carousel controls">
              <button type="button" className="project-arrow" aria-label="Previous project" onClick={() => scrollProjects("prev")}>
                ←
              </button>
              <button type="button" className="project-arrow" aria-label="Next project" onClick={() => scrollProjects("next")}>
                →
              </button>
            </div>
          )}
        </div>

        <div className="projects-carousel">
          <div className="project-track" ref={trackRef}>
            {items.map((project) => (
              <article key={project.id} className="project-card experience-card">
                <header className="experience-card-header">
                  <span className="experience-card-date">{project.date}</span>
                  <span className="experience-card-role-badge">{project.badge}</span>
                </header>

                <div className="experience-card-body">
                  <h3 className="experience-card-title">{project.title}</h3>
                  <p className="experience-card-summary">{project.summary}</p>
                  <div className="experience-card-tools">
                    {project.tools.map((tool) => (
                      <span key={`${project.id}-${tool}`} className="tool-pill">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <footer className="experience-card-footer project-footer">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="project-link">
                      GitHub <span aria-hidden="true">↗</span>
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="project-link">
                      Demo <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </footer>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProjectsSection;
