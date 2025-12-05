import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainScreen from './components/MainScreen';
import StatsScreen from './components/StatsScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/stats" element={<StatsScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
