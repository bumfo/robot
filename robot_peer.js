const Vec = require('./vec.js');
const Utils = require('./utils.js');

const Point = require('./point.js');
const States = require('./states.js');

const Rules = require('./rules.js');

const BulletPeer = require('./bullet_peer.js');
const ExplosionPeer = require('./explosion_peer.js');

const {
	Circle, Sector, Rectangle
} = require('./shapes.js');

class RobotPeer {
	constructor() {
		this.states = new States();

		this.position = new Point();
		this.shape = new Rectangle(Rules.botSize * 2, Rules.botSize * 2);

		this.energy = Rules.initialEnergy;

		this.velocity = 0;
		this.heading = 0;

		this.turnRate = 0;

		this.maxVelocity = Rules.maxVelocity;
		this.acceleration = 0;

		this.gunHeading = 0;
		this.gunHeat = Rules.initialGunHeat;

		this.radarHeading = 0;
		this.radarSector = new Sector(1000, this.radarHeading, this.radarHeading);
		this.scans = [];

		this.adjustGunForRobotTurn = false;
		this.adjustRadarForGunTurn = false;
	}
	ahead(val) {
		this.setAhead(val);
		this.states.flush('ahead');
	}
	back(val) {
		this.ahead(-val);
	}
	turn(val) {
		this.setTurn(val);
		this.states.flush('turn');
	}
	turnRight(val) {
		this.turn(val);
	}
	turnLeft(val) {
		this.turn(-val);
	}
	fire(val) {
		this.setFire(val);
		this.states.flush('power');
	}

	loop(fn) {
		this.states.addState(new States.LoopState(fn));
	}

	setAhead(val) {
		this.states.set({
			ahead: val,
		});
	}
	setBack(val) {
		this.setAhead(-val);
	}
	setTurn(val) {
		this.states.set({
			turn: val / 180 * Math.PI,
		});
	}
	setTurnRight(val) {
		this.setTurn(val);
	}
	setTurnLeft(val) {
		this.setTurn(-val);
	}
	setFire(val) {
		if (this.gunHeat > 0)
			return;

		if (0.1 <= val && val <= 3) {
			this.states.set({
				power: val,
			});
		}
	}

	execute() {
		this.states.set();
		this.states.flush();
	}

	update(sprites) {
		sprites.forEach(that => {
			this.tryScan(that);
			that.tryScan(this);
		});

		this.radarSector.headingB = this.radarHeading;

		this.turnBody(this.turnRate);
		this.turnRate = 0;
		this.turnRadar(0);

		this.radarSector.headingA = this.radarHeading;

		this.velocity += this.acceleration;
		this.acceleration = 0;
		this.position.project(this.velocity, this.heading);

		this.gunHeat = Math.max(0, this.gunHeat - Rules.gunCoolRate);
		if (this.gunHeat < Number.EPSILON)
			this.gunHeat = 0;

		if (this.energy <= 0)
			this.explode(); ///
	}

	turnBody(turnRate) {
		this.heading += turnRate;
		if (!this.adjustGunForRobotTurn)
			this.turnGun(turnRate);
	}

	turnGun(turnRate) {
		this.gunHeading += turnRate;
		if (!this.adjustRadarForGunTurn)
			this.turnRadar(turnRate);
	}

	turnRadar(turnRate) {
		this.radarHeading += turnRate;
	}

	exec() {
		// console.log(JSON.stringify(this.states));
		this.states.exec(this);
	}

	draw() {
		this.shape.stroke(this.gfx, this.position, this.heading);

		let clockwise = Angle.normalRelative(this.radarSector.headingB - this.radarSector.headingA) > 0;
		this.radarSector.fill(this.gfx, this.position, clockwise, 0.02);
		this.radarSector.stroke(this.gfx, this.position, clockwise, 0.02);
	}

	setNewVelocity(val) {
		this.acceleration = val - this.velocity;
	}

	setMaxVelocity(val) {
		this.maxVelocity = Utils.limit(0, val, Rules.maxVelocity);
	}

	getBulletPeer(power) {
		let peer = new BulletPeer(power);
		peer.owner = this;
		peer.gfx = this.gfx;

		return peer;
	}

	getExplosionPeer(power) {
		let peer = new ExplosionPeer(power);
		peer.gfx = this.gfx;

		return peer;
	}

	addBulletPeer(bulletPeer) {
		this.game.addProjectile(bulletPeer);
	}

	addExplosionPeer(bulletPeer) {
		this.game.addParticle(bulletPeer);
	}

	damage(damage) {
		this.energy -= damage;
	}

	explode() {
		this.nonalive = true;

		let explosionPeer = this.getExplosionPeer(3);

		explosionPeer.position.assign(this.position);
		explosionPeer.isBig = true;
		explosionPeer.update(40 * Math.tan(Rules.botSize * Math.SQRT2 / 100));

		this.addExplosionPeer(explosionPeer);
	}

	inRange(phi) {
		return Angle.inRange(phi, Angle.range(this.radarSector.headingA, this.radarSector.headingB));
	}

	inSector(that) {
		// let phi = this.position.phi(that.position);
		// return this.inRange(phi);

		let d = this.position.distance(that.position);
		let phi = this.position.phi(that.position);
		let side = Math.asin(18 / d);
		let range = Angle.range(phi - side, phi + side);

		let scanRange;

		if (Angle.normalRelative(this.radarSector.headingB - this.radarSector.headingA) > 0)
			scanRange = [this.radarSector.headingA, this.radarSector.headingB];
		else
			scanRange = [this.radarSector.headingB, this.radarSector.headingA];

		return Angle.intersects(range, scanRange);
	}

	tryScan(that) {
		if (this.inSector(that))
			this.scans.push(that);
	}
}

module.exports = RobotPeer;
