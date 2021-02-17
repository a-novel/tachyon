import {describe, it} from '@jest/globals';
import {buildQueryString, buildUrl, fillParams, goTo, isActive} from '../src';
import {FormatError} from '../src/errors';

describe(
	'test fillParams',
	() => {
		it('should work when the url contains nothing to interpolate', () => {
			const warnSpy = jest.spyOn(global.console, 'warn');

			expect(fillParams('/foo')).toEqual('/foo');
			expect(warnSpy).toHaveBeenCalledTimes(0);
			expect(fillParams('/foo/:fake')).toEqual('/foo/:fake');
			expect(warnSpy).toHaveBeenCalledTimes(0);

			expect(fillParams('/foo', {param: 'bar'})).toEqual('/foo');
			expect(warnSpy).toHaveBeenCalledTimes(0);
			expect(fillParams('/foo/:fake', {param: 'bar'})).toEqual('/foo/:fake');
			expect(warnSpy).toHaveBeenCalledTimes(1);

			warnSpy.mockRestore();
		});

		it('should interpolate', () => {
			expect(fillParams('/foo/:bar', {bar: 'qux'})).toEqual('/foo/qux');
			expect(fillParams('/:foo/:bar', {bar: 'qux'})).toEqual('/:foo/qux');
		});

		it('should fail with non valid arguments', () => {
			expect(() => fillParams(null)).toThrow(TypeError);
			expect(() => fillParams('')).toThrow(TypeError);
			expect(() => fillParams(123456)).toThrow(TypeError);
			expect(() => fillParams('/foo', 'bar')).toThrow(TypeError);
			expect(() => fillParams('/foo/:param', {param: ['bar']})).toThrow(TypeError);
			expect(() => fillParams('abc')).toThrow(FormatError);
		});
	}
);

describe(
	'test buildQueryString',
	() => {
		it('should build with empty query', () => {
			expect(buildQueryString(null)).toEqual('');
			expect(buildQueryString({})).toEqual('');
		});

		it('should build valid query string', () => {
			expect(buildQueryString({uid: 123})).toEqual('uid=123');
			expect(buildQueryString({type: 'book', maxPrice: 10})).toEqual('type=book&maxPrice=10');
		});

		it('should fail with non valid argument', () => {
			expect(() => buildQueryString(['uid', 123])).toThrow(TypeError);
		});
	}
);

describe(
	'test buildUrl',
	() => {
		it('should build url without interpolation', () => {
			expect(buildUrl('/foo/bar')).toEqual('/foo/bar');
		});

		it('should build with params', () => {
			expect(buildUrl('/foo/:param', {params: {param: 'bar'}})).toEqual('/foo/bar');
			expect(buildUrl('/foo/bar', {query: {uid: 123456}})).toEqual('/foo/bar?uid=123456');
			expect(buildUrl('/foo/bar', {anchor: 'section1'})).toEqual('/foo/bar#section1');

			expect(buildUrl('/foo/:param', {anchor: 'section1', query: {uid: 123456}, params: {param: 'bar'}}))
				.toEqual('/foo/bar#section1?uid=123456');
		});

		it('should fail with non valid arguments', () => {
			expect(() => buildUrl(null)).toThrow(TypeError);
			expect(() => buildUrl('')).toThrow(TypeError);
			expect(() => buildUrl(123456)).toThrow(TypeError);
			expect(() => buildUrl('abc')).toThrow(FormatError);
		});
	}
);

describe(
	'test goTo',
	() => {
		it('should go to url', () => {
			const history = /** @type {History} */ {push: jest.fn(), replace: jest.fn()};
			window.open = jest.fn();

			goTo('/foo/bar', history);
			expect(history.push).toHaveBeenLastCalledWith('/foo/bar');

			goTo('/foo/bar', history, {openOutside: true});
			expect(window.open).toHaveBeenLastCalledWith('/foo/bar');

			goTo('/foo/bar', history, {skip: true});
			expect(history.replace).toHaveBeenLastCalledWith('/foo/bar');

			goTo('/foo/:param', history, {params: {param: 'bar'}});
			expect(history.push).toHaveBeenLastCalledWith('/foo/bar');

			goTo('/foo/bar', history, {query: {uid: 'user_id'}});
			expect(history.push).toHaveBeenLastCalledWith('/foo/bar?uid=user_id');

			goTo('/foo/bar', history, {anchor: 'section2'});
			expect(history.push).toHaveBeenLastCalledWith('/foo/bar#section2');
		});
	}
);

describe(
	'test isActive',
	() => {
		/** @return {History} */
		const location = path => /** @type {History} */ ({pathname: path});

		it('should return correct values with string destination', () => {
			expect(isActive('/', location('/foo/bar/qux'))).toBeTruthy();
			expect(isActive('/', location('/'))).toBeTruthy();

			expect(isActive('/foo/bar', location('/foo/bar'))).toBeTruthy();
			expect(isActive('/foo/bar', location('/foo/bar/qux'))).toBeTruthy();

			expect(isActive('/foo/bar', location('/foo/bar/'))).toBeTruthy();
			expect(isActive('/foo/bar', location('/foo/bar/qux/'))).toBeTruthy();

			expect(isActive('/foo/bar/', location('/foo/bar'))).toBeTruthy();
			expect(isActive('/foo/bar/', location('/foo/bar/qux'))).toBeTruthy();

			expect(isActive('/foo/bar/', location('/foo/bar/'))).toBeTruthy();
			expect(isActive('/foo/bar/', location('/foo/bar/qux/'))).toBeTruthy();

			expect(isActive('/foo/bar', location('/foo'))).toBeFalsy();
			expect(isActive('/foo/bar', location('/foo/'))).toBeFalsy();

			expect(isActive('/foo/bar', location('/foo/bar'), true)).toBeTruthy();
			expect(isActive('/foo/bar', location('/foo/bar/'), true)).toBeTruthy();
			expect(isActive('/foo/bar/', location('/foo/bar/'), true)).toBeTruthy();
			expect(isActive('/foo/bar/', location('/foo/bar'), true)).toBeTruthy();

			expect(isActive('/foo/bar', location('/foo/bar/qux'), true)).toBeFalsy();
			expect(isActive('/foo/bar/', location('/foo/bar/qux'), true)).toBeFalsy();
		});

		it('should return correct values with array destination', () => {
			expect(isActive(['/qux/quux/', '/foo/bar'], location('/foo/bar'))).toBeTruthy();
			expect(isActive(['/qux/quux/', '/foo/bar'], location('/foo/bar/qux'))).toBeTruthy();
			expect(isActive(['/qux/quux/', '/foo/bar'], location('/foo/bar/qux'), true)).toBeFalsy();
		});
	}
);