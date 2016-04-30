const Vec = require('./vec.js');
const Utils = require('./utils.js');

const Point = require('./point.js');
const States = require('./states.js');

const Rules = require('./rules.js');

const BulletPeer = require('./bullet_peer.js');
const ExplosionPeer = require('./explosion_peer.js');

const {
	Ray, Circle, Sector, Rectangle
} = require('./shapes.js');

class Emitter {
	constructor() {
		this._callbacks = new Map();
	}
	on(event, listener) {
		this.getListeners(event).push(listener);
	}
	emit(event, e) {
		var arr = this.getListeners(event);
		for (var i = 0, n = arr.length; i < n; ++i) {
			arr[i](e);
		}
	}
	getListeners(event) {
		var listeners = this._callbacks.get(event);
		return listeners || this._callbacks.set(event, listeners = []), listeners;
	}
}

class RobotPeer {
	constructor() {
		this.emitter = new Emitter();
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
		this.gunTurnRate = 0;
		this.gunHeat = Rules.initialGunHeat;
		this.lastGunHeat = this.gunHeat;
		this.gunRay = new Ray(this.gunHeading);

		this.radarHeading = 0;
		this.radarTurnRate = 0;
		this.radarDot = new Circle(1);
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
	turnGun(val) {
		this.setTurnGun(val);
		this.states.flush('turnGun');
	}
	turnRadar(val) {
		this.setTurnRadar(val);
		this.states.flush('turnRadar');
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
	setTurnRadians(val) {
		this.states.set({
			turn: val,
		});
	}
	setTurn(val) {
		this.setTurnRadians(val / 180 * Math.PI);
	}
	setTurnGunRadians(val) {
		this.states.set({
			turnGun: val,
		});
	}
	setTurnGun(val) {
		this.setTurnGunRadians(val / 180 * Math.PI);
	}
	setTurnRadarRadians(val) {
		this.states.set({
			turnRadar: val,
		});
	}
	setTurnRadar(val) {
		this.setTurnRadarRadians(val / 180 * Math.PI);
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
		this.radarSector.headingB = this.radarHeading;

		this.doTurnBody(this.turnRate);
		this.turnRate = 0;
		this.doTurnGun(this.gunTurnRate);
		this.gunTurnRate = 0;
		this.doTurnRadar(this.radarTurnRate);
		this.radarTurnRate = 0;

		this.gunRay.heading = this.gunHeading;

		this.radarSector.headingA = this.radarHeading;

		this.velocity += this.acceleration;
		this.acceleration = 0;
		this.position.project(this.velocity, this.heading);

		this.gunHeat = Math.max(0, this.gunHeat - Rules.gunCoolRate);
		if (this.gunHeat < Number.EPSILON)
			this.gunHeat = 0;

		if (this.energy <= 0)
			this.explode(); ///

		this.lastGunHeat = this.gunHeat;

		sprites.forEach(that => {
			this.tryScan(that);
			that.tryScan(this);
		});
	}

	doTurnBody(turnRate) {
		this.heading += turnRate;
		if (!this.adjustGunForRobotTurn)
			this.doTurnGun(turnRate);
	}

	doTurnGun(turnRate) {
		this.gunHeading += turnRate;
		if (!this.adjustRadarForGunTurn)
			this.doTurnRadar(turnRate);
	}

	doTurnRadar(turnRate) {
		this.radarHeading += turnRate;
	}

	exec() {
		this.scans.forEach(that => this.emitter.emit('scannedRobot', that));
		this.scans.splice(0, this.scans.length);

		this.states.exec(this);
	}

	draw() {
		this.shape.stroke(this.gfx, this.position, this.heading);

		this.gunRay.draw(this.gfx, this.position.projected(-Math.min(this.lastGunHeat / 1.6, 1) * 18 * (1-0.618), this.gunRay.heading), Rules.botSize);

		let clockwise = Angle.normalRelative(this.radarSector.headingB - this.radarSector.headingA) > 0;
		this.radarDot.fill(this.gfx, this.position);
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

	inSector(that) {
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
