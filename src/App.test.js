import React from 'react';
import App from './App';
import { act } from 'react-dom/test-utils';
import { unmountComponentAtNode, render } from 'react-dom';

const mediaStream = {
  getVideoTracks: () => [{
    stop: () => { }
  }]
};

let resolve;
let reject;
jest.mock('./resizable-video/ResizableVideo', () => (props) => <video className='mock'></video>);

let container = null;
beforeEach(() => {
  container = document.createElement('div'); 
  document.body.appendChild(container);

  Object.defineProperty(window.navigator, 'mediaDevices', {
    writable: true,
    configurable: true,
    value: {
      getUserMedia: jest.fn((constraints) => new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      }))
    }
  });
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test('render starts with Loading... text', () => {
  act(() => {
    render(<App />, container)
  });
  expect(container.textContent).toContain('Loading...');
});

test('renders ResizableVideo when webcam loads', async () => {
  act(() => {
    render(<App />, container);
  });
  await act(async () => {
    resolve(mediaStream);
  });
  
  expect(container.querySelector('.mock')).toBeTruthy();
});

test('renders Error message when webcam is unavailable', async () => {
  delete window.navigator.mediaDevices;
  await act(async () => {
    render(<App />, container);
  });
  expect(container.textContent).toContain('Cannot access webcam. Are you running out of localhost or without https?');
});

test('renders Error message when webcam fails loading', async () => {
  const message = 'Oh snap!';
  act(() => {
    render(<App />, container);
  });
  await act(async () => {
    reject({message});
  });
  
  expect(container.textContent).toContain(message);
});
