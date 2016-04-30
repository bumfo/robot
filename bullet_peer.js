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

function segmentRectangleIntersection(p, r, pos, halfWidth, halfHeight, heading) {
	let collides = false;

	let cos = Math.cos(heading + Math.PI);
	let sin = Math.sin(heading + Math.PI);

	let pOriented = Vec.oriented(Vec.minus(p, pos), cos, sin);
	let prOriented = Vec.oriented(Vec.minus(Vec.plus(p, r), pos), cos, sin);

	collides = collides || isPointInBB(pOriented, halfWidth, halfHeight);
	collides = collides || isPointInBB(prOriented, halfWidth, halfHeight);

	if (collides)
		return true;

	let q = Vec.plus(pos, Vec.oriented2(-halfWidth, -halfHeight, cos, sin));
	let s;

	s = Vec.oriented2(halfWidth * 2, 0, cos, sin);
	collides = segmentIntersection(p, r, q, s);
	q.add(s);

	if (collides)
		return true;

	s = Vec.oriented2(0, halfHeight * 2, cos, sin);
	collides = segmentIntersection(p, r, q, s);
	q.add(s);

	if (collides)
		return true;

	s = Vec.oriented2(-halfWidth * 2, 0, cos, sin);
	collides = segmentIntersection(p, r, q, s);
	q.add(s);

	if (collides)
		return true;

	s = Vec.oriented2(0, -halfHeight * 2, cos, sin);
	collides = segmentIntersection(p, r, q, s);

	if (collides)
		return true;

	return false;
}

function isPointInBB(point, halfWidth, halfHeight) {
	return Math.abs(point.x) <= halfWidth && Math.abs(point.y) <= halfHeight;
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

		if (this.position.x < 0 || this.position.x >= 800)
			this.explode();
		else if (this.position.y < 0 || this.position.y >= 600)
			this.explode();

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

			let collides = segmentRectangleIntersection(this.position, Vec.polar(-this.velocity, this.heading), that.position, Rules.botSize, Rules.botSize, that.heading);

			if (collides) {
				this.explode(true);
				that.damage(Rules.getBulletDamage(this.power));
				this.owner.damage(-Rules.getBulletHitBonus(this.power));

				if (that.energy <= 0)
					that.explode();

				return;
			}
		}

		this.nodraw = false;
	}

	draw() {
		this.shape.fill(this.position, this.gfx);
	}

	explode(didDamage) {
		this.nonalive = true;

		let explosionPeer = this.owner.getExplosionPeer(this.power);

		explosionPeer.position.assign(this.position);
		explosionPeer.velocity = this.velocity * 0.8;
		explosionPeer.heading = this.heading;
		explosionPeer.didDamage = didDamage;
		explosionPeer.update(20 * Math.tan((this.shape.R * 2 + 1) / (100 * Math.sqrt(this.power) / Math.sqrt(3))));

		this.owner.addExplosionPeer(explosionPeer);
	}
}

module.exports = BulletPeer;
