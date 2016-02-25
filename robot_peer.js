const Vec = require('./vec.js');
const Utils = require('./utils.js');

const Point = require('./point.js');
const States = require('./states.js');

class RobotPeer {
	constructor() {
		this.position = new Point();
		this.velocity = 0;
		this.heading = 0;
		this.maxVelocity = 8;

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
	execute() {
		this.states.set();
		this.states.flush();
	}

	update() {
		this.velocity += this.acceleration;
		this.acceleration = 0;
		this.position.project(this.velocity, this.heading);
	}

	exec() {
		// console.log(JSON.stringify(this.states));
		this.states.exec(this);
	}

	draw() {
		this.position.draw(this.gfx, this.heading);
	}

	setNewVelocity(val) {
		this.acceleration = val - this.velocity;
	}

	setMaxVelocity(val) {
		this.maxVelocity = Utils.limit(0, val, 8);
	}

	getNewVelocity(velocity, distance) {
		if (distance < 0)
			return -this.getNewVelocity(-velocity, -distance);

		var goalVel = Math.min(this.getMaxVelocity(distance), this.maxVelocity);

		if (velocity >= 0)
			return Utils.limit(velocity - 2, goalVel, velocity + 1);

		return Utils.limit(velocity - 1, goalVel, velocity + this.maxDecel(-velocity));
	}
	getMaxVelocity(distance) {
		if (distance >= 20)
			return this.maxVelocity;

		var decelTime = Math.round(
			//sum of 0... decelTime, solving for decelTime 
			//using quadratic formula, then simplified a lot
			Math.sqrt(distance + 1));

		var decelDist = Math.max(0, (decelTime) * (decelTime - 1));
		// sum of 0..(decelTime-1)
		// * Rules.DECELERATION*0.5;

		return Math.max(0, ((decelTime - 1) * 2) + ((distance - decelDist) / decelTime));
	}

	maxDecel(speed) {
		return Utils.limit(1, speed * 0.5 + 1, 2);
	}
}

module.exports = RobotPeer;
