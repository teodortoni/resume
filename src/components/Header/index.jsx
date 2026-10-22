import { useMemo, useState } from "react";

function ThemeIcon({ dark }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="theme-toggle-icon">
      {dark ? (
        <path d="M12 2.75a.75.75 0 0 1 .75.75v1.2a.75.75 0 0 1-1.5 0V3.5a.75.75 0 0 1 .75-.75Zm0 15.5a.75.75 0 0 1 .75.75v1.2a.75.75 0 0 1-1.5 0v-1.2a.75.75 0 0 1 .75-.75ZM3.5 11.25a.75.75 0 0 1 .75-.75h1.2a.75.75 0 0 1 0 1.5H4.25a.75.75 0 0 1-.75-.75Zm14.5 0a.75.75 0 0 1 .75-.75h1.2a.75.75 0 0 1 0 1.5h-1.2a.75.75 0 0 1-.75-.75ZM6.2 6.2a.75.75 0 0 1 1.06 0l.85.85a.75.75 0 0 1-1.06 1.06l-.85-.85a.75.75 0 0 1 0-1.06Zm9.7 9.7a.75.75 0 0 1 1.06 0l.85.85a.75.75 0 1 1-1.06 1.06l-.85-.85a.75.75 0 0 1 0-1.06ZM6.2 17.8a.75.75 0 0 1 0-1.06l.85-.85a.75.75 0 0 1 1.06 1.06l-.85.85a.75.75 0 0 1-1.06 0Zm9.7-9.7a.75.75 0 0 1 0-1.06l.85-.85a.75.75 0 0 1 1.06 1.06l-.85.85a.75.75 0 0 1-1.06 0ZM12 7.25A4.75 4.75 0 1 1 12 16.75 4.75 4.75 0 0 1 12 7.25Z" fill="currentColor"/>
      ) : (
        <path d="M20.2 14.9A7.75 7.75 0 0 1 9.1 3.8a7.75 7.75 0 1 0 11.1 11.1Z" fill="currentColor"/>
      )}
    </svg>
  );
}

function Header({ config, isDarkMode, onToggleTheme }) {
  const [open, setOpen] = useState(false);
  const siteName = config.siteTitle || config.name || "Developer";

  const navItems = useMemo(() => {
    const items = [{ label: "Home", href: "#home" }];

    if (config.showExperience) items.push({ label: "Experience", href: "#experience" });
    if (config.showSkills) items.push({ label: "Skills", href: "#skills" });
    if (config.showProjects) items.push({ label: "Projects", href: "#projects" });

    items.push({ label: "Contact", href: "#contact" });
    return items;
  }, [config]);

  return (
    <header className="site-header">
      <div className="container nav-shell">
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </button>
        <nav id="site-nav" className={`site-nav ${open ? "is-open" : ""}`} aria-label="Main">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
          <button
            type="button"
            className={`theme-toggle ${isDarkMode ? "is-light" : "is-dark"}`}
            onClick={onToggleTheme}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <ThemeIcon dark={isDarkMode} />
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
