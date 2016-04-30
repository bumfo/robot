const PI = Math.PI;
const TWO_PI = 2 * Math.PI;

class Angle {
	static normalRelative(angle) {
		return (angle % TWO_PI + TWO_PI + PI) % TWO_PI - PI; // [-Pi, Pi)
	}
	static normalAbsolute(angle) {
		return (angle % TWO_PI + TWO_PI) % TWO_PI; // [0, 2Pi)
	}
	static range(p, q) {
		return this.normalRelative(p - q) <= 0 ? [p, q] : [q, p];
	}
	static inRange(angle, range) {
		let t = Angle.normalAbsolute(angle - range[0]) / Angle.normalAbsolute(range[1] - range[0]);
		return 0 <= t && t <= 1;
	}
	static intersects(rangeA, rangeB) {
		let r1 = Angle.normalAbsolute(rangeA[1] - rangeA[0]);
		let r2 = Angle.normalAbsolute(rangeB[1] - rangeB[0]);
		let t1 = 0;
		let t2 = 0;

		if (r2 > r1) {
			t1 = Angle.normalAbsolute(rangeA[0] - rangeB[0]) / r2;
			t2 = Angle.normalAbsolute(rangeA[1] - rangeB[0]) / r2;
		} else {
			t1 = Angle.normalAbsolute(rangeB[0] - rangeA[0]) / r1;
			t2 = Angle.normalAbsolute(rangeB[1] - rangeA[0]) / r1;
		}

		return 0 <= t1 && t1 <= 1 || 0 <= t2 && t2 <= 1;
	}

	static maxRelative(phi, angleA, angleB) {
		if (Math.abs(this.normalRelative(angleA - phi)) < Math.abs(this.normalRelative(angleB - phi))) {
			return angleB;
		} else {
			return angleA;
		}
	}
}

module.exports = Angle;
