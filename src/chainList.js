class ChainList {
	constructor(previous, next, lock) {
		this.#previous = previous;
		this.#next = next;
		this.#lock = lock;
	}

	#previous;
	#next;
	#lock;

	lock = () => {
		this.#lock = true;
	};

	unlock = () => {
		this.#lock = false;
	};

	isLocked = () => this.#lock;

	rebaseLeft = element => {
		this.guard('rebaseLeft');
		this.#previous = element;
		return element;
	};

	rebaseRight = element => {
		this.guard('rebaseRight');
		this.#next = element;
		return element;
	};

	cut = () => {
		this.guard('cut');
		this.#previous && this.#previous.rebaseRight(this.#next);
		this.#next && this.#next.rebaseLeft(this.#previous);
	};

	previous = () => this.#previous;

	next = () => this.#next;

	guard = fn => {
		if (this.isLocked()) {
			throw {
				name: 'LockedError',
				message: `Sequence.${fn} is forbidden on locked instance. This indicate an unsafe construction in your code ` +
					'where you are trying to mutate a sequence list from a copy instance.'
			}
		}
	};
}

export default ChainList;