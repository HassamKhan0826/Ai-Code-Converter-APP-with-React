import { APP_NAME } from "../../config/app";
import { AccountButton } from "../AccountButton.jsx";
import { Logo } from "../Logo.jsx";

const NAV = [
  { href: "#/", path: "/", label: "Converter" },
  { href: "#/privacy", path: "/privacy", label: "Privacy" },
];

export function AppHeader({ currentPath }) {
  return (
    <header className="border-b border-ink-700/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-6">
          <a href="#/" className="flex items-center gap-2.5 rounded-md">
            <Logo />
            <span className="hidden font-semibold tracking-tight sm:inline">{APP_NAME}</span>
          </a>
          <nav aria-label="Main">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => {
                const active = currentPath === item.path;
                return (
                  <li key={item.path}>
                    <a
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`rounded-md px-2.5 py-1.5 text-sm sm:px-3 transition-colors ${
                        active ? "bg-ink-800 text-paper" : "text-mist hover:text-paper"
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
        <AccountButton />
      </div>
    </header>
  );
}
