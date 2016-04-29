function sq(u) {
	return u * u;
}

class Vec2 {
	static add(u, [x, y]) {
		u[0] += x;
		u[1] += y;
		return u;
	}

	static add2(u, x, y) {
		u[0] += x;
		u[1] += y;
		return u;
	}

	static rotate(u, cos, sin) {
		let x = u[0];
		let y = u[1];

		u[0] = x * cos - y * sin;
		u[1] = y * cos + x * sin;

		return u;
	}
}

module.exports = Vec2;
