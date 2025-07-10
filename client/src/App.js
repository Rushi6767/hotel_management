import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homescreen from './screens/Homescreen';
import Bookingscreen from './screens/Bookingscreen';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homescreen />} />
        <Route path="/home" element={<Homescreen />} />
        <Route path="/booking/:roomid" element={<Bookingscreen />} />
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  );
}

export default App;
