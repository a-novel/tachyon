// Created and maintained by Kushuh.
// https://github.com/Kushuh - kuzanisu@gmail.com

import {getOS, OS} from './os';

const os = getOS();

/**
 * Ctrl for most OS, Cmd for macOS.
 * @type {string}
 */
const actionKey = os === OS.MACOS ? 'Meta' : 'Control';

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
	UNDO: [actionKey, 'Z'],
	REDO: [actionKey, 'Shift', 'Z'],
	SELECTALL: [actionKey, 'A'],
	COPY: [actionKey, 'C'],
	CUT: [actionKey, 'X'],
	PASTE: [actionKey, 'V'],
	KONAMI_CODE: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
};

/**
 * Attach a unique event to each instance of sequencer.
 *
 * @param {number} id
 * @return {string}
 * @override
 */
const event = id => `KeySequenceUpdated_${id}`;

window.tachyonDATA = {sequencerID: 1};

const LOGS = {
	INTRO: (id, timeout) => `new sequencer mounted:\n\tID: ${id}\n\ttimeout: ${timeout}`,
	CURRENT_SEQUENCES: list => `current sequence: ${JSON.stringify(list)}`,
	RUNNING_CALLBACK: fn => `running callback ${fn.name || 'anonymous'}`,
	RUNNING_FALLBACK: fn => `running fallback ${fn.name || 'anonymous'}`,
	ERROR_ALREADYMOUNTED: 'this sequencer has already been attached to an element',
	ERROR_NOTMOUNTEDYET: 'sequencer is not yet initialized, you cannot attach listeners to it'
};

/**
 * A Sequence consist of a callback and a list of keys to trigger it.
 *
 * @typedef {{fn: function, sequences: string[]}} Sequence
 * @override
 */
/**
 * Extend eventListener concept on a serie of keys.
 *
 * @version 1.0.0
 * @author [Kushuh](https://github.com/Kushuh)
 */
