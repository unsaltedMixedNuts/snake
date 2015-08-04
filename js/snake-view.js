(function () {
  if (typeof SnakeGame === "undefined") {
    window.SnakeGame = {};
  }

// ----------VIEW CLASS----------
  var View = SnakeGame.View = function ($el) {
    this.$el = $el;
    this.$snakeGame = this.$el.find(".snake-game");
    this.$score = this.$el.find('.score');
    this.$highScore = this.$el.find('.lives');
    this.viewRowDimension = 20;
    this.viewWidthDimension = 20;
    this.board = new SnakeGame.Board(this.viewRowDimension, this.viewWidthDimension);
    this.highScore = 0;
    this.initialBoardDisplay();
    this.step();
    // this.interval = window.setInterval(
    //   this.step.bind(this), View.MILLISECONDS_PER_STEP
    // );
    this.pause = true;

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
    if (event.keyCode === 32) {
      event.preventDefault();
      this.togglePause();
    } else if (event.keyCode === 82) {
      if (!this.pause) {
        this.togglePause();
      }
      this.board = new SnakeGame.Board(this.viewRowDimension, this.viewWidthDimension);
      this.initialBoardDisplay();
      this.step();
    } else {
      var newDir = View.KEY_DIRS[event.keyCode];
      if (newDir) {
        this.board.snake.turn(newDir);
        if (this.pause) {
          this.togglePause();
        }
      }
    }
  };

  View.prototype.render = function () {
    // ---------text based rendering---------
    // this.$snakeGame.html("<pre>" + this.board.render() + "</pre>")
    // ---------text based rendering---------

    // ---------css based rendering---------
    if (!this.board.snake.gameOver) {
      this.updateBoard([this.board.apple.position], "apple");
      this.updateBoard(this.board.snake.segments, "snake");
      this.updateScore();
    }
    // ---------css based rendering---------

  };

  View.prototype.step = function () {
    if (this.board.snake.gameOver) {
      alert("You lose!");
      window.clearInterval(this.interval);
    } else {
      this.board.snake.move();
      this.render();
    }
  };

  View.prototype.initialBoardDisplay = function () {
    // this.$snakeGame.empty();

    var content = "";

    for (var iRow = 0; iRow < this.board.row_dim; iRow++) {
      content += "<ul>";
      for (var jWidth = 0; jWidth < this.board.width_dim; jWidth++) {
        content += "<li></li>"
      }
      content += "</ul>";
    }

    this.$snakeGame.html(content);
    this.$li = this.$snakeGame.find("li");
  };

  View.prototype.updateBoard = function (coords, className) {
    this.$li.filter("." + className).removeClass();

    coords.forEach( function (coord) {
      var absoluteIndex = (coord.x * this.board.width_dim) + coord.y;
      this.$li.eq(absoluteIndex).addClass(className);
    }.bind(this));
  };

  View.prototype.updateScore = function () {
    var scoreContent = "Score: " + this.scoreWithCommas(this.board.snake.score);
    this.$score.html(scoreContent);

    this.highScore = Math.max(this.highScore, this.board.snake.score)
    var highScoreContent = "Your highest score this session: " + this.scoreWithCommas(this.highScore);
    this.$highScore.html(highScoreContent);
  };

  View.prototype.togglePause = function () {
    if (this.pause) {
      this.pause = false;
      this.interval = window.setInterval(
        this.step.bind(this), View.MILLISECONDS_PER_STEP
      );
    } else {
      this.pause = true;
      window.clearInterval(this.interval);
    }
  };

  View.prototype.scoreWithCommas = function (score) {
    return score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

})();
