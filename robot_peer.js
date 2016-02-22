const Vec = require('./vec.js');
const Point = require('./point.js');
const State = require('./state.js');

const Utils = {
	limit(min, val, max) {
		return Math.max(min, Math.min(val, max));
	},
};

class LoopState {
	constructor(fn) {
		this.waiting = ['loop'];
		this.states = new States();
		this.loopFn = fn;
	}
	exec(peer, bases) {
		// console.log(this.states);
		if (!this.states.some(state => state.waiting.length)) {
			let states = peer.states;
			this.states.currentState = states.currentState;
			peer.states = this.states;
			this.loopFn();
			peer.states = states;
			states.currentState = this.states.currentState;
		}

		this.states.exec(peer, 0, bases);
	}
}

class States extends Array {
	add(obj) {
		this.addState(Object.assign(new State(), obj));
	}
	addState(state) {
		this.push(state);
	}

	exec(peer, shift = 0, bases = []) {
		let state = this[shift];

		if (!state)
			return void new State().exec(peer, bases);

		if (state.waiting.length || this.length - 1 < shift + 1) {
			let finished = state.exec(peer, bases);
			if (finished)
				this.shift();
		} else {
			bases.unshift(state);
			this.exec(peer, shift + 1, bases);
			this.shift();
		}
	}

	set(obj) {
		this.currentState = this.currentState || new State();
		Object.assign(this.currentState, obj);
	}
	flush(wait) {
		if (!this.currentState)
			return;

		this.currentState.waiting.push(wait);

		this.addState(this.currentState);
		this.currentState = null;
	}
}

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
		this.states.addState(new LoopState(fn));
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
