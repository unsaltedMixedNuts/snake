(function () {
  if (typeof SnakeGame === "undefined") {
    window.SnakeGame = {};
  }

// ----------VIEW CLASS----------
  var View = SnakeGame.View = function ($el) {
    this.$el = $el;
    var viewRowDimension = 20;
    var viewWidthDimension = 20;
    this.board = new SnakeGame.Board(viewRowDimension, viewWidthDimension);
    this.initialBoardDisplay();
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
    // ---------text based rendering---------
    // this.$el.html("<pre>" + this.board.render() + "</pre>")
    // ---------text based rendering---------

    // ---------css based rendering---------
    this.updateBoard([this.board.apple.position], "apple")
    this.updateBoard(this.board.snake.segments, "snake")
    // ---------css based rendering---------

  };

  View.prototype.step = function () {
    this.board.snake.move();
    this.render();
  };

  View.prototype.initialBoardDisplay = function () {
    var content = "";

    for (var iRow = 0; iRow < this.board.row_dim; iRow++) {
      content += "<ul>";
      for (var jWidth = 0; jWidth < this.board.width_dim; jWidth++) {
        content += "<li></li>"
      }
      content += "</ul>";
    }

    this.$el.html(content);
    this.$li = this.$el.find("li");
  };

  View.prototype.updateBoard = function (coords, className) {
    this.$li.filter("." + className).removeClass();

    coords.forEach( function (coord) {
      var absoluteIndex = (coord.x * this.board.width_dim) + coord.y;
      this.$li.eq(absoluteIndex).addClass(className);
    }.bind(this));
  };

})();
