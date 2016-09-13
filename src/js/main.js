import picturefill from 'picturefill';
import FontFaceObserver from 'fontfaceobserver';

var roboto400 = new FontFaceObserver("Open Sans", {
  weight: 400
});
var roboto700 = new FontFaceObserver("Open Sans", {
  weight: 700
});

Promise.all([
  roboto400.load(),
  roboto700.load()
]).then(function() {
  document.documentElement.className += " has-fonts-loaded";
});

picturefill();
