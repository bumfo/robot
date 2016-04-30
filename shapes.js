class Ray {
	constructor(heading) {
		this.heading = heading;
	}
	draw(gfx, position, length) {
		gfx.drawRay(position.x, position.y, this.heading, length);
	}
}

class Rectangle {
	constructor(width, height) {
		this.width = width;
		this.height = height;
	}
	stroke(gfx, position, heading = 0) {
		gfx.strokeRectangleOriented(position.x, position.y, this.width, this.height, heading);
	}
}

class Circle {
	constructor(R) {
		this.R = R;
	}
	stroke(gfx, position, opacity) {
		gfx.strokeCircle(position.x, position.y, this.R, opacity);
	}

	fill(gfx, position, opacity) {
		gfx.fillCircle(position.x, position.y, this.R, opacity);
	}
}

class Sector {
	constructor(R, headingA, headingB) {
		this.R = R;
		this.headingA = headingA;
		this.headingB = headingB;
	}
	fill(gfx, position, clockwise, opacity) {
		if (clockwise)
			gfx.fillSector(position.x, position.y, this.R, this.headingA, this.headingB, opacity);
		else
			gfx.fillSector(position.x, position.y, this.R, this.headingB, this.headingA, opacity);
	}
	stroke(gfx, position, clockwise, opacity) {
		if (clockwise)
			gfx.strokeSector(position.x, position.y, this.R, this.headingA, this.headingB, opacity);
		else
			gfx.strokeSector(position.x, position.y, this.R, this.headingB, this.headingA, opacity);
	}
}


module.exports = {
	Ray,
	Rectangle,
	Circle,
	Sector,
};
