/**
 * Safely transpose caret when the text around gets mutated.
 *
 * @class CaretHandler
 * */
class CaretHandler {
	/**
	 * Creates a new CaretHandler
	 *
	 * @param {Number} start
	 * @param {Number} end
	 *
	 * @return CaretHandler
	 * */
	constructor(start, end) {
		this.#start = start;
		this.#end = end;
	}

	/**
	 * @type {Number}
	 * @description Caret start position.
	 * */
	#start;

	/**
	 * @type {Number}
	 * @description Caret end position.
	 * */
	#end;

	/**
	 * Update a caret based on a content mutation.
	 *
	 * @param {{
	 *   [rangeOrigin]: Caret,
	 *   newContentLength: Number,
	 *   oldContentLength: Number
	 * }} params
	 * */
	update = params => {
		const {rangeOrigin, newContentLength, oldContentLength} = params;
		const offset = newContentLength - oldContentLength;

		// Current is rangeOrigin.
		if (!rangeOrigin) {
			this.#start += newContentLength;
			this.#end = this.#start;

			return;
		}

		const destinationRangeEnd = rangeOrigin.start + newContentLength;

		// [current]...[rangeOrigin]
		if (rangeOrigin.start >= this.#end) {
			return;
		}

		// [rangeOrigin]...[current]
		if (rangeOrigin.end <= this.#start) {
			this.#start += offset;
			this.#end += offset;
			return;
		}

		// [rangeOrigin (current ] )
		if (
			rangeOrigin.end > this.#start &&
			rangeOrigin.end <= this.#end &&
			rangeOrigin.start < this.#start
		) {
			const diff = this.#end - rangeOrigin.end;

			this.#start = rangeOrigin.start;
			this.#end = destinationRangeEnd + diff;

			return;
		}

		// [rangeOrigin (current) ]
		if (rangeOrigin.end >= this.#end && rangeOrigin.start <= this.#start) {
			this.#start = destinationRangeEnd;
			this.#end = destinationRangeEnd;

			return;
		}

		// (current [rangeOrigin ) ]
		if (
			rangeOrigin.start > this.#start &&
			rangeOrigin.start < this.#end &&
			rangeOrigin.end >= this.#end
		) {
			this.#end = destinationRangeEnd;
			return;
		}

		// (current [rangeOrigin] )
		this.#end += offset;
	};

	/**
	 * Returns current underlying caret.
	 *
	 * @return {Caret}
	 * */
	current = () => ({start: this.#start, end: this.#end});

	/**
	 * Update current caret.
	 *
	 * @param {Number} start
	 * @param {Number} end
	 * */
	set = (start, end) => {
		this.#start = start;
		this.#end = end;
	};
}

export default CaretHandler;