/* eslint-disable @typescript-eslint/naming-convention */
import { NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t } = useTranslation();
  const logoText = "VHP";

  return (
    <header className="header flex items-center justify-between p-4 bg-gray-100">
      <NavLink
        to="/"
        className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 items-center justify-center flex font-bold shadow-md"
      >
        <p className="blue-gradient_text dark:text-white">{ logoText }</p>
      </NavLink>
      <nav className="flex text-xl gap-7 font-medium">
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
      <nav className="flex items-center gap-3">
        <ThemeToggle />
        <LanguageToggle />
      </nav>
    </header>
  );
};

export default Navbar;
