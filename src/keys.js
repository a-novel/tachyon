/**
 * @author Team Anovel {@link https://github.com/a-novel}
 * @module keys
 * */

import {getOS, OS} from './os';

/* c8 ignore next 5 */
/**
 * Ctrl for most OS, Cmd for macOS.
 * @type {}
 */
const actionKey = () => (getOS() === OS.MACOS) ? 'Meta' : 'Control';

/**
 * Common controls sequences.
 *
 * @type {{
 * 	UNDO: string[],
 * 	CUT: string[],
 * 	SELECTALL: string[],
 * 	PASTE: string[],
 * 	REDO: string[],
 * 	COPY: string[],
 * 	KONAMI_CODE: string[]
 * }}
 */
const COMBOS = {
	UNDO: [actionKey(), 'Z'],
	REDO: [actionKey(), 'Shift', 'Z'],
	SELECTALL: [actionKey(), 'A'],
	COPY: [actionKey(), 'C'],
	CUT: [actionKey(), 'X'],
	PASTE: [actionKey(), 'V'],
	KONAMI_CODE: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
};

/**
 * @callback IntermediateAction
 * @param {Number} completionIndex
 * */

/**
 * @typedef {{
 *   trigger: Array.<string>,
 *   action: function,
 *   [intermediateAction]: {IntermediateAction},
 *   [alwaysTrigger]: Boolean,
 * }} module:keys.Configuration
 * */

/**
 * Compares a key chain against a sequence action configuration.
 *
 * @param {String} snapshot
 * @param {module:keys.Configuration} configuration
 *
 * @return Promise<void>
 * */
const compareSequenceList = async (snapshot, configuration) => {
	const {
		/** @type Array.<string> */ trigger,
		/** @type function */ action,
		/** @type {IntermediateAction} */ intermediateAction,
		/** @type Boolean */ alwaysTrigger
	} = configuration;

	let matches = trigger.length;

	while (!snapshot.endsWith(trigger.slice(0, matches).join(' '))) {
		matches--;
	}

	// All keys where matched.
	if (matches === trigger.length) {
		action && action();
	} else if (alwaysTrigger || matches > 0) {
		intermediateAction && intermediateAction(matches);
	}
};

/**
 * A sequence identifies a key press at a certain timestamp. It is a workaround implementation of C++ chained lists,
 * to optimize both memory usage and access time (it avoids manipulating a whole array on each action, and lets a
 * Sequence delete itself more quickly).
 *
 * @class Sequence
 * @alias keys.Sequence
 * */
class Sequence {
	/**
	 * Creates a new Sequence.
	 *
	 * @param {String} key - the associated keycode
	 * @param {keys.Sequence | null} [previous] - an optional reference to the previous sequence in the chain
	 * @param {keys.Sequence | keys.Sequencer | null} [next] - an optional reference to the next sequence in the chain
	 * @param {Boolean} [lock] - indicates this sequence cannot alter the sequence chain (usually when it represents a copy of another Sequence)
	 * */
	constructor(key, previous, next, lock = false) {
		this.#key = key;
		this.#previous = previous;
		this.#next = next;
		this.#lock = lock;
	}

	/**
	 * @type {String}
	 * @description The keycode of the key that was pressed.
	 * */
	#key;

	/**
	 * @type {keys.Sequence}
	 * @description An optional reference to the previous instance within the chain.
	 * */
	#previous;

	/**
	 * @type {keys.Sequence}
	 * @description An optional reference to the next instance within the chain.
	 * */
	#next;

	/**
	 * @type {Boolean}
	 * @description Prevent this instance from performing alterations to the chain.
	 * */
	#lock;

	/**
	 * @type {NodeJS.Timeout}
	 * @description Handles class self destruction.
	 * */
	#timer;

	/**
	 * @typedef {Error} LockedError
	 * */

