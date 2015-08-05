(function () {
  if (typeof SnakeGame === "undefined") {
    window.SnakeGame = {};
  }

// ----------VIEW CLASS----------
  var View = SnakeGame.View = function ($el) {
    this.$el = $el;
    this.$snakeGame = this.$el.find(".snake-game");
    this.$score = this.$el.find('.current-score');
    this.$highScore = this.$el.find('.high-score');
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
      if (!this.board.snake.gameOver) {
        this.togglePause();
        $('.start').hide();
      }
    } else if (event.keyCode === 82) {
      $('.game-over').hide();
      if (!this.pause) {
        this.togglePause();
        $('.pause').hide();
        $('.start').show();
      }
      this.board = new SnakeGame.Board(this.viewRowDimension, this.viewWidthDimension);
      this.initialBoardDisplay();
      this.step();
    } else {
      var newDir = View.KEY_DIRS[event.keyCode];
      if (newDir) {
        this.board.snake.turn(newDir);
        if (this.pause) {
          $('.start').hide();
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
      // alert("You lose!");
      $('.game-over').show();
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
    var scoreContent = "Current Score: " + this.scoreWithCommas(this.board.snake.score);
    this.$score.html(scoreContent);

    if (this.board.snake.score != 0 && this.board.snake.score >= this.highScore) {
      this.$score.removeClass("red-score");
      this.$score.addClass("green-score");
    } else if (this.board.snake.score < this.highScore) {
      this.$score.addClass("red-score");
      this.$score.removeClass("green-score");
    } else {
      this.$score.removeClass("green-score");
      this.$score.removeClass("red-score");
    }

    this.highScore = Math.max(this.highScore, this.board.snake.score)
    var highScoreContent = "High Score: " + this.scoreWithCommas(this.highScore);
    this.$highScore.html(highScoreContent);

    if (this.highScore != 0 && this.highScore >= this.board.snake.score) {
      this.$highScore.removeClass("red-score");
      this.$highScore.addClass("green-score");
    } else if (this.highScore != 0) {
      this.$highScore.addClass("red-score");
      this.$highScore.removeClass("green-score");
    }
  };

  View.prototype.togglePause = function () {
    if (this.pause) {
      this.pause = false;
      $('.pause').hide();
      this.interval = window.setInterval(
        this.step.bind(this), View.MILLISECONDS_PER_STEP
      );
    } else {
      this.pause = true;
      $('.pause').show();
      window.clearInterval(this.interval);
    }
  };

  View.prototype.scoreWithCommas = function (score) {
    return score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

})();
