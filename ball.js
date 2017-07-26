
function Ball(x, y, vx, vy, radius, color, mass) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
    this._wallX = width;
    this._wallY = height;
    this._count = 0;
    this.mass = mass;
    this.color = color || "#0000ff";

    this.move = function(dt) {
        //dt = this._round(dt);
        //console.log(dt);
        //if (foo) foo(this.x, this.y);

        //if (this.x - this.radius < 0 || this.x + this.radius > width) this.vx = -this.vx;
        //if (this.y - this.radius < 0 || this.y + this.radius > height) this.vy = -this.vy;

        this.x += this.vx*dt;
        this.y += this.vy*dt;

        // var rx = getRandomInt(1, 10);
        // this.vx = this.vx > 0 ? rx : -rx;

        // var ry = getRandomInt(1, 10);
        // this.vy = this.vy > 0 ? ry : -ry;

        //posXElement.value = this.x;
        //posYElement.value = this.y;
    }

    this.draw = function(context) {
        context.beginPath();
        context.fillStyle=this.color;
        context.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
        context.closePath();
        context.fill();
    }

    this.count = function() {
        return this._count;
    }

    this.timeToHit = function(otherBall) {
        if (this === otherBall) return Number.MAX_VALUE;
        var _this = this,
            dx = otherBall.x - _this.x,
            dy = otherBall.y - _this.y,
            dvx = otherBall.vx - _this.vx,
            dvy = otherBall.vy - _this.vy,
            dvdr = dx*dvx + dy*dvy;
        if (dvdr > 0) return Number.MAX_VALUE;
        var dvdv = dvx*dvx + dvy*dvy,
            drdr = dx*dx + dy*dy,
            sigma = _this.radius + otherBall.radius,
            d = (dvdr*dvdr) - dvdv * (drdr - sigma*sigma);
        if (d < 0) return Number.MAX_VALUE;
        return -(dvdr + Math.sqrt(d)) / dvdv;
    }

    this.timeToHitHorizontalWall = function() {
        var _this = this;
        if (_this.vy < 0) return _this._round((_this.y - _this.radius) / -_this.vy);
        if (_this.vy > 0) return _this._round((_this._wallY - _this.radius - _this.y) / _this.vy, -1);
        return Number.MAX_VALUE;
    }

    this.timeToHitVerticalWall = function() {
        var _this = this;
        if (_this.vx > 0) return _this._round((_this._wallX - _this.radius - _this.x) / _this.vx, -1);
        if (_this.vx < 0) return _this._round((_this.x - _this.radius) / -_this.vx, -1);
        return Number.MAX_VALUE;
    }

    this.bounceOff = function(otherBall) {
        var _this = this,
            dx = otherBall.x - _this.x,
            dy = otherBall.y - _this.y,
            dvx = otherBall.vx - _this.vx,
            dvy = otherBall.vy - _this.vy,
            dvdr = dx*dvx + dy*dvy,
            dist = _this.radius + otherBall.radius,
            magnitude = 2 * _this.mass * otherBall.mass * dvdr / ((_this.mass + otherBall.mass) * dist),
            fx = magnitude * dx / dist,
            fy = magnitude * dy / dist;

        _this.vx += fx / _this.mass;
        _this.vy += fy / _this.mass;
        otherBall.vx -= fx / otherBall.mass;
        otherBall.vy -= fy / otherBall.mass;

        _this._count++;
        otherBall._count++;
    }

    this.bounceOffHorizontalWall = function() {
        // change velocity to reflect hitting horizontal wall
        this.vy = -this.vy;
        this._count++;
    }

    this.bounceOffVerticalWall = function() {
        this.vx = -this.vx;
        this._count++;
    }

    this._round = function(number) {
        //return Math.round(number * 100) / 100;
        return number;
    }
}

// var ball1 = new Ball(5, 5,-1, -1, 5);
// var ball2 = new Ball(50, 50, -5, -5, 5);
//var ball4 = new Ball(20, 20, 1, 1, 10);
/*var ball3 = new Ball(80, 80, 5, 5, 10);
var balls = [ball3];

setInterval(() => {
    context.clearRect(0,0,width,height);
    balls.forEach(ball => {
        ball.move(0.5);
        ball.draw();
    });
}, 1000)*/