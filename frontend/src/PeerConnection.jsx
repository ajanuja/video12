import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io.connect('http://localhost:5000');  

const PeerConnection = ({ onStream }) => {
  const [peerConnection, setPeerConnection] = useState(null);

  useEffect(() => {
    const pc = new RTCPeerConnection();
    setPeerConnection(pc);

    socket.on('offer', async (payload) => {
      await pc.setRemoteDescription(new RTCSessionDescription(payload.offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit('answer', { answer, target: payload.callerId });
    });

    socket.on('answer', async (payload) => {
      await pc.setRemoteDescription(new RTCSessionDescription(payload.answer));
    });

    socket.on('ice-candidate', (payload) => {
      pc.addIceCandidate(new RTCIceCandidate(payload));
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', { candidate: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      onStream(event.streams[0]);
    };

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      onStream(stream);
    });

    return () => pc.close();
  }, [onStream]);

  return null;
};

export default PeerConnection;
