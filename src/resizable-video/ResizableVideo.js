import React from 'react';
import PropTypes from 'prop-types';
import './ResizableVideo.css';

export default class ResizableVideo extends React.Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
    this.containerRef = React.createRef();
  }
  render = () => {
    return <div ref={this.containerRef} className={`ResizableVideo-container ${this.props.containerClassName}`}>
      <video autoPlay playsInline muted ref={this.videoRef}>
      </video>
    </div>
  }
  
  componentDidMount() {
    this.setSrcToVideo();
    window.addEventListener('resize', this.calculateVideoWidth);
  } 

  componentWillUnmount() {
    window.removeEventListener('resize', this.calculateVideoWidth);
  } 

  componentDidUpdate() {
    this.setSrcToVideo();
  }

  setSrcToVideo = () => {
    if (!this.videoRef.current || (this.videoRef.current.src || this.videoRef.current.srcObject)) return;
    this.props.src ? this.videoRef.current.src = this.props.src : this.videoRef.current.srcObject = this.props.srcObject;

    this.videoRef.current.addEventListener('loadeddata', this.calculateVideoWidth);
  }

  calculateVideoWidth = (event) => {
    const videoClientWidth = this.videoRef.current.clientWidth;
    const containerClientWidth = this.containerRef.current.clientWidth;

    if (videoClientWidth <= this.videoRef.current.videoWidth) {
      this.videoRef.current.style.width = `${containerClientWidth}px`;
    } else {
      this.videoRef.current.style.width = '';
    }
  }
}


ResizableVideo.propTypes = {
  src: PropTypes.string,
  srcObject: PropTypes.instanceOf(window.MediaStream),
  containerClassName: PropTypes.string,
  customProp: (props, propName, componentName) => {
    const error = new Error(`Must provide one and only one of 'src' or 'srcObject'`);
    if (!props['src'] && !props['srcObject']) {
      return error;
    }
    
    if (propName === 'src' && props[propName] && props['srcObject']) {
      return error;
    }

    if (propName === 'srcObject' && props[propName] && props['src']) {
      return error;
    }
  }
}
