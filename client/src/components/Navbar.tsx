import { useState } from "react";
import { Link, NavLink } from "react-router";
import ShinyQuestLogo from "../assets/ShinyQuestLogo.svg";

const navLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/hunts", label: "Hunts" },
  { to: "/friends", label: "Friends" },
];

// Current page's link turns gold (same amber as the login tagline) and underlined
const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "text-amber-400 underline underline-offset-8" : "";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="relative flex items-center gap-12 px-6 lg:px-8 pt-8 pb-5 lg:py-6 bg-gray-900 border-b-2 border-gray-700">
      <Link to="/dashboard">
        <img src={ShinyQuestLogo} alt="Shiny Quest logo" className="h-16" />
      </Link>

      {/* Desktop: links sit inline next to the logo */}
      <div className="hidden lg:flex gap-8 text-2xl font-bold">
        {navLinks.map((link) => (
          <NavLink key={link.to} to={link.to} className={navLinkClass}>
            {link.label}
          </NavLink>
        ))}
      </div>

      {/* Mobile: hamburger button toggles the dropdown, swaps to an X while open */}
      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        className="lg:hidden ml-auto p-2"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        <svg className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" viewBox="0 0 24 24">
          {menuOpen ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {menuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 z-20 flex flex-col bg-gray-900 border-b-2 border-gray-700 text-2xl font-bold">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={(state) => `px-6 py-4 border-t border-gray-700 ${navLinkClass(state)}`}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}
