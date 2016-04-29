function sq(u) {
	return u * u;
}

class Vec2 {
	static times(u, k) {
		return [k * u[0], k * u[1]];
	}

	static plus(u, v) {
		return [u[0] + v[0], u[1] + v[1]];
	}

	static minus(u, v) {
		return [u[0] - v[0], u[1] - v[1]];
	}

	static add(u, [x, y]) {
		u[0] += x;
		u[1] += y;
		return u;
	}

	static subtract(u, [x, y]) {
		u[0] -= x;
		u[1] -= y;
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

	static dot(u, v) {
		return u[0] * v[0] + u[1] * v[1];
	}

	static cross(u, v) {
		return u[0] * v[1] - u[1] * v[0];
	}

	static polar(rho, theta) {
		return [rho * Math.cos(theta), rho * Math.sin(theta)];
	}
}

module.exports = Vec2;
