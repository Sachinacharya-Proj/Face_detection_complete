const imageUpload = document.getElementById('imageUpload');
const warnLite = document.getElementById("warn");
const chooseImage = document.getElementById('chooseImage');
const hiddenData = document.querySelectorAll('.hidden');
let labels = [];
hiddenData.forEach(items =>{
  labels.push(items.textContent);
})
chooseImage.addEventListener('click', ()=>{
  imageUpload.click()
  chooseImage.innerText = "LOADING";
})

Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(start)

async function start() {
  const container = document.createElement('div')
  container.style.position = 'relative'
  document.body.append(container)
  const labeledFaceDescriptors = await loadLabeledImages()
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
  let image
  let canvas
  warnLite.textContent = 'You can, now, upload Image';
  chooseImage.style.display = "block";
  imageUpload.addEventListener('change', async () => {
    if (image) image.remove()
    if (canvas) canvas.remove()
    if (imageUpload == null) chooseImage.innerText = 'CHOOSE IMAGE';
    warnLite.textContent = 'Result: (Still can upload Image)';
    chooseImage.innerText = 'CHOOSE IMAGE'
    image = await faceapi.bufferToImage(imageUpload.files[0])
    image.style.maxWidth = "80vw";
    image.style.maxHeight = "80vh";
    container.append(image)
    canvas = faceapi.createCanvasFromMedia(image)
    container.append(canvas)
    const displaySize = { width: image.width, height: image.height }
    faceapi.matchDimensions(canvas, displaySize)
    const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
    warnLite.textContent = "Results: "
    results.forEach((result, i) => {
      const box = resizedDetections[i].detection.box
      const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
      drawBox.options.boxColor = "red";
      drawBox.options.drawLabelOptions.backgroundColor = "rgba(0, 0, 0, 0.4)";
      drawBox.options.drawLabelOptions.fontStyle = 'sans-serif';
      drawBox.options.lineWidth = -2;
      drawBox.options.drawLabelOptions.padding = 5;
      // console.log(drawBox.options.lineWidth, drawBox.options.drawLabelOptions.padding)
      // console.log(drawBox.options)
      warnLite.textContent += `${drawBox.options.label}, `;
      drawBox.draw(canvas)
    })
  })
}

function loadLabeledImages() {
  // const labels = ['Black Widow', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jim Rhodes', 'Thor', 'Tony Stark']
  console.table(labels)
  return Promise.all(
    labels.map(async label => {
      const descriptions = []
      for (let i = 1; i <= 2; i++) {
        // const img = await faceapi.fetchImage(`../statics/labeled_images/${label}/${i}.jpg`);
        const img = await faceapi.fetchImage(`../labeled_images/${label}/${i}.jpg`);
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        descriptions.push(detections.descriptor)
      }

      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  )
}
