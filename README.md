Proof of concept to create a simple strategy to resize a HTML video based on the available viewport.

Using React (but could be achieved with any other modern ui framework/library or even vanilla js) the
ResizableVideo component listens to window.resize event and update the inner <video> element's css width,
ensuring a natural almost perfect resize persisting the aspect ratio.
App component uses a Webcam (getUserMedia) to provide the video source, but any url could be given to
ResizableComponent.

The POC was suspended while validating the behavior on a mobile device.

