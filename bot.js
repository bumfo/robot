class Bot {
	init(peer, x, y, heading = 0) {
		this._peer = peer;

		this._peer.position.assign({
			x: x,
			y: y,
		});

		this._peer.heading = heading;
	}

	loop(fn) {
		this._peer.loop(fn);
	}

	turn(val) {
		this._peer.turn(val);
	}

	fire(val) {
		this._peer.fire(val);
	}
}

module.exports = Bot;
