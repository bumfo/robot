const Gfx = require('./gfx.js');

class Canvas {
	constructor() {
		let canvas = Canvas.buildCanvas();
		Canvas.appendToBody(canvas);

		this.scale = 2;

		let ctx = canvas.getContext('2d');
		let gfx = new Gfx(ctx, this.scale);

		this.canvas = canvas;
		this.ctx = ctx;
		this.gfx = gfx;
	}
	resize(width, height, _width = window.innerWidth, _height = window.innerHeight) {
		this.canvas.width = _width * this.scale;
		this.canvas.height = _height * this.scale;
		this.canvas.style.width = _width + 'px';
		this.canvas.style.height = _height + 'px';
		this.gfx.resize(width || _width, height || _height);
	}
	static buildCanvas() {
		return document.createElement('canvas');
	}
	static ready(fn) {
		if (document.body)
			fn();
		else
			document.addEventListener('DOMContentLoaded', () => fn());
	}
	static appendToBody(canvas) {
		this.ready(() => document.body.appendChild(canvas));
	}
	static prepare() {
		if (this.prepared)
			return;
		this.prepared = true;

		this.ready(() => {
			document.body.style.imageRendering = 'pixelated';
			document.body.style.backgroundColor = '#333';
			document.body.style.margin = '0';
			document.body.style.overflow = 'hidden';
		});
	}
}

module.exports = Canvas;
