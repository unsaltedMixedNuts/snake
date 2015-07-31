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
    return (this.x === (-1 * coord.x)) && (this.j === (-1 * coord.y));
  };



// ----------SNAKE CLASS----------
  var Snake = SnakeGame.Snake = function (board) {
    this.dir = "N";
    var start_coord = new Coord(Math.floor(board.row_dim/2), Math.floor(board.width_dim/2));
    this.segments = [start_coord];
  };

  Snake.DIRS = {
    "N": new Coord(-1, 0),
    "E": new Coord(0, 1),
    "S": new Coord(1, 0),
    "W": new Coord(0, -1)
  };

  Snake.SYMBOL = "S"

  Snake.prototype.head = function () {
    return this.segments[this.segments.length - 1];
  };

  Snake.prototype.move = function () {
    this.segments.push(this.head().plus(Snake.DIRS[this.dir]));
    this.segments.shift();
  };

  Snake.prototype.turn = function (dir) {
    this.dir = dir;
  };



// ----------BOARD CLASS----------
  var Board = SnakeGame.Board = function (row_dim, width_dim) {
    this.row_dim = row_dim;
    this.width_dim = width_dim;
    this.snake = new Snake(this);
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

})();
