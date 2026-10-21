import "./ExperienceSection.css";

function ExperienceSection({ items, activeExperience, onSelectExperience }) {
  return (
    <section id="experience" className="section" aria-labelledby="experience-heading">
      <div className="container">
        <h2 id="experience-heading" className="section-heading">Experience</h2>

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

        <article className="experience-modal" key={activeExperience.id}>
          <header className="experience-modal-header">
            <span className="experience-modal-date">{activeExperience.dates}</span>
            <span className="experience-modal-role">{activeExperience.title}</span>
          </header>

          <ul className="experience-modal-body">
            {activeExperience.highlights.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>

          <footer className="experience-modal-footer">
            {activeExperience.tools.map((tool) => (
              <span key={tool} className="tool-pill">
                {tool}
              </span>
            ))}
          </footer>
        </article>
      </div>
    </section>
  );
}

export default ExperienceSection;
