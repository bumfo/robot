const Game = require('./game.js');

let game = new Game();
let that = game.getRobotPeer();

console.log(that);

that.position.assign({
	x: 100,
	y: 100,
});

that.loop(() => { // square
	that.ahead(200);
	that.turn(90);
});

// that.loop(() => { // box
// 	that.setTurn(90);
// 	that.ahead(200);
// 	that.setTurn(90);
// 	that.back(200);
// });

// that.setAhead(200); // test
// that.turn(90);
// that.setTurnLeft(90);
// that.loop(() => {
// 	that.back(200);
// 	that.ahead(200);
// });

// that.setAhead(200);
// that.execute();
// that.loop(() => {
// 	that.turn(10);
// });

// game.addSprite(that);

class TestBot {
	constructor(x, y, heading = 0) {
		let bot = game.getRobotPeer();

		bot.position.assign({
			x: x,
			y: y,
		});

		bot.heading = heading;

		bot.loop(() => {
			bot.fire(3);
		});

		game.addSprite(bot);
	}
}

new TestBot(200, 200);
let bot = game.getRobotPeer();
bot.position.assign({
	x: 600,
	y: 200,
});

bot.loop(() => {
	bot.turn(10);
});

game.addSprite(bot);
// new TestBot(600, 200, Math.PI);
