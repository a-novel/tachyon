const literals = {
	ERROR_MISSINGURLPARAM: param => `url parameter ${param} is missing in properties`
};

/**
 * Replace param literals in url by actual values.
 *
 * fillParams('/url/to/route/:foo', {foo: 'bar'}) will return '/url/to/route/bar'
 *
 * @param {string=} pattern
 * @param {Object=} params
 * @return {string}
 */
const fillParams = (pattern = '/', params = {}) => {
	/* c8 ignore next 14 */
	const fillPattern = params ?
		Object
			.entries(params)
			.reduce(
				/**
				 * @param {string} acc
				 * @param {string} key
				 * @param {string} value
				 */
				(acc, [key, value]) => acc.replace(`:${key}`, value),
				pattern
			) :
		pattern;

	const leftBehind = fillPattern.split('/').find(x => x.startsWith(':'));

	if (leftBehind) {
		throw new Error(literals.ERROR_MISSINGURLPARAM(leftBehind));
	}

	return fillPattern;
}

/**
 * Convert an object to an url query string.
 *
 * @param {Object} query
 * @return {string}
 */
const toQueryString = query => Object.entries(query).map(([key, value]) => `${key}=${value}`).join('&');

/**
 * Navigate to url.
 *
 * @param {string=} destination
 * @param {Object=} urlParams
 * @param {boolean=} openOutside
 * @param {boolean=} skip
 * @param {Object=} urlQuery
 * @param {History=} history
 */
/* c8 ignore next 12 */
const goTo = (
	destination = '/',
	{urlParams, openOutside, skip, urlQuery, location} = {}
) => {
	const destinationUrl = `${fillParams(destination, urlParams || {})}?${toQueryString(urlQuery || {})}`;
	const currentURL = (location || window.location).pathname + (location || window.location).search;

	if (destinationUrl !== currentURL) {
		openOutside ?
			window.open(destinationUrl) : history[skip ? 'replace' : 'push'](destinationUrl);
	}
};

/**
 * Check if the current route is active.
 *
 * @param {string|string[]} destination
 * @param {boolean=} exact
 * @param {History=} history
 * @return {boolean}
 */
const isActive = (destination, {exact, location} = {}) => {
	if (destination.constructor === Array) {
		return destination.map(path => isActive(path, {exact, location})).find(x => x === true);
	}

	const destinationElements = destination.split('/');
	const currentElements = (location || window.location).pathname.split('/');

	if (destinationElements.length > currentElements.length) {
		return false;
	}

	if (exact && destinationElements.length !== currentElements.length) {
		return false;
	}

	for (const index in destinationElements) {
		const element = destinationElements[index];

		if (element.includes(':')) {
			continue;
		}

		if (element !== currentElements[index]) {
			return false;
		}
	}

	return true;
};

export {goTo, fillParams, toQueryString, isActive, literals};