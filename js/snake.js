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
    
  };

})();
