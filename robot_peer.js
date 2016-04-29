const Vec = require('./vec.js');
const Utils = require('./utils.js');

const Point = require('./point.js');
const States = require('./states.js');

const Rules = require('./rules.js');

const {
	Circle, Rectangle
} = require('./shapes.js');

class RobotPeer {
	constructor() {
		this.position = new Point();
		this.shape = new Rectangle(Rules.botWidth, Rules.botHeight);
		this.velocity = 0;
		this.heading = 0;
		this.maxVelocity = 8;
		this.acceleration = 0;

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
		this.shape.draw(this.position, this.gfx, this.heading);
	}

	setNewVelocity(val) {
		this.acceleration = val - this.velocity;
	}

	setMaxVelocity(val) {
		this.maxVelocity = Utils.limit(0, val, 8);
	}
}

module.exports = RobotPeer;
