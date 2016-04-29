const Point = require('./point.js');
const Vec = require('./vec.js');

const Rules = require('./rules.js');

const {
	Circle, Rectangle
} = require('./shapes.js');

function segmentIntersection(p, r, q, s) {
	let pq = Vec.minus(q, p);
	let rxs = Vec.cross(r, s);
	let pqxr = Vec.cross(pq, r);

	let threshold = 1e-10;

	if (Math.abs(rxs) < threshold) {
		if (Math.abs(pqxr) >= threshold)
			return false;

		s = Vec.times(r, Vec.dot(s, r) / Vec.dot(r, r));

		let r2 = Vec.dot(r, r);
		let t0 = Vec.dot(pq, r) / r2;
		let t1 = t0 + Vec.dot(s, r) / r2;

		if (t1 > t0)
			return 0 <= t1 && t0 <= 1;
		else
			return 0 <= t0 && t1 <= 1;
	} else {
		let pqxs = Vec.cross(pq, s);
		let u = pqxr / rxs;
		let t = pqxs / rxs;

		return 0 <= u && u <= 1 && 0 <= t && t <= 1;
	}
}

class BulletPeer {
	constructor(power) {
		this.power = power;

		this.position = new Point();
		this.velocity = Rules.getBulletSpeed(power);
		this.heading = 0;

		this.shape = new Circle(Math.max(0.5 * Math.sqrt(power / 0.1), 1));

		this.nodraw = true;
	}

	update(projectiles, sprites) {
		this.position.project(this.velocity, this.heading);

		if (this.position.x < 0 || this.position.x >= 800) {
			this.explode();
		} else if (this.position.y < 0 || this.position.y >= 600) {
			this.explode();
		}

		for (let i = 0, n = projectiles.length; i < n; ++i) {
			let that = projectiles[i];

			let collides = segmentIntersection(this.position, Vec.polar(-this.velocity, this.heading), that.position, Vec.polar(-that.velocity, that.heading));
			if (collides) {
				this.explode();
				that.explode();

				return i;
			}
		}

		for (let i = 0, n = sprites.length; i < n; ++i) {
			let that = sprites[i];

			if (that === this.owner)
				continue;

			let p = this.position;
			let r = Vec.polar(-this.velocity, this.heading);

			let collides = false;
			let cos = Math.cos(that.heading);
			let sin = Math.sin(that.heading);
			let q = Vec.plus(that.position, Vec.oriented2(-Rules.botSize, -Rules.botSize, cos, sin));

			if (!collides) {
				let s = Vec.oriented2(Rules.botSize * 2, 0, cos, sin);
				collides = segmentIntersection(p, r, q, s);
				q.add(s);
			}

			if (!collides) {
				let s = Vec.oriented2(0, Rules.botSize * 2, cos, sin);
				collides = segmentIntersection(p, r, q, s);
				q.add(s);
			}

			if (!collides) {
				let s = Vec.oriented2(-Rules.botSize * 2, 0, cos, sin);
				collides = segmentIntersection(p, r, q, s);
				q.add(s);
			}

			if (!collides) {
				let s = Vec.oriented2(0, -Rules.botSize * 2, cos, sin);
				collides = segmentIntersection(p, r, q, s);
			}

			if (collides) {
				this.explode();
				that.damage(Rules.getBulletDamage(this.power));
				if (that.energy <= 0) {
					that.nonalive = true;
				}

				console.log(that.energy);

				return;
			}
		}

		this.nodraw = false;
	}

	draw() {
		this.shape.fill(this.position, this.gfx);
	}

	explode() {
		this.nonalive = true;
	}
}

module.exports = BulletPeer;
