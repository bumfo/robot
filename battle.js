class Battle {
	constructor(game) {
		this.game = game;

		this.botClasses = [];
		this.positions = [];
	}

	addBot(Robot, x, y) {
		this.botClasses.push(Robot);
		this.positions.push([x, y]);
	}

	runBot(Robot, [x, y]) {
		let peer = this.game.getRobotPeer();
		this.game.addSprite(peer);

		let bot = new Robot();
		bot.init(peer, x, y);
		bot.run();
	}

	start(maxRound = 1) {
		if (this.game.unready)
			return;

		this.game.unready = true;

		this.round = 0;

		this.startRound();

		this.game.onReady = () => {
			if (this.round < maxRound) {
				this.startRound();
			}
		}
	}

	startRound() {
		++this.round;
		this.game.init();
		this.botClasses.forEach((Robot, index) => {
			this.runBot(Robot, this.positions[index]);
		});
	}
}

module.exports = Battle;
