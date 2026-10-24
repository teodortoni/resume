import { useEffect, useState } from "react";

function ExperienceSection({ items, activeExperience, onSelectExperience }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);

  useEffect(() => {
    setSelectedProjectIndex(0);
  }, [activeExperience.id]);

  const projectOptions = activeExperience.projects && activeExperience.projects.length > 0
    ? activeExperience.projects
    : [{
        projectName: activeExperience.projectName || activeExperience.division || activeExperience.company,
        projectDescription: activeExperience.projectDescription || activeExperience.title,
        highlights: activeExperience.highlights || [],
        metrics: activeExperience.metrics || [],
        problem: activeExperience.problem || "No problem statement available.",
        approach: Array.isArray(activeExperience.approach)
          ? activeExperience.approach
          : [activeExperience.approach || "No approach detail available."],
        outcome: Array.isArray(activeExperience.outcome)
          ? activeExperience.outcome
          : [activeExperience.outcome || "No outcome detail available."],
        stack: activeExperience.tools || []
      }];

  const selectedProject = projectOptions[selectedProjectIndex] || projectOptions[0];
  const modalProjectName = selectedProject.projectName || activeExperience.company;
  const modalDescription = selectedProject.projectDescription || activeExperience.title;
  const metrics = selectedProject.metrics || [];
  const problem = selectedProject.problem || "No problem statement available.";
  const approachLines = Array.isArray(selectedProject.approach)
    ? selectedProject.approach
    : [selectedProject.approach || "No approach detail available."];
  const outcomeLines = Array.isArray(selectedProject.outcome)
    ? selectedProject.outcome
    : [selectedProject.outcome || "No outcome detail available."];
  const summaryText = selectedProject.highlights && selectedProject.highlights[0] ? selectedProject.highlights[0] : "";
  const stackTools = selectedProject.stack || activeExperience.tools || [];

  return (
    <section id="experience" className="section" aria-labelledby="experience-heading">
      <div className="container">
        <div className="section-heading-block">
          <span className="section-heading-label">Selected work</span>
          <h2 id="experience-heading" className="section-heading">Experience</h2>
        </div>

        <div className="experience-layout">
          <ol className="timeline">
            {items.map((item) => {
              const isActive = item.id === activeExperience.id;
              return (
                <li key={item.id} className={`timeline-entry ${isActive ? "is-active" : ""}`}>
                  <button className={`timeline-item ${isActive ? "is-active" : ""}`} type="button" onClick={() => onSelectExperience(item.id)}>
                    <span className="timeline-item-main">
                      <span className="timeline-item-company-row">
                        <span className="timeline-item-company">{item.company}</span>
                        <span className="timeline-item-division"> — {item.division}</span>
                      </span>
                      <span className="timeline-item-title">{item.title}</span>
                    </span>
                    <span className="timeline-item-dates">{item.dates}</span>
                  </button>
                </li>
              );
            })}
          </ol>

          <article className="experience-card" key={activeExperience.id}>
            <header className="experience-card-header">
              <span className="experience-card-date">{activeExperience.dates}</span>
              <span className="experience-card-role-badge">{activeExperience.title}</span>
            </header>

            <div className="experience-card-body">
              <h3 className="experience-card-title">{modalProjectName}</h3>
              <p className="experience-card-summary">{summaryText}</p>
              <div className="experience-card-tools">
                {stackTools.map((tool) => (
                  <span key={tool} className="tool-pill">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <footer className="experience-card-footer">
              <button type="button" className="view-details-button" onClick={() => setIsModalOpen(true)}>
                View Details <span aria-hidden="true">↗</span>
              </button>
            </footer>
          </article>
        </div>
      </div>

      {isModalOpen && (
        <div className="experience-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="experience-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="experience-modal-title" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="experience-modal-close" aria-label="Close experience details" onClick={() => setIsModalOpen(false)}>
              ×
            </button>
            <header className="experience-modal-header">
              <div className="experience-modal-meta-line">
                <span className="experience-modal-company">{activeExperience.company}</span>
                <span className="experience-modal-separator">/</span>
                <span className="experience-modal-role">{activeExperience.title}</span>
                <span className="experience-modal-separator">/</span>
                <span>{activeExperience.dates}</span>
              </div>
              <h3 id="experience-modal-title" className="experience-modal-project">
                {modalProjectName}
              </h3>
              <p className="experience-modal-description">{modalDescription}</p>

              {projectOptions.length > 1 && (
                <div className="experience-project-switcher" aria-label="Project selector">
                  {projectOptions.map((project, index) => (
                    <button
                      key={project.projectName || `project-${index}`}
                      type="button"
                      className={`experience-project-tab ${index === selectedProjectIndex ? "is-active" : ""}`}
                      onClick={() => setSelectedProjectIndex(index)}
                    >
                      {project.projectName || `Project ${index + 1}`}
                    </button>
                  ))}
                </div>
              )}
            </header>

            <div className="experience-modal-body">
              <section className="experience-modal-section">
                <h4 className="experience-modal-section-title">Highlights</h4>
                <div className="experience-metrics-grid">
                  {metrics.slice(0, 4).map((metric) => (
                    <div key={`${metric.value}-${metric.label}`} className="experience-metric">
                      <div className="experience-metric-value">{metric.value}</div>
                      <div className="experience-metric-label">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="experience-modal-section">
                <h4 className="experience-modal-section-title">Problem</h4>
                <p>{problem}</p>
              </section>

              <section className="experience-modal-section">
                <h4 className="experience-modal-section-title">Approach</h4>
                <ul className="experience-modal-list experience-modal-list--approach">
                  {approachLines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </section>

              <section className="experience-modal-section">
                <h4 className="experience-modal-section-title">Outcome</h4>
                <ul className="experience-modal-list experience-modal-list--outcome">
                  {outcomeLines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </section>

              <section className="experience-modal-section">
                <h4 className="experience-modal-section-title">Stack</h4>
                <div className="experience-stack-row">
                  {(stackTools.length > 0 ? stackTools : ["Portfolio", "Engineering", "Product"]).map((tool) => (
                    <span key={tool} className="tool-pill">
                      {tool}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ExperienceSection;
