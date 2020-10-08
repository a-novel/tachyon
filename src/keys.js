// Created and maintained by Kushuh.
// https://github.com/Kushuh - kuzanisu@gmail.com

// import {getOS, OS} from '../os';
//
// const os = getOS();
//
// /**
//  * Ctrl for most OS, Cmd for macOS.
//  * @type {string}
//  */
// const actionKey = os === OS.MACOS ? 'Meta' : 'Control';
//
// /**
//  * Common controls sequences.
//  *
//  * @type {{
//  * 	UNDO: [string, string],
//  * 	CUT: [string, string],
//  * 	SELECTALL: [string, string],
//  * 	PASTE: [string, string],
//  * 	REDO: [string, string, string],
//  * 	COPY: [string, string]
//  * }}
//  */
// const COMBOS = {
// 	UNDO: [actionKey, 'Z'],
// 	REDO: [actionKey, 'Shift', 'Z'],
// 	SELECTALL: [actionKey, 'A'],
// 	COPY: [actionKey, 'C'],
// 	CUT: [actionKey, 'X'],
// 	PASTE: [actionKey, 'V']
// };

/**
 * Attach a unique event to each instance of sequencer.
 *
 * @param {number} id
 * @return {string}
 */
const event = id => `KeySequenceUpdated_${id}`;

/**
 * A Sequence consist of a callback and a list of keys to trigger it.
 *
 * @typedef {{fn: function, sequences: string[]}} Sequence
 */
/**
 * Extend eventListener concept on a serie of keys.
 *
 * @typedef {sequencer} Sequencer
 * @version 1.0.0
 * @author [Kushuh](https://github.com/Kushuh)
 */
class sequencer {
	/**
	 * @param {number=} timeout
	 * @param {boolean=} debug
	 */
	constructor(timeout, debug) {
		this.#debug = debug;
		this.#timeout = timeout || 300;
		this.#id = new Date().getTime();
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
	 */
	mount(el) {
		// Assign element to the one passed in parameters
		this.#el = el || document;

		if (this.#debug) {
			this.#el.addEventListener(event(this.#id), () => {
				console.log(this.#sequences);
			});
		}

		// Return handlers in an object.
		return {
			keyDown: e => {
				// Add a new key to current sequence and record its position.
				this.#keyCount++;
				this.#sequences.push(e.key);
				const lockKC = this.#keyCount;

				// Inform other listeners we updated the sequence.
				this.#el.dispatchEvent(new CustomEvent(event(this.#id), {detail: e}));

				// Remove listener declared as a variable so it can be removed.
				const removeKey = ee => {
					// Callback when the key needs to be removed from current sequence.
					const terminateCallback = () => {
						// Current offset of the key.
						const offset = this.#keyCount - lockKC;

						// Only if key is still present in the sequences array.
						if (offset < this.#sequences.length) {
							// Remove current key and every key before it.
							this.#sequences = this.#sequences.slice(this.#sequences.length - offset + 1);

							// Inform other listeners we updated the sequence.
							this.#el.dispatchEvent(new CustomEvent(event(this.#id), {detail: ee}));
						}

						// Remove attached listeners for the current key.
						this.#el.removeEventListener('keydown', removeKey, true);
						this.#el.removeEventListener(event(this.#id), resetCallback, true);
					};

					// Reset timer when another key is pressed fast enough, allowing for longer combos.
					const resetCallback = () => {
						clearTimeout(timer);
						timer = setTimeout(terminateCallback, this.#timeout);
					};

					let timer = setTimeout(terminateCallback, this.#timeout);
					this.#el.addEventListener(event(this.#id), resetCallback, true);
				}

				// Add listener in a way it can be removed afterwards.
				this.#el.addEventListener('keydown', removeKey, true);
			}
		}
	}

	/**
	 * Automatic setup : add handlers and don't return them.
	 *
	 * @param {Node=} el
	 * @public
	 */
	listen(el) {
		// Get handlers and set them.
		const {keyDown} = this.mount(el);
		this.#el.addEventListener('keydown', keyDown);

		// So it can be used in ref={} declaration.
		return el;
	}

	/**
	 * @callback accessor
	 * @return {{sequence: Sequence[], fn: function, [fallback]: function}}
	 */

	/**
	 * Allow dynamic key combos to be listened. Combos are accessed via a function that has access to the latest array
	 * of {@link Sequence} to listen to, so they can change over setTime.
	 *
	 * @param {accessor} accessor
	 * @public
	 */
	dynamicKeys(accessor) {
		this.#el.addEventListener(
			event(this.#id),
			e => {
				// Get current sequences string representation.
				const current = this.#sequences.join(' ');

				// Filter each validated sequences and trigger their callbacks.
				(accessor() || [])
					.filter(x => x.sequence.join(' ') === current)
					.forEach(({fn}) => fn(e.detail));

				// Run fallbacks.
				(accessor() || [])
					.filter(x => x.sequence.join(' ') !== current && x.fallback)
					.forEach(({fallback}) => fallback(e.detail));
			}
		);
	}

	/**
	 * Set debug mode programmatically.
	 *
	 * @param {boolean} mode
	 */
	setDebugMode = mode => {
		this.#debug = mode;
	};

	/**
	 * Return current sequence of pressed keys.
	 *
	 * @return {string[]}
	 */
	getSequence = () => this.#sequences;

	/**
	 * Return the number of validated keys within the sequence.
	 *
	 * @param {string[]} keys
	 * @return number
	 */
	getValidationPercentage = keys => {
		let i = keys.length;
		while (keys.slice(0, i).join(';') !== this.#sequences.slice(-i).join(';') && i > 0) {
			i--;
		}

		return i;
	};

	/**
	 * Add a new listener for a particular sequences. This listener is static and cannot be removed afterwards.
	 *
	 * @param {function} fn
	 * @param {string[]} sequence
	 * @param {function=} fallback
	 * @public
	 */
	register(fn, sequence, fallback) {
		this.#el.addEventListener(
			event(this.#id),
			e => {
				if (this.#sequences.join(' ') === sequence.join(' ')) {
					if (this.#debug) {
						console.log(`running ${fn.name}`);
					}

					fn(e.detail);
				} else if (fallback) {
					if (this.#debug) {
						console.log(`running ${fallback.name}`);
					}

					fallback(e.detail);
				}
			}
		);
	}
}

export {sequencer};