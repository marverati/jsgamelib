
function StartStage() {
  Stage.call(this, "start", 1);
}
inherit(StartStage, Stage);

StartStage.prototype.load = function() {
  this.flowerImage = this.getShared("flowerImage");
  this.flowerTransition = null;
};

StartStage.prototype.render = function(ctx, timer) {
  const p = Interpolators.cubic(this.opacity);
  const w = ctx.canvas.width, h = ctx.canvas.height;
  const clipX = w * (1 - p);
  ctx.beginPath();
  ctx.rect(clipX, 0, w, h);
  ctx.clip();
  // Black background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, w, h);
  // Message
  const alpha = (0.7 + 0.2 * Math.sin(timer.runTime * 0.003)) * (this.opacity ** 8);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.font = "48px Arial";
  ctx.fillText("PRESS ENTER TO START", w / 2, h / 2 - 20);
  // Flower
  ctx.globalAlpha = 1;
  let flowerAngle = 0;
  if (this.flowerTransition && !this.flowerTransition.done) {
    flowerAngle = this.flowerTransition.update(timer.gameTime);
  } else {
    const targetAngle = (rnd() < 0.5) ? 2 * Math.PI : -2 * Math.PI;
    this.flowerTransition = new Transition(0, targetAngle, rnd(1000, 4500), Interpolators.getBounce(rnd(0.3, 2.5)), timer.gameTime + rnd(1000, 2800));
  }
  drawImage(ctx, this.flowerImage, w - 150, 150, flowerAngle, 0.5);
};

Stage.prototype.update = function(timer) {
  // nothing to update here
};

Stage.prototype.onkey = function(event) {
  if (this.opacity >= 1) {
    if (event.key == "Enter") {
      this.transitionTo("main", 1200);
    }
  }
};
