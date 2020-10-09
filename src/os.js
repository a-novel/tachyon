// Created and maintained by Kushuh.
// https://github.com/Kushuh - kuzanisu@gmail.com

/**
 * Shorthands for OS platforms.
 *
 * @type {{OTHER: string, LINUX: string, WINDOWS: string, MACOS: string, IOS: string, ANDROID: string}}
 */
const OS = {
	WINDOWS: 'Windows',
	LINUX: 'Linux',
	MACOS: 'MacOS',
	IOS: 'IOS',
	ANDROID: 'Android',
	OTHER: 'unknown'
};

/**
 * Return the operating system the current user is running on.
 *
 * @version 1.0.0
 * @author [Kushuh](https://github.com/Kushuh)
 * @return {string}
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