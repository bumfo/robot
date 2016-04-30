const Vec = require('./vec.js');

function sq(u) {
	return u * u;
}

class Point extends Vec {
	constructor(x = 0, y = 0) {
		super(x, y);
	}

	clone() {
		return new Point(this.x, this.y);
	}
	projected(rho, theta) {
		return new Point(this.x + rho * Math.cos(theta), this.y + rho * Math.sin(theta));
	}

	distance(u) {
		return Math.sqrt(sq(this.x - u.x) + sq(this.y - u.y));
	}
	phi(u) {
		return Math.atan2(u.y - this.y, u.x - this.x);
	}
}

module.exports = Point;
