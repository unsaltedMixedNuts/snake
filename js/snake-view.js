(function () {
  if (typeof SnakeGame === "undefined") {
    window.SnakeGame = {};
  }

// ----------VIEW CLASS----------
  var View = SnakeGame.View = function ($el) {
    // Initialize jQuery elements
    this.$el = $el;
    this.$snakeGame = this.$el.find(".snake-game");
    this.$score = this.$el.find('.current-score');
    this.$highScore = this.$el.find('.high-score');
    this.highScore = 0;

    // CSS is styled specifically for this.dimensions to be 20
    this.dimensions = 20;

    // Setup and display board and pause game
    this.board = new SnakeGame.Board(this.dimensions);
    this.initialBoardDisplay();
    this.step();
    this.pause = true;

    // Event handlers
    $(window).on("keydown", this.handleKeyEvent.bind(this));
  };

  // Constants
  View.KEY_DIRS = {
    38: "N",
    39: "E",
    40: "S",
    37: "W"
  };

  View.MILLISECONDS_PER_STEP = 100;

  View.prototype.handleKeyEvent = function (event) {

    // If spacebar (keyCode 32) is pressed:
    if (event.keyCode === 32) {
      event.preventDefault();
      if (!this.board.snake.gameOver) {
        // Remove "start" message if it is displayed and toggle pause.
        $('.start').hide();
        this.togglePause();
      }
    // If "R" (keyCode 82) is pressed:
    } else if (event.keyCode === 82) {
      event.preventDefault();
      //Remove "game over", pause game, and swap pause message for start message.
      $('.game-over').hide();
      if (!this.pause) {
        this.togglePause();
        $('.pause').hide();
        $('.start').show();
      }

      //Replace board with a new board.
      this.board = new SnakeGame.Board(this.dimensions);
      this.initialBoardDisplay();
      this.step();

      // Else move the snake with the arrow keys and ignore all other keys.
    } else {
      event.preventDefault();
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
    if (!this.board.snake.gameOver) {
      this.updateBoard([this.board.apple.position], "apple");
      this.updateBoard(this.board.snake.segments, "snake");
      this.updateScore();
    }
  };

  View.prototype.step = function () {
    if (this.board.snake.gameOver) {
      $('.game-over').show();
      window.clearInterval(this.interval);
    } else {
      this.board.snake.move();
      this.render();
    }
  };

  View.prototype.initialBoardDisplay = function () {
    var content = "";

    for (var iRow = 0; iRow < this.board.dim; iRow++) {
      content += "<ul>";
      for (var jWidth = 0; jWidth < this.board.dim; jWidth++) {
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
      var absoluteIndex = (coord.x * this.board.dim) + coord.y;
      this.$li.eq(absoluteIndex).addClass(className);
    }.bind(this));
  };

  View.prototype.updateScore = function () {
    //Current Score content
    var scoreContent = "Current Score: "
    scoreContent += this.scoreWithCommas(this.board.snake.score);
    this.$score.html(scoreContent);

    //Current Score format
    if (this.board.snake.score != 0 && this.board.snake.score >= this.highScore) {
      this.$score.removeClass("red-score");
      this.$score.addClass("green-score");
    } else if (this.board.snake.score < this.highScore) {
      this.$score.removeClass("green-score");
      this.$score.addClass("red-score");
    } else {
      this.$score.removeClass("red-score");
      this.$score.removeClass("green-score");
    }

    // High score content
    this.highScore = Math.max(this.highScore, this.board.snake.score)
    var highScoreContent = "High Score: " + this.scoreWithCommas(this.highScore);
    this.$highScore.html(highScoreContent);

    // High score format
    if (this.highScore != 0 && this.highScore >= this.board.snake.score) {
      this.$highScore.removeClass("red-score");
      this.$highScore.addClass("green-score");
    } else if (this.highScore != 0) {
      this.$highScore.removeClass("green-score");
      this.$highScore.addClass("red-score");
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
