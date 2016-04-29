class Circle {
	constructor(R) {
		this.R = R;
	}
	draw(position, gfx, heading) {
		if (!isNaN(heading))
			gfx.strokeArc(position.x, position.y, this.R, heading + Math.PI / 24, heading - Math.PI / 24);
		else
			gfx.strokeCircle(position.x, position.y, this.R);
	}

	fill(position, gfx) {
		gfx.fillCircle(position.x, position.y, this.R);
	}
}

class Rectangle {
	constructor(width, height) {
		this.width = width;
		this.height = height;
	}
	draw(position, gfx, heading = 0) {
		gfx.strokeRectangleOriented(position.x, position.y, this.width, this.height, heading);
	}
}

module.exports = {
	Circle,
	Rectangle,
};
