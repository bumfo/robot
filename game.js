const RobotPeer = require('./robot_peer.js');
const Canvas = require('./canvas.js');

function traversal(u, fn) {
	for (let i = 0, n = u.length; i < n; ++i) {
		let that = u[i];
		let deleteI = fn(that, i);
		if (that.nonalive) {
			u.splice(i--, 1);
			--n;
		}
		if (typeof deleteI === 'number') {
			u.splice(deleteI, 1);
			--n;
		}
	}
}

class Game {
	constructor() {
		this.sprites = [];
		this.projectiles = [];

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

			this.projectiles.forEach(that => !that.nodraw && that.draw());
			this.sprites.forEach(that => that.draw());

			traversal(this.projectiles, (that, i) => that.update(this.projectiles.slice(0, i), this.sprites));
			traversal(this.sprites, that => !that.nonalive && that.update());

			this.sprites.forEach(that => that.exec());

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
		peer.game = this;

		return peer;
	}
	addSprite(that) {
		this.sprites.push(that);
	}

	addProjectile(that) {
		this.projectiles.push(that);
	}
}

module.exports = Game;
