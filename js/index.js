// get context
const canvas = document.getElementById("heading");
const ctx = canvas.getContext("2d");


const player = new Player({
    position: {
      x: 150,
      y: 100,
    },
    imageSrc: "./images/warrior/Idle.png",
    frameRate: 8,
    animations: {
      Idle: {
        imageSrc: "./images/warrior/Idle.png",
        frameRate: 8,
        frameBuffer: 3,
      },
    },
  });



