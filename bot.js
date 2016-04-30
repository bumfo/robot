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

	loop(val) {
		this._peer.loop(val);
	}

	ahead(val) {
		this._peer.ahead(val);
	}

	turn(val) {
		this._peer.turn(val);
	}

	fire(val) {
		this._peer.fire(val);
	}

	listen(publisher, listeners) {
		var keys = Object.keys(listeners);
		for (var i = 0, n = keys.length; i < n; ++i) {
			let key = keys[i];
			publisher.on(key, e => this[listeners[key]](e));
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
