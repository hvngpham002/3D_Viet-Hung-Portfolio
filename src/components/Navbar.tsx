/* eslint-disable @typescript-eslint/naming-convention */
import { NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const Navbar = () => {
  const { t } = useTranslation();
  const logoText = "VHP";
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="header fixed top-0 left-0 right-0 flex items-center justify-between p-4 z-50">
      <NavLink
        to="/"
        className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 items-center justify-center flex font-bold shadow-md"
      >
        <p className="blue-gradient_text dark:text-white">{logoText}</p>
      </NavLink>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex text-xl gap-7 font-medium">
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? 'text-blue-500' : 'text-black dark:text-white'
          }
        >
          {t('About')}
        </NavLink>
        <NavLink
          to="/projects"
          className={({ isActive }) =>
            isActive ? 'text-blue-500' : 'text-black dark:text-white'
          }
        >
          {t('Projects')}
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            isActive ? 'text-blue-500' : 'text-black dark:text-white'
          }
        >
          {t('Contact')}
        </NavLink>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={`${
          isOpen ? 'flex' : 'hidden'
        } lg:hidden fixed top-20 right-4 w-48 bg-gray-100/95 dark:bg-gray-800/95 rounded-lg p-4 flex-col gap-4 shadow-xl z-50 border border-gray-200 dark:border-gray-700`}
      >
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `${isActive ? 'text-blue-500' : 'text-black dark:text-white'} p-2 rounded-lg transition-colors`
          }
          onClick={() => setIsOpen(false)}
        >
          {t('About')}
        </NavLink>
        <NavLink
          to="/projects"
          className={({ isActive }) =>
            `${isActive ? 'text-blue-500' : 'text-black dark:text-white'} p-2 rounded-lg transition-colors`
          }
          onClick={() => setIsOpen(false)}
        >
          {t('Projects')}
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `${isActive ? 'text-blue-500' : 'text-black dark:text-white'} p-2 rounded-lg transition-colors`
          }
          onClick={() => setIsOpen(false)}
        >
          {t('Contact')}
        </NavLink>
      </div>

      <nav className="flex items-center gap-3">
        <ThemeToggle />
        <LanguageToggle />
        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="lg:hidden text-black dark:text-white focus:outline-none shadow-lg rounded-full p-2 bg-gray-200 dark:bg-gray-700"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
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
