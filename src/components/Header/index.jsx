import { useMemo, useState } from "react";
import { Menu, MoonStar, SunMedium } from "lucide-react";

function ThemeIcon({ dark }) {
  if (dark) {
    return <SunMedium size={18} className="theme-toggle-icon" aria-hidden="true" />;
  }

  return <MoonStar size={18} className="theme-toggle-icon" aria-hidden="true" />;
}

function Header({ config, profile, isDarkMode, onToggleTheme }) {
  const [open, setOpen] = useState(false);
  const siteName = config.siteTitle || profile?.name || "Developer";

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
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <Menu size={16} className="menu-toggle-icon" aria-hidden="true" />
        </button>
        <nav id="site-nav" className={`site-nav ${open ? "is-open" : ""}`} aria-label="Main">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
          <button
            type="button"
            className={`theme-toggle ${isDarkMode ? "is-dark" : "is-light"}`}
            onClick={onToggleTheme}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span className="theme-toggle-track" aria-hidden="true">
              <span className="theme-toggle-thumb">
                <ThemeIcon dark={isDarkMode} />
              </span>
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
