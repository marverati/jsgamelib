

function StageManager(canvas, timer) {
  this.allStages = [];
  this.prevStage = null;
  this.activeStage = null;
  this.transitions = [];
  this.defaultDuration = 1000;
  this.canvas = canvas;
  this.context = canvas.getContext("2d");
  this.timer = timer || new Timer();
  this.stageTimes = {};
  this.sharedValues = {};

  // Register Event Listeners
  document.body.addEventListener("keydown", this.handleKeyDown.bind(this));
  canvas.addEventListener("click", this.handleKeyDown.bind(this));
}

StageManager.prototype.load = function() {
  this.allStages.forEach(stage => {
    stage.preload();
  });
};

StageManager.prototype.add = function(stage) {
  stage.setManager(this);
  this.allStages.push(stage);
  this.stageTimes[stage.name] = {
    dif: 0,
    total: 0
  };
  if (!this.activeStage) {
    this.setInstant(stage);
  }
  return this;
};

StageManager.prototype.share = function(key, value, stage) {
  if (this.sharedValues.hasOwnProperty(key)) {
    throw new Error("Can't share key '" + key + "' from stage " + stage.name + ", as key is already shared");
  }
  this.sharedValues[key] = value;
};

StageManager.prototype.getShared = function(key, stage) {
  if (!this.sharedValues.hasOwnProperty(key)) {
    throw new Error("Can't retreive shared key '" + key + "' from stage " + stage.name + ", as this key has not been registered");
  }
  return this.sharedValues[key];
};

StageManager.prototype.setInstant = function(stage) {
  this.set(stage, 0);
};

StageManager.prototype.set = function(stage, fadeDuration = this.defaultDuration, fadeInDuration = fadeDuration) {
  stage = this.get(stage);
  // Load stage first?
  if (stage.load && !stage.isLoaded) {
    stage.load();
    stage.isLoaded = true;
  }
  // Callbacks of previous and new stage
  if (this.activeStage) {
    this.activeStage.prestop();
  }
  stage.prestart();
  // Handle stage states
  stage.alive = true;
  stage.active = true;
  if (this.activeStage) {
    this.prevStage = this.activeStage;
    this.prevStage.active = false;
  }
  this.activeStage = stage;
  // Begin transitions
  if (fadeDuration > 0) {
    if (this.prevStage) {
      this.transitions.push({
        stage: this.prevStage,
        fadeIn: false,
        transition: new Transition(1, 0, fadeDuration, undefined, this.timer.runTime)
      });
    }
  } else if (this.prevStage) {
    this.prevStage.opacity = 0;
  }
  if (fadeInDuration > 0) {
    this.transitions.push({
      stage: this.activeStage,
      fadeIn: true,
      transition: new Transition(0, 1, fadeInDuration, undefined, this.timer.runTime)
    });
  } else {
    this.activeStage.opacity = 1;
  }
};

StageManager.prototype.get = function(stage) {
  if (typeof stage === "string") {
    const foundStage = this.allStages.find(s => s.name == stage);
    if (foundStage) {
      return foundStage;
    }
  }
  if (!this.allStages.find(s => s == stage)) {
    throw new Error("Tried to get stage that isn't managed by StageManager: ")
  }
  return stage;
};

StageManager.prototype.update = function() {
  // Transitions
  let changes = 0;
  for (let t = this.transitions.length - 1; t >= 0; t--) {
    const v = this.transitions[t].transition.update(this.timer.runTime);
    this.transitions[t].stage.opacity = v;
    // Handle end of transition
    if (this.transitions[t].transition.done) {
      this.transitions[t].stage.alive = !!this.transitions[t].fadeIn;
      if (this.transitions[t].stage.alive) {
        // Fade in ready
        this.transitions[t].stage.start();
      } else {
        // Fade out ready
        this.transitions[t].stage.stop();
      }
      // Remove transition
      this.transitions.splice(t, 1);
    }
  }
  // Stages
  for (let stage of this.allStages) {
    const stageTime = this.stageTimes[stage.name];
    if (stage.alive) {
      stageTime.dif = this.timer.gameTimeDif * stage.opacity;
      stageTime.total += stageTime.dif;
      this.timer.stageTimeDif = stageTime.dif;
      this.timer.stageTime = stageTime.total;
      stage.update(this.timer);
    } else {
      stageTime.dif = 0;
    }
  }
};

StageManager.prototype.render = function() {
  // Clear canvas
  this.context.setTransform(1, 0, 0, 1, 0, 0);
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  // Sort active stages by their z-index
  const activeStages = this.allStages.filter(stage => stage.alive && stage.opacity > 0);
  // Render previous stage in case current one is transparent
  if (this.prevStage && !this.prevStage.active && this.activeStage.isTransparent) {
    activeStages.push(this.prevStage);
  }
  // Sort by z-index
  activeStages.sort((s1, s2) => s1.zIndex - s2.zIndex);
  // Stages
  for (let stage of activeStages) {
    this.timer.stageTimeDif = this.stageTimes[stage.name].dif;
    this.timer.stageTime = this.stageTimes[stage.name].total;
    this.context.save();
    stage.render(this.context, this.timer);
    this.context.restore();
  }
};

StageManager.prototype.handleKeyDown = function(event) {
  this.activeStage.onkey(event);
};