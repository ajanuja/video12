import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'
const NewMeeting = () => {
  return (
    <div className="container my-5">
      <h1>Create a New Meeting</h1>

      <Link
      to="/PersonalRoom" 
        className="btnmeet"
      >
        Going to Personal Room
      </Link>
    </div>
  );
};

export default NewMeeting;
