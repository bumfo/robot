const Vec = require('./vec.js');

class Point extends Vec {
	constructor(x = 0, y = 0) {
		super(x, y);
	}
}

module.exports = Point;
