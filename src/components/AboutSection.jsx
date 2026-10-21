import "./AboutSection.css";

function AboutSection() {
  return (
    <section id="about" className="section" aria-labelledby="about-heading">
      <div className="container">
        <h2 id="about-heading" className="section-heading">About</h2>
        <p>
          I’ve spent the last 14 years building production software, with most of my work centered on backend systems, API
          design, and full-stack delivery. I’m at my best when the problem is technical and practical: improve reliability,
          speed up a release pipeline, or make a system easier to operate.
        </p>
        <p>
          I work comfortably across Node.js services, React applications, AWS infrastructure, and data layers. I care about
          measurable outcomes, clean architecture, and helping teams move faster through strong code review, clear technical
          documentation, and mentoring.
        </p>
      </div>
    </section>
  );
}

export default AboutSection;
