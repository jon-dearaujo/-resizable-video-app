import React from 'react';
import './App.css';
import ResizableVideo from './resizable-video/ResizableVideo';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {stream: null, error: null}
  }
  
  componentDidMount() {
    const {mediaDevices} = window.navigator;
    if (!mediaDevices) {
      this.setState({error: 'Cannot access webcam. Are you running out of localhost or without https?'});
    } else {
      mediaDevices.getUserMedia(this.videoConstraints())
        .then(s => {
          this.setState({stream: s});
        })
        .catch(e => this.setState({error: e.message}));
    }
  }

  componentWillUnmount() {
    if (this.state.stream) {
      this.state.stream.getVideoTracks().forEach(vt => vt.stop());
    }
  }
  
  render = () => {
    const textContent = this.state.error ? this.state.error : 'Loading...';
    const videoErrorOrLoadingContent = this.state.stream ?
     <ResizableVideo srcObject={this.state.stream} containerClassName="App-video"/>
     : <span className="App-feedbackMessage">{textContent}</span>
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

  // Min 480p - Max 1080p
  videoConstraints = () => ({
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
}
