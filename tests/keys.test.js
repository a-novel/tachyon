/**
 * @jest-environment jsdom
 */

import {afterEach, beforeEach, describe, it, jest} from '@jest/globals';
import {Sequencer} from '../src/index';
import {LOGS} from '../src/keys';

// 400 keys.
const longSequence = [
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
];

describe(
	'test Sequencer class',
	() => {
		let callback;
		let fallback;
		let callback2;
		let fallback2;

		beforeEach(() => {
			callback = jest.fn();
			fallback = jest.fn();
			callback2 = jest.fn();
			fallback2 = jest.fn();
		});

		afterEach(() => {
			callback.mockClear();
			fallback.mockClear();
			callback2.mockClear();
			fallback2.mockClear();
		});

		it('should record 4 concurrent keys', () => {
			const sequencer = new Sequencer(50);
			sequencer.listen();
			sequencer.register(['a', 'b', 'c', 'd'], callback);
			sequencer.register(['c', 'd', 'a', 'b'], callback2);

			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'a'}));
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'b'}));

			expect(callback).toBeCalledTimes(0);
			expect(callback2).toBeCalledTimes(0);

			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'c'}));
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'd'}));

			expect(callback).toBeCalledTimes(1);
			expect(callback2).toBeCalledTimes(0);

			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'a'}));
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'b'}));

			expect(callback).toBeCalledTimes(1);
			expect(callback2).toBeCalledTimes(1);

			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'c'}));
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'd'}));

			expect(callback).toBeCalledTimes(2);
			expect(callback2).toBeCalledTimes(1);
		});

		it('should record 400 concurrent keys', () => {
			const sequencer = new Sequencer(50);
			sequencer.listen();
			sequencer.register(longSequence, callback);

			expect(callback).toBeCalledTimes(0);
			for(const key of longSequence) {
				document.dispatchEvent(new KeyboardEvent('keydown', {'key': key}));
			}

			expect(callback).toBeCalledTimes(1);
		});

		it('should call fallback correctly', () => {
			const sequencer = new Sequencer(50);
			sequencer.listen();
			sequencer.register(['a', 'b', 'c', 'd'], callback, fallback);
			sequencer.register(['c', 'd', 'a', 'b'], callback2);

			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'a'}));
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'a'}));
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'b'}));
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'c'}));
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'd'}));

			expect(callback).toBeCalledTimes(1);
			expect(fallback).toBeCalledTimes(4);
			expect(callback2).toBeCalledTimes(0);

			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'a'}));
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'b'}));

			expect(callback).toBeCalledTimes(1);
			expect(fallback).toBeCalledTimes(6);
			expect(callback2).toBeCalledTimes(1);
		});

		it('should return correct sequence of keys', () => {
			const sequencer = new Sequencer(50);
			sequencer.listen();

			expect(sequencer.getSequence()).toEqual([]);
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'a'}));
			expect(sequencer.getSequence()).toEqual(['a']);
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'a'}));
			expect(sequencer.getSequence()).toEqual(['a', 'a']);
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'b'}));
			expect(sequencer.getSequence()).toEqual(['a', 'a', 'b']);
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'c'}));
			expect(sequencer.getSequence()).toEqual(['a', 'a', 'b', 'c']);
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'd'}));
			expect(sequencer.getSequence()).toEqual(['a', 'a', 'b', 'c', 'd']);
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'a'}));
			expect(sequencer.getSequence()).toEqual(['a', 'a', 'b', 'c', 'd', 'a']);
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'b'}));
			expect(sequencer.getSequence()).toEqual(['a', 'a', 'b', 'c', 'd', 'a', 'b']);
		});

		it('should return correct progress values', () => {
			const sequencer = new Sequencer(50);
			sequencer.listen();

			expect(sequencer.getValidationProgress(['a', 'b', 'c', 'd'])).toEqual(0);
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'a'}));
			expect(sequencer.getValidationProgress(['a', 'b', 'c', 'd'])).toEqual(1);
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'a'}));
			expect(sequencer.getValidationProgress(['a', 'b', 'c', 'd'])).toEqual(1);
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'b'}));
			expect(sequencer.getValidationProgress(['a', 'b', 'c', 'd'])).toEqual(2);
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'c'}));
			expect(sequencer.getValidationProgress(['a', 'b', 'c', 'd'])).toEqual(3);
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'd'}));
			expect(sequencer.getValidationProgress(['a', 'b', 'c', 'd'])).toEqual(4);
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'a'}));
			expect(sequencer.getValidationProgress(['a', 'b', 'c', 'd'])).toEqual(1);
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'b'}));
			expect(sequencer.getValidationProgress(['a', 'b', 'c', 'd'])).toEqual(2);
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'e'}));
			expect(sequencer.getValidationProgress(['a', 'b', 'c', 'd'])).toEqual(0);
		});

		it('should not mix between sequencers', () => {
			const sequencer = new Sequencer();
			const sequencer2 = new Sequencer();

			sequencer.listen();
			sequencer.register(['a', 'b', 'c', 'd'], callback);

			expect(sequencer.getSequence()).toEqual([]);
			expect(sequencer2.getSequence()).toEqual([]);
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'a'}));
			expect(sequencer.getSequence()).toEqual(['a']);
			expect(sequencer2.getSequence()).toEqual([]);
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'a'}));
			expect(sequencer.getSequence()).toEqual(['a', 'a']);
			expect(sequencer2.getSequence()).toEqual([]);
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'b'}));
			expect(sequencer.getSequence()).toEqual(['a', 'a', 'b']);
			expect(sequencer2.getSequence()).toEqual([]);

			sequencer2.listen();
			sequencer2.register(['a', 'b', 'c', 'd'], callback2);

			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'c'}));
			expect(sequencer.getSequence()).toEqual(['a', 'a', 'b', 'c']);
			expect(sequencer2.getSequence()).toEqual(['c']);
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'd'}));
			expect(sequencer.getSequence()).toEqual(['a', 'a', 'b', 'c', 'd']);
			expect(sequencer2.getSequence()).toEqual(['c', 'd']);
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'a'}));
			expect(sequencer.getSequence()).toEqual(['a', 'a', 'b', 'c', 'd', 'a']);
			expect(sequencer2.getSequence()).toEqual(['c', 'd', 'a']);
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'b'}));
			expect(sequencer.getSequence()).toEqual(['a', 'a', 'b', 'c', 'd', 'a', 'b']);
			expect(sequencer2.getSequence()).toEqual(['c', 'd', 'a', 'b']);

			expect(callback).toBeCalledTimes(1);
			expect(callback2).toBeCalledTimes(0);
		});

		it('should be able to add 400 sequencer concurrently', () => {
			let ids = [];
			for (let i = 0; i < 400; i++) {
				const sequencer = new Sequencer();
				if (ids.includes(sequencer.getID())) {
					throw new Error(`id for item ${i} is already present in the list`);
				} else {
					ids.push(sequencer.getID());
				}
			}
		});

		it('should work with dynamic keys', () => {
			const sequencer = new Sequencer();
			sequencer.listen();

			// Trigger if two consecutive keys were repeated twice.
			sequencer.dynamicKeys(() => {
				const lastDuo = sequencer.getSequence().slice(-2);

				if (lastDuo.length < 2) {
					return null;
				}

				return [{fn: callback, sequence: [...lastDuo, ...lastDuo]}];
			});

			expect(callback).toBeCalledTimes(0);

			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'a'}));
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'b'}));
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'c'}));
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'd'}));
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'c'}));
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'd'}));

			expect(callback).toBeCalledTimes(1);

			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'c'}));

			expect(callback).toBeCalledTimes(2);

			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'e'}));
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'f'}));
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'e'}));
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'h'}));
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 't'}));
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 't'}));
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 't'}));
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 't'}));

			expect(callback).toBeCalledTimes(3);

			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'a'}));

			expect(callback).toBeCalledTimes(3);
		});

		it('should reject when attaching the listener multiple times', () => {
			const sequencer = new Sequencer();
			sequencer.listen();

			expect(() => {
				sequencer.listen()
			}).toThrow(LOGS.ERROR_ALREADYMOUNTED);

			expect(() => {
				sequencer.mount()
			}).toThrow(LOGS.ERROR_ALREADYMOUNTED);
		});

		it('should reject when adding listener on non attached sequencer', () => {
			const sequencer = new Sequencer();

			expect(() => {
				sequencer.register(['a', 'b'], callback)
			}).toThrow(LOGS.ERROR_NOTMOUNTEDYET);

			expect(() => {
				sequencer.dynamicKeys(() => null)
			}).toThrow(LOGS.ERROR_NOTMOUNTEDYET);
		});

		it('should timeup correctly', async () => {
			const sequencer = new Sequencer(50);
			sequencer.listen();

			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'a'}));
			document.dispatchEvent(new KeyboardEvent('keyup'));
			expect(sequencer.getSequence()).toEqual(['a']);

			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'a'}));
			document.dispatchEvent(new KeyboardEvent('keyup'));
			expect(sequencer.getSequence()).toEqual(['a', 'a']);

			await new Promise(resolve => setTimeout(resolve, 60));
			expect(sequencer.getSequence()).toEqual([]);

			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'a'}));
			document.dispatchEvent(new KeyboardEvent('keyup'));
			expect(sequencer.getSequence()).toEqual(['a']);

			await new Promise(resolve => setTimeout(resolve, 30));

			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'a'}));
			document.dispatchEvent(new KeyboardEvent('keyup'));
			expect(sequencer.getSequence()).toEqual(['a', 'a']);

			await new Promise(resolve => setTimeout(resolve, 30));

			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'a'}));
			document.dispatchEvent(new KeyboardEvent('keyup'));
			expect(sequencer.getSequence()).toEqual(['a', 'a', 'a']);

			await new Promise(resolve => setTimeout(resolve, 60));
			expect(sequencer.getSequence()).toEqual([]);
		});

		it('should output in debug mode', () => {
			const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

			new Sequencer(400);
			expect(consoleSpy).not.toHaveBeenCalled();

			const testMount = new Sequencer(400, true);
			expect(consoleSpy).toHaveBeenNthCalledWith(1, LOGS.INTRO(testMount.getID(), 400));

			const sequencer = new Sequencer(400);
			sequencer.setDebugMode(true);

			function namedCallback() {
				return null;
			}

			function namedFallback() {
				return null;
			}

			sequencer.listen();
			sequencer.register(['a', 'b', 'c'], namedCallback, namedFallback);

			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'a'}));
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'b'}));
			document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'c'}));

			expect(consoleSpy).toHaveBeenNthCalledWith(2, LOGS.CURRENT_SEQUENCES(['a']));
			expect(consoleSpy).toHaveBeenNthCalledWith(3, LOGS.RUNNING_FALLBACK({name: 'namedFallback'}));
			expect(consoleSpy).toHaveBeenNthCalledWith(4, LOGS.CURRENT_SEQUENCES(['a', 'b']));
			expect(consoleSpy).toHaveBeenNthCalledWith(5, LOGS.RUNNING_FALLBACK({name: 'namedFallback'}));
			expect(consoleSpy).toHaveBeenNthCalledWith(6, LOGS.CURRENT_SEQUENCES(['a', 'b', 'c']));
			expect(consoleSpy).toHaveBeenNthCalledWith(7, LOGS.RUNNING_CALLBACK({name: 'namedCallback'}));

			consoleSpy.mockRestore();
		});
	}
);