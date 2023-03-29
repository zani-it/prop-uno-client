import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

function MyForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imageData, setImageData] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((error) => {
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
    const context = canvas.getContext("2d");
    const video = videoRef.current;

    // draw the video frame onto the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // get the base64-encoded image data from the canvas
    const imageData = canvas.toDataURL();
    setImageData(imageData);
  }

  function handleSubmit(event) {
    event.preventDefault();
  
    // generate UUID and image name
    const uuid = uuidv4();
    const imageName = `${uuid}-${name}.png`;
  
    const apiKey = "Bo8n8rvUhlTJA2gApQEBJQ3up3MLj1kY";
    const apiSecret = "-wDOfiJz7FfFAzIQJiQzWOmgAHWInnhW";
  
    // make API request to detect face
    axios
      .post("http://localhost:3001/detect", {
        api_key: apiKey,
        api_secret: apiSecret,
        file_base64: imageData.split(",")[1],
        detection_flags: "basicpoints,propoints,classifiers,content",
        // set_person_id: 
        // recognize_targets
        // original_filename
      })
      .then((response) => {
        // handle success response
        console.log(response.data);
      })
      .catch((error) => {
        // handle error response
        console.error(error);
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" value={name} onChange={handleNameChange} />
      </label>
      <br />
      <label>
        Email:
        <input type="email" value={email} onChange={handleEmailChange} />
      </label>
      <br />
      <video
        id="webcam"
        width="300"
        height="300"
        autoPlay
        ref={videoRef}
      ></video>
      <canvas
        id="webcam-canvas"
        width="300"
        height="220"
        ref={canvasRef}
      ></canvas>
      <br />
      <button type="button" onClick={handleImageCapture}>
        Capture Image
      </button>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
}

export default MyForm;
