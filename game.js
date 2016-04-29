const RobotPeer = require('./robot_peer.js');
const Canvas = require('./canvas.js');

class Game {
	constructor() {
		this.sprites = [];

		Canvas.prepare();

		this.width = 800;
		this.height = 600;

		this.canvas = new Canvas();
		this.gfx = this.canvas.gfx;

		window.addEventListener('resize', () => {
			this.resize();
		});
		this.resize();

		window.addEventListener('keydown', e => {
			switch (e.code) {
				case 'Space':
					this.paused = false;
					this.pauseThen = true;
					break;
				case 'KeyB': 
					this.paused = !this.paused;
					break;
			}
		});

		let frame = () => {
			if (this.paused) {
				requestAnimationFrame(frame);
				return;
			}

			this.gfx.clear();
			this.gfx.strokeBoundary();
			this.sprites.forEach(that => that.update());
			this.sprites.forEach(that => that.exec());
			this.sprites.forEach(that => that.draw());

			requestAnimationFrame(frame);

			if (this.pauseThen) {
				this.pauseThen = false;
				this.paused = true;
			}
		}

		requestAnimationFrame(frame);
	}
	resize(width = this.width, height = this.height) {
		this.canvas.resize(width, height);
	}
	getRobotPeer() {
		let peer = new RobotPeer();
		peer.gfx = this.gfx;

		return peer;
	}
	addSprite(that) {
		this.sprites.push(that);
	}
}

module.exports = Game;
