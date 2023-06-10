class Zombie extends Component {
    constructor({
      position,
      imageSrc,
      frameRate,
      scale = 1,
      animations,
    }) {
      super({ imageSrc, frameRate, scale });
  
      // player's position on the canvas
      this.position = position;

      this.isReady = false;

      this.velocity = {
        x: 0,
        y: 1,
      };
  
      // box around character that must touch other objects to detect collision
      this.hitbox = {
        position: {
          x: this.position.x,
          y: this.position.y,
        },
        width: 10,
        height: 10,
      };
  
      // all player animations/character animations
      this.animations = animations;
      this.lastDirection = "right";
  
      for (let key in this.animations) {
        const image = new Image();
        image.src = this.animations[key].imageSrc;
  
        this.animations[key].image = image;
      }
  
      // camera view
      this.camerabox = {
        position: {
          x: this.position.x,
          y: this.position.y,
        },
        width: 300,
        height: 80,
      };
    }
  
    // used to switch between animations
    switchSprite(key) {
      if (this.image === this.animations[key].image || !this.loaded) return;
  
      this.currentFrame = 0;
      this.image = this.animations[key].image;
      this.frameBuffer = this.animations[key].frameBuffer;
      this.frameRate = this.animations[key].frameRate;
    }
  
    // update camera view
    updateCamerabox() {
      this.camerabox = {
        position: {
          x: this.position.x - 50,
          y: this.position.y,
        },
        width: 300,
        height: 80,
      };
    }
  
    // has character hit end of canvas?
    checkForHorizontalCanvasCollision() {
      if (
        // TODO: Play around with 576
        this.hitbox.position.x + this.hitbox.width + this.velocity.x >= 576 ||
        this.hitbox.position.x + this.velocity.x <= 0
      ) {
        this.velocity.x = 0;
      }
    }
  
    // camera methods
    shouldPanCameraToTheLeft({ canvas, camera }) {
      const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width;
      const scaledDownCanvasWidth = canvas.width / 1.5;
  
      if (cameraboxRightSide >= 6600) return;
  
      if (
        cameraboxRightSide >=
        scaledDownCanvasWidth + Math.abs(camera.position.x)
      ) {
        camera.position.x -= this.velocity.x;
      }
    }
  
    shouldPanCameraToTheRight({ canvas, camera }) {
      if (this.camerabox.position.x <= 0) return;
  
      if (this.camerabox.position.x <= Math.abs(camera.position.x)) {
        camera.position.x -= this.velocity.x;
      }
    }
  
    shouldPanCameraDown({ canvas, camera }) {
      if (this.camerabox.position.y + this.velocity.y <= 0) return;
  
      if (this.camerabox.position.y <= Math.abs(camera.position.y)) {
        camera.position.y -= this.velocity.y;
      }
    }
  
    shouldPanCameraUp({ canvas, camera }) {
      if (
        this.camerabox.position.y + this.camerabox.height + this.velocity.y >=
        432
      )
        return;
  
      const scaledCanvasHeight = canvas.height / 4;
  
      if (
        this.camerabox.position.y + this.camerabox.height >=
        Math.abs(camera.position.y) + scaledCanvasHeight
      ) {
        camera.position.y -= this.velocity.y;
      }
    }
  
    // handle updates
    update() {
      this.updateFrames();
      this.updateHitbox();
  
      this.updateCamerabox();
      this.draw();
  
      this.drawPlayerPath()
  
      this.position.x += this.velocity.x;
      this.updateHitbox();
  
      // this.checkForHorizontalCollisions();
  
      this.applyGravity();
  
      this.updateHitbox();
      this.checkForVerticalCollisions();
    }
  
    drawPlayerPath() {
            // draw image of a weapon
            ctx.fillStyle = 'rgba(0, 0, 0, 0.85)'
            ctx.fillRect(0, canvas.height + 100, background.width, 60)
    }
  
    updateHitbox() {
      this.hitbox = {
        position: {
          x: this.position.x + 35,
          y: this.position.y + 26,
        },
        width: 14,
        height: 27,
      };
    }
  
    applyGravity() {
      this.position.y += this.velocity.y;
    }
  
    // checkForHorizontalCollisions() {
    //   if (
    //     // TODO: Play around with 576
    //     this.hitbox.position.x + this.hitbox.width + this.velocity.x >=
    //     0
    //   ) {
    //     this.velocity.x = 0;
    //   } else {
    //     this.velocity.x -= gravity;
    //   }
    // }

  
    checkForVerticalCollisions() {
      if (
        // TODO: Play around with 576
        this.hitbox.position.y + this.hitbox.height + this.velocity.y <
        canvas.height + 60
      ) {
        this.velocity.y += gravity;
      } else {
        this.velocity.y = 0;
        this.isReady = true;
      }
    }
  }
  