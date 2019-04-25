
function LoadStage() {
  Stage.call(this, "load", 5);
}
inherit(LoadStage, Stage);

LoadStage.prototype.preload = function() {
  // Load a bunch of huge images to provoke longer loading time for demonstration purposes
  this.images = [];
  for (let i = 0; i < 10; i++) {
    this.images.push(loader.loadImage(
      "https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73751/world.topo.bathy.200407.3x5400x2700.jpg?tmp=" + i
    ));
  }
}

LoadStage.prototype.render = function(ctx, timer) {
  const w = ctx.canvas.width, h = ctx.canvas.height;
  const p = Interpolators.cubic3(this.opacity);
  if (p < 1) {
    ctx.translate(0, -(1 - p) * (h + 10));
  }
  // Bar at the bottom
  ctx.fillStyle = "#666";
  ctx.fillRect(0, h + 1, w, 4);
  // Black background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, w, h);
  // Message
  const alpha = (0.7 + 0.2 * Math.sin(timer.runTime * 0.003));
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "white";
  ctx.textAlign = "right";
  ctx.font = "32px Arial";
  const percentage = Math.round(loader.progress * 100) + "%";
  ctx.fillText("Loading " + percentage, w - 30, h - 30);
};

LoadStage.prototype.update = function(timer) {
  // nothing to update here
};