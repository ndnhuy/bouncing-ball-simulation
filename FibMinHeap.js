function FibMinHeap() {
    this.min = null;
    this.n = 0;
    this.rootList = [];
    this.insert = function(k) {
        var _this = this,
        x = {};
        x.degree = 0;
        x.p = null;
        x.left = x.right = x;
        x.child = null;
        x.key = k;

        _this.rootList.push(x);
        if (_this.min == null || _this._less(x.key, _this.min.key)) {
            _this.min = x;
        }

        _this.n = _this.n + 1;
    }

    this.removeMin = function() {
        var _this = this;
        if (_this.min == null) return _this.min;

        var min = _this.min;
        _this.rootList.splice(_this.rootList.indexOf(min), 1);

        // add all children of min into root list
        var iter = min.child;
        do {
            if (iter == null) break;

            _this.rootList.push(iter);
            iter.p = null;
            iter = iter.right;
        } while (iter != min.child);
        _this.consolidate();
        _this.n = _this.n - 1;
        return min.key;
    }

    this.consolidate = function() {
        var _this = this,
        A = new Array(_this.n);
        for (var i = 0; i < _this.n; i++) {
            A[i] = null;
        }

        //console.log(_this.rootList.map(r => r.key));

        _this.rootList.map(o => o).forEach(root => {
            var x = root,
            d = x.degree;
            while (A[d] !== null) {
                var y = A[d];
                if (_this._less(y.key, x.key)) {
                    var tmp = x;
                    x = y;
                    y = tmp;
                }

                // link x and y - make y child of x
                _this.fibHeapLink(y, x);
                _this.rootList.splice(_this.rootList.indexOf(y), 1);
                A[d] = null;
                d = d + 1;
            }
            A[d] = x;
        });

        _this.min = null;
        A.filter(r => r != null).forEach(r => {
            if (_this.min == null) {
                //_this.rootList.length = 0;
                _this.rootList = [r];
                _this.min = r;
            } else {
                _this.rootList.push(r);
                if (_this._less(r.key, _this.min.key)) {
                    _this.min = r;
                }
            }
        });
    }

    var G = 1;
    this.consumeChildren = function(node, children, startNode) {
        G++;
        if (G == 100) return [];

        children.push(node == null ? null : node);
        if (node == null || node.right === startNode) {
            return children;
        }
        return this.consumeChildren(node.right, children, startNode);
    }

    this.fibHeapLink = function(y, x) {
        var _this = this;
        y.right = y.left = y;
        _this.addChildTo(x, y);
        x.degree = x.degree + 1;
    }
    this.addChildTo = function(parent, newChild) {
        if (parent.child == null) {
            parent.child = newChild;
            newChild.p = parent;
            return;
        }

        var currentChild = parent.child,
        tmp = currentChild.right;

        currentChild.right = newChild;
        newChild.left = currentChild;
        newChild.right = tmp;
        tmp.left = newChild;
        newChild.p = parent;
    }

    this._less = function(x, y) {
        return (typeof x === 'number' && typeof y === 'number') ? x < y : x.compareTo(y) < 0;
    }
}

// var heap = new FibMinHeap();
// heap.insert(44);
// heap.insert(16);
// heap.insert(28);
// heap.insert(12);
// heap.insert(19);
// heap.insert(65);
// heap.insert(53);
// heap.insert(1);
// heap.insert(0);
// heap.insert(-9);
// heap.insert(-90);
// heap.insert(999);

// console.log(heap.removeMin().key);
// console.log(heap.removeMin().key);
// console.log(heap.removeMin().key);
// console.log(heap.removeMin().key);
// console.log(heap.removeMin().key);
// console.log(heap.removeMin().key);
// console.log(heap.removeMin().key);
// console.log(heap.removeMin().key);
// console.log(heap.removeMin().key);
// console.log(heap.removeMin().key);

// console.log(heap.rootList.map(o => o));