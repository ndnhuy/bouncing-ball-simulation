function Cell(x, y) {
    this.x = x;
    this.y = y;
    this._WIDTH = 0;
    this._HEIGHT = 0;
    this._balls = [];

    this.addBall = function(ball) {
        var _this = this;
        _this._balls.push(ball);
    }

    this.removeBall = function(ball) {
        _this._balls..splice(_this._balls.indexOf(ball), 1);
    }
}