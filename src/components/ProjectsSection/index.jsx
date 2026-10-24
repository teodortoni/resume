import { useEffect, useMemo, useRef } from "react";

function ProjectsSection({ items = [] }) {
  const trackRef = useRef(null);
  const hasInfiniteLoop = items.length > 1;
  const renderedItems = useMemo(
    () => (hasInfiniteLoop ? [...items, ...items, ...items] : items),
    [hasInfiniteLoop, items]
  );

  const getCardSpan = (track) => {
    const firstCard = track.querySelector(".project-card");
    if (!firstCard) return 0;

    const computedTrackStyle = window.getComputedStyle(track);
    const gap = Number.parseFloat(computedTrackStyle.columnGap || computedTrackStyle.gap || "0") || 0;
    return firstCard.getBoundingClientRect().width + gap;
  };

  const normalizeTrackPosition = () => {
    const track = trackRef.current;
    if (!track || !hasInfiniteLoop) return;

    const cardSpan = getCardSpan(track);
    if (!cardSpan) return;

    const segmentWidth = cardSpan * items.length;
    const currentScrollLeft = track.scrollLeft;
    const offsetInSegment = ((currentScrollLeft - segmentWidth) % segmentWidth + segmentWidth) % segmentWidth;
    const centeredPosition = segmentWidth + offsetInSegment;

    if (Math.abs(centeredPosition - currentScrollLeft) > 1) {
      track.scrollTo({ left: centeredPosition, behavior: "auto" });
    }
  };

  const setCenterSegmentPosition = () => {
    const track = trackRef.current;
    if (!track || !hasInfiniteLoop) return;

    const cardSpan = getCardSpan(track);
    if (!cardSpan) return;

    track.scrollTo({
      left: cardSpan * items.length,
      behavior: "auto"
    });
  };

  useEffect(() => {
    if (!hasInfiniteLoop) return undefined;

    const syncPosition = () => setCenterSegmentPosition();
    const mountFrame = window.requestAnimationFrame(syncPosition);
    window.addEventListener("resize", syncPosition);

    return () => {
      window.cancelAnimationFrame(mountFrame);
      window.removeEventListener("resize", syncPosition);
    };
  }, [hasInfiniteLoop, items.length]);

  const scrollProjects = (direction) => {
    const track = trackRef.current;
    if (!track) return;

    const cardSpan = getCardSpan(track);
    if (!cardSpan) return;

    if (!hasInfiniteLoop) {
      track.scrollBy({
        left: direction === "next" ? cardSpan : -cardSpan,
        behavior: "smooth"
      });
      return;
    }

    normalizeTrackPosition();

    track.scrollBy({
      left: direction === "next" ? cardSpan : -cardSpan,
      behavior: "smooth"
    });
  };

  return (
    <section id="projects" className="section" aria-labelledby="projects-heading">
      <div className="container">
        <div className="projects-header-row">
          <div className="section-heading-block">
            <span className="section-heading-label">Built for curiosity</span>
            <h2 id="projects-heading" className="section-heading">Personal Projects</h2>
          </div>

          {hasInfiniteLoop && (
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
            {renderedItems.map((project, index) => (
              <article key={`${project.id}-${index}`} className="project-card experience-card">
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
