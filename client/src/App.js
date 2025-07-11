import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homescreen from './screens/Homescreen';
import Bookingscreen from './screens/Bookingscreen';
import BookingSuccess from './screens/BookingSuccess';
import Register from './screens/Register';
import Login from './screens/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homescreen />} />
          <Route path="/home" element={<Homescreen />} />
          <Route path="/booking/:roomid" element={
            <ProtectedRoute>
              <Bookingscreen />
            </ProtectedRoute>
          } />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* Add more routes here as needed */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
