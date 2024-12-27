/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';
import { Home, About, Projects, Contact } from './pages/index';

const App = () => {
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  return (
    <div className={themeMode === 'dark' ? 'dark' : ''}>
      <main className="bg-slate-300/20 dark:bg-slate-800">
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Router>
      </main>
    </div>
  );
};

export default App;
