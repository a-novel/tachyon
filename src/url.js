import {FormatError} from './errors';

/**
 * @author Team Anovel {@link https://github.com/a-novel}
 * */

/**
 * Used to match RELATIVE urls. Won't work for absolute url starting with protocol (eg. https, http, ftp, etc.).
 *
 * @const {regexp}
 * */
const urlRegexp = /^\/[a-zA-Z0-9():]+([-a-zA-Z0-9()@:%_+.~#?&/=]*)/;

/**
 * Interpolate a pattern url with actual values for parameters.
 *
 * @example
 * 	fillParams('/foo/:bar', {bar: 'qux'}) // returns '/foo/qux'
 *
 * 	// warns about missing foo parameter
 * 	fillParams('/:foo/:bar', {bar: 'qux'}) // returns '/:foo/qux'
 *
 * @param {string} pattern - the (relative) url pattern to be interpolated.
 * @param {Object.<string, (string|null|undefined)>} [params] - a list of key/value pairs to interpolate within the pattern.
 *
 * @return {string} url - the interpolated url with the values given in params.
 *
 * @throws {TypeError} pattern must be a non empty string
 * @throws {TypeError} pattern must be of string type
 * @throws {TypeError} params must be an object or null
 * @throws {TypeError} params values must be of string type (or null)
 * @throws {FormatError} pattern must be a valid relative url
 */
const fillParams = (pattern, params) => {
	// Arguments check.

	if (pattern == null || pattern.length === 0) {
		throw new TypeError('no url pattern was given');
	}

	if (pattern.constructor.name !== ''.constructor.name) {
		throw new TypeError(`non valid constructor ${pattern.constructor.name} for pattern: should be a string`);
	}

	if (!urlRegexp.test(pattern)) {
		throw new FormatError('non valid pattern format');
	}

	if (params == null) {
		return pattern;
	}

	if (params.constructor.name !== {}.constructor.name) {
		throw new TypeError(`non valid constructor ${params.constructor.name} for params: should be an object`);
	}

	return pattern.split('/').map(element => {
		// Value supports interpolation.
		if (element.startsWith(':')) {
			const value = params[element.slice(1)];

			// Do not interpolate with missing values.
			if (value == null || value === '') {
				console.warn(`parameter ${element.slice(1)} not found in values`);
				return element;
			}

			if (value.constructor.name !== ''.constructor.name) {
				throw new TypeError(`non valid constructor ${value.constructor.name} for parameter ${element.slice(1)}: only strings are supported`);
			}

			return value;
		}

		return element;
	}).join('/');
}

/**
 * Create a query string from an object notation configuration.
 *
 * @example
 *	buildQueryString({uid: '123456', offset: 10}) // uid=123456&offset=10
 *
 * @param {Object.<string, *>} query - the object containing query data.
 *
 * @return {string} queryUrl - the query part of an url built from query object.
 *
 * @throws {TypeError} query must be an object or null
 * */
const buildQueryString = query => {
	if (query == null) {
		return '';
	}

	if (query.constructor.name !== {}.constructor.name) {
		throw new TypeError(`non valid constructor ${query.constructor.name} for query: should be an object`);
	}

	return Object.entries(query).map(([key, value]) => `${key}=${value.replaceAll('/', '%2F')}`).join('&');
};

/**
 * Builds an url from a pattern and options, using {@link fillParams} and {@link buildQueryString}.
 *
 * @example
 * 	buildUrl('/foo') // '/foo'
 * 	buildUrl('/foo/:param1', {param1: 'bar'}) // '/foo/bar'
 * 	buildUrl('/foo/:param1', {param1: 'bar'}, {uid: 'user_uid'}) // '/foo/bar?uid=user_id'
 * 	buildUrl('/search', null, {genre: 'books', priceMax: 10}) // '/search?genre=books&priceMax=10'
 *
 * @param {String} url - the base url
 * @param {{
 * 	[params]: Object.<string, (string|null|undefined)>,
 * 	[query]: Object.<string, *>,
 * 	[anchor]: String
 * }} [options]
 *
 * @return {String} url - the newly built url.
 *
 * @throws {TypeError} url must be a non empty string
 * @throws {TypeError} url must be of string type
 * @throws {TypeError} params must be an object or null
 * @throws {TypeError} params values must be of string type (or null)
 * @throws {FormatError} url must be a valid relative url
 * @throws {TypeError} query must be an object or null
 * */
const buildUrl = (url, options) => {
	const {params, query, anchor} = options || {};

	// Arguments check.

	if (url == null || url.length === 0) {
		throw new TypeError('no url pattern was given');
	}

	if (url.constructor.name !== ''.constructor.name) {
		throw new TypeError(`non valid constructor ${url.constructor.name} for url: should be a string`);
	}

	if (!urlRegexp.test(url)) {
		throw new FormatError('non valid url format');
	}

	if (params) url = fillParams(url, params);
	if (anchor) url += `#${anchor}`;
	if (query) url += `?${buildQueryString(query)}`;

	return url;
};

const buildAbsoluteUrl = (url, options) => {
	const [protocol, pathname] = url.split(':/');
	return `${protocol}:/${buildUrl(pathname, options)}`;
};

/**
 * Extra implementation of url navigator with options.
 *
 * @example
 *  // Basic example
 * 	goTo('/foo/bar', history) // opens '/foo/bar' in current tab
 *
 * 	// With flags
 * 	goTo('/foo/bar', history, {openOutside: true}) // opens '/foo/bar' in a new browser tab
 * 	goTo('/foo/bar', history, {skip: true}) // opens '/foo/bar' in current tab, and remove previous location from history
 *
 * 	// Using url build options
 * 	goTo('/foo/:param', history, {params: {param: 'bar'}}) // opens '/foo/bar'
 * 	goTo('/foo/bar', history, {query: {uid: 'user_id'}}) // opens '/foo/bar?uid=user_id'
 * 	goTo('/foo/bar', history, {anchor: 'section2'}) // opens '/foo/bar#section2'
 *
 * @param {String} destination - the destination url
 * @param {History} history - the history object
 * @param {{
 *  [params]: Object.<string, (string|null|undefined)>,
 * 	[query]: Object.<string, *>,
 * 	[anchor]: String,
 * 	[openOutside]: Boolean,
 * 	[skip]: Boolean
 * }} [options]
 *
 * @throws {TypeError} destination must be a non empty string
 * @throws {TypeError} destination must be of string type
 * @throws {TypeError} params must be an object or null
 * @throws {TypeError} params values must be of string type (or null)
 * @throws {FormatError} destination must be a valid relative url
 * @throws {TypeError} query must be an object or null
 * */
const goTo = (destination, history, options) => {
	const {params, query, anchor, openOutside, skip} = options || {};
	const url = buildUrl(destination, {params, query, anchor});

	if (openOutside) {
		window.open(url);
	} else {
		history[skip ? 'replace' : 'push'](url);
	}
};

/**
 * Check if the current route is active.
 *
 * @param {String|String[]} target
 * @param {History} currentLocation
 * @param {Boolean} [exact]
 *
 * @return {boolean}
 */
const isActive = (target, currentLocation, exact) => {
	if (target.constructor === Array) {
		return target.map(path => isActive(path, currentLocation, exact)).find(x => x === true);
	}

	if (!target.endsWith('/')) {
		target += '/'
	}

	let {pathname} = currentLocation;

	if (!pathname.endsWith('/')) {
		pathname += '/'
	}

	const destinationElements = target.split('/');
	const currentElements = pathname.split('/');

	if (destinationElements.length > currentElements.length) {
		return false;
	}

	if (exact && destinationElements.length !== currentElements.length) {
		return false;
	}

	for (const index in destinationElements) {
		const element = destinationElements[index];

		if (element.startsWith(':') || element === '') {
			continue;
		}

		if (element !== currentElements[index]) {
			return false;
		}
	}

	return true;
};

export {goTo, fillParams, buildUrl, isActive, buildQueryString, buildAbsoluteUrl};