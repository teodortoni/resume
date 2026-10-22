import { useMemo, useState } from "react";

function Header({ config }) {
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
        </nav>
      </div>
    </header>
  );
}

export default Header;
