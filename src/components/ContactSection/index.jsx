import { useState } from "react";

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 6.75A1.75 1.75 0 0 1 4.75 5h14.5A1.75 1.75 0 0 1 21 6.75v10.5A1.75 1.75 0 0 1 19.25 19H4.75A1.75 1.75 0 0 1 3 17.25V6.75Zm2.1-.25 6.9 5.38 6.9-5.38H5.1Zm13.15 11.5h-14.5a.25.25 0 0 1-.25-.25V7.65l7.1 5.54a.75.75 0 0 0 .9 0l7.1-5.54v9.6a.25.25 0 0 1-.25.25Z" fill="currentColor"/>
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.94 8.5A1.56 1.56 0 1 1 6.94 5.4a1.56 1.56 0 0 1 0 3.1ZM5.5 9.5h2.9v8.8H5.5V9.5Zm5.2 0h2.8v1.2h.04c.39-.74 1.35-1.52 2.78-1.52 2.97 0 3.52 1.95 3.52 4.48V18.3h-2.9v-16.7h2.9v2.08h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6V18.3h-2.9v-16.7h-2.9v1.8h-.04c-.4-.76-1.4-1.56-2.9-1.56-2.87 0-3.38 1.98-3.38 4.39V18.3H10.7V9.5Z" fill="currentColor"/>
    </svg>
  );
}

function IconGitHub() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 .75A11.25 11.25 0 0 0 8.58 22.4c.56.1.76-.24.76-.54v-1.93c-3.1.67-3.75-1.33-3.75-1.33-.5-1.3-1.24-1.65-1.24-1.65-.99-.68.07-.67.07-.67 1.1.08 1.68 1.14 1.68 1.14.97 1.66 2.55 1.18 3.17.9.1-.7.38-1.18.69-1.45-2.47-.28-5.08-1.24-5.08-5.5 0-1.21.42-2.2 1.12-2.97-.11-.28-.49-1.41.11-2.94 0 0 .92-.29 3.02 1.12a10.52 10.52 0 0 1 5.49 0c2.1-1.41 3.02-1.12 3.02-1.12.6 1.53.22 2.66.11 2.94.7.77 1.12 1.76 1.12 2.97 0 4.27-2.62 5.22-5.11 5.5.39.34.74 1.02.74 2.06v3.06c0 .3.2.65.77.54A11.25 11.25 0 0 0 12 .75Z" fill="currentColor"/>
    </svg>
  );
}

function IconCopy() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 3.75A2.75 2.75 0 0 0 6.25 6.5v9.75A2.75 2.75 0 0 0 9 19l.02-.03V6.5A2.75 2.75 0 0 0 9 3.75Zm5.5 2.75A2.75 2.75 0 0 0 12 5.5H9.8v12.48a1.75 1.75 0 0 1-1.75 1.75H6.25A2.75 2.75 0 0 1 3.5 17.02V6.5A2.75 2.75 0 0 1 6.25 3.75h5.75A2.75 2.75 0 0 1 14.75 6.5Zm4.75 3.75a2.75 2.75 0 0 1 2.75 2.75v8.25A2.75 2.75 0 0 1 17.5 24H9.75A2.75 2.75 0 0 1 7 21.25V18.5h7.75A2.75 2.75 0 0 0 17.5 15.75V6.5h.25A2.75 2.75 0 0 1 20.5 9.25Z" fill="currentColor"/>
    </svg>
  );
}

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
    <section id="contact" className="contact-section" aria-labelledby="contact-heading">
      <div className="container contact-shell">
        <p className="contact-kicker">Let&apos;s build something useful.</p>
        <h2 id="contact-heading" className="section-heading contact-heading">Let&apos;s talk about software.</h2>
        <p className="contact-intro">
          I’m always interested in good engineering problems, thoughtful teams, and opportunities to build systems that
          matter.
        </p>
        <p className="contact-email">
          <a href={`mailto:${config.email}`}>{config.email}</a>
        </p>

        <div className="contact-actions">
          <a className="light-action" href={config.github} target="_blank" rel="noopener">
            <IconGitHub />
            <span>GitHub</span>
          </a>
          <a className="light-action" href={config.linkedin} target="_blank" rel="noopener">
            <IconLinkedIn />
            <span>LinkedIn</span>
          </a>
          <button className="light-action" type="button" onClick={handleCopyEmail}>
            <IconCopy />
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
