import "./Footer.css";

function Footer({ config }) {
  return (
    <footer className="site-footer">
      <div className="container footer-shell">
        <p>© 2026 Teodor Toni</p>
        <div>
          <a href={config.github} target="_blank" rel="noopener">
            GitHub
          </a>
          <a href={config.linkedin} target="_blank" rel="noopener">
            LinkedIn
          </a>
          <a href={`mailto:${config.email}`}>Email</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