	/* c8 ignore next 16 */
	/**
	 * Prevent key chain mutations from locked instances.
	 *
	 * @param {String} fn - calling method name.
	 *
	 * @throws {LockedError} - calling method not allowed in locked mode.
	 * */
	lock = fn => {
		if (this.#lock) {
			throw {
				name: 'LockedError',
				message: `Sequence.${fn} is forbidden on locked instance. This indicate an unsafe construction in your code ` +
					'where you are trying to mutate a sequence list from a copy instance.'
			}
		}
	};

	/**
	 * Destroy current instance in a defined duration. This timer may be reset by another call to itself.
	 *
	 * @param {Number} duration - time in milliseconds before the current instance is destroyed (dereference).
	 * @param {Boolean} [propagate] - retime every element in the chain
	 *
	 * @throws {LockedError}
	 * */
	time = (duration, propagate) => {
		this.lock('time');
		this.untime();
		this.#timer = setTimeout(this.destruct, duration);

		// Double check the previous element is set to avoid null reference errors.
		if (propagate === true && this.#previous != null) this.#previous.time(duration, true);
	};

	/**
	 * Cancels self-destruction timer.
	 * */
	untime = () => {
		if (this.#timer) clearTimeout(this.#timer);
	};

	/**
	 * Destruct (dereference) current instance.
	 *
	 * @throws {LockedError}
	 * */
	destruct = () => {
		this.lock('destruct');
		this.#next.clear();
	};

	/**
	 * Dereference the previous instance in the chain.
	 *
	 * @throws {LockedError}
	 * */
	clear = () => {
		this.lock('clear');
		this.#previous = null;
	};

	/**
	 * Re-assign previous sequence.
	 *
	 * @param {keys.Sequence} sequence
	 * @return {keys.Sequence} sequence
	 * */
	rebaseLeft = sequence => {
		this.#previous = sequence;
		return sequence;
	};

	/**
	 * Re-assign next sequence.
	 *
	 * @param {keys.Sequence} sequence
	 * @return {keys.Sequence} sequence
	 * */
	rebaseRight = sequence => {
		this.#next = sequence;
		return sequence;
	};

	/**
	 * Removes current sequence for chain. Same as {@link keys.Sequence.clear} with the extra handle of healing the chain
	 * if not cut at edges.
	 *
	 * @throws {LockedError}
	 * */
	cut = () => {
		this.lock('cut');

		this.#previous && this.#previous.rebaseRight(this.#next);
		this.#next.rebaseLeft(this.#previous);
	};

	/**
	 * Returns the previous instance if any.
	 *
	 * @return {keys.Sequence | null} previousSequence
	 * */
	previous = () => this.#previous;

	/**
	 * Returns the next instance if any.
	 *
	 * @return {keys.Sequence | null} nextSequence
	 * */
	next = () => this.#next;

	/**
	 * Creates a locked copy of the current sequence.
	 *
	 * @return {keys.Sequence} sequence
	 * */
	copy = () => new Sequence(this.#key, this.#previous, this.#next, true);

	/**
	 * Returns current sequence keycode
	 *
	 * @return {String} key
	 * */
	key = () => this.#key;

	/**
	 * Returns the current key chain.
	 *
	 * @param {Array.<string>} [current]
	 *
	 * @return {Array.<string>} chain
	 */
	keyChain = current => {
		const output = current || [];
		output.push(this.#key);

		return this.#previous != null ? this.#previous.keyChain(output) : output;
	};

	/**
	 * Cut a Sequence based on a keycode.
	 *
	 * @param {String} target
	 * */
	cutTarget = target => {
		if (this.#key === target) {
			this.cut();
		}

		if (this.#previous) {
			this.#previous.cutTarget(target);
		}
	};
}

/**
 * Detect keys sequences and trigger according actions.
 *
 * @example
 *
 * // Logs each time the konami code was performed, at 2 different speed levels.
 * const MyComponent = () => {
 *   const sequencerSlow = new Sequencer();
 *   const sequencerFast = new Sequencer();
 *
 *   const slowConfig = {lifespan: 1000, combos: [
 *     trigger: COMBOS.KONAMI_CODE,
 *     action: () => console.log('triggered slow !')
 *   ]};
 *
 *   const fastConfig = {lifespan: 200, combos: [
 *     trigger: COMBOS.KONAMI_CODE,
 *     action: () => console.log('triggered fast !')
 *   ]};
 *
 *   return (
 *     <div className={css.container}>
 *      <div
 *       	tabIndex="0"
 *       	className={css.button1}
 *       	onKeyDown={sequencerSlow.update(slowConfig)}
 *     	/>
 *     	<div
 *       	tabIndex="0"
 *       	className={css.button2}
 *       	onKeyDown={sequencerFast.update(fastConfig)}
 *     	/>
 *     </div>
 *   );
 * };
 *
 * @class Sequencer
 * @alias keys.Sequencer
 * */
class Sequencer {
	/**
	 * @type {keys.Sequence}
	 * @description Holds reference to the latest element of a {@link keys.Sequence} chain.
	 * */
	#sequence;

	/**
	 * @callback UpdateHandler
	 *
	 * @param {KeyboardEvent} e
	 *
	 * @return {Array.<String>} keyChain
	 * */

	/**
	 * Append a {@link keys.Sequence} to the current chain. Returns the current keyChain list through a callback.
	 *
	 * @param {{
	 *   [lifespan]: Number,
	 *   [combos]: Array.<module:keys.Configuration>,
	 *   [sustain]: Boolean
	 * }} [config]
	 *
	 * @return {UpdateHandler}
	 * */
	update = config => e => {
		const {lifespan, combos, sustain} = config || {};

		this.#insert(e.code, lifespan, sustain);
		if (combos && combos.length) this.#check(combos);

		return this.keys();
	};

	/**
	 * Removes a key from current chain.
	 *
	 * @param {KeyboardEvent} e
	 *
	 * @return {Array.<String>} keyChain
	 * */
	remove = e => {
		// Do not perform combos check since a combo should only be targeted when the right keys were pressed in order.
		this.#sequence != null && this.#sequence.cutTarget(e.code);
		return this.keys();
	};

	/**
	 * @private
	 *
	 * Insert a new sequence.
	 *
	 * @param {String} key
	 * @param {Number} [lifespan]
	 * @param {Boolean} [sustain]
	 * */
	#insert = (key, lifespan, sustain) => {
		if (this.#sequence == null) {
			this.#sequence = new Sequence(key, null, this);
		} else {
			this.#sequence = this.#sequence.rebaseRight(new Sequence(key, this.#sequence, this));
		}

		if (lifespan) {
			this.#sequence.time(lifespan, sustain);
		}
	};

	/**
	 * @private
	 *
	 * Check if a combo is triggered.
	 *
	 * @param {Array.<module:keys.Configuration>} combos
	 * */
	#check = combos => {
		const snapshot = this.#sequence.keyChain();
		snapshot.reverse();

		for (const combo of combos) {
			compareSequenceList(snapshot.join(' '), combo).catch(console.error);
		}
	};

	/**
	 * Dereference current sequence to cancel chain.
	 * */
	clear = () => {
		this.#sequence = null;
	};

	/**
	 * Implementation of Sequence rebaseLeft for duck typing.
	 *
	 * @param {keys.Sequence} sequence
	 * @return {keys.Sequence} sequence
	 * */
	rebaseLeft = sequence => {
		this.#sequence = sequence;
		return sequence;
	};

	/**
	 * Return current key chain.
	 *
	 * @return {Array.<String>} keyChain
	 * */
	keys = () => {
		return this.#sequence == null ? [''] : this.#sequence.keyChain();
	};
}

export default Sequencer;
export {COMBOS};