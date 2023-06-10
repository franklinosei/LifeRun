// global variables to be used in the game
let gameAnimID;
let isGameOver = false;
let isGamePaused = false;

// get context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// set canvas dimensions
canvas.width = 1268;
canvas.height = 500;

// ================ Physics and bg =================
const gravity = 0.1;

const backgroundImageHeight = 512;

// bg
const background = new Component({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./images/bg.jpg",
});

const camera = {
  position: {
    x: 0,
    y: -backgroundImageHeight + canvas.height,
  },
};

// =================================================

//  =============== questions =====================

// last known positions where questions were rendered
let questionPositionX = 300;
let questionPositionY = canvas.height + 40;
let distanceBetweenQuestions = 600;

// answering var
let currentQuestionIdx = 0;

const questionBlocks = [];
questions.forEach((question) => {
  // positions
  // let questionPositionX = generateRandomNumber(300, 6600);
  // let y = canvas.height + 40;

  // let x = 300
  // let y = canvas.height + 40

  const questionBlock = new Question({
    question: question,
    position: { x: questionPositionX, y: questionPositionY },
    imageSrc: "./images/question/question.png",
    frameRate: 7,
    scale: 0.3,
    frameBuffer: 4,
  });

  questionBlocks.push(questionBlock);

  questionPositionX += distanceBetweenQuestions;
  // questionPositionY = generateRandomNumber(
  //   canvas.height + 40,
  //   canvas.height - 40
  // );
});

//  =================================================================================

// keys
const keys = {
  d: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
};

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
    y: 200,
  },
  imageSrc: "./images/zombie/idle.png",
  frameRate: 2,
  animations: {
    Idle: {
      imageSrc: "./images/zombie/idle.png",
      frameRate: 2,
      frameBuffer: 3,
    },
    Run: {
      imageSrc: "./images/zombie/trex.png",
      frameRate: 6,
      frameBuffer: 3,
    },
  },
});

// use thi to gen weapons
// weaponInterval = setInterval(() => {
//   console.log("gen weapon")
// }, 1000 * 5)

// let currentQue = questionBlocks[currentQuestionIdx];

function gameLoop() {
  gameAnimID = window.requestAnimationFrame(gameLoop);

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.scale(1.5, 1.5);

  ctx.translate(camera.position.x, camera.position.y);
  background.update();

  player.update();
  zombie.update();

  player.velocity.x = 0;
  zombie.velocity.x = 0;

  // move when characters land
  if (!isGamePaused && zombie.isReady && player.isReady) {
    // keys.d.pressed = true;

        // // // try zombie
        zombie.switchSprite("Run");
        zombie.velocity.x = 2;
        zombie.lastDirection = "right";
        zombie.shouldPanCameraToTheLeft({ canvas, camera });
    
        // // player controls
        player.switchSprite("Run");
        player.velocity.x = 2;
        player.lastDirection = "right";
        player.shouldPanCameraToTheLeft({ canvas, camera });
  }

  // game over logics here
  if (player.checkEnemyCollision({ zombie: zombie.hitbox })) {
    // stop game when this is true
    isGameOver = true;

    // call game over
    gameOver();
  }

  questionBlocks.forEach((currentQue) => {
    // currentQue.update()

    if (!currentQue.question.answered) {
      currentQue.update();

      if (currentQue.isPlayerCollide({ player: player })) {
        // pause game to answer question

        isGamePaused = true;
        //     keys.d.pressed = false;

        //     //
        currentQue.question.answered = true;

        player.position.x += 15;
        //     // player.camerabox.position.x += 100

        // isGamePaused = false;
        //     // keys.d.pressed = true;
        setTimeout(() => {
          isGamePaused = false
        }, 5000)
      }
    }
  });

  // render questions but if question is answered already, move to next question
  // if (!currentQue.question.answered) {
  //   currentQue.update();

  //   if (currentQue.isPlayerCollide({ player: player })) {
  //     // pause game to answer question

  //     isGamePaused = true;
  //     keys.d.pressed = false;

  //     //
  //     currentQue.question.answered = true;

  //     player.position.x += 5
  //     // player.camerabox.position.x += 100

  //     isGamePaused = false;
  //     // keys.d.pressed = true;

  //   }
  // } else {
  //   if (currentQuestionIdx < questionBlocks.length - 1) {
  //     currentQuestionIdx += 1;
  //     currentQue = questionBlocks[currentQuestionIdx];
  //   }
  // }

  // movement logics here
  if (keys.d.pressed) {
    // // try zombie
    zombie.switchSprite("Run");
    zombie.velocity.x = 2;
    zombie.lastDirection = "right";
    zombie.shouldPanCameraToTheLeft({ canvas, camera });

    // player controls
    player.switchSprite("Run");
    player.velocity.x = 2;
    player.lastDirection = "right";
    player.shouldPanCameraToTheLeft({ canvas, camera });
  }

  // else if (keys.a.pressed) {
  //   player.switchSprite("RunLeft");
  //   player.velocity.x = -2;
  //   player.lastDirection = "left";
  //   player.shouldPanCameraToTheRight({ canvas, camera });
  // }
  else if (player.velocity.y === 0) {
    if (
      // player.lastDirection === "right" &&
       isGamePaused) {
      player.switchSprite("Idle");
      zombie.switchSprite("Idle");
    } 
    // else {
    //   player.switchSprite("IdleLeft");
    // }
  }

  if (player.velocity.y < 0) {
    player.shouldPanCameraDown({ camera, canvas });
    if (player.lastDirection === "right") {
      player.switchSprite("Jump");
    } else {
      player.switchSprite("JumpLeft");
    }
  } else if (player.velocity.y > 0) {
    player.shouldPanCameraUp({ camera, canvas });

    if (player.lastDirection === "right") {
      player.switchSprite("Fall");
    } else {
      player.switchSprite("FallLeft");
    }
  }

  ctx.restore();
}

// handles game over
function gameOver() {
  cancelAnimationFrame(gameAnimID);
}

// stop game
if (isGameOver) {
  gameOver();
} else {
  gameLoop();
}

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
