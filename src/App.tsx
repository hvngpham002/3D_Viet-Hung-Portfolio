import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

const App = () => {
  return (
    <div>
      <main className='bg-slate-300/20'>
        <Router>
            <Routes>
                <Route path='/' element={'Home'}/>
                <Route path='/about' element={'About'}/>
                <Route path='/projects' element={'Projects'}/>
                <Route path='/contact' element={'Contact'}/>
            </Routes>
        </Router>
      </main>
    </div>
  )
}

export default App
