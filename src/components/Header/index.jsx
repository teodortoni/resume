import { useMemo, useState } from "react";

function ThemeIcon({ dark }) {
  if (dark) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="theme-toggle-icon">
        <path d="M12 2.75a.75.75 0 0 1 .75.75v1.2a.75.75 0 0 1-1.5 0V3.5a.75.75 0 0 1 .75-.75Zm0 15.5a.75.75 0 0 1 .75.75v1.2a.75.75 0 0 1-1.5 0v-1.2a.75.75 0 0 1 .75-.75ZM3.5 11.25a.75.75 0 0 1 .75-.75h1.2a.75.75 0 0 1 0 1.5H4.25a.75.75 0 0 1-.75-.75Zm14.5 0a.75.75 0 0 1 .75-.75h1.2a.75.75 0 0 1 0 1.5h-1.2a.75.75 0 0 1-.75-.75ZM6.2 6.2a.75.75 0 0 1 1.06 0l.85.85a.75.75 0 0 1-1.06 1.06l-.85-.85a.75.75 0 0 1 0-1.06Zm9.7 9.7a.75.75 0 0 1 1.06 0l.85.85a.75.75 0 1 1-1.06 1.06l-.85-.85a.75.75 0 0 1 0-1.06ZM6.2 17.8a.75.75 0 0 1 0-1.06l.85-.85a.75.75 0 0 1 1.06 1.06l-.85.85a.75.75 0 0 1-1.06 0Zm9.7-9.7a.75.75 0 0 1 0-1.06l.85-.85a.75.75 0 0 1 1.06 1.06l-.85.85a.75.75 0 0 1-1.06 0ZM12 7.25A4.75 4.75 0 1 1 12 16.75 4.75 4.75 0 0 1 12 7.25Z" fill="currentColor"/>
      </svg>
    );
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon h-4 w-4">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
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
