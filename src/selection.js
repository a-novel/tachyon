// Created and maintained by Kushuh - kuzanisu@gmail.com.
// https://github.com/Kushuh

/**
 * This file contains helpers for manipulating carets in a DOM document.
 *
 * EXPORTED
 * - getSelectionRange
 * - setSelectionRange
 *
 * UTILS
 * - getComplexOffset
 * - seekSelectionNode
 */

/**
 * Represent a caret range within a rendered string. Caret goes from content[start] to content[end].
 *
 * @typedef {{start: number, end: number}} Caret
 */

/**
 * Calculate offset while ignoring some elements based on an array of selectors.
 *
 * @param {Range} range - current document range
 * @param {Node} container - the container wrapping the selection
 * @param {number} offset - the targeted position for the caret
 * @param {string[]=} ignore - ignore elements that match selectors in caret position count
 * @returns {number}
 */
const getComplexOffset = (range, container, offset, ignore) => {
	if (ignore == null || ignore.length === 0) {
		return offset;
	}

	// Select content from 0 to offset. This allow us to count every static content occurring before our caret position,
	// which are likely to alter it.
	range.setEnd(container, offset);
	const copy = range.cloneContents();

	for (const selector of ignore) {
		copy.querySelectorAll(selector).forEach(e => e ? e.innerHTML = '' : '');
	}

	// Remove static length from caret position.
	return copy.innerText.length;
};

/**
 * From an absolute caret position, find it's "relative" position (aka the one we should expect to be returned from
 * DOM methods). Range needs a container and an offset. The container has to be a text node, and the offset be contained
 * within it.
 *
 * @param {number} target - the target position for the cursor
 * @param {Node} el - the parent element of the cursor (not necessarily direct)
 * @param {string[]=} ignore - ignore some elements when calculating caret
 * @returns {{container: Node, offset: number}}
 */
const seekSelectionNode = (target, el, ignore) => {
	// Container is already a text node, so absolute position will equal the relative one and we don't need to do
	// anything.
	if (el.nodeType === Node.TEXT_NODE) {
		// In case the target (offset) is longer than the content length, setting range will throw an error. We'd like to
		// avoid this, so if target is greater than the text length, we cap it.
		return {container: el, offset: Math.min(target, (/** @type Node.TEXT_NODE */ el).length)};
	}

	// Empty node means we have nothing to select.
	if (el.childNodes == null) {
		return {container: el, offset: 0};
	}

	// Loop through child nodes while summing length of their content. Our container will be the first node to exceed the
	// offset position.
	let offset = 0;
	const nodes = [...el.childNodes];
	for (const node of nodes) {
		// Ignore static content.
		if (
			ignore != null && ignore.length > 0 &&
			node.classList &&
			ignore.find(x => node.matches(x))
		) {
			continue;
		}

		// Text nodes work differently from classic nodes, since they don't have innerText property.
		const innerLength = node.nodeType === Node.TEXT_NODE ? node.length : (node.innerText || '').length;
		offset += innerLength;

		// Perform recursive check because we eventually need our container to be a text node.
		if (offset > target) {
			return seekSelectionNode(target - offset + innerLength, node);
		}
	}

	// Since we should return if a Node was found, it means our caret is currently out of bounds. We set the caret at the
	// very end then.
	let last = nodes.pop();
	while (last && last.nodeType !== Node.TEXT_NODE && last.childNodes && last.childNodes.length) {
		last = [...last.childNodes].pop();
	}

	return {container: last, offset: (last || '').length};
};

/**
 * Return information about caret position. Return object contain data returned by default range handlers (caret parent
 * element and offset within the given parent), plus an absolute range. Absolute range (which consist of a start and
 * end offset) returns the caret boundaries if element had only one pure text child node.
 *
 * @param {Node} element
 * @param {string[]=} ignore - ignore elements that match selectors in caret position count
 * @returns {{absolute: Caret, start: {container: Node, offset: number}, end: {container: Node, offset: number}}}
 */
const getSelectionRange = (element, ignore) => {
	// Allocate variables for better readability.
	let start = 0;
	let end = 0;
	let startContainer = element;
	let endContainer = element;
	let startOffset = 0;
	let endOffset = 0;

	// Secure way to get the equivalent of 'window' global in non DOM environment, which can be useful for testing, for
	// example. It is more generally safer to avoid relying too much on globals.
	const win = (element.ownerDocument || document).defaultView;

	// Check if something is selected (pointless otherwise).
	const sel = win.getSelection();
	if (sel.rangeCount > 0) {
		// TODO : would be useful to look further at how selection work; can a document hold multiple selection ranges ?
		// TODO : How do we deal with them ?
		const range = win.getSelection().getRangeAt(0);

		// Creating a copy of range allows to compute it while not interfering with the actual selection. We need such
		// alterations in the getComplexOffset() method.
		const preCaretRange = range.cloneRange();

		// Default variable provided by js DOM.
		startContainer = range.startContainer;
		endContainer = range.endContainer;
		startOffset = range.startOffset;
		endOffset = range.endOffset;

		// Select the whole content under our element.
		preCaretRange.selectNodeContents(element);

		// Read more about this function goal at the function doc above. This will set our absolute caret position.
		start = getComplexOffset(preCaretRange, range.startContainer, range.startOffset, ignore);
		end = getComplexOffset(preCaretRange, range.endContainer, range.endOffset, ignore);
	}

	// Return object. Default records are set at declaration, in case no selection was found within the element.
	return {
		absolute: {
			start,
			end
		},
		start: {
			container: startContainer,
			offset: startOffset
		},
		end: {
			container: endContainer,
			offset: endOffset
		}
	};
};

/**
 * Set caret to given range. Additionally to wrap the default javascript methods to achieve this, it works with
 * absolute caret position and static content.
 *
 * @param {Node} element
 * @param {number} start
 * @param {string[]=} ignore - ignore elements that match selectors in caret position count
 * @param {number} end
 * @return {*}
 */
const setSelectionRange = (element, start, end, ignore) => {
	debugger;
	// No need to do anything if no content is present.
	if (element.innerText == null || element.innerText.length === 0) {
		return {start: -1, end: -1, it: element.outerHTML};
	}

	// Secure way to get the equivalent of 'window' global in non DOM environment, which can be useful for testing, for
	// example. It is more generally safer to avoid relying too much on globals.
	const win = (element.ownerDocument || document).defaultView;

	// Cap caret position to avoid overflow error.
	start = Math.min(element.innerText.length, start);
	end = Math.min(element.innerText.length, end || start);

	const range = (element.ownerDocument || document).createRange();

	// Get relative position of the node.
	const {container: startNode, offset: startOffset} = seekSelectionNode(start, element, ignore);
	const {container: endNode, offset: endOffset} = seekSelectionNode(end, element, ignore);

	range.setStart(startNode || element, startOffset);
	range.setEnd(endNode || element, endOffset);

	const sel = win.getSelection();
	sel.removeAllRanges();
	sel.addRange(range);

	return {start, end, it2: element.innerText};
};

export {getSelectionRange as getRange, setSelectionRange as setRange};