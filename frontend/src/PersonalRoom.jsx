import React, { useState } from 'react';
import { MdAdd } from "react-icons/md";
import VideoCall from './VideoCall';
import './PersonalRoom.css';
import './recordCompletedMeeting'
import './new.css'
import './Navbar.css'

const PersonalRoom = () => {
  const [roomCreated, setRoomCreated] = useState(false); 
  const [invitationLink, setInvitationLink] = useState(''); 

  
  const generateInvitationLink = () => {
    const roomId = Math.random().toString(36).substring(2, 15); 
    setInvitationLink(`${window.location.origin}/room/${roomId}`); 
    setRoomCreated(true); 
  };

  return (
    <div className='persroom'>
      <h5>Personal Meeting Room</h5>
      <p>Meeting ID: 12345</p>
      <p>Passcode: 6789</p>
      <button
        style={{ backgroundColor: 'rgb(65, 65, 122)', color: 'white' }}
        className="btn btn mx-2"
        onClick={() => setRoomCreated(true)} 
      >
        Start The Meeting
      </button>

      <button
        style={{ backgroundColor: 'rgb(65, 65, 122)', color: 'white' }}
        className="btn btn"
        onClick={generateInvitationLink}
      >
        Copy Invitation
      </button>

      <div>
        <button
          style={{ borderColor: 'black' }}
          className="btn btn mx-2 my-3"
          onClick={generateInvitationLink}
        >
          <MdAdd style={{ fontSize: '2rem', color: 'black' }} />
          Create a new room
        </button>
      </div>

      {roomCreated && invitationLink && (
        <div>
          <h6>Invitation Link:</h6>
          <a href={invitationLink} target="_blank" rel="noopener noreferrer">
            {invitationLink}
          </a>
        </div>
      )}

      {roomCreated && <VideoCall />}
    </div>
  );
};

export default PersonalRoom;
