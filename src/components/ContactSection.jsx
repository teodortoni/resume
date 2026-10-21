import { useState } from "react";
import "./ContactSection.css";

function ContactSection({ config }) {
  const [status, setStatus] = useState("");

  async function handleCopyEmail() {
    try {
      await navigator.clipboard.writeText(config.email);
      setStatus("Email copied to clipboard.");
    } catch {
      setStatus("Unable to copy automatically. Please copy the email manually.");
    }
  }

  return (
    <section id="contact" className="section" aria-labelledby="contact-heading">
      <div className="container">
        <h2 id="contact-heading" className="section-heading">Let&apos;s talk about software.</h2>
        <p>
          I’m always interested in good engineering problems, thoughtful teams, and opportunities to build systems that
          matter.
        </p>
        <p className="contact-email">
          <a href={`mailto:${config.email}`}>{config.email}</a>
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href={`mailto:${config.email}`}>
            Email
          </a>
          <a className="btn" href={config.linkedin} target="_blank" rel="noopener">
            LinkedIn
          </a>
          <a className="btn" href={config.github} target="_blank" rel="noopener">
            GitHub
          </a>
          <button className="btn" type="button" onClick={handleCopyEmail}>
            Copy Email
          </button>
        </div>
        <p className="copy-status" aria-live="polite">
          {status}
        </p>
      </div>
    </section>
  );
}

export default ContactSection;
