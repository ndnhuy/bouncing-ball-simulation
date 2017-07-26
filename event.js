function Event(t, ballA, ballB) {
    this.time = t;
    this.ballA = ballA;
    this.ballB = ballB;
    this.countA = -1;
    this.countB = -1;

    this.isValid = function() {
        if (this.ballA != null && this.ballA.count() != this.countA) return false;
        if (this.ballB != null && this.ballB.count() != this.countB) return false;
        return true;
    }

    this.compareTo = function(other) {
        return this.time - other.time;
    }

    ballA != null ? this.countA = ballA.count() : this.countA = -1;
    ballB != null ? this.countB = ballB.count() : this.countB = -1;
}