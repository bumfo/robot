class Bot {
	init(peer, x, y, heading = 0) {
		this._peer = peer;

		this._peer.position.assign({
			x: x,
			y: y,
		});

		this._peer.heading = heading;

		this.listen(this._peer.emitter, {
			update: 'onUpdate',
			scannedRobot: 'onScannedRobot',
			robotDeath: 'onRobotDeath',
			hitRobot: 'onHitRobot',
			hitByBullet: 'onHitByBullet',
			bulletHit: 'onBulletHit',
			bulletHitBullet: 'onBulletHitBullet',
			updated: 'onUpdated',
		});
	}

	getPosition() {
		return this._peer.position.clone();
	}
	getGunHeading() {
		return this._peer.gunHeading;
	}
	getRadarHeading() {
		return this._peer.radarHeading;
	}

	ahead(val) {
		this._peer.ahead(val);
	}
	back(val) {
		this._peer.back(val);
	}
	turn(val) {
		this._peer.turn(val);
	}
	turnGun(val) {
		this._peer.turnGun(val);
	}
	turnRadar(val) {
		this._peer.turnRadar(val);
	}
	fire(val) {
		this._peer.fire(val);
	}
	loop(val) {
		this._peer.loop(val);
	}
	setAhead(val) {
		this._peer.setAhead(val);
	}
	setBack(val) {
		this._peer.setBack(val);
	}
	setTurn(val) {
		this._peer.setTurn(val);
	}
	setTurnGunRadians(val) {
		this._peer.setTurnGunRadians(val);
	}
	setTurnRadarRadians(val) {
		this._peer.setTurnRadarRadians(val);
	}
	setFire(val) {
		this._peer.setFire(val);
	}
	execute(val) {
		this._peer.execute(val);
	}

	listen(publisher, listeners) {
		var keys = Object.keys(listeners);
		for (var i = 0, n = keys.length; i < n; ++i) {
			let key = keys[i];
			let name = listeners[key];
			publisher.on(key, e => this[name](e));
		}
	}

	onUpdate() {}
	onScannedRobot() {}
	onRobotDeath() {}
	onHitRobot() {}
	onHitByBullet() {}
	onBulletHit() {}
	onBulletHitBullet() {}
	onUpdated() {}
}

module.exports = Bot;
