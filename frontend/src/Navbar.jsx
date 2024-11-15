import React from 'react';
import { BiSolidVideoRecording } from "react-icons/bi";
import { GoPersonFill } from "react-icons/go";
import { Link, Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar'; // Sidebar component
import Home from './Home'; // Home component
import Upcoming from './Upcoming'; // Upcoming component
import Previous from './Previous'; // Previous component
import Recording from './Recording'; // Recording component
import PersonalRoom from './PersonalRoom'; // PersonalRoom component
import Signup from './Signup'; // Signup component
import Login from './Login'; // Login component

import './Navbar.css'; // CSS file for styling

const Navbar = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo Section */}
          <a href="/" className="navbar-logo" >
            <BiSolidVideoRecording style={{ fontSize: '2.5rem', color: 'white' }} />
          </a>
          
          {/* Brand Name */}
          <a href="/" className="navbar-brand">
            Video Conferencing
          </a>

          {/* User Icon */}
          <Link to="/signup" className="navbar-icon" style={{marginLeft:'67vw'}}>
            <GoPersonFill style={{ fontSize: '2rem', color: 'white' }} />
          </Link>
        </div>
      </nav>

      {/* Sidebar and Main Content */}
      <div className="main-container">
        <Sidebar /> {/* Sidebar component */}
        <div className="content-container">
          {/* Routes for different components */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Upcoming" element={<Upcoming />} />
            <Route path="/Previous" element={<Previous />} />
            <Route path="/Recording" element={<Recording />} />
            <Route path="/PersonalRoom" element={<PersonalRoom />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Navbar;