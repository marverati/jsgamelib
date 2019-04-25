


function Stage(name, zIndex) {
  this.name = name;
  this.manager = null;
  this.zIndex = zIndex || 0;
  this.active = false; // only one stage is active at a time, always equal to manager.activeStage
  this.alive = false; // active stage is always alive, others in background can be alive as well
  this.opacity = 0;
  this.isTransparent = false;
  this.isLoaded = false;
}

Stage.prototype.setManager = function(manager) {
  this.manager = manager;
};

Stage.prototype.transitionTo = function(stage, duration) {
  this.manager.set(stage, duration);
};

Stage.prototype.share = function(key, value) {
  this.manager.share(key, value, this);
};

Stage.prototype.getShared = function(key) {
  return this.manager.getShared(key, this);
};

Stage.prototype.render = function(ctx, timer) {

};

Stage.prototype.update = function(timer) {

};

Stage.prototype.preload = function() {

};

Stage.prototype.prestart = function() {

};

Stage.prototype.start = function() {

};

Stage.prototype.prestop = function() {

};

Stage.prototype.stop = function() {

};

Stage.prototype.preterminate = function() {

};

Stage.prototype.onkey = function(event) {

};
