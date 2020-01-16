import React, { useState, useEffect } from 'react';
import './App.css';
import ResizableVideo from './resizable-video/ResizableVideo';

// Min 480p - Max 1080p
const videoConstraints = () => ({
  audio: false,
  video: {
    width: {
      min: 640,
      ideal: 1280,
      max: 1920
    },
    height: {
      min: 480,
      ideal: 720,
      max: 1080
    },
    facingMode: 'environment'
  }
});  

export default function App(_) {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const {mediaDevices} = window.navigator;
    if (!mediaDevices) {
      setError('Cannot access webcam. Are you running out of localhost or without https?');
    } else {
      mediaDevices.getUserMedia(videoConstraints())
        .then(s => {
          setStream(s);
        })
        .catch(e => setError(e.message));
    }

    return () => {
      if (stream) {
        stream.getVideoTracks().forEach(vt => vt.stop());
      }
    }
  });
  
  const textContent = error ? error : 'Loading...';
  const videoErrorOrLoadingContent = stream ?
   <ResizableVideo srcObject={stream} containerClassName="App-video"/>
   : <span className="App-feedbackMessage">{textContent}</span>;
  
  return (
    <div className="App">
      <ul className="App-side_menu">
        <li>Menu Item 1</li>
        <li>Menu Item 2</li>
        <li>Menu Item 3</li>
        <li>Menu Item 4</li>
        <li>Menu Item 5</li>
      </ul>
      
      {videoErrorOrLoadingContent}
    </div>
  );
}
