/**
 * @author Team Anovel {@link https://github.com/a-novel}
 * */

/* c8 ignore next 13 */
/**
 * Shorthands for OS platforms.
 *
 * @type {Object.<string, string>}
 */
const OS = {
	WINDOWS: 'Windows',
	LINUX: 'Linux',
	MACOS: 'macOS',
	IOS: 'iOS',
	ANDROID: 'Android',
	OTHER: 'unknown'
};


/* c8 ignore next 28 */
/**
 * Returns the current client operating system.
 *
 * @return {string} os - the os string (may be found in {@link OS} object)
 */
const getOS = () => {
	const userAgent = window.navigator.userAgent;
	const platform = window.navigator.platform;

	// Some platforms can have multiple identifiers.
	const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
	const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
	const iosPlatforms = ['iPhone', 'iPad', 'iPod'];

	if (macosPlatforms.includes(platform)) {
		return OS.MACOS;
	} else if (iosPlatforms.includes(platform)) {
		return OS.IOS;
	} else if (windowsPlatforms.includes(platform)) {
		return OS.WINDOWS;
	} else if (/Android/.test(userAgent)) {
		return OS.ANDROID;
	} else if (/Linux/.test(platform)) {
		return OS.LINUX;
	}

	return OS.OTHER;
};

export {getOS, OS};