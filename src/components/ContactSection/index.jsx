import { useState } from "react";
import { BriefcaseBusiness, Copy, GitBranch } from "lucide-react";

function ContactSection({ config, profile }) {
  const [status, setStatus] = useState("");
  const email = profile?.email || config.email || "";
  const github = profile?.socialLinks?.github || config.github || "#";
  const linkedin = profile?.socialLinks?.linkedin || config.linkedin || "#";

  async function handleCopyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("Email copied to clipboard.");
    } catch {
      setStatus("Unable to copy automatically. Please copy the email manually.");
    }
  }

  return (
    <section id="contact" className="contact-section" aria-labelledby="contact-heading">
      <div className="container contact-shell">
        <div className="section-heading-block section-heading-block--compact">
          <span className="section-heading-label">Start a conversation</span>
          <h2 id="contact-heading" className="section-heading contact-heading">Let&apos;s talk about software.</h2>
        </div>
        <p className="contact-intro">
          I’m always interested in good engineering problems, thoughtful teams, and opportunities to build systems that
          matter.
        </p>
        <p className="contact-email">
          {email ? <a href={`mailto:${email}`}>{email}</a> : <span>Contact unavailable</span>}
        </p>

        <div className="contact-actions">
          <a className="light-action" href={github} target="_blank" rel="noopener">
            <GitBranch size={18} aria-hidden="true" />
            <span>GitHub</span>
          </a>
          <a className="light-action" href={linkedin} target="_blank" rel="noopener">
            <BriefcaseBusiness size={18} aria-hidden="true" />
            <span>LinkedIn</span>
          </a>
          <button className="light-action" type="button" onClick={handleCopyEmail} disabled={!email}>
            <Copy size={18} aria-hidden="true" />
            <span>Copy Email</span>
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
