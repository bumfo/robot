const RobotPeer = require('./robot_peer.js');
const Peer = require('./peer.js');
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

		let frame = () => {
			this.gfx.clear();
			this.gfx.strokeBoundary();
			this.sprites.forEach(that => that.exec());
			this.sprites.forEach(that => that.update());
			this.sprites.forEach(that => that.draw());

			requestAnimationFrame(frame);
		}

		requestAnimationFrame(frame);
	}
	resize(width = this.width, height = this.height) {
		this.canvas.resize(width, height);
	}
	getRobotPeer() {
		let peer = new Peer();
		peer.gfx = this.gfx;

		return peer;
	}
	addSprite(that) {
		this.sprites.push(that);
	}
}

module.exports = Game;
