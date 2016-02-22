class Vec {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}
	add(that) {
		this.x += that.x;
		this.y += that.y;
	}
	add2(x, y) {
		this.x += x;
		this.y += y;
	}
	project(length, theta) {
		this.add2(length * Math.cos(theta), length * Math.sin(theta));
	}
}

module.exports = Vec;
