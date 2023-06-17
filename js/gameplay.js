

// global variables to be used in the game
let gameAnimID;
let isGameOver = false;
let isGamePaused = false;
let timeout;

let timeoutSecs = 1000 * 50;
// let countdown = 1000 * 5;

let countdownIntervalId;

let isSubmittedAnswer = false;
let submittedAnswer = "";

let currentScore = 0;
let highestScore = localStorage.getItem("highestScore") ?? 0;
let questionsAnswered = 0;
let totalQuestions = 0;

const sfx = {
  jump: new Howl({
    src: ["sounds/jump.wav"],
    volume: 0.1,
  }),

  correctAnswer: new Howl({
    src: ["sounds/right-answer.wav"],
    volume: 0.1,
  }),
  wrongAnswer: new Howl({
    src: ["sounds/wrong-answer.wav"],
    volume: 0.1,
  }),
  enemyCollision: new Howl({
    src: ["sounds/enemy-collision.mp3"],
    volume: 0.1,
  }),
  landedSound: new Howl({
    src: ["sounds/landing-track.wav"],
    // autoplay: true,
  }),
};
const music = {
  gameTrack: new Howl({
    src: ["sounds/best.mp3"],
    autoplay: true,
    loop: true,
    volume: 0.08,
  }),
};

// get context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// get questions area
const questionDiv = document.getElementById("questions-area");

// hide it
questionDiv.className = "hidden";

// set canvas dimensions
canvas.width = 1268;
canvas.height = 500;

// ============= scoreboard =======================
const questionsAnsweredEle = document.getElementById("answered-questions");
const totalQuestionsEle = document.getElementById("total-questions");
const highestScoreEle = document.getElementById("highest-score");
const currentScoreEle = document.getElementById("current-score");

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

let currentQuestion;

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

  // update scoreboard
  totalQuestionsEle.innerText = questionBlocks.length;
  highestScoreEle.innerText = highestScore;
  currentScoreEle.innerText = currentScore;
  questionsAnsweredEle.innerText = questionsAnswered;

  player.velocity.x = 0;
  zombie.velocity.x = 0;

  // move when characters land
  if (!isGamePaused && zombie.isReady && player.isReady) {
    // if (!sfx.landedSound.playing()) {
    // sfx.landedSound.play();
    // } else{
    //   sfx.landedSound.stop();

    // }

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
  if (
    player.checkEnemyCollision(
      { zombie: zombie.hitbox }
    )  || player.checkForHorizontalCanvasCollision()
  ) {
    // stop game when this is true

    isGameOver = true;

    // call game over
    gameOver();
  }

  questionBlocks.forEach((currentQue) => {
    if (!currentQue.question.answered) {
      currentQue.update();

      if (currentQue.isPlayerCollide({ player: player })) {
        // pause game to answer question

        isGamePaused = true;

        // handles display of question
        handleQuestionDisplay(currentQue);

        // show questions div
        questionDiv.className = "questions-area animate-from-right";

        currentQuestion = currentQue;

        if (isGamePaused) {
          // timeout = setTimeout(() => {
          //   isGamePaused = false;
          //   //   // hide questions div
          //   questionDiv.className = "hidden";
          //   clearTimeout(timeout);
          // }, 1000*15);
        }
      }
    }
  });

  // movement logics here
  if (keys.d.pressed && !isGamePaused) {
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
      isGamePaused
    ) {
      player.switchSprite("Idle");
      zombie.switchSprite("Idle");
    }
    // else {
    //   player.switchSprite("IdleLeft");
    // }
  }

  if (player.velocity.y < 0 && !isGameOver) {
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

// hangles start game
function startGame() {
  window.location.replace("gamemode.html");

  // start gameplay
  music.gameTrack.play();
}

// handles submitted data
function handleSubmit() {
  // Get the selected option
  var selectedOption = document.querySelector(
    'input[name="selected-answer"]:checked'
  );

  // Check if an option is selected
  if (selectedOption) {
    // Retrieve the value of the selected option
    var selectedValue = selectedOption.value;

    isSubmittedAnswer = true;
    submittedAnswer = selectedValue;

    if (isSubmittedAnswer) {
      currentQuestion.question.answered = true;

      questionsAnswered += 1;

      // console.log(submittedAnswer);

      if (submittedAnswer === currentQuestion.question.answer) {
        currentScore += 5;
        player.position.x += 15;

        if (currentScore > highestScore) {
          localStorage.setItem("highestScore", currentScore);
        }

        sfx.correctAnswer.play();
        isSubmittedAnswer = false;
        submittedAnswer = "";
      } else {
        sfx.wrongAnswer.play();
        zombie.position.x += 40;
      }
    }

    clearSelectedOption();

    // hide div
    questionDiv.className = "hidden";

    // continue game
    isGamePaused = false;
  } else {
    console.log("No option selected");
  }
}

// handles the display of question in the game
function handleQuestionDisplay(question) {
  // show question
  const questionDiv = document.getElementById("question");
  questionDiv.innerText = question.question.question;

  // show possilble answers
  const opt1Label = document.getElementById("choice1-label");
  const option1 = document.getElementById("choice1");

  const optLabe2 = document.getElementById("choice2-label");
  const option2 = document.getElementById("choice2");

  const optLabe3 = document.getElementById("choice3-label");
  const option3 = document.getElementById("choice3");

  const optLabe4 = document.getElementById("choice4-label");
  const option4 = document.getElementById("choice4");

  opt1Label.innerText = question.question.choices[0];
  option1.value = question.question.choices[0];

  option2.value = question.question.choices[1];
  optLabe2.innerText = question.question.choices[1];

  option3.value = question.question.choices[2];
  optLabe3.innerText = question.question.choices[2];

  option4.value = question.question.choices[3];
  optLabe4.innerText = question.question.choices[3];
}

function clearSelectedOption() {
  // clear selectedanswer
  const selectedOption = document.querySelector(
    'input[name="selected-answer"]:checked'
  );
  selectedOption.checked = false;
}

// handles game over
function gameOver() {
  if (!music.gameTrack.playing()) {
    music.gameTrack.stop();
  }

  if (!sfx.enemyCollision.playing()) {
    sfx.enemyCollision.play();
  }

  cancelAnimationFrame(gameAnimID);

  localStorage.setItem("currentScore", currentScore);
  localStorage.setItem("questionsAnswered", questionsAnswered);

  // go to game over screen
  window.location.replace("gameover.html");
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
      // play jump sound
      if (!sfx.jump.playing()) {
        sfx.jump.play();
      }

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
