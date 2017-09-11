var PREVIOUS_TIME = 0;
function BallSystem() {
    //this.minPQ = new FibMinHeap();
    this.minPQ = new MinPQ();
    this.currentTime = 0;
    this.balls = [];
    this._ballsByCell = {};
    this.CELL_WIDTH = 750;
    this.CELL_HEIGHT = 450;
    this.WALL_X = width;
    this.WALL_Y = height;

    // ### TEST ###

    var init = () => {
        var cells = initCells();
        var ballsByCell = {};
        cells.forEach(c => ballsByCell[c.x + '-' + c.y] = []);
        balls.forEach(b => {
            var cellX = Math.floor(b.x/CELL_WIDTH)*CELL_WIDTH;
            var cellY = Math.floor(b.y/CELL_HEIGHT)*CELL_HEIGHT;
            ballsByCell[cellX + '-' + cellY].push(b);
        });
    };

    this.init = function() {
        var _this = this;
        _this.minPQ.insert(new Event(0, null, null));

        _this._initCells([], 0, 0, _this.CELL_WIDTH, _this.CELL_HEIGHT, _this.WALL_X, _this.WALL_Y)
            .forEach(c => _this._ballsByCell[c.x + '-' + c.y] = []);

        _this.balls.forEach(b => {
            var cellX = Math.floor(b.x/_this.CELL_WIDTH)*this.CELL_WIDTH;
            var cellY = Math.floor(b.y/_this.CELL_HEIGHT)*this.CELL_HEIGHT;
            _this._ballsByCell[_this._calcCellId(_this._calcCurrentCell(b))].push(b);
        });
    },

    this._initCells = (cells, x, y, wCell, hCell, wallX, wallY) => {
        var cells = [];
        for (var j = 0; j < wallY; j+=hCell) {
            for (var i = 0; i < wallX; i+=wCell) {
                cells.push({
                    x: i,
                    y: j
                });
            }
        }
        return cells;

        // if (x >= wallX) {
        //     return this._initCells(cells, 0, y + hCell, wCell, hCell, wallX, wallY);
        // }
        // if (y >= wallY) {
        //     return cells;
        // }

        // cells.push({
        //     x: x,
        //     y: y
        // });
        // return this._initCells(cells, x + wCell, y, wCell, hCell, wallX, wallY);
    };

    this._flatMap = (array, callback) => [].concat.apply([], array.map(callback));

    this.predictUsingCellMethod= function(ball, boundaryCrossingEvent) {
        var _this = this;
        var eventMinPQ = new MinPQ();
        // identify which cell this ball belongs to

        //console.log('from predictUsingCellMethod');
        //console.log(ball.x + ' $ ' + ball.y);
        var cell = _this._calcCurrentCell(ball);

        // from the cell, I have a list of balls that might be in
        // collision with current ball
        if (boundaryCrossingEvent != null) {
            var neighbors = _this._getNewNeighboringBalls(boundaryCrossingEvent.fromCell, cell);
            neighbors.filter(b => b !== ball).forEach(other => {
                var t = ball.timeToHit(other);
                if (t < 10000) {
                    eventMinPQ.insert(new Event(_this.currentTime + t, ball, other));
                }
            });

            // // when to hit wall
            // if (_this._ifCanHitVerticalWall(boundaryCrossingEvent.toCell, ball)) {
            //     console.log('add hit vertical wall event');
            //     console.log(ball.x + ' # ' + ball.y);
            //     _this.minPQ.insert(new Event(_this.currentTime + ball.timeToHitVerticalWall(), ball, null));
            // } else if (_this._ifCanHitHorizontalWall(boundaryCrossingEvent.toCell, ball)) {
            //     console.log('add hit horizon wall event');
            //     console.log(ball.x + ' # ' + ball.y);
            //     _this.minPQ.insert(new Event(_this.currentTime + ball.timeToHitHorizontalWall(), null, ball));
            // }

            // // when to cross boundary
            // if (_this._ifCanCrossVerticalBoundary(cell, ball)) {
            //     console.log('add boundary vertical crossing event');
            //     console.log(ball.x + ' # ' + ball.y + ' #cell.x = ' + boundaryCrossingEvent.toCell.x);
            //     var verticalBorderCrossEvent = new Event(_this.currentTime + ball.timeToCrossVerticalBorder(_this.CELL_WIDTH, _this.CELL_HEIGHT), ball, null, true);
            //     verticalBorderCrossEvent.fromCell = cell;
            //     eventMinPQ.insert(verticalBorderCrossEvent);
            //     console.log(JSON.parse(JSON.stringify(verticalBorderCrossEvent)));
            // }
            // if (_this._ifCanCrossHorizontalBoundary(cell, ball)) {
            //     console.log('add boundary horizon crossing event');
            //     console.log(ball.x + ' # ' + ball.y + ' #cell.y = ' + boundaryCrossingEvent.toCell.y + ' #timeToCross = ' + ball.timeToCrossHorizontalBorder(_this.CELL_WIDTH, _this.CELL_HEIGHT));
            //     var horizonBorderCrossEvent = new Event(_this.currentTime + ball.timeToCrossHorizontalBorder(_this.CELL_WIDTH, _this.CELL_HEIGHT), ball, null, true);
            //     horizonBorderCrossEvent.fromCell = cell;
            //     eventMinPQ.insert(horizonBorderCrossEvent);
            //     console.log(JSON.parse(JSON.stringify(horizonBorderCrossEvent)));
            // }
        } else {
            // when to hit neighbors
            var neighbors = [];
            neighbors = _this._flatMap(_this._getSurroundingCells(cell).map(cell => cell.x + '-' + cell.y),
                            cellId => _this._ballsByCell[cellId]);

            neighbors.filter(b => b !== ball).forEach(other => {
                var t = ball.timeToHit(other);
                if (t < 10000) {
                    eventMinPQ.insert(new Event(_this.currentTime + t, ball, other));
                }
            });
        }

        // when to hit wall
        if (_this._ifCanHitVerticalWall(cell, ball)) {
            //console.log('add hit vertical wall event');
            //console.log(ball.x + ' # ' + ball.y);
            _this.minPQ.insert(new Event(_this.currentTime + ball.timeToHitVerticalWall(), ball, null));
        }
        if (_this._ifCanHitHorizontalWall(cell, ball)) {
            //console.log('add hit horizon wall event');
            //console.log(ball.x + ' # ' + ball.y);
            _this.minPQ.insert(new Event(_this.currentTime + ball.timeToHitHorizontalWall(), null, ball));
        }

        // when to cross boundary
        var verticalBorderCrossEvent = null, horizonBorderCrossEvent = null;
        if (_this._ifCanCrossVerticalBoundary(cell, ball)) {
            //console.log('add boundary vertical crossing event');
            //console.log(ball.x + ' # ' + ball.y + ' #cell.x = ' + cell.x + ' #timeToCross = ' + ball.timeToCrossVerticalBorder(_this.CELL_WIDTH, _this.CELL_HEIGHT));
            verticalBorderCrossEvent = new Event(_this.currentTime + ball.timeToCrossVerticalBorder(_this.CELL_WIDTH, _this.CELL_HEIGHT), ball, null, true);
            verticalBorderCrossEvent.fromCell = cell;
            //console.log(JSON.parse(JSON.stringify(verticalBorderCrossEvent)));
        }
        if (_this._ifCanCrossHorizontalBoundary(cell, ball)) {
            //console.log('add boundary horizon crossing event');
            //console.log(ball.x + ' # ' + ball.y + ' #cell.y = ' + cell.y + ' #timeToCross = ' + ball.timeToCrossHorizontalBorder(_this.CELL_WIDTH, _this.CELL_HEIGHT));
            horizonBorderCrossEvent = new Event(_this.currentTime + ball.timeToCrossHorizontalBorder(_this.CELL_WIDTH, _this.CELL_HEIGHT), ball, null, true);
            horizonBorderCrossEvent.fromCell = cell;
            //console.log(JSON.parse(JSON.stringify(horizonBorderCrossEvent)));
        }
        if (verticalBorderCrossEvent != null && horizonBorderCrossEvent != null) {
            if (verticalBorderCrossEvent.time < horizonBorderCrossEvent.time) {
                _this.minPQ.insert(verticalBorderCrossEvent);
            } else {
                _this.minPQ.insert(horizonBorderCrossEvent);
            }

        } else if (verticalBorderCrossEvent != null) {
            _this.minPQ.insert(verticalBorderCrossEvent);
        } else if (horizonBorderCrossEvent != null) {
            _this.minPQ.insert(horizonBorderCrossEvent);
        }

        if (!eventMinPQ.isEmpty()) {
            var earliestEvent = eventMinPQ.removeMin();
            earliestEvent.eventMinPQ = eventMinPQ;
            _this.minPQ.insert(earliestEvent);
        }

        // cross over:
        //      right, left, up, down,
        //      top left corner, bottom left corner, top right corner, bottom right corner

        // start predicting current ball with the list of balls

        // ---
        // the ball might hit the wall

        // predict when it cross boundary
    }

    this._ifCanCrossVerticalBoundary = function(cell, ball) {
        return (ball.vx > 0 && cell.x + this.CELL_WIDTH < this.WALL_X)
                || (ball.vx < 0 && cell.x > 0);
    };

    this._ifCanCrossHorizontalBoundary = function(cell, ball) {
        return (ball.vy > 0 && cell.y + this.CELL_HEIGHT < this.WALL_Y)
                || (ball.vy < 0 && cell.y > 0);
    };

    this._getSurroundingCells = (cell) => {
        return [cell].concat({ // up
            x: cell.x,
            y: cell.y - this.CELL_HEIGHT
        }).concat({ // down
            x: cell.x,
            y: cell.y + this.CELL_HEIGHT
        }).concat({ // left
            x: cell.x - this.CELL_WIDTH,
            y: cell.y
        }).concat({ // right
            x: cell.x + this.CELL_WIDTH,
            y: cell.y
        }).concat({ // top left
            x: cell.x - this.CELL_WIDTH,
            y: cell.y - this.CELL_HEIGHT
        }).concat({ // top right
            x: cell.x + this.CELL_WIDTH,
            y: cell.y - this.CELL_HEIGHT
        }).concat({ // bottom left
            x: cell.x - this.CELL_WIDTH,
            y: cell.y + this.CELL_HEIGHT
        }).concat({ // bottom right
            x: cell.x + this.CELL_WIDTH,
            y: cell.y + this.CELL_HEIGHT
        }).filter(c => c.x >= 0 && c.x < this.WALL_X && c.y < this.WALL_Y && c.y >= 0);
    };

    this._getNewNeighboringBalls = function(fromCell, toCell) {
        var _this = this;
        var oldNeighborCells = this._getSurroundingCells(fromCell);
        var newNeighborCells = this._getSurroundingCells(toCell);
        return this._flatMap(newNeighborCells.filter(c => oldNeighborCells.indexOf(c) === -1),
                                c => _this._ballsByCell[c.x + '-' + c.y]);
        // if (toCell.x > fromCell.x) { // move right
        //     if (toCell.y )
        // } else if (toCell.x < fromCell.x) { // move left

        // } else if (toCell.y < fromCell.y) { // move up

        // } else if (toCell.y > fromCell.y) { // move down

        // }
    }

    this._ifCanHitVerticalWall = function(cell, ball) {
        return (ball.vx > 0 && cell.x + this.CELL_WIDTH == this.WALL_X)
                || (ball.vx < 0 && cell.x == 0);

    }

    this._ifCanHitHorizontalWall = function(cell, ball) {
        return (ball.vy > 0 && (cell.y + this.CELL_HEIGHT == this.WALL_Y))
                || (ball.vy < 0 && cell.y == 0);
    }

    // this._getIdOfAboveCell = (cell) => {};
    // this._getIdOfLeftCell = (cell) => {};
    // this._getIdOfRightCell = (cell) => {};
    // this._getIdOfBelowCell = (cell) => {};
    // this._getIdOfTopLeftCell = (cell) => {};
    // this._getIdOfTopRightCell = (cell) => {};
    // this._getIdOfBottomLeftCell = (cell) => {};
    // this._getIdOfBottomRightCell = (cell) => {};

    // predict collisions with neighbors
    this.predictCollisions = function(ball, boundaryCrossing) {
        //this.predictUsingCellMethod(ball, boundaryCrossing);


        if (ball == null) return;

        var _this = this,
        eventMinPQ = new MinPQ();

        var verticalEvent = new Event(_this.currentTime + ball.timeToHitVerticalWall(), ball, null);
        var horizonEvent = new Event(_this.currentTime + ball.timeToHitHorizontalWall(), null, ball);

        if (verticalEvent.time - _this.currentTime < 10000) {
            //_this.minPQ.insert(verticalEvent);
            eventMinPQ.insert(verticalEvent);
        }
        if (horizonEvent.time - _this.currentTime < 10000) {
            //_this.minPQ.insert(horizonEvent)
            eventMinPQ.insert(horizonEvent);
        };

        _this.balls.filter(b => b !== ball).forEach(other => {
            var t = ball.timeToHit(other);
            if (t < 10000) {
                //_this.minPQ.insert(new Event(_this.currentTime + t, ball, other));
                eventMinPQ.insert(new Event(_this.currentTime + t, ball, other));
            }
        });

        if (!eventMinPQ.isEmpty()) {
            var earliestEvent = eventMinPQ.removeMin();
            earliestEvent.eventMinPQ = eventMinPQ;
            _this.minPQ.insert(earliestEvent);
        }
    }

    this.simulate = function() {
        var _this = this,
            executedEvent = _this.minPQ.removeMin();
        if (executedEvent.isValid() != null) {
            if (executedEvent.isValid() === executedEvent.ballA) return;
            if (!executedEvent.eventMinPQ || executedEvent.eventMinPQ.isEmpty()) return;
            var e = executedEvent.eventMinPQ.removeMin();
            e.eventMinPQ = executedEvent.eventMinPQ;
            _this.minPQ.insert(e);
            return;
        };

        //console.log(JSON.parse(JSON.stringify(executedEvent)));

        _this.balls.forEach(ball => {
            ball.move(executedEvent.time - _this.currentTime);
        });

        //console.log(_this.balls[1].x + ' $$$ ' + _this.balls[1].y + ' time = ' + (executedEvent.time - _this.currentTime));

        _this.currentTime = executedEvent.time;

        if (executedEvent.ballA == null && executedEvent.ballB == null) {
            context.clearRect(0,0,width,height);
            _this.balls.forEach(ball => ball.draw(context));
            _this.minPQ.insert(new Event(executedEvent.time + 0.001, null, null));
            visible_context.clearRect(0,0,width,height);
            visible_context.drawImage(canvas, 0, 0);


            var now = new Date().getTime() / 1000;
            var dur = now - PREVIOUS_TIME;
            //console.log(' # ' + dur);
            //sleep(50 - dur);
            PREVIOUS_TIME = now;
        }
        else if (executedEvent.ballA != null && executedEvent.ballB == null && executedEvent.isBoundaryCrossing) {

            //console.log(JSON.parse(JSON.stringify(this._ballsByCell)));

            var currentCell = _this._calcCurrentCell(executedEvent.ballA);
            // console.log(JSON.parse(JSON.stringify(_this.minPQ)));
            // console.log(JSON.parse(JSON.stringify(executedEvent)));
            // console.log(JSON.parse(JSON.stringify(currentCell)));

            _this._ballsByCell[_this._calcCellId(currentCell)].push(executedEvent.ballA);
            var ballIndex = _this._ballsByCell[_this._calcCellId(executedEvent.fromCell)].indexOf(executedEvent.ballA);
            _this._ballsByCell[_this._calcCellId(executedEvent.fromCell)].splice(ballIndex, 1);

            _this.predictCollisions(executedEvent.ballA, {
                fromCell: executedEvent.fromCell,
                toCell: currentCell
            });
        }
        else if (executedEvent.ballA != null && executedEvent.ballB == null && !executedEvent.isBoundaryCrossing) {
            executedEvent.ballA.bounceOffVerticalWall();
            _this.predictCollisions(executedEvent.ballA);
        }
        else if (executedEvent.ballA == null && executedEvent.ballB != null) {
            executedEvent.ballB.bounceOffHorizontalWall();
            _this.predictCollisions(executedEvent.ballB);
        }
        else if (executedEvent.ballA != null && executedEvent.ballB != null) {
            executedEvent.ballA.bounceOff(executedEvent.ballB);
            _this.predictCollisions(executedEvent.ballA);
            _this.predictCollisions(executedEvent.ballB);
        }
    }

    this._calcCellId = function(cell) {
        return cell.x + '-' + cell.y;
    }

    this._calcCurrentCell = function(ball) {
        var cell = {
            x: Math.floor(ball.x/this.CELL_WIDTH)*this.CELL_WIDTH,
            y: Math.floor(ball.y/this.CELL_HEIGHT)*this.CELL_HEIGHT
        };
        return {
            x: cell.x >= this.WALL_X ? cell.x - this.CELL_WIDTH : cell.x,
            y: cell.y >= this.WALL_Y ? cell.y - this.CELL_HEIGHT : cell.y
        };
    }
}


