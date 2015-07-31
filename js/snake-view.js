(function () {
  if (typeof SnakeGame === "undefined") {
    window.SnakeGame = {};
  }

// ----------VIEW CLASS----------
  var View = SnakeGame.View = function ($el) {
    this.steps = 0;
    this.$el = $el;
    var viewRowDimension = 20;
    var viewWidthDimension = 40;
    this.board = new SnakeGame.Board(viewRowDimension, viewWidthDimension)
    this.interval = window.setInterval(
      this.step.bind(this), View.MILLISECONDS_PER_STEP
    );

    $(window).on("keydown", this.handleKeyEvent.bind(this));
  };

  View.KEY_DIRS = {
    38: "N",
    39: "E",
    40: "S",
    37: "W"
  };

  View.MILLISECONDS_PER_STEP = 100;

  View.prototype.handleKeyEvent = function (event) {
    var newDir = View.KEY_DIRS[event.keyCode];
    if (newDir) {
      this.board.snake.turn(newDir);
    }
  };

  View.prototype.render = function () {
    // simple text based rendering
    this.$el.html("<pre>" + this.board.render() + "</pre>")
  };

  View.prototype.step = function () {
    this.board.snake.move();
    this.render();
  };


})();
