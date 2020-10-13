/**
 * @jest-environment jsdom
 */

import {expect, describe, it, jest} from '@jest/globals';
import {fillParams, toQueryString, isActive} from '../src/index';
import {literals} from '../src/url';


describe('test url functions', () => {
	it('should fill params', () => {
		expect(fillParams()).toEqual('/');
		expect(fillParams('/')).toEqual('/');
		expect(fillParams('/', {})).toEqual('/');

		expect(fillParams('/hello/world')).toEqual('/hello/world');
		expect(fillParams('/hello/world', {})).toEqual('/hello/world');

		expect(() => {
			fillParams('/hello/:greet', {})
		}).toThrow(literals.ERROR_MISSINGURLPARAM(':greet'));

		expect(fillParams('/hello/world', {greet: 'foo'})).toEqual('/hello/world');
		expect(fillParams('/hello/:greet', {greet: 'foo'})).toEqual('/hello/foo');
	});

	it('should build queryString', () => {
		expect(toQueryString({})).toEqual('');
		expect(toQueryString({foo: 'bar'})).toEqual('foo=bar');
		expect(toQueryString({foo: 'bar', qux: 'quux'})).toEqual('foo=bar&qux=quux');
	});

	it('should return correct flag for isActive', () => {
		const currentHistory = {pathname: '/hello/world/42'};

		expect(isActive('/', {location: currentHistory})).toBeFalsy();
		expect(isActive('/hello/world/42', {location: currentHistory})).toBeTruthy();
		expect(isActive('/hello/world/42/123456', {location: currentHistory})).toBeFalsy();
		expect(isActive(['/hello/world/42', '/hello/world/42/123456'], {location: currentHistory})).toBeTruthy();

		currentHistory.pathname = '/hello/world/42/123456';

		expect(isActive('/hello/world/42', {location: currentHistory})).toBeTruthy();
		expect(isActive('/hello/:greet/42', {location: currentHistory})).toBeTruthy();
		expect(isActive('/hello/world/42', {location: currentHistory, exact: true})).toBeFalsy();
	});
});