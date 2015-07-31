(function () {
  if (typeof SnakeGame === "undefined") {
    window.SnakeGame = {};
  }

  var Snake = SnakeGame.Snake = function (board) {
    this.dir = "N";
    var start_coord = new Coord(Math.floor(board.dim/2), Math.floor(board.dim/2));
    this.segments = [start_coord];
  };

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

})();
