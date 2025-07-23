/* eslint-disable @typescript-eslint/naming-convention */
import { Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';
import Loader from './components/Loader';
import VersionMark from './components/VersionMark';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));

const App = () => {
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  return (
    <div className={themeMode === 'dark' ? 'dark' : ''}>
      <main className="bg-slate-300/50 dark:bg-slate-800">
        <Router>
          <Navbar />
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Suspense>
        </Router>

      {/* Version Mark */}
      <VersionMark />
      </main>
    </div>
  );
};

export default App;
