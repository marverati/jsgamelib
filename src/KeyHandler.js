
function KeyHandler(target, watchers) {
  this.attachTo(target);
  this.initListeners();
  this.watchers = watchers;
  this.mouse = {
    click: 0,
    absX: 0,
    absY: 0,
    canvasX: 0,
    canvasY: 0,
    x: 0,
    y: 0
  };
  this.keyStates = {
  };
  watchers.forEach( key => this.keyStates[key.toLowerCase()] = false );
  this.transform = {
    offX: 0,
    offY: 0,
    scaleX: 1,
    scaleY: 1,
    rotation: 0
  };
}

KeyHandler.prototype.eventTarget = null;

KeyHandler.prototype.initListeners = function () {
  this.eventTarget.addEventListener('keydown', this.onKeyDown.bind(this));
  this.eventTarget.addEventListener('keyup', this.onKeyUp.bind(this));
  this.eventTarget.addEventListener('mousemove', this.onMouseMove.bind(this));
  this.eventTarget.addEventListener('mousedown', this.onMouseDown.bind(this));
  this.eventTarget.addEventListener('mouseup', this.onMouseUp.bind(this));
}

KeyHandler.prototype.attachTo = function(target) {
  this.eventTarget = target;
}

KeyHandler.prototype.detach = function() {
  this.eventTarget.removeEventListener('keydown', this.onKeyDown.bind(this));
  this.eventTarget.removeEventListener('keyup', this.onKeyUp.bind(this));
}

KeyHandler.prototype.onKeyDown = function (keyDownEvent) {
  var key = keyDownEvent.key.toLowerCase();
  if (this.keyStates[key] != null) {
      this.keyStates[key] = true;
  }
}

KeyHandler.prototype.onKeyUp = function (keyUpEvent) {
  var key = keyUpEvent.key.toLowerCase();
  if (this.keyStates[key] != null) {
      this.keyStates[key] = false;
  }
}

KeyHandler.prototype.onMouseMove = function(mouseEvent) {
  const coords = getRelativeMouseCoordinates(mouseEvent, this.eventTarget);
  this.mouse.absX = coords[0];
  this.mouse.absY = coords[1];
  this.mouse.canvasX = coords[0] * this.eventTarget.width / this.eventTarget.offsetWidth;
  this.mouse.canvasY = coords[1] * this.eventTarget.height / this.eventTarget.offsetHeight;
  [this.mouse.x, this.mouse.y] = this.transformCoord(this.mouse.canvasX, this.mouse.canvasY);
}

KeyHandler.prototype.onMouseDown = function(mouseEvent) {
  this.mouse.click = 1;
}

KeyHandler.prototype.onMouseUp = function(mouseEvent) {
  this.mouse.click = 0;
}

KeyHandler.prototype.setCanvasTransform = function(offX = 0, offY = 0, scaleX = 1, scaleY = scaleX, rotation = 0, invert = true) {
  if (!invert) {
    // Simply apply transformation
    this.transform.offX = offX;
    this.transform.offY = offY;
    this.transform.scaleX = scaleX;
    this.transform.scaleY = scaleY;
    this.transform.rotation = rotation;
  } else {
    // Reverse transformation
    this.transform.offX = -offX;
    this.transform.offY = -offY;
    this.transform.scaleX = 1/scaleX;
    this.transform.scaleY = 1/scaleY;
    this.transform.rotation = -rotation;
  }
  this.transform.rotationSin = Math.sin(rotation);
  this.transform.rotationCos = Math.cos(rotation);
}

KeyHandler.prototype.transformCoord = function(x, y) {
  // Offset
  x += this.transform.offX;
  y += this.transform.offY;
  // Scale
  x *= this.transform.scaleX;
  y *= this.transform.scaleY;
  // Rotate and return
  return [
    this.transform.rotationCos * x - this.transform.rotationSin * y,
    this.transform.rotationSin * x + this.transform.rotationCos * y
  ];
}
