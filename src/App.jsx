import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainScreen from './components/MainScreen';
import StatsScreen from './components/StatsScreen';

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/stats" element={<StatsScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
