let keys = ['turn', 'ahead'];
const Rules = require('./rules.js');

class State {
	constructor() {
		this.waiting = [];
	}
	exec(peer, bases = []) {
		let overrided = new Set(Object.keys(this).filter(key => keys.indexOf(key) !== -1));
		bases.forEach(base => {
			for (let key of keys) {
				if (!overrided.has(key)) {
					overrided.add(key);
					this[key] = base[key];
				}
				delete base[key];
			}
		});

		let finished = true;
		keys.forEach(key => {
			let isFinished = this['$' + key](peer);
			finished = isFinished && finished;
			if (isFinished) {
				let index = this.waiting.indexOf(key);
				if (index !== -1)
					this.waiting.splice(index, 1);
			}
		});

		if (!this.waiting.some(u => u))
			this.waiting = [];

		return finished;
	}

	$ahead(peer) {
		let distance = this.ahead;
		if (!distance)
			distance = 0;
		let velocity = Rules.getNewVelocity(peer.velocity, distance, peer.maxVelocity);
		peer.setNewVelocity(velocity);

		if (this.ahead !== void 0)
			this.ahead = distance - velocity;

		if (!this.ahead)
			return true;
	}
	$turn(peer) {
		let turn = this.turn;
		if (!turn)
			return true;

		let maxTurnRate = (10 - 0.75 * Math.abs(peer.velocity)) / 180 * Math.PI;
		let turnRate = Math.sign(turn) * Math.min(Math.abs(turn), maxTurnRate);

		peer.heading += turnRate;

		this.turn = turn - turnRate;

		if (!this.turn)
			return true;
	}
}

module.exports = State;
