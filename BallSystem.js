var PREVIOUS_TIME = 0;
function BallSystem() {
    //this.minPQ = new FibMinHeap();
    this.minPQ = new MinPQ();
    this.currentTime = 0;
    this.balls = [];

    this.predictCollisions = function(ball) {
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
        //var startTime = new Date().getTime()/1000;
        var _this = this,
            executedEvent = _this.minPQ.removeMin();
        if (!executedEvent.isValid()) {
            if (!executedEvent.eventMinPQ || executedEvent.eventMinPQ.isEmpty()) return;
            var e = executedEvent.eventMinPQ.removeMin();
            e.eventMinPQ = executedEvent.eventMinPQ;
            _this.minPQ.insert(e);
            return;
        };

        _this.balls.forEach(ball => {
            //console.log(executedEvent.time + ' # ' + _this.currentTime);
            ball.move(executedEvent.time - _this.currentTime);
        });
        _this.currentTime = executedEvent.time;

        if (executedEvent.ballA == null && executedEvent.ballB == null) {
            context.clearRect(0,0,width,height);
            _this.balls.forEach(ball => ball.draw(context));
            _this.minPQ.insert(new Event(executedEvent.time + 0.01, null, null));
            visible_context.clearRect(0,0,width,height);
            visible_context.drawImage(canvas, 0, 0);



            var now = new Date().getTime() / 1000;
            var dur = now - PREVIOUS_TIME;
            console.log(' # ' + dur);
            //sleep(50 - dur);
            PREVIOUS_TIME = now;
        }
        else if (executedEvent.ballA != null && executedEvent.ballB == null) {
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
            //         var endTime = new Date().getTime()/1000;
            //         var durr = endTime - startTime;
            // console.log('# ' + durr);
    }
}


//###### MAIN #######
var ballSystem = new BallSystem();
ballSystem.minPQ.insert(new Event(0, null, null));

for (var i = 0; i < 100; i++) {
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
//     new Ball(50, 200, 0, 0, 20, "#f441f1", 100), // pink
//     new Ball(200, 200, -40, 0, 20, "#0000ff", 100), // xanh duong
//     new Ball(100, 200, 40, 0, 20, "#930505", 1000), // red
//     new Ball(100, 400, -100, 0, 20, "#f4e841", 100), // yellow
//     new Ball(50, 100, 0, 1, 5, "#41f4eb", 100), // blue
//     new Ball(60, 100, -10, 0, 5, "#0f0e0e", 100), // black
//     new Ball(50, 500, 0, -50, 5, "#918e8e", 100), // grey
//     new Ball(50, 400, 0, 0, 5, "#e27c00", 500) // orange

     new Ball(200, 200, 5, 5, 100, "#930505", 5000)
);

ballSystem.balls.forEach(ball => ballSystem.predictCollisions(ball));

function debug() {
    // console.log('######################################');
    //console.log(JSON.parse(JSON.stringify(ballSystem.minPQ.pQueue)));
    //console.log('#');
    //console.log(ballSystem.minPQ.rootList.length);
    ballSystem.simulate();
    requestAnimationFrame(debug);
}

//debug();


// for (var i = 0; i < 120; i++) {
//     debug();
// }

setInterval(() => {
    //console.log(ballSystem.minPQ.pQueue.length);
    //console.log(ballSystem.currentTime);
    ballSystem.simulate();
}, 1);


//####
var balls = [];
for (var i = 0; i < 80; i++) {
    balls.push(
        new Ball(
            getRandomInt(50, width - 100),
            getRandomInt(50, height - 100),
            getRandomInt(5, 5),
            getRandomInt(5, 5),
            getRandomInt(50, 50),
            getRandomColor()));
}

function animate() {
    var now = new Date().getTime() / 1000;
    console.log(now - PREVIOUS_TIME);
    PREVIOUS_TIME = now;


    context.clearRect(0,0,width,height);
    balls.forEach(ball => {
        ball.move(1);
        ball.draw(context);
    });
    visible_context.clearRect(0,0,width,height);
    visible_context.drawImage(canvas, 0, 0);
    requestAnimationFrame(animate);
}
//animate();




// requestAnimationFrame(() => {
//     context.clearRect(0,0,width,height);
//     balls.forEach(ball => {
//         ball.move(0.5);
//         ball.draw(context);
//     });
//     visible_context.drawImage(canvas, 0, 0);
// });

// setInterval(() => {
//     context.clearRect(0,0,width,height);
//     balls.forEach(ball => {
//         ball.move(0.5);
//         ball.draw();
//     });
// }, 1)


// #####################
// var stop = false;
// var frameCount = 0;
// var fps, fpsInterval, startTime, now, then, elapsed;

// startAnimating(60);

// function startAnimating(fps) {
//     fpsInterval = 1000 / fps;
//     then = Date.now();
//     startTime = then;
//     console.log(startTime);
//     animate();
// }


// function animate() {

//     // stop
//     if (stop) {
//         return;
//     }

//     // request another frame

//     requestAnimationFrame(animate);

//     // calc elapsed time since last loop

//     now = Date.now();
//     elapsed = now - then;

//     // if enough time has elapsed, draw the next frame

//     if (elapsed > fpsInterval) {

//         // Get ready for next frame by setting then=now, but...
//         // Also, adjust for fpsInterval not being multiple of 16.67
//         then = now - (elapsed % fpsInterval);

//         // draw stuff here
//         ballSystem.simulate();
//     }
// }

function sleep(milliseconds) {
    if (milliseconds < 0) return;
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}