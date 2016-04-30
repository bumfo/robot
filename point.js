const Vec = require('./vec.js');

function sq(u) {
	return u * u;
}

class Point extends Vec {
	constructor(x = 0, y = 0) {
		super(x, y);
	}

	distance(u) {
		return Math.sqrt(sq(this.x - u.x) + sq(this.y - u.y));
	}
	phi(u) {
		return Math.atan2(u.y - this.y, u.x - this.x);
	}
}

module.exports = Point;
