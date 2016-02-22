const Vec = require('./vec.js');

class Point extends Vec {
	constructor(x = 0, y = 0) {
		super(x, y);
	}
	draw(gfx, heading) {
		if (!isNaN(heading))
			gfx.strokeArc(this.x, this.y, void 0, heading + Math.PI / 24, heading - Math.PI / 24);
		else
			gfx.strokeCircle(this.x, this.y);
	}
}

module.exports = Point;
