import React, { useEffect } from 'react';
import * as faceapi from 'face-api.js';
const MODEL_URL = '/models'

function Camera(props) {

  useEffect(() => {
    if (props.login) {
      Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
      ]).then(start)
    }
  }, [props.login])

  async function start() {
    var video = document.querySelector('#video');
    const labeledFaceDescriptors = await loadLabeledImages()
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)

    const output = document.querySelector('.output');
    output.innerHTML = '';

    navigator.getUserMedia(
      { video: {} },
      stream => video.srcObject = stream,
      err => console.error(err)
    )
    let iterator = 0;
    video.addEventListener('play', recognizeFace)

    async function recognizeFace() {
      const canvas = faceapi.createCanvasFromMedia(video)
      document.body.append(canvas)
      const displaySize = { width: video.width, height: video.height }
      faceapi.matchDimensions(canvas, displaySize)
      var myInterval = setInterval(async () => {

        if (iterator > 10) {
          output.innerHTML = 'Wybacz ale nie mogę Cię rozpoznać';
          clearInterval(myInterval);
          video.removeEventListener('play', recognizeFace);
          props.loginOff();
        }

        const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
        results.forEach((result, i) => {
          iterator++;
          if (!result.toString().includes('unknown')) {
            props.loginOff();
            props.faceRecognized(result.toString());
            clearInterval(myInterval);
            video.removeEventListener('play', recognizeFace);
          }
        })
      }, 500)
    }
  }

  function loadLabeledImages() {
    const output = document.querySelector('.output');
    output.innerHTML = 'Ładowanie...';
    const links = props.users.map((user) => user.photo)
    const labels = props.users.map((user) => user._id)
    return Promise.all(
      links.map(async (link, index) => {
        const descriptions = []
        const img = await faceapi.fetchImage(link)
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        descriptions.push(detections.descriptor)
        return new faceapi.LabeledFaceDescriptors(labels[index], descriptions)
      })
    )
  }

  return (
    <div className="camera__container">
      <video id="video" width="720" height="560" autoPlay muted></video>
    </div>
  );
}

export default Camera;