//###### MAIN #######
var ballSystem = new BallSystem();

for (var i = 0; i < 200; i++) {
    var radius = getRandomInt(3, 10);
    ballSystem.balls.push(
        new Ball(
            getRandomInt(50, width - 100),
            getRandomInt(50, height - 100),
            //getRandomInt(1, 1)/getRandomInt(2, 5),
            //getRandomInt(1, 1)/getRandomInt(2, 5),
            getRandomInt(5, 200),
            getRandomInt(5, 200),
            radius,
            getRandomColor(),
            radius*radius / 10));
}

ballSystem.balls.push(
    //new Ball(50, 200, 50, 0, 20, "#f441f1", 100), // pink
    //new Ball(200, 200, -100, 0, 20, "#0000ff", 100), // xanh duong
    // new Ball(100, 200, 40, 0, 20, "#930505", 1000), // red
    // new Ball(100, 400, -100, 0, 20, "#f4e841", 100), // yellow
    // new Ball(50, 100, 0, 1, 5, "#41f4eb", 100), // blue
    // new Ball(60, 100, -10, 0, 5, "#0f0e0e", 100), // black
    // new Ball(200, 500, 50, -50, 5, "#918e8e", 100), // grey
    // new Ball(50, 400, 0, 0, 5, "#e27c00", 500) // orange

    // new Ball(200, 200, -100, 100, 5, "#930505", 100),
    // new Ball(500, 200, 100, -100, 5, "#0f0e0e", 100),
    new Ball(150, 500, 1500, 0, 100, "#930505", 1000),
    new Ball(1000, 500, -1500, 0, 100, "#0000ff", 1000)
);
ballSystem.init();

ballSystem.balls.forEach(ball => ballSystem.predictCollisions(ball));

function debug() {
    ballSystem.simulate();
    requestAnimationFrame(debug);
}

// console.log(JSON.parse(JSON.stringify(ballSystem.minPQ.pQueue)));
// ballSystem.simulate();
// console.log(JSON.parse(JSON.stringify(ballSystem.minPQ.pQueue)));
// ballSystem.simulate();
// console.log(JSON.parse(JSON.stringify(ballSystem.minPQ.pQueue)));


// for (var i = 0; i < 1500; i++) {
//     console.log('--------------------------------');
//     //console.log(JSON.parse(JSON.stringify(ballSystem.minPQ.pQueue)));
//     console.log(JSON.stringify(ballSystem.minPQ.pQueue));
//     ballSystem.simulate();
// }

var count = 0;
setInterval(() => {
    //console.log(JSON.stringify(ballSystem.minPQ.pQueue));
    console.log(ballSystem.minPQ.pQueue.length);
    //console.log('#' + count);
    //count++;
    //console.log(ballSystem.currentTime);
    ballSystem.simulate();
}, 1);