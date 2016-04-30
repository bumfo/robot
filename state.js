const Rules = require('./rules.js');

const keys = ['turn', 'turnGun', 'turnRadar', 'ahead', 'power'];

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

		let maxTurnRate = Rules.getMaxTurnRate(Math.abs(peer.velocity));
		let turnRate = Math.sign(turn) * Math.min(Math.abs(turn), maxTurnRate);

		peer.turnRate = turnRate;

		this.turn = turn - turnRate;

		if (!this.turn)
			return true;
	}
	$turnGun(peer) {
		let turnGun = this.turnGun;
		if (!turnGun)
			return true;


		let gunMaxTurnRate = Rules.gunMaxTurnRate;
		let gunTurnRate = Math.sign(turnGun) * Math.min(Math.abs(turnGun), gunMaxTurnRate);

		peer.gunTurnRate = gunTurnRate;

		this.turnGun = turnGun - gunTurnRate;

		if (!this.turnGun)
			return true;
	}
	$turnRadar(peer) {
		let turnRadar = this.turnRadar;
		if (!turnRadar)
			return true;

		let radarMaxTurnRate = Rules.radarMaxTurnRate;
		let radarTurnRate = Math.sign(turnRadar) * Math.min(Math.abs(turnRadar), radarMaxTurnRate);

		peer.radarTurnRate = radarTurnRate;

		this.turnRadar = turnRadar - radarTurnRate;

		if (!this.turnRadar)
			return true;
	}

	$power(peer) {
		let power = this.power;
		if (!power)
			return true;

		let bulletPeer = peer.getBulletPeer(power);
		bulletPeer.position.assign(peer.position);
		bulletPeer.heading = peer.gunHeading;

		peer.gunHeat += Rules.getGunHeat(power);
		peer.energy -= power;

		peer.addBulletPeer(bulletPeer);

		this.power = 0;

		return true;
	}
}

module.exports = State;
