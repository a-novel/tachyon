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
		const pathPM = '/:foo/bar/';
		const pathPMNP = '/:foo/bar';
		const path = '/foo/bar/';
		const pathNP = '/foo/bar';

		/**
		 *
		 * @param str
		 * @return History
		 */
		const newLocation = str => {
			const output = {}/** History*/
			output.pathname = str;
			return output
		};

		expect(isActive(path, {location: newLocation('/')})).toBeFalsy();
		expect(isActive(pathNP, {location: newLocation('/')})).toBeFalsy();

		expect(isActive(path, {location: newLocation('/foo/bar/qux'), exact: true})).toBeFalsy();
		expect(isActive(path, {location: newLocation('/foo/bar/qux/'), exact: true})).toBeFalsy();
		expect(isActive(pathNP, {location: newLocation('/foo/bar/qux'), exact: true})).toBeFalsy();
		expect(isActive(pathNP, {location: newLocation('/foo/bar/qux/'), exact: true})).toBeFalsy();

		expect(isActive(path, {location: newLocation('/foo/bar/qux')})).toBeTruthy();
		expect(isActive(path, {location: newLocation('/foo/bar/qux/')})).toBeTruthy();
		expect(isActive(pathNP, {location: newLocation('/foo/bar/qux')})).toBeTruthy();
		expect(isActive(pathNP, {location: newLocation('/foo/bar/qux/')})).toBeTruthy();

		expect(isActive(path, {location: newLocation('/foo/bar'), exact: true})).toBeTruthy();
		expect(isActive(path, {location: newLocation('/foo/bar/'), exact: true})).toBeTruthy();
		expect(isActive(pathNP, {location: newLocation('/foo/bar'), exact: true})).toBeTruthy();
		expect(isActive(pathNP, {location: newLocation('/foo/bar/'), exact: true})).toBeTruthy();

		expect(isActive(pathPM, {location: newLocation('/world/bar/qux'), exact: true})).toBeFalsy();
		expect(isActive(pathPM, {location: newLocation('/world/bar/qux/'), exact: true})).toBeFalsy();
		expect(isActive(pathPMNP, {location: newLocation('/world/bar/qux'), exact: true})).toBeFalsy();
		expect(isActive(pathPMNP, {location: newLocation('/world/bar/qux/'), exact: true})).toBeFalsy();

		expect(isActive(pathPM, {location: newLocation('/world/bar/qux')})).toBeTruthy();
		expect(isActive(pathPM, {location: newLocation('/world/bar/qux/')})).toBeTruthy();
		expect(isActive(pathPMNP, {location: newLocation('/world/bar/qux')})).toBeTruthy();
		expect(isActive(pathPMNP, {location: newLocation('/world/bar/qux/')})).toBeTruthy();

		expect(isActive(pathPM, {location: newLocation('/world/bar'), exact: true})).toBeTruthy();
		expect(isActive(pathPM, {location: newLocation('/world/bar/'), exact: true})).toBeTruthy();
		expect(isActive(pathPMNP, {location: newLocation('/world/bar'), exact: true})).toBeTruthy();
		expect(isActive(pathPMNP, {location: newLocation('/world/bar/'), exact: true})).toBeTruthy();

	});
});