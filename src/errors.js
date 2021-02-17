/**
 * @class
 * */
class FormatError extends Error {
	/**
	 * Creates a new FormatError.
	 *
	 * @constructs FormatError
	 * @param {String} message
	 * */
	constructor(message) {
		super(message);
		this.name = 'FormatError';
	}
}

export {
	FormatError
};