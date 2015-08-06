(function () {
  if (typeof SnakeGame === "undefined") {
    window.SnakeGame = {};
  }

// ----------COORD CLASS----------
  var Coord = SnakeGame.Coord = function (x, y) {
    this.x = x;
    this.y = y;
  };

  Coord.prototype.plus = function (coord) {
    return new Coord(this.x + coord.x, this.y + coord.y);
  };

  Coord.prototype.equals = function (coord) {
    return (this.x === coord.x) && (this.y === coord.y);
  };

  Coord.prototype.isOpposite = function (coord) {
    return (this.x == (-1 * coord.x)) && (this.y == (-1 * coord.y));
  };



// ----------SNAKE CLASS----------
  var Snake = SnakeGame.Snake = function (board) {
    this.board = board;
    this.newGame = true;
    this.gameOver = false;
    this.score = 0;
    this.dir = "N";
    this.turning = false;
    var start_coord = new Coord(Math.floor(board.dim/2), Math.floor(board.dim/2));
    this.segments = [start_coord];
    this.growCount = 0;
  };

  // Snake Constants
  Snake.DIRS = {
    "N": new Coord(-1, 0),
    "E": new Coord(0, 1),
    "S": new Coord(1, 0),
    "W": new Coord(0, -1)
  };
  Snake.DEFAULT_GROW_INCREMENTS = 3;

  Snake.prototype.head = function () {
    return this.segments[this.segments.length - 1];
  };

  Snake.prototype.invalid = function () {
    if (!this.board.validPosition(this.head())) {
      return true;
    }

    for (var i = 0; i < this.segments.length - 1; i++) {
      if (this.segments[i].equals(this.head())) {
        return true;
      }
    }
    return false;
  };

  Snake.prototype.move = function () {
    this.segments.push(this.head().plus(Snake.DIRS[this.dir]));
    this.turning = false;

    if (this.appleEaten()) {
      this.board.apple.respawn();
    }

    if (this.growCount > 0) {
      this.growCount -= 1;
    } else {
      this.segments.shift();
    }

    if (this.invalid()) {
      this.gameOver = true;
    }
  };

  Snake.prototype.turn = function (dir) {
    // Allow first move to be opposite direction of default direction
    if (this.newGame) {
      this.newGame = false;
      this.turning = true;
      this.dir = dir;

    // Disallow move to be opposite of current direction unless it's first move.
    } else if (Snake.DIRS[this.dir].isOpposite(Snake.DIRS[dir]) || this.turning) {
      return;
    } else {
      this.turning = true;
      this.dir = dir;
    }
  };

  // This tells us if snake is inhabiting a current slot (e.g. an apple's slot).
  Snake.prototype.inhabiting = function (array) {
    var result = false;
    this.segments.forEach(function (segment) {
      if (segment.x === array[0] && segment.y === array[1]) {
        result = true;
        return result;
      }
    });
    return result;
  };

  Snake.prototype.appleEaten = function () {
    if (this.head().equals(this.board.apple.position)) {
      this.growCount += Snake.DEFAULT_GROW_INCREMENTS;
      this.score += this.board.scoreIncrements;
      return true;
    } else {
      return false;
    }
  };




  // ----------APPLE CLASS----------
  var Apple = SnakeGame.Apple = function (board) {
    this.board = board;
    this.respawn();
  };

  Apple.prototype.respawn = function () {
    var x = Math.floor(Math.random() * this.board.dim);
    var y = Math.floor(Math.random() * this.board.dim);

    // Avoid spawning an apple where there is a snake.
    while (this.board.snake.inhabiting([x, y])) {
      x = Math.floor(Math.random() * this.board.dim);
      y = Math.floor(Math.random() * this.board.dim);
    }

    this.position = new Coord(x, y);
  };





// ----------BOARD CLASS----------
  var Board = SnakeGame.Board = function (dim) {
    this.dim = dim;
    this.scoreIncrements = Board.DEFAULT_SCORE_INCREMENTS;
    this.snake = new Snake(this);
    this.apple = new Apple(this);
  };

  // Board Constants
  Board.DEFAULT_SCORE_INCREMENTS = 100;

  Board.prototype.validPosition = function (coord) {
    return (coord.x >= 0) && (coord.x < this.dim) &&
    (coord.y >= 0) && (coord.y < this.dim);
  };

})();
