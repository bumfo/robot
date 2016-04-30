const Point = require('./point.js');

const {
	Circle, Rectangle
} = require('./shapes.js');

const SQRT3 = Math.sqrt(3);

function getR(t, max) {
	return Math.atan(t / max);
}

function getOpacity(t, max) {
	return (1 - t / max) / 4;
}

class ExplosionPeer {
	constructor(power) {
		this.position = new Point();
		this.t = 0;

		this.shape = new Circle();
		this.scale = 100 * Math.sqrt(power) / SQRT3; //Math.max(0.5 * Math.sqrt(power / 0.1), 1);

		this.velocity = 0;
		this.heading = 0;
	}

	update(forceT) {
		++this.t;

		if (forceT)
			this.t = forceT;

		let max = 20;
		if (this.isBig)
			max = 40;

		this.shape.R = getR(this.t, max) * this.scale;
		this.opacity = getOpacity(this.t, max);

		if (this.opacity < 0.01)
			this.nonalive = true;

		if (forceT === void 0) {
			this.velocity *= 0.64;
			this.position.project(this.velocity, this.heading);
		}
	}

	draw() {
		if (this.didDamage) {
			this.shape.fill(this.gfx, this.position, this.opacity * 0.8);
			this.shape.stroke(this.gfx, this.position, this.opacity);
		} else if (this.isBig) {
			this.shape.stroke(this.gfx, this.position, this.opacity * 10);
		} else {
			this.shape.stroke(this.gfx, this.position, this.opacity * 1.5);
		}
	}
}

module.exports = ExplosionPeer;
