'use strict';

(function () {

  window.addEventListener('DOMContentLoaded', function (event) {
    // Use getUserMedia for accessing video camera.
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

    var warningSection = document.querySelector('.warning');

    // Check if browser supports WebRTC.
    if (!navigator.getUserMedia || !window.URL) {
      warningSection.innerHTML = '<p>navigator.getUserMedia is not supported in your browser!</p>';
      return;
    }

    var $screenshotButton = document.querySelector('.take-screenshot'),
        $grayContainer = document.querySelector('#grayscale-screenshot'),
        $colorContainer = document.querySelector('#color-screenshot'),
        $canvas = document.createElement('canvas'),
        $video = document.querySelector('video');

    $canvas.setAttribute('width', '200px');
    $canvas.setAttribute('height', '100px');

    var ScreenshotConverter = (function (canvas) {
      var context = canvas.getContext('2d'),
          ASCII_CHARS = '@#8&OLI)i=+;:,. '.split(''),
          ASCII_CHARS_LENGTH = ASCII_CHARS.length - 1;

      var CANVAS_WIDTH = canvas.width,
          CANVAS_HEIGHT = canvas.height;

      var createColorPixel = function (pixel, pixelColor) {
        var colorPixel = '<span style="color:rgb(' + pixelColor.red + ',' + pixelColor.green + ',' + pixelColor.blue + ')">' + pixel + '</span>';
        return colorPixel;
      }

      var convertToASCII = function () {
        // The canvas image data will behave as the Bitmap for the screenshot.
        var imageData = context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data,
            grayscaleASCIIScreenshot = '',
            colorASCIIScreenshot = '',
            pixelColor = {},
            pixelMatchingChar,
            x, y, offset, red, blue, green, pixel;

        // Loop through each pixel of the screenshot.
        for (y = 0; y < CANVAS_HEIGHT; y += 1) {
          for (x = 0; x < CANVAS_WIDTH; x += 1) {
            offset = (y * CANVAS_WIDTH + x) * 4;

            // Get grayscale color from screenshot.
            // The easiest way is to get the biggest of the RGB values
            // of each pixel and divide by 255.
            red = imageData[offset];
            green = imageData[offset + 1];
            blue = imageData[offset + 2];
            pixel = Math.max(red, green, blue) / 255;

            pixelColor = {
              red: red,
              green: green,
              blue: blue
            }

            // Select ASCII character that corresponds to pixel.
            pixelMatchingChar = ASCII_CHARS[parseInt(pixel * ASCII_CHARS_LENGTH, 10)];

            // Append grayscale and color character to image result.
            grayscaleASCIIScreenshot += pixelMatchingChar;
            colorASCIIScreenshot += createColorPixel(pixelMatchingChar, pixelColor);
          }

          grayscaleASCIIScreenshot += '\n';
          colorASCIIScreenshot += '\n';
        }

        return {
          grayscale: grayscaleASCIIScreenshot,
          color: colorASCIIScreenshot
        };
      }

      return {
        convertScreenshotToASCII: convertToASCII,
      }
    }($canvas));

    var cameraOptions = {
      video: true,
      audio: false
    };

    var drawScreenshots = function (event) {
      var context = $canvas.getContext('2d'),
          $screenshots = document.querySelector('.screenshots'),
          asciiScreenshot;

      context.drawImage($video, 0, 0, 200, 100);
      asciiScreenshot = ScreenshotConverter.convertScreenshotToASCII();

      $screenshots.classList.add('visible');
      $grayContainer.innerHTML = asciiScreenshot.grayscale;
      $colorContainer.innerHTML = asciiScreenshot.color;
    }

    // Start getting media from camera.
    navigator.getUserMedia(cameraOptions, function (stream) {
      $video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;

      $screenshotButton.addEventListener('click', drawScreenshots, false)
    }, function (error) {
      console.log(error);
      warningSection.innerHTML = '<p>ERROR: ' + error.name + '</p>';
    }, false);

    $video.play();
  }, false);

}());
