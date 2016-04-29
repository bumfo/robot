class Vec {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}
	add(that) {
		this.x += that.x;
		this.y += that.y;

		return this;
	}
	add2(x, y) {
		this.x += x;
		this.y += y;

		return this;
	}
	project(length, theta) {
		this.add2(length * Math.cos(theta), length * Math.sin(theta));

		return this;
	}

	static times(u, k) {
		return new this(k * u.x, k * u.y);
	}

	static plus(u, v) {
		return new this(u.x + v.x, u.y + v.y);
	}

	static minus(u, v) {
		return new this(u.x - v.x, u.y - v.y);
	}

	static dot(u, v) {
		return u.x * v.x + u.y * v.y;
	}

	static cross(u, v) {
		return u.x * v.y - u.y * v.x;
	}

	static polar(rho, theta) {
		return new this(rho * Math.cos(theta), rho * Math.sin(theta));
	}

	static oriented(u, cos, sin) {
		let x = u.x;
		let y = u.y;
		return new this(x * cos - y * sin, y * cos + x * sin);
	}

	static oriented2(x, y, cos, sin) {
		return new this(x * cos - y * sin, y * cos + x * sin);
	}
}

module.exports = Vec;
