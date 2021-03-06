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

    this.dimensions = 20;
    this.scoreIncrements = 100;

    // Setup and display board and pause game
    this.board = new SnakeGame.Board(this.dimensions, this.scoreIncrements);
    this.initialBoardDisplay();
    this.render();
    this.pause = true;

    // Event handlers
    $(window).on("keydown", this.handleKeyEvent.bind(this));
    $("#fast-speed").on("click", this.fastSpeedSnake.bind(this));
    $("#normal-speed").on("click", this.normalSpeedSnake.bind(this));
    $("#slow-speed").on("click", this.slowSpeedSnake.bind(this));
    $("#slowest-speed").on("click", this.slowestSpeedSnake.bind(this));
    $(".start-game").on("click", this.pressSpacebar.bind(this));
    $(".restart-game").on("click", this.keypressR.bind(this));

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

    if (event.keyCode === 48 && this.board.snake.newGame) {
      // If "0" (keyCode 48) is pressed:
      event.preventDefault();
      this.fastSpeedSnake();

    } else if (event.keyCode === 49 && this.board.snake.newGame) {
      // If "1" (keyCode 49) is pressed:
      event.preventDefault();
      this.normalSpeedSnake();

    } else if (event.keyCode === 50 && this.board.snake.newGame) {
      // If "2" (keyCode 50) is pressed:
      event.preventDefault();
      this.slowSpeedSnake();

    } else if (event.keyCode === 51 && this.board.snake.newGame) {
      // If "3" (keyCode 51) is pressed:
      event.preventDefault();
      this.slowestSpeedSnake();

    } else if (event.keyCode === 32) {
      // If "spacebar" (keyCode 32) is pressed:
      event.preventDefault();
      this.pressSpacebar();

    } else if (event.keyCode === 82) {
      // If "R" (keyCode 82) is pressed:
      event.preventDefault();
      this.keypressR();

      // Else move the snake with the arrow keys and ignore all other keys.
    } else {
      var newDir = View.KEY_DIRS[event.keyCode];
      if (newDir) {
        event.preventDefault();
        this.board.snake.turn(newDir);
        this.board.snake.newGame = false;
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
      this.updateGameOverModal();
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
    if (this.board.snake.score === 0) {
      this.$score.removeClass("red-score");
      this.$score.removeClass("green-score");
    } else if (this.board.snake.score >= this.highScore) {
      this.$score.removeClass("red-score");
      this.$score.addClass("green-score");
    } else if (this.board.snake.score < this.highScore) {
      this.$score.removeClass("green-score");
      this.$score.addClass("red-score");
    }

    // High score content
    this.highScore = Math.max(this.highScore, this.board.snake.score)
    var highScoreContent = "High Score: " + this.scoreWithCommas(this.highScore);
    this.$highScore.html(highScoreContent);

    // High score format
    if (this.highScore === 0) {
      this.$highScore.removeClass("red-score");
      this.$highScore.removeClass("green-score");
    } else if (this.highScore >= this.board.snake.score) {
      this.$highScore.removeClass("red-score");
      this.$highScore.addClass("green-score");
    }
  };

  View.prototype.updateGameOverModal = function () {
    var scoreNoteContent = "You scored " + this.board.snake.score + " points!"
    $(".score-notification").html(scoreNoteContent);
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

  View.prototype.fastSpeedSnake = function () {
      this.changeSnakeSpeed(250, 50);
      this.flashSpeedNotification();
      this.$el.find(".title").html("El Serpent Loco");
  };

  View.prototype.normalSpeedSnake = function () {
      this.changeSnakeSpeed(100, 100);
      this.flashSpeedNotification();
      this.$el.find(".title").html("Snake");
  };

  View.prototype.slowSpeedSnake = function () {
      this.changeSnakeSpeed(50, 150);
      this.flashSpeedNotification();
      this.$el.find(".title").html("Slow Snake");
  };

  View.prototype.slowestSpeedSnake = function () {
      this.changeSnakeSpeed(25, 200);
      this.flashSpeedNotification();
      this.$el.find(".title").html("Slowest Snake");
  };

  View.prototype.changeSnakeSpeed = function (scoreIncrements, stepMilliseconds) {
    this.scoreIncrements = scoreIncrements;
    this.board.scoreIncrements = scoreIncrements;
    this.highScore = 0;
    this.updateScore();
    View.MILLISECONDS_PER_STEP = stepMilliseconds;
  };

  View.prototype.pressSpacebar = function () {
    if (!this.board.snake.gameOver) {
      this.board.snake.newGame = false;
      
      // Remove "start" message if it is displayed and toggle pause.
      $('.start').hide();
      this.togglePause();
    }
  };

  View.prototype.keypressR = function () {
    if (!this.pause) {
      this.togglePause();
    }

    //Remove "game over", pause game, and swap pause message for start message.
    $('.game-over').hide();
    $('.pause').hide();
    $('.start').show();

    //Replace board with a new board.
    this.board = new SnakeGame.Board(this.dimensions, this.scoreIncrements);
    this.initialBoardDisplay();
    this.render();
  };

  View.prototype.flashSpeedNotification = function () {
    if (this.notifying) {
      return;
    } else {

      this.notifying = true;
      var content = View.SPEEDS[View.MILLISECONDS_PER_STEP] + " selected";
      $('.speed-notification').html(content);
      $('.speed-notification').show("easing");

      setTimeout(function () {
        $('.speed-notification').hide("easing");
      }.bind(this), 900);

      setTimeout(function () {
        this.notifying = false;
      }.bind(this), 1000);
    }
  };

  View.SPEEDS = {
    50: "fast",
    100: "normal",
    150: "slow",
    200: "slowest"
  };

})();
