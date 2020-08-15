const video = document.getElementById('video')

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo);

function startVideo() {
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    const mydiv = document.querySelector(".video-panel")
    mydiv.appendChild(canvas)
    
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video,
        new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()
        .withFaceExpressions();
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)


        // if (resizedDetections.length > 0 && resizedDetections[0].detection.score > 0.7 && resizedDetections[0].expressions.happy > 0.5){
        //    // alert('happy')
        //     //or play a music or something
        //     const canvas = document.createElement('canvas');
        //     canvas.width = video.videoWidth;
        //     canvas.height = video.videoHeight;
        //     canvas.getContext('2d').drawImage(video, 0, 0);
        //     canvas.getContext('2d').drawImage(canvas, 0, 0);


        //     const img = document.createElement("img");
        //     img.src = canvas.toDataURL('image/webp');

        //     document.getElementById('screenshot').appendChild(img)
        // }
    }, 100 )
   
})

