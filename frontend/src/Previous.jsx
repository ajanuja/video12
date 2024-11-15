import React, { useEffect, useState } from 'react';
import { completedMeetings } from './firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import './previous.css';
import './Navbar.css'
const Previous = () => {
  const [meetings, setMeetings] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    
    const fetchMeetings = async () => {
      try {
        const meetingCollection = collection(completedMeetings, "completedMeetings");
        const meetingSnapshot = await getDocs(meetingCollection);
        const meetingList = meetingSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMeetings(meetingList);
      } catch (error) {
        setError('Failed to load meetings.');
        console.error(error); 
      } finally {
        setLoading(false); 
      }
    };

    fetchMeetings();
  }, []); 

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (error) {
    return <div>{error}</div>; 
  }

  return (
    <div className="previous">
      <div className="container my-5">
        <div className="previouscard">
          <h1>Meets</h1>
          <h1>Previous Meetings</h1>
          {meetings.length === 0 ? (
            <p>No meetings found.</p> 
          ) : (
            meetings.map((meeting) => (
              <div key={meeting.id} className="card my-4">
                <div className="card-body">
                  <img 
                    style={{ height: "6vh" }} 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP2OAyxEBlsBYTxBHtsyXV4TUNgvMaGgT7CA&s" 
                    alt="Meeting thumbnail" 
                  />
                  <h1 className="card-title">{meeting.title}</h1>
                  <p className="card-text">{meeting.description}</p>
                  <h1>Meets</h1>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Previous;
