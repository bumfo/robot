class Bot {
	init(peer, x, y, heading = 0) {
		this._peer = peer;

		this._peer.position.assign({
			x: x,
			y: y,
		});

		this._peer.heading = heading;
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
}

module.exports = Bot;
