const Utils = require('./utils.js');

class Rules {
	static getNewVelocity(velocity, distance, maxVelocity) {
		if (distance < 0)
			return -this.getNewVelocity(-velocity, -distance);

		var goalVel = Math.min(this.getMaxVelocity(distance), maxVelocity);

		if (velocity >= 0)
			return Utils.limit(velocity - 2, goalVel, velocity + 1);

		return Utils.limit(velocity - 1, goalVel, velocity + this.maxDecel(-velocity));
	}
	static getMaxVelocity(distance) {
		if (distance >= 20)
			return 8;

		var decelTime = Math.round(
			//sum of 0... decelTime, solving for decelTime 
			//using quadratic formula, then simplified a lot
			Math.sqrt(distance + 1));

		var decelDist = Math.max(0, (decelTime) * (decelTime - 1));
		// sum of 0..(decelTime-1)
		// * Rules.DECELERATION*0.5;

		return Math.max(0, ((decelTime - 1) * 2) + ((distance - decelDist) / decelTime));
	}

	static maxDecel(speed) {
		return Utils.limit(1, speed * 0.5 + 1, 2);
	}
}

Object.assign(Rules, {
	botWidth: 36,
	botHeight: 36,
});

module.exports = Rules;
