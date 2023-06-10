class Question extends Component {
  constructor({
    question,
    position,
    imageSrc,
    frameRate,
    frameBuffer = 3,
    scale = 0.4,
  }) {
    super({ imageSrc, frameRate, scale, frameBuffer });

    this.position = position;
    this.question = question;

    // box around character that must touch other objects to detect collision
    this.hitbox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 20,
      height: 10,
    };
  }

  // place() {
  //   // draw image of a weapon
  //   ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
  //   ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  // }

  // update() {
  //   this.place();
  // }

  isPlayerCollide({ player }) {
    return collision({ object1: player.hitbox, object2: this.hitbox });
  }
}
