class Circle {
	constructor(R) {
		this.R = R;
	}
	stroke(position, gfx, opacity) {
		gfx.strokeCircle(position.x, position.y, this.R, opacity);
	}

	fill(position, gfx, opacity) {
		gfx.fillCircle(position.x, position.y, this.R, opacity);
	}
}

class Rectangle {
	constructor(width, height) {
		this.width = width;
		this.height = height;
	}
	stroke(position, gfx, heading = 0) {
		gfx.strokeRectangleOriented(position.x, position.y, this.width, this.height, heading);
	}
}

module.exports = {
	Circle,
	Rectangle,
};
