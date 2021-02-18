/**
 * @author Team Anovel {@link https://github.com/a-novel}
 * @module records
 * */

import ChainList from './chainList';

/**
 * @typedef {{
 *   start: Number,
 *   end: Number
 * }} Caret
 *
 * @typedef {{
 *   count: Number
 * }} HistoryOption
 *
 * @typedef {{
 *   [maxSize]: Number,
 *   [separators]: Array.<string>,
 *   [timeout]: Number
 * }} PackOption
 * */

/**
 * Holds a record about a given state of a text input.
 *
 * @class Record
 * @alias records.Record
 * */
class Record extends ChainList {
	/**
	 * Creates a new Record.
	 *
	 * @param {{
	 *   caret: Caret,
	 *   oldContent: String,
	 *   newContent: String,
	 *   [canceled]: Boolean,
	 *   [previous]: records.Record | null,
	 *   [next]: records.Record | null,
	 *   [lock]: Boolean,
	 *   [timestamp]: Number
	 * }} options
	 *
	 * @return records.Record
	 * */
	constructor(options) {
		const {caret, oldContent, newContent, canceled, previous, next, lock, timestamp} = options;

		super(previous, next, lock);
		this.#caret = caret;
		this.#oldContent = oldContent;
		this.#newContent = newContent;
		this.#canceled = canceled;
		this.#timestamp = timestamp;
	}

	/**
	 * @type Caret
	 * @description Caret range on the original content prior to the modification.
	 * */
	#caret;

	/**
	 * @type String
	 * @description Input content that was removed during the update process.
	 * */
	#oldContent;

	/**
	 * @type String
	 * @description New input content that was inserted.
	 * */
	#newContent;

	/**
	 * @type Boolean
	 * @description Indicates this record was rolled back.
	 * */
	#canceled;

	/**
	 * @type Number
	 * @description The time when the record occured.
	 * */
	#timestamp;

	/**
	 * Return the record status.
	 *
	 * @return {Boolean} canceled
	 * */
	isCanceled = () => this.#canceled;

	/**
	 * Append a new record after this one.
	 *
	 * @param {records.Record} record
	 *
	 * @return {records.Record | null} newRecord - returns null if record list needs to be destroyed.
	 * */
	append = record => {
		if (this.isCanceled()) {
			if (this.previous()) {
				return this.previous().append(record);
			}

			return null;
		} else {
			record.rebaseLeft(this);
			return this.rebaseRight(record);
		}
	};

