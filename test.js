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

game.addSprite(that);
