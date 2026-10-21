import "./HeroSection.css";

function HeroSection({ config }) {
  return (
    <section id="home" className="hero section">
      <div className="container">
        <h1 className="hero-heading">Teodor Toni</h1>
        <p className="kicker">Senior Full-Stack Software Engineer</p>
        <p className="stack">TypeScript · React · Node.js · AWS · AI-Assisted Development</p>
        <p className="headline">Building reliable backend systems, APIs, and production web applications.</p>
        <p className="supporting">
          Senior Full-Stack Software Engineer with {config.yearsOfExperience} years of experience building and scaling production software, with a
          strong focus on backend engineering, APIs, AWS, and end-to-end product delivery.
        </p>
        <div className="hero-actions">
          <a className="btn" href={config.github} target="_blank" rel="noopener">
            GitHub
          </a>
          <a className="btn" href={config.linkedin} target="_blank" rel="noopener">
            LinkedIn
          </a>
          <a className="btn" href={config.resumePath} target="_blank" rel="noopener">
            Download Resume
          </a>
        </div>
        <p className="meta">Venice, FL · Remote US</p>
        <p className="meta">Authorized to work in the US · No sponsorship required</p>
      </div>
    </section>
  );
}

export default HeroSection;
