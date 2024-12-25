import React from 'react';
import { NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  return (
    <header className="header flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-900">
      <NavLink to="/" className="w-10 h-10 rounded-lg bg-white items-center justify-center flex font-bold shadow-md">
        <p className="blue-gradient_text">VHP</p>
      </NavLink>
      <nav>
        <ThemeToggle />
      </nav>
    </header>
  );
};

export default Navbar;
