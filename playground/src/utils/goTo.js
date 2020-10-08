import history from '../history';

// Replace literal parameters in string ('/path/:param') with value from object.
const getParams = (destination, params) =>
	params ?
		Object
			.entries(params)
			.reduce(
				(acc, [key, value]) => acc.replace(`:${key}`, value),
				destination
			) :
		destination;

// Convert pairs of key/value to query string.
const parseQuery = params => Object.entries(params)
	.reduce(
		(acc, [key, value], index) => `${acc}${index > 0 ? '&' : ''}${key}=${value}`,
		'?'
	);

const goTo = (
	destination = '/',
	{
		params,
		openOutside,
		skip,
		query
	} = {}
) => {
	const [url, currentUrl] = buildRouteFromParams(
		destination,
		{
			params,
			openOutside,
			skip,
			query
		}
	);

	// Only operate if url is actually different from the current one.
	if (url !== currentUrl) {
		openOutside ?
			window.open(url) :
			// replace will not write to history, so hitting back button won't go to last page, but the last pushed one.
			history[skip ? 'replace' : 'push'](url);
	}
};

const isActive = (destination, {exact, propRoute}) => {
	if (destination.constructor === Array) {
		return destination
			.map(path => isActive(path, {exact, propRoute}))
			.find(x => x === true);
	} else {
		const destinationElements = destination.split('/');
		const currentRouteElements = (propRoute || window.location.pathname).split('/');

		if (destinationElements.length > currentRouteElements.length) {
			return false;
		} else if (exact && destinationElements.length !== currentRouteElements.length) {
			return false;
		} else {
			return destinationElements.reduce(
				(acc, element, index) => {
					if (!acc) return acc;
					else {
						return (element.startsWith(':') || element === currentRouteElements[index]);
					}
				}, true
			);
		}
	}
};

const buildRouteFromParams = (
	destination = '/',
	{
		params,
		query
	} = {}
) => {
	// Parse url.
	const parsedParams = getParams(destination, params);
	const queryString = query ? parseQuery(query) : '';

	// Build urls.
	const {pathname, search} = window.location;
	const url = `${parsedParams}${queryString}`;
	return [url, `${pathname}${search}`];
};

export {isActive, goTo, getParams, buildRouteFromParams};