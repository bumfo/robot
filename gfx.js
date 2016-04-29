const Vec2 = require('./vec2.js');

class Gfx {
	constructor(ctx, scale) {
		this.ctx = ctx;
		this._scale = scale;
	}

	resize(width, height) {
		let ctx = this.ctx;
		this._width = ctx.canvas.width / this._scale;
		this._height = ctx.canvas.height / this._scale;
		this.width = width;
		this.height = height;

		let down_scale = Math.min(this._width / width, this._height / height, 1);
		this.scale = this._scale * down_scale;

		this.translateX = Math.round(this._scale * (this._width - width * down_scale) / 2) + 0.5;
		this.translateY = Math.round(this._scale * (this._height - height * down_scale) / 2) + 0.5;
		ctx.setTransform(this.scale, 0, 0, this.scale, this.translateX, this.translateY);

		this.initContext();
	}

	initContext() {
		let ctx = this.ctx;
		ctx.lineWidth = 1;
		ctx.globalAlpha = 1;
		ctx.strokeStyle = 'rgba(255,255,255,1)';
		ctx.fillStyle = 'rgba(255,255,255,.5)';
		ctx.font = "lighter 16px Helvetica Neue";
	}

	strokeBoundary() {
		let paddingX = 0;
		let paddingY = 0;

		this.ctx.globalAlpha = 0.2;
		this.ctx.strokeRect(paddingX, paddingY, this.width - 1 - 2 * paddingX, this.height - 1 - 2 * paddingY);
		this.ctx.globalAlpha = 1;
		// this.strokeCircle(this.width / 2, this.height / 2, Math.min(this.width, this.height) / 2 - 50);
		// this.ctx.fillText('hi', 4, this.height - 4);
	}

	clear(width = this._width * this._scale / this.scale, height = this._height * this._scale / this.scale) {
		let paddingX = -this.translateX / this.scale;
		let paddingY = -this.translateY / this.scale;

		this.ctx.clearRect(paddingX - 1, paddingY - 1, width + 1, height + 1);
	}
	strokeCircle(x, y, R) {
		this.ctx.beginPath();
		this.ctx.arc(x, y, R, 0, Math.PI * 2);
		this.ctx.stroke();
	}
	strokeArc(x, y, R, start = 0, end = Math.PI * 2) {
		this.ctx.beginPath();
		this.ctx.arc(x, y, R, start, end);
		this.ctx.stroke();
	}

	strokeRectangle(x, y, width, height) {
		this.ctx.beginPath();
		this.ctx.moveTo(x, y);
		this.ctx.lineTo(x + width, y);
		this.ctx.lineTo(x + width, y + height);
		this.ctx.lineTo(x, y + height);
		this.ctx.closePath();
		this.ctx.stroke();
	}

	strokeRectangleOriented(x, y, width, height, heading) {
		let cos = Math.cos(heading);
		let sin = Math.sin(heading);

		let pos = [x, y];

		this.ctx.beginPath();
		this.ctx.moveTo(...Vec2.add(pos, Vec2.rotate([-width / 2, -height / 2], cos, sin)));
		this.ctx.lineTo(...Vec2.add(pos, Vec2.rotate([width, 0], cos, sin)));
		this.ctx.lineTo(...Vec2.add(pos, Vec2.rotate([0, height], cos, sin)));
		this.ctx.lineTo(...Vec2.add(pos, Vec2.rotate([-width, 0], cos, sin)));
		this.ctx.closePath();
		this.ctx.stroke();
	}
}

module.exports = Gfx;
