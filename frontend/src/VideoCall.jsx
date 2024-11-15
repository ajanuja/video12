import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const VideoCall = () => {
  const [name, setName] = useState('');
  const [users, setUsers] = useState({});
  const [isRegistered, setIsRegistered] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [currentCallTarget, setCurrentCallTarget] = useState(null);
  const [callRequest, setCallRequest] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const candidatesQueueRef = useRef([]); 

  useEffect(() => {
    const initLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideoRef.current.srcObject = stream;
        localStreamRef.current = stream;
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    };
    initLocalStream();

    socket.on('users', (updatedUsers) => {
      setUsers(updatedUsers);
    });

    socket.on('offer', async ({ offer, sender }) => {
      setCallRequest({ offer, sender });
    });

    socket.on('answer', async ({ answer }) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(answer);
        
        candidatesQueueRef.current.forEach(async (candidate) => {
          try {
            await peerConnectionRef.current.addIceCandidate(candidate);
            console.log('Candidate added after connection');
          } catch (error) {
            console.error('Error adding queued ICE candidate', error);
          }
        });
        candidatesQueueRef.current = []; 
      }
    });

    socket.on('candidate', async ({ candidate }) => {
      if (peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.addIceCandidate(candidate);
        } catch (error) {
          console.error('Error adding received ICE candidate', error);
        }
      } else {
        
        candidatesQueueRef.current.push(candidate);
        console.log('Candidate queued until peer connection is ready');
      }
    });

    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      socket.off('users');
      socket.off('offer');
      socket.off('answer');
      socket.off('candidate');
    };
  }, []);

  const registerUser = () => {
    if (name.trim()) {
      socket.emit('join', name);
      setIsRegistered(true);
    }
  };

  const startCall = async (targetSocketId) => {
    setCurrentCallTarget(targetSocketId);
    setIsInCall(true);

    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });
    peerConnectionRef.current = peerConnection;

    localStreamRef.current.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStreamRef.current);
    });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('candidate', { target: targetSocketId, candidate: event.candidate });
      }
    };

    peerConnection.ontrack = (event) => {
      
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    socket.emit('offer', { target: targetSocketId, offer });
  };

  const handleOfferResponse = async (response) => {
    if (response === 'accept') {
      const { offer, sender } = callRequest;

      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });
      peerConnectionRef.current = peerConnection;

      localStreamRef.current.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStreamRef.current);
      });

      await peerConnection.setRemoteDescription(offer);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      socket.emit('answer', { target: sender, answer });
      setIsInCall(true);

      peerConnection.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('candidate', { target: sender, candidate: event.candidate });
        }
      };

      candidatesQueueRef.current.forEach(async (candidate) => {
        try {
          await peerConnection.addIceCandidate(candidate);
          console.log('Candidate added after connection');
        } catch (error) {
          console.error('Error adding queued ICE candidate', error);
        }
      });

      candidatesQueueRef.current = [];
    }

    setCallRequest(null); 
  };

  const endCall = () => {
    if (peerConnectionRef.current) {
      const remoteStream = remoteVideoRef.current.srcObject;
      if (remoteStream) {
        remoteStream.getTracks().forEach((track) => track.stop());
        remoteVideoRef.current.srcObject = null;
      }

      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    setIsInCall(false);
    setCurrentCallTarget(null);
  };

  return (
    <div>
      <h2>Video Call</h2>
      {!isRegistered ? (
        <div>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={registerUser}>Join</button>
        </div>
      ) : (
        <div>
          <h3>Connected Users</h3>
          <ul>
            {Object.entries(users).map(([socketId, userName]) => (
              socketId !== socket.id && (
                <li key={socketId}>
                  {userName} <button onClick={() => startCall(socketId)}>📞</button>
                </li>
              )
            ))}
          </ul>
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px' }}>
        <video ref={localVideoRef} autoPlay muted style={{ width: '45%', height: '300px', backgroundColor: 'black' }}></video>
        <video ref={remoteVideoRef} autoPlay style={{ width: '45%', height: '300px', backgroundColor: 'black' }}></video>
      </div>

      
      {callRequest && (
        <div>
          <p>{users[callRequest.sender]} is calling you...</p>
          <button onClick={() => handleOfferResponse('accept')}>Accept</button>
          <button onClick={() => handleOfferResponse('decline')}>Decline</button>
        </div>
      )}

      {isInCall && (
        <button onClick={endCall} style={{ marginTop: '10px' }}>End Call</button>
      )}
    </div>
  );
};

export default VideoCall;
