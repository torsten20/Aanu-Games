// Create the canvas
var canvas = document.createElement("canvas");
canvas.width = 600;
canvas.height = 800;
document.body.appendChild(canvas);

var ctx = canvas.getContext("2d"); 

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
  bgReady = true;
};
bgImage.src = "images/bg.png";


// (B) SOURCE IMAGE OBJECT
//var img = new Image();
 
// (C) CROP ON LOAD
//img.onload = () => {
 
  // (C2) CROP BY COPYING PART OF SOURCE IMAGE TO CANVAS
  //ctx.drawImage(img,
    // SOURCE X, Y, WIDTH, HEIGHT
  //  0, 0, 25, 31,
    // DESTINATION X, Y, WIDTH, HEIGHT
  //  0, 0, 25, 31
  //);
//};
 
// (D) GO!
//img.src = "images/alphabet.png";
