

function MainStage() {
  Stage.call(this, "main", 0);
}
inherit(MainStage, Stage);

MainStage.prototype.preload = function() {
  this.images = [
    loader.loadImage('media/1.jpg'),
    loader.loadImage('media/2.jpg')
  ];
  this.cursorImage = loader.loadImage('media/flower.png');
  this.explosionImage = loader.loadImage('media/explosion.png', 6, 5);
  this.share("flowerImage", this.cursorImage);
};

MainStage.prototype.render = function(ctx, timer) {
  const w = ctx.canvas.width, h = ctx.canvas.height;
  const imgw = 1400, imgh = 800;
  // White background
  ctx.fillStyle = "#ccc";
  ctx.fillRect(0, 0, w, h);
  // Camera View
  ctx.translate(w / 2, h / 2);
  mouseHandler.setCanvasTransform(w / 2, h / 2);
  // Solid image
  if (this.p == 0 || this.p == 1) {
    const img = this.images[Math.round(this.p)];
    ctx.drawImage(img, -imgw/2, -imgh/2, imgw, imgh);
    // Half
    ctx.fillStyle = "#00000020";
    ctx.fillRect(-1, -imgh/2, 3, imgh);
  } else {
    // Animation, render left and right half of respective images first
    ctx.drawImage(this.images[0], 0, 0, this.images[0].width / 2, this.images[0].height,
        -imgw/2, -imgh/2, imgw/2, imgh);
    ctx.drawImage(this.images[1], this.images[1].width / 2, 0, this.images[1].width / 2, this.images[0].height,
        0, -imgh/2, imgw/2, imgh);
    // Half
    ctx.fillStyle = "#00000030";
    ctx.fillRect(-1, -imgh/2, 3, imgh);
    // Page bending
    const bend = this.p < this.prevP ? -0.25 : 0.25;
    drawBentImage(ctx,
        this.images[0], this.images[0].width / 2, 0, this.images[0].width / 2, this.images[0].height,
        this.images[1], 0, 0, this.images[1].width / 2, this.images[1].height,
        0, -imgh/2, imgw/2, imgh,
        this.p, bend, 64);
  }

  // Cursor
  const mouse = this.getMouse();
  if (mouse.click == 1) {
    if (!this.getKeyState("shift")) {
      drawImage(ctx, this.cursorImage, mouse.x, mouse.y, timer.stageTime * 0.005, 0.25, 0.5, 0.5, 0.5, 0.5); 
    } else {
      const frame = absMod(Math.floor(timer.stageTime / 25), 70);
      if (frame < this.explosionImage.frameCount) {
        drawFrame(ctx, this.explosionImage, frame, mouse.x, mouse.y, timer.stageTime * 0.0005, 3); 
      }
    }
  }
};

MainStage.prototype.update = function(timer) {
  this.prevP = this.p;
  const stillTime = 1400, animationTime = 600;
  const duration = 2 * (stillTime + animationTime);
  let phase = timer.stageTime % duration;
  if (phase < duration / 2) {
    // Wrap left -> right
    if (phase < animationTime) {
      this.p = Interpolators.cos(phase / animationTime);
    } else {
      this.p = 1;
    }
  } else {
    // Wrap right -> left
    phase -= (duration / 2);
    if (phase < animationTime) {
      this.p = Interpolators.cos(1 - phase / animationTime);
    } else {
      this.p = 0;
    }
  }
};

MainStage.prototype.onkey = function(event) {
  if (event.key == "Escape") {
    this.transitionIn("pause", 400);
  } else if (event.key == "Backspace") {
    this.transitionTo("start", 1000);
  }
}