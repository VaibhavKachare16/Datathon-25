<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Map from './components/Map';
=======
import { useState } from 'react'
import Map from './components/Map'
import TestBackend from './components/TestBackend'
>>>>>>> e00224b269bc87edfc3a22518163b2748a7030f8
import './App.css'

function App() {
  return (
<<<<<<< HEAD
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/map" element={<Map />} />
      </Routes>
    </Router>
  );
=======
    <>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <Map />
        <TestBackend />
      </div>
    </>
  )
>>>>>>> e00224b269bc87edfc3a22518163b2748a7030f8
}

export default App;