	ruleShouldBeSiblings = record => (
		record.caret().start > (this.#caret.start + this.#newContent.length) ||
		record.caret().start <= this.#caret.start
	);

	ruleShouldBreakOnSeparator = separators => {
		if (!separators || separators.length === 0) return false;

		for (const separator of separators) {
			if (this.#newContent.includes(separator)) {
				return true;
			}
		}

		return false;
	};

	ruleShouldBreakOnOversize = (maxSize, record) => {
		if (maxSize && maxSize > 0) {
			if ((record.newContent().length + this.#newContent.length) > maxSize) {
				return true;
			}
		}

		return false;
	};

	ruleShouldBreakOnTimeout = (timeout, record) => {
		if (timeout && timeout > 0) {
			if ((record.timestamp() - this.#timestamp) > timeout) {
				return true;
			}
		}

		return false;
	};

	/**
	 * Merge new record with current one if pack condition matches, or append a new record otherwise.
	 *
	 * @param {records.Record} record
	 * @param {PackOption} options
	 *
	 * @return {records.Record | null} newRecord - returns null if record list needs to be destroyed.
	 * */
	appendPack = (record, options) => {
		if (this.isCanceled()) {
			if (this.previous()) {
				return this.previous().appendPack(record, options);
			}

			return null;
		}

		const {maxSize, separators, timeout} = options;

		if (
			this.ruleShouldBeSiblings(record) ||
			this.ruleShouldBreakOnSeparator(separators) ||
			this.ruleShouldBreakOnOversize(maxSize, record) ||
			this.ruleShouldBreakOnTimeout(timeout, record)
		) {
			return this.append(record);
		}

		this.#newContent = this.#newContent.slice(0, record.caret().start - this.#caret.start) + record.newContent();
		this.#oldContent = this.#oldContent + record.oldContent();
		this.#caret.end = this.#caret.start + this.#oldContent.length;

		return this;
	};

	/**
	 * Undo record and apply changes on current content. Assume records are undone in order.
	 *
	 * @param {String} content
	 * @param {HistoryOption} [options]
	 *
	 * @return {String} alteredContent
	 * */
	undo = (content, options) => {
		const {count} = options || {};

		if (this.#canceled) {
			if (this.previous()) {
				return this.previous().undo(content, options);
			} else {
				return content;
			}
		}

		this.#canceled = true;

		const restored = content.slice(0, this.#caret.start) +
			this.#oldContent +
			content.slice(this.#caret.start + this.#newContent.length);

		if (count > 1 && this.previous()) {
			return this.previous().undo(restored, {count: count - 1});
		} else {
			return restored;
		}
	};

	/**
	 * Redo record and apply changes on current content. Assume records are redone in order.
	 *
	 * @param {String} content
	 * @param {HistoryOption} [options]
	 *
	 * @return {String} alteredContent
	 * */
	redo = (content, options) => {
		const {count} = options || {};

		if (!this.isCanceled()) return content;

		if (this.previous() && this.previous().isCanceled()) {
			return this.previous().redo(content, options);
		}

		this.#canceled = false;

		const restored = content.slice(0, this.#caret.start) +
			this.#newContent +
			content.slice(this.#caret.end);

		if (count > 1 && this.next()) {
			return this.next().redo(restored, {count: count - 1});
		} else {
			return restored;
		}
	}

	/**
	 * Remove every entry below a certain index (keep last x entries only).
	 *
	 * @param {Number} count
	 * */
	clear = count => {
		if (count > 1) {
			this.previous() && this.previous().clear(count - 1);
		} else {
			this.rebaseLeft(null);
		}
	};

	/**
	 * Get current caret.
	 *
	 * @return {Caret} caret
	 * */
	caret = () => this.#caret;

	/**
	 * Get oldContent.
	 *
	 * @return {String} oldContent
	 * */
	oldContent = () => this.#oldContent;

	/**
	 * Get newContent.
	 *
	 * @return {String} newContent
	 * */
	newContent = () => this.#newContent;

	/**
	 * Get timestamp.
	 *
	 * @return {Number} timestamp
	 * */
	timestamp = () => this.#timestamp;
}

/**
 * @typedef {{
 *   caret: Caret,
 *   oldContent: String,
 *   newContent: String,
 *   timestamp: Number,
 *   [canceled]: Boolean
 * }} StaticRecord
 * */

/**
 * History manager for input text.
 *
 * @class RecordsManager
 * @alias records.RecordsManager
 * */
class RecordsManager {
	/**
	 * Create a new RecordManager.
	 *
	 * @param {String} content
	 * @param {{
	 *   [maxLength]: Number,
	 *   [pack]: PackOption,
	 *   [history]: Array.<StaticRecord>,
	 *   [trustStartValue]: Boolean
	 * }} [options]
	 * */
	constructor(content, options) {
		const {maxLength, history, pack, trustStartValue} = options || {};

		this.#content = content;
		this.#maxLength = maxLength;
		this.#packOptions = pack;

		if (history == null || history.length === 0) {
			return;
		}

		history.forEach(
			({caret, oldContent, newContent, canceled, timestamp}) =>
				this.#pushStart({caret, oldContent, newContent, canceled, timestamp}, trustStartValue)
		);
	}

	/**
	 * @type records.Record
	 * @description Last record in list.
	 * */
	#record;

	/**
	 * @type Number
	 * @description Max number of records that can be kept in history.
	 * */
	#maxLength;

	/**
	 * @type String
	 * @description Current string content.
	 * */
	#content;

	/**
	 * @type PackOption
	 * @description Set how records should merge under certain conditions.
	 * */
	#packOptions;

	/**
	 * Push a new record to the stack and update content.
	 *
	 * @param {{
	 *   caret: Caret,
	 *   newContent: String
	 * }} record
	 *
	 * @return {String} alteredContent
	 * */
	push = record => {
		const newRecord = new Record({
			oldContent: this.#content.slice(record.caret.start, record.caret.end),
			newContent: record.newContent,
			caret: record.caret,
			timestamp: new Date().getTime()
		});

		const append = this.#record != null && (this.#packOptions ? this.#record.appendPack : this.#record.append);

		if (append) this.#record = append(newRecord, this.#packOptions) || newRecord;
		else this.#record = newRecord;

		if (this.#maxLength > 0) this.#record.clear(this.#maxLength);

		this.#content = this.#content.slice(0, record.caret.start) +
			record.newContent +
			this.#content.slice(record.caret.end);

		return this.#content;
	};

	/**
	 * Push a new record to the stack. Only used for initialization.
	 *
	 * @param {StaticRecord} record
	 * @param {Boolean} trustStartValue
	 * */
	#pushStart = (record, trustStartValue) => {
		if (!trustStartValue && !record.canceled) {
			this.push(record);
		} else {
			const newRecord = new Record(record);
			if (this.#record != null) this.#record.append(newRecord);
			this.#record = newRecord;
		}
	};

	/**
	 * Undo the last active record in history.
	 *
	 * @param {HistoryOption} [options]
	 *
	 * @return {String} alteredContent
	 * */
	undo = options => {
		if (this.#record) this.#content = this.#record.undo(this.#content, options);
		return this.#content;
	};

	/**
	 * Redo the first inactive record in history.
	 *
	 * @param {HistoryOption} [options]
	 *
	 * @return {String} alteredContent
	 * */
	redo = options => {
		if (this.#record) this.#content = this.#record.redo(this.#content, options);
		return this.#content;
	};

	/**
	 * Remove all entries from history.
	 * */
	clearAll = () => {
		this.#record = null;
	}

	/**
	 * Get content.
	 *
	 * @return {String} content.
	 * */
	content = () => this.#content;
}

export default RecordsManager;