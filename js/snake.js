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
    this.dir = "N";
    var start_coord = new Coord(Math.floor(board.row_dim/2), Math.floor(board.width_dim/2));
    this.segments = [start_coord];
    this.board = board;

    this.turning = false;
    this.growCount = 0;
  };

  Snake.DIRS = {
    "N": new Coord(-1, 0),
    "E": new Coord(0, 1),
    "S": new Coord(1, 0),
    "W": new Coord(0, -1)
  };

  Snake.SYMBOL = "S";
  Snake.DEFAULT_GROW_COUNT = 3;

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
      this.segments = [];
    }
  };

  Snake.prototype.turn = function (dir) {
    if (Snake.DIRS[this.dir].isOpposite(Snake.DIRS[dir]) || this.turning) {
      return;
    } else {
      this.turning = true;
      this.dir = dir;
    }
  };

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
      this.growCount += 3;
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
    var x = Math.floor(Math.random() * this.board.row_dim);
    var y = Math.floor(Math.random() * this.board.width_dim);

    // Don't place an apple where there is a snake
    while (this.board.snake.inhabiting([x, y])) {
      x = Math.floor(Math.random() * this.board.row_dim);
      y = Math.floor(Math.random() * this.board.width_dim);
    }

    this.position = new Coord(x, y);
  };





// ----------BOARD CLASS----------
  var Board = SnakeGame.Board = function (row_dim, width_dim) {
    this.row_dim = row_dim;
    this.width_dim = width_dim;
    this.snake = new Snake(this);
    this.apple = new Apple(this);
  };

  Board.EMPTY_SPACE_SYMBOL = ".";

  Board.buildBoard = function (row_dim, width_dim) {
    var board = [];

    for (var i = 0; i < row_dim; i++) {
      var row = [];
      for (var j = 0; j < width_dim; j++) {
        row.push(Board.EMPTY_SPACE_SYMBOL);
      }

      board.push(row);
    }

    return board;
  };

  Board.prototype.render = function () {
    var boardWithSnake = Board.buildBoard(this.row_dim, this.width_dim);

    this.snake.segments.forEach( function (segment) {
      boardWithSnake[segment.x][segment.y] = Snake.SYMBOL;
    });

    // return board_with_snake

    // join it up
    var formattedBoard = boardWithSnake.map(function (row) {
      return row.join("");
    }).join("\n");

    return formattedBoard;
  };

  Board.prototype.validPosition = function (coord) {
    return (coord.x >= 0) && (coord.x < this.row_dim) &&
    (coord.y >= 0) && (coord.y < this.width_dim);
  };

})();
