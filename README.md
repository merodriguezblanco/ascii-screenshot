# ASCII Screenshot

The main idea of this this page is to take advantage of the [`navigator.getUserMedia`](http://www.w3.org/TR/mediacapture-streams/)
provided by [WebRTC](http://www.w3.org/TR/webrtc/) to take a photo and create an ASCII image
representation of it.

You just have to take a photo of yourself using your computer's camera and see the result being
displayed on a grayscale and color ASCII representation.

The character set that I chose is `#@%OHLTI)i=+;:,. `. But you can
try changing these constants in the code to output different
effects.

## Output example

![Output Example](https://github.com/merodriguezblanco/ascii-screenshot/blob/master/captures/capture.jpg)

## How to run

Just start any local server. If you are running linux and have python
installed, try: `python -m SimpleHTTPServer`
