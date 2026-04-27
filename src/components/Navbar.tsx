/* eslint-disable @typescript-eslint/naming-convention */
import { NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import ChatBot from "./ChatBot";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { reloadTranslations } from "../i18n";
import React from "react";

const Navbar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isTranslationsLoading, setIsTranslationsLoading] = useState(true);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    reloadTranslations().finally(() => setIsTranslationsLoading(false));
  }, []);

  const navItem = (to: string, label: string) => (
    <NavLink
      key={to}
      to={to}
      className={({ isActive }) =>
        `font-display text-lg md:text-xl ${
          isActive ? "italic scribble" : "not-italic"
        } text-ink-900 no-underline`
      }
      onClick={() => setIsOpen(false)}
    >
      {label}
    </NavLink>
  );

  const navLinks = [
    { to: "/about", label: t("About") },
    { to: "/projects", label: t("Projects") },
    { to: "/contact", label: t("Contact") },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex h-16 w-full items-center justify-between px-4 md:px-6"
      style={{
        background: "color-mix(in srgb, var(--paper-0) 85%, transparent)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid var(--rule-strong)",
      }}
    >
      <NavLink
        to="/"
        className="flex items-center gap-3 no-underline"
        aria-label="Home"
      >
        <img
          src="/logo.png"
          alt=""
          aria-hidden="true"
          draggable={false}
          className="h-[38px] w-[38px] object-contain"
        />
        <span className="hidden flex-col leading-none sm:flex">
          <span className="font-display text-lg text-ink-900">Pham Viet Hung</span>
          <span className="t-eyebrow" style={{ fontSize: 9 }}>
            Engineer · Wanderer
          </span>
        </span>
      </NavLink>

      <nav className="hidden items-center gap-8 lg:flex">
        {isTranslationsLoading ? (
          <div className="loading-bar h-6 w-60 rounded-sm" />
        ) : (
          <React.Fragment>
            {navLinks.map(({ to, label }) => navItem(to, label))}
          </React.Fragment>
        )}
      </nav>

      <div
        className={`${isOpen ? "flex" : "hidden"} fixed right-4 top-20 z-50 w-52 flex-col lg:hidden`}
        style={{
          background: "var(--paper-1)",
          border: "1px solid var(--rule-strong)",
          boxShadow: "var(--shadow-card)",
          padding: 8,
        }}
      >
        {navLinks.map(({ to, label }, index) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `px-4 py-2.5 font-display text-lg italic no-underline ${
                isActive ? "text-accent" : "text-ink-900"
              }`
            }
            style={{
              borderBottom: index < navLinks.length - 1 ? "1px dotted var(--rule)" : "none",
            }}
            onClick={() => setIsOpen(false)}
          >
            {label}
          </NavLink>
        ))}
      </div>

      <nav className="flex items-center gap-2">
        <ChatBot />
        <ThemeToggle />
        <LanguageToggle />
        <button
          type="button"
          onClick={toggleMenu}
          className="grid place-items-center lg:hidden"
          aria-label="Toggle menu"
          style={{
            width: 36,
            height: 36,
            borderRadius: 2,
            background: "var(--paper-1)",
            border: "1px solid var(--rule-strong)",
            color: "var(--ink-900)",
            boxShadow: "var(--shadow-press)",
          }}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
