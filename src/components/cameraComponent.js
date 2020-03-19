import React from 'react';
import * as faceapi from 'face-api.js';
const MODEL_URL = '/models'


function Camera() {
  return (
    <div className="App">
      <video id="video" width="720" height="560" autoPlay muted></video>
      <button className="photo">take a photo</button>

    </div>
  );
}

Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
  faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
]).then(start)

async function start() {
  const labeledFaceDescriptors = await loadLabeledImages()
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
  console.log('Zaladowalem cos tam');
  var takePhotoButton = document.querySelector('.photo');
  var video = document.querySelector('#video');
  takePhotoButton.onclick = takePhoto;
  
  let image
  navigator.getUserMedia({ video: {} },
    (stream) => {
      video.srcObject = stream;
      image = video;
    },
    (err) => {
      console.error(err);
    }
  )
  async function takePhoto() {
    image = video
    if (image) image.remove()
    const displaySize = { width: image.width, height: image.height }
    const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
    results.forEach((result, i) => {
      console.log(result.toString());
    })

  }
}

function loadLabeledImages() {
  console.log('laduje zdjecia z neta');
  const links = ['https://firebasestorage.googleapis.com/v0/b/electron-mirror.appspot.com/o/images%2F777285?alt=media&token=2ebe8e7a-7c3d-46e1-8a00-a2dc012a94e6', 'https://firebasestorage.googleapis.com/v0/b/electron-mirror.appspot.com/o/images%2F149078?alt=media&token=83f99ac9-e4e5-4e51-89bd-83c8efe122a0', 'https://firebasestorage.googleapis.com/v0/b/electron-mirror.appspot.com/o/images%2F165319?alt=media&token=705bb421-aae5-46f7-a520-aaaae8812d66', 'https://firebasestorage.googleapis.com/v0/b/electron-mirror.appspot.com/o/images%2F649883?alt=media&token=69134330-9414-4b8b-a544-7f1325cfa352', 'https://firebasestorage.googleapis.com/v0/b/electron-mirror.appspot.com/o/images%2F293524?alt=media&token=597a8928-1292-4649-ada2-bf0ff8a943f4']
  const labels = ['777285', '149078', '165319', '649883', '293524']
  return Promise.all(
    links.map(async (link, index) => {
      const descriptions = []
      const img = await faceapi.fetchImage(link)
      const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
      descriptions.push(detections.descriptor)
      console.log('zaladowalem zdjecia z neta');
      return new faceapi.LabeledFaceDescriptors(labels[index], descriptions)
    })
  )
}

export default Camera;
