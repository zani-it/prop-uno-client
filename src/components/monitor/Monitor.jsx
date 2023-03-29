import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

function Monitor() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [imageData, setImageData] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Set up the interval to capture and submit the image every 10 seconds
    const intervalId = setInterval(() => {
      handleImageCapture();
      handleSubmit({});
    }, 10000);

    // Capture and set the initial image data
    handleImageCapture();

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      console.log("navigator.mediaDevices.getUserMedia is not supported");
    }
  }, []);

  function handleNameChange(event) {
    setName(event.target.value);
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handleImageCapture() {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const video = videoRef.current;

    // draw the video frame onto the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // get the base64-encoded image data from the canvas
    const imageData = canvas.toDataURL();
    setImageData(imageData);
  }

  function handleSubmit(event) {
    // generate UUID and image name
    const uuid = uuidv4();
    const imageName = `${uuid}-${name}.png`;

    // create post data
    const postData = {
      api_key: 'd45fd466-51e2-4701-8da8-04351c872236',
      file_base64: imageData.split(',')[1], 
      detection_flags: 'bestface,basicpoints,propoints,classifiers,content',
      recognize_targets: [`all@mynamespace`],
      detection_min_score: (70),
      original_filename: imageName,
    };

    // send post request
    axios.post('http://betafaceapi.com/api/v2/media', postData)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* <label>
        Name:
        <input type="text" value={name} onChange={handleNameChange} />
      </label>
      <br />
      <label>
        Email:
        <input type="email" value={email} onChange={handleEmailChange} />
      </label> */}
      <br />
      <video id="webcam" width="300" height="300" autoPlay ref={videoRef}></video>
      <canvas id="webcam-canvas" width="300" height="220" ref={canvasRef}></canvas>
      <br />
    
    </form>
  );
}

export default Monitor;
