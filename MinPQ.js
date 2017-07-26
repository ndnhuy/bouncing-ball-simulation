function MinPQ() {
    this.pQueue = [{}];
    this.insert = function(key) {
        this.pQueue.push(key);
        var k = this.pQueue.length - 1;
        while (k > 1 && this._less(this.pQueue[k], this.pQueue[Math.floor(k/2)])) {
            this._exchange(k, Math.floor(k/2));
            k = Math.floor(k/2);
        }
    }

    this.removeMin = function() {
        this._exchange(this.pQueue.length - 1, 1);
        returnValue = this.pQueue.pop();

        var k = 1;
        var smallerChildIndex;
        while (2*k < this.pQueue.length) {
            if (2*k + 1 > this.pQueue.length - 1) {
                smallerChildIndex = 2*k;
            }
            else {
                smallerChildIndex = this._less(this.pQueue[2*k], this.pQueue[2*k + 1]) ? 2*k : 2*k + 1;
            }

            if (this._less(this.pQueue[k], this.pQueue[smallerChildIndex])) {
                break;
            }

            this._exchange(k, smallerChildIndex);
            k = smallerChildIndex;
        }

        return returnValue;
    }

    this.isEmpty = function() {
        return this.pQueue.length == 1;
    }

    this._exchange = function(x, y) {
        var tmp = this.pQueue[x];
        this.pQueue[x] = this.pQueue[y];
        this.pQueue[y] = tmp;
    }

    this._less = function(x, y) {
        return (typeof x === 'number' && typeof y === 'number') ? x < y : x.compareTo(y) < 0;
    }
}

// q = new MinPQ();
// q.insert(44);
// q.insert(16);
// q.insert(28);
// q.insert(12);
// q.insert(65);
// q.insert(53);
// q.insert(1);
// q.insert(0);

// console.log('###### RESULT #######');
// console.log(JSON.stringify(q));

// q.removeMin();
// q.removeMin();

// console.log('###### RESULT #######');
// console.log(JSON.stringify(q));