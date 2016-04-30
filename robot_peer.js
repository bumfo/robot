const Vec = require('./vec.js');
const Utils = require('./utils.js');

const Point = require('./point.js');
const States = require('./states.js');

const Rules = require('./rules.js');

const BulletPeer = require('./bullet_peer.js');
const ExplosionPeer = require('./explosion_peer.js');

const {
	Circle, Rectangle
} = require('./shapes.js');

class RobotPeer {
	constructor() {
		this.position = new Point();
		this.shape = new Rectangle(Rules.botSize * 2, Rules.botSize * 2);

		this.energy = Rules.initialEnergy;

		this.velocity = 0;
		this.heading = 0;

		this.maxVelocity = Rules.maxVelocity;
		this.acceleration = 0;

		this.gunHeat = Rules.initialGunHeat;

		this.states = new States();
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
		if (this.gunHeat > 0 || !(0.1 <= val && val <= 3))
			return;

		this.states.set({
			power: val,
		});
	}

	execute() {
		this.states.set();
		this.states.flush();
	}

	update() {
		this.velocity += this.acceleration;
		this.acceleration = 0;
		this.position.project(this.velocity, this.heading);

		this.gunHeat = Math.max(0, this.gunHeat - Rules.gunCoolRate);
		if (this.gunHeat < Number.EPSILON)
			this.gunHeat = 0;

		if (this.energy <= 0)
			this.explode(); ///
	}

	exec() {
		// console.log(JSON.stringify(this.states));
		this.states.exec(this);
	}

	draw() {
		this.shape.stroke(this.position, this.gfx, this.heading);
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
}

module.exports = RobotPeer;
