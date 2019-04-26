

function PauseStage() {
  Stage.call(this, "pause", 2);
  this.isTransparent = true;
}
inherit(PauseStage, Stage);

PauseStage.prototype.render = function(ctx, timer) {
  const w = ctx.canvas.width, h = ctx.canvas.height;
  const p = Interpolators.cubic(this.opacity);
  ctx.globalAlpha = p;
  ctx.fillStyle = "#00000060";
  ctx.fillRect(0, 0, w, h);
  // Pause Text
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.font = "72px Arial";
  ctx.translate(w / 2, h / 2 - 20);
  const angle = Math.PI * wobble(this.time, 1.467, 2, 2.4);
  ctx.rotate(angle);
  ctx.shadowColor = "black";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 3;
  const x = 250 * wobble(this.time, 1.7, 0, 1.2), y = 150 * wobble(this.time, 1.98, 0.7, 1.5)
  ctx.fillText("Game Paused", x, y);
};

PauseStage.prototype.onkey = function(event) {
  if (event.key == "Escape") {
    this.transitionOut(800);
  }
};