export default class Sequencer {
	/**
	 * @param {number=} timeout
	 * @param {boolean=} debug
	 * @constructs Sequencer
	 */
	constructor(timeout, debug) {
		this.#debug = debug;
		this.#timeout = timeout || 400;
		this.#id = window.tachyonDATA.sequencerID;
		window.tachyonDATA.sequencerID++;

		if (debug) {
			console.log(LOGS.INTRO(this.#id, this.#timeout));
		}
	}

	/**
	 * Debug mode allow to print dynamically recorded sequence.
	 *
	 * @type {boolean}
	 * @private
	 */
	#debug;

	/**
	 * Unique id for this sequencer.
	 *
	 * @type {number}
	 * @private
	 */
	#id;

	/**
	 * Hold the current sequences of pressed keys.
	 *
	 * @type {string[]}
	 * @private
	 */
	#sequences = [];

	/**
	 * HTML Element to attach listeners to. By default it is document global.
	 *
	 * @type {Node}
	 * @private
	 */
	#el;

	/**
	 * Time to wait before removing a key from combo.
	 *
	 * @type {number}
	 * @private
	 */
	#timeout;

	/**
	 * Private variable used to keep track of key position.
	 *
	 * @type {number}
	 * @private
	 */
	#keyCount = 0;

	/**
	 * Return general listeners for manual setup.
	 *
	 * @param {Node=} el
	 * @returns {{keyDown: function}}
	 * @public
	 * @override
	 */
	mount = el => {
		if (this.#el != null) {
			throw new Error(LOGS.ERROR_ALREADYMOUNTED);
		}

		// Assign element to the one passed in parameters
		this.#el = el || document;

		if (this.#debug) {
			this.#el.addEventListener(event(this.#id), () => {
				console.log(LOGS.CURRENT_SEQUENCES(this.#sequences));
			});
		}

		// Return handlers in an object.
		return {
			/**
			 * @param {KeyboardEvent} e
			 */
			keyDown: e => {
				// Add a new key to current sequence and record its position.
				this.#keyCount++;
				this.#sequences.push(e.key);
				const lockKC = this.#keyCount;

				// Inform other listeners we updated the sequence.
				this.#el.dispatchEvent(new CustomEvent(event(this.#id), {detail: e}));

				// Remove listener declared as a variable so it can be removed.
				/**
				 * @param {KeyboardEvent} ee
				 */
				const removeKey = () => {
					// Callback when the key needs to be removed from current sequence.
					const terminateCallback = () => {
						// Current offset of the key.
						const offset = this.#keyCount - lockKC;

						// Only if key is still present in the sequences array.
						if (offset < this.#sequences.length) {
							// Remove current key and every key before it.
							this.#sequences = this.#sequences.slice(this.#sequences.length - offset + 1);
						}

						// Remove attached listeners for the current key.
						this.#el.removeEventListener('keyup', removeKey, true);
						this.#el.removeEventListener('keydown', resetCallback, true);
					};

					// Reset timer when another key is pressed fast enough, allowing for longer combos.
					const resetCallback = () => {
						clearTimeout(timer);
						timer = setTimeout(terminateCallback, this.#timeout);
					};

					let timer = setTimeout(terminateCallback, this.#timeout);
					this.#el.addEventListener('keydown', resetCallback, true);
				}

				// Add listener in a way it can be removed afterwards.
				this.#el.addEventListener('keyup', removeKey, true);
			}
		}
	};

	/**
	 * Automatic setup : add handlers and don't return them.
	 *
	 * @param {Node=} el
	 * @public
	 * @override
	 */
	listen = el => {
		if (this.#el != null) {
			throw new Error(LOGS.ERROR_ALREADYMOUNTED);
		}

		// Get handlers and set them.
		const {keyDown} = this.mount(el);
		this.#el.addEventListener('keydown', keyDown);

		// So it can be used in ref={} declaration.
		return el;
	};

	/**
	 * Allow dynamic key combos to be listened. Combos are accessed via a function that has access to the latest array
	 * of {@link Sequence} to listen to, so they can change over setTime.
	 *
	 * @param {function: {sequence: Sequence[], fn: function, [fallback]: function}[]} accessor
	 * @public
	 * @override
	 */
	dynamicKeys = accessor => {
		if (this.#el == null) {
			throw new Error(LOGS.ERROR_NOTMOUNTEDYET);
		}

		this.#el.addEventListener(
			event(this.#id),
			e => {
				(accessor() || []).forEach(registration => this.#checkSequence(e.detail, registration));
			}
		);
	};

	/**
	 * Set debug mode programmatically.
	 *
	 * @param {boolean} mode
	 * @override
	 */
	setDebugMode = mode => {
		this.#debug = mode;
	};

	/**
	 * Return current sequence of pressed keys.
	 *
	 * @return {string[]}
	 * @override
	 */
	getSequence = () => this.#sequences;

	/**
	 * Return the number of validated keys within the sequence.
	 *
	 * @param {string[]} keys
	 * @return number
	 * @override
	 */
	getValidationProgress = keys => {
		let i = keys.length;
		while (keys.slice(0, i).join(';') !== this.#sequences.slice(-i).join(';') && i > 0) {
			i--;
		}

		return i;
	};

	/**
	 * @return {number}
	 */
	getID = () => this.#id;

	/**
	 * Check if the current sequence matches a combo.
	 *
	 * @param {string} target
	 * @param {string} current
	 * @return {*|boolean}
	 */
	#isSequenceValidated = (target, current) => current.endsWith(target);

	/**
	 * @param {KeyboardEvent} e
	 * @param {{fn: function, sequence: string[], fallback: function}} registration
	 */
	#checkSequence = (e, registration) => {
		if (this.#isSequenceValidated(registration.sequence.join(' '), this.#sequences.join(' '))) {
			if (this.#debug) {
				console.log(LOGS.RUNNING_CALLBACK(registration.fn));
			}

			registration.fn(e);
		} else if (registration.fallback) {
			if (this.#debug) {
				console.log(LOGS.RUNNING_FALLBACK(registration.fallback));
			}

			registration.fallback(e);
		}
	};

	/**
	 * Add a new listener for a particular sequences. This listener is static and cannot be removed afterwards.
	 *
	 * @param {function} fn
	 * @param {string[]} sequence
	 * @param {function=} fallback
	 * @public
	 * @override
	 */
	register = (sequence, fn, fallback) => {
		if (this.#el == null) {
			throw new Error(LOGS.ERROR_NOTMOUNTEDYET);
		}

		this.#el.addEventListener(
			event(this.#id),
			e => this.#checkSequence(e.detail, {fn, sequence, fallback})
		);
	};
}

export {COMBOS, LOGS};