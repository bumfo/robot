const Utils = {
	limit(min, val, max) {
		return Math.max(min, Math.min(val, max));
	},
};

module.exports = Utils;
