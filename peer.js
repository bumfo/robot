const Vec = require('./vec.js');
const Utils = require('./utils.js');

const Point = require('./point.js');

class Peer {
	constructor() {
		this.position = new Point();
		this.velocity = 0;
		this.heading = 0;
	}
	ahead() {}
	back() {}
	turn() {}
	turnRight() {}
	turnLeft() {}

	loop() {}

	setAhead() {}
	setBack() {}
	setTurn() {}
	setTurnRight() {}
	setTurnLeft() {}
	execute() {}

	update() {}

	exec() {}

	draw() {
		this.position.draw(this.gfx, this.heading);
	}
}

module.exports = Peer;
