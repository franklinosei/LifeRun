// global variables to be used in the game

let weaponInterval;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// canvas.className = "bg"

canvas.width = 1268;
canvas.height = 512;

const scaledCanvas = {
  width: canvas.width,
  height: canvas.height,
};

// // for testing
// const collisionBlocks = [];
// const platformCollisionBlocks = [];

const gravity = 0.1;

const player = new Player({
  position: {
    x: 400,
    y: 100,
  },
  // collisionBlocks,
  // platformCollisionBlocks,
  imageSrc: "./images/warrior/Idle.png",
  frameRate: 8,
  animations: {
    Idle: {
      imageSrc: "./images/warrior/Idle.png",
      frameRate: 8,
      frameBuffer: 3,
    },
    Run: {
      imageSrc: "./images/warrior/Run.png",
      frameRate: 8,
      frameBuffer: 5,
    },
    Jump: {
      imageSrc: "./images/warrior/Jump.png",
      frameRate: 2,
      frameBuffer: 3,
    },
    Fall: {
      imageSrc: "./images/warrior/Fall.png",
      frameRate: 2,
      frameBuffer: 3,
    },
    FallLeft: {
      imageSrc: "./images/warrior/FallLeft.png",
      frameRate: 2,
      frameBuffer: 3,
    },
    RunLeft: {
      imageSrc: "./images/warrior/RunLeft.png",
      frameRate: 8,
      frameBuffer: 5,
    },
    IdleLeft: {
      imageSrc: "./images/warrior/IdleLeft.png",
      frameRate: 8,
      frameBuffer: 3,
    },
    JumpLeft: {
      imageSrc: "./images/warrior/JumpLeft.png",
      frameRate: 2,
      frameBuffer: 3,
    },
  },
});

// Zombie
const zombie = new Zombie({
  position: {
    x: 20,
    y: 100,
  },
  // collisionBlocks,
  // platformCollisionBlocks,
  imageSrc: "./images/zombie/trex.png",
  frameRate: 6,
  animations: {
    Idle: {
      imageSrc: "./images/zombie/trex.png",
      frameRate: 6,
      frameBuffer: 3,
    },
    Run: {
      imageSrc: "./images/zombie/trex.png",
      frameRate: 6,
      frameBuffer: 3,
    },
  },
});

// keys
const keys = {
  d: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
};

// bg
const background = new Component({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./images/bg.jpg",
});

const backgroundImageHeight = 512;

const camera = {
  position: {
    x: 0,
    y: -backgroundImageHeight + scaledCanvas.height,
  },
};
// use thi to gen weapons
// weaponInterval = setInterval(() => {
//   console.log("gen weapon")
// }, 1000 * 5)

function gameLoop() {
  window.requestAnimationFrame(gameLoop);

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.scale(1.3, 1.3);

  ctx.translate(camera.position.x, camera.position.y);
  background.update();

  player.update();
  zombie.update()

  player.velocity.x = 0;
  zombie.velocity.x = 0;


  if (keys.d.pressed) {

// try zombie
zombie.switchSprite("Run")
zombie.velocity.x = 2;
zombie.lastDirection = "right";
zombie.shouldPanCameraToTheLeft({ canvas, camera });

// player controls
    player.switchSprite("Run");
    player.velocity.x = 2;
    player.lastDirection = "right";
    player.shouldPanCameraToTheLeft({ canvas, camera });
  } else if (keys.a.pressed) {
    player.switchSprite("RunLeft");
    player.velocity.x = -2;
    player.lastDirection = "left";
    player.shouldPanCameraToTheRight({ canvas, camera });
  } else if (player.velocity.y === 0) {
    if (player.lastDirection === "right") player.switchSprite("Idle");
    else player.switchSprite("IdleLeft");
  }

  if (player.velocity.y < 0) {
    player.shouldPanCameraDown({ camera, canvas });
    if (player.lastDirection === "right") player.switchSprite("Jump");
    else player.switchSprite("JumpLeft");
  } else if (player.velocity.y > 0) {
    player.shouldPanCameraUp({ camera, canvas });
    if (player.lastDirection === "right") player.switchSprite("Fall");
    else player.switchSprite("FallLeft");
  }

  ctx.restore();
}

gameLoop();

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowRight":
      keys.d.pressed = true;
      break;
    case "ArrowLeft":
      keys.a.pressed = true;
      break;
    case "ArrowUp":
      player.velocity.y = -4;
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "ArrowRight":
      keys.d.pressed = false;
      break;
    case "ArrowLeft":
      keys.a.pressed = false;
      break;
  }
});
