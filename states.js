const State = require('./state.js');

class LoopState {
	constructor(fn) {
		this.waiting = ['loop'];
		this.states = new States();
		this.loopFn = fn;
	}
	exec(peer, bases) {
		if (!this.states.some(state => state.waiting.length)) {
			let states = peer.states;
			this.states.currentState = states.currentState;
			peer.states = this.states;
			this.loopFn();
			peer.states = states;
			states.currentState = this.states.currentState;
		}

		this.states.exec(peer, 0, bases);
	}
}

class States extends Array {
	add(obj) {
		this.addState(Object.assign(new State(), obj));
	}
	addState(state) {
		this.push(state);
	}

	exec(peer, shift = 0, bases = []) {
		let state = this[shift];

		if (!state)
			return void new State().exec(peer, bases);

		if (state.waiting.length || this.length - 1 < shift + 1) {
			let finished = state.exec(peer, bases);
			if (finished)
				this.shift();
		} else {
			bases.unshift(state);
			this.exec(peer, shift + 1, bases);
			this.shift();
		}
	}

	set(obj) {
		this.currentState = this.currentState || new State();
		Object.assign(this.currentState, obj);
	}
	flush(wait) {
		if (!this.currentState)
			return;

		this.currentState.waiting.push(wait);

		this.addState(this.currentState);
		this.currentState = null;
	}
}

States.LoopState = LoopState;

module.exports = States;
