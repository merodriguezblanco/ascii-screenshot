'use strict';

(function () {

  // Use getUserMedia for accessing video camera.
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

  // Check if browser supports WebRTC.
  if (!navigator.getUserMedia || !window.URL) {
    var warningSection = document.querySelector('#warning-section');
    warningSection.innerHTML('getUserMedia is not supported in your browser!');

    return;
  }

  var grayContainer = document.querySelector('#grayscale-screenshot'),
      colorContainer = document.querySelector('#color-screenshot'),
      screenshotButton = document.querySelector('#take-screenshot'),
      video = document.querySelector('video'),
      canvas = document.createElement('canvas'),
      context = canvas.getContext('2d');

  var drawScreenshotOnCanvas = function (canvas) {
    canvas.setAttribute('width', 200);
    canvas.setAttribute('height', 100);
    context.drawImage(video, 0, 0, video.width, video.height);
  }

  var cameraOptions = {
    video: true,
    audio: false
  };

  // Start getting media from camera.
  navigator.getUserMedia(cameraOptions, function (stream) {
    video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;

    screenshotButton.addEventListener('click', function (event) {
      console.log('click');

      drawScreenshotOnCanvas(grayContainer);
      drawScreenshotOnCanvas(colorContainer);
    }, false)
  }, function (error) {
    console.log('ERROR: ', error);
  }, false);

  video.play();

}());
