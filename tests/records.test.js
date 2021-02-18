import {describe, it} from '@jest/globals';
import {RecordsManager} from '../src/index';

describe(
	'test RecordsManager',
	() => {
		it('should work without any options', () => {
			const manager = new RecordsManager('');

			expect(manager.content()).toEqual('');

			// Alterate empty history.

			expect(manager.undo()).toEqual('');
			expect(manager.redo()).toEqual('');

			// Append.

			const entry1 = {
				caret: {start: 0, end: 0},
				newContent: 'hello'
			};
			expect(manager.push(entry1)).toEqual('hello');

			const entry2 = {
				caret: {start: 5, end: 5},
				newContent: ' world'
			};
			expect(manager.push(entry2)).toEqual('hello world');

			const entry3 = {
				caret: {start: 5, end: 5},
				newContent: ' new'
			};
			expect(manager.push(entry3)).toEqual('hello new world');

			const entry4 = {
				caret: {start: 0, end: 5},
				newContent: 'goodbye'
			};
			expect(manager.push(entry4)).toEqual('goodbye new world');

			// Redo when no entries canceled.

			expect(manager.redo()).toEqual('goodbye new world');

			// Undo.

			expect(manager.undo()).toEqual('hello new world');
			expect(manager.undo()).toEqual('hello world');
			expect(manager.undo()).toEqual('hello');
			expect(manager.undo()).toEqual('');
			expect(manager.undo()).toEqual('');

			// Redo.

			expect(manager.redo()).toEqual('hello');
			expect(manager.redo()).toEqual('hello world');
			expect(manager.redo()).toEqual('hello new world');
			expect(manager.redo()).toEqual('goodbye new world');
			expect(manager.redo()).toEqual('goodbye new world');

			// Undo/Redo with small count.

			expect(manager.undo({count: 3})).toEqual('hello');
			expect(manager.redo({count: 2})).toEqual('hello new world');
			expect(manager.redo({count: 2})).toEqual('goodbye new world');

			// Undo/Redo with large count.

			expect(manager.undo({count: 10})).toEqual('');
			expect(manager.redo({count: 10})).toEqual('goodbye new world');

			// Clear canceled history elements on push.

			manager.undo();
			manager.undo();

			expect(manager.push(entry4)).toEqual('goodbye world');
			expect(manager.redo()).toEqual('goodbye world');

			// Undo/Redo in the rebased history.

			expect(manager.undo()).toEqual('hello world');
			expect(manager.undo()).toEqual('hello');
			expect(manager.undo()).toEqual('');
			expect(manager.redo()).toEqual('hello');
			expect(manager.redo()).toEqual('hello world');
			expect(manager.redo()).toEqual('goodbye world');

			// Clear all.

			manager.clearAll();

			expect(manager.undo()).toEqual('goodbye world');
		});

		it('should reset when all records are canceled', () => {
			const manager = new RecordsManager('');

			const entry1 = {
				caret: {start: 0, end: 0},
				newContent: 'hello'
			};
			manager.push(entry1);

			const entry2 = {
				caret: {start: 5, end: 5},
				newContent: ' world'
			};
			manager.push(entry2);

			const entry3 = {
				caret: {start: 5, end: 5},
				newContent: ' new'
			};
			manager.push(entry3);

			const entry4 = {
				caret: {start: 0, end: 5},
				newContent: 'goodbye'
			};
			manager.push(entry4);

			expect(manager.content()).toEqual('goodbye new world');

			manager.undo();
			manager.undo();
			manager.undo();
			manager.undo();

			const entry5 = {
				caret: {start: 0, end: 0},
				newContent: 'foo'
			};
			manager.push(entry5);

			expect(manager.content()).toEqual('foo');

			manager.undo();
			expect(manager.content()).toEqual('');
			manager.undo();
			expect(manager.content()).toEqual('');
			manager.redo();
			expect(manager.content()).toEqual('foo');
		});

		it('should load previous history entries', () => {
			const history = [
				{caret: {start: 0, end: 0}, newContent: 'hello', oldContent: ''},
				{caret: {start: 5, end: 5}, newContent: ' world', oldContent: ''},
				{caret: {start: 5, end: 5}, newContent: ' new', oldContent: ''},
				{caret: {start: 0, end: 5}, newContent: 'goodbye', oldContent: 'hello', canceled: true}
			];
			const manager = new RecordsManager('hello new world', {history, trustStartValue: true});

			expect(manager.redo()).toEqual('goodbye new world');
		});

		it('should automatically rebuild history', () => {
			const history = [
				{caret: {start: 0, end: 0}, newContent: 'hello', oldContent: ''},
				{caret: {start: 5, end: 5}, newContent: ' world', oldContent: ''},
				{caret: {start: 5, end: 5}, newContent: ' new', oldContent: ''},
				{caret: {start: 0, end: 5}, newContent: 'goodbye', oldContent: 'hello', canceled: true}
			];

			const manager = new RecordsManager('', {history});

			expect(manager.content()).toEqual('hello new world');
			expect(manager.redo()).toEqual('goodbye new world');
		});

		it('should limit history length', () => {
			const manager = new RecordsManager('', {maxLength: 2});

			const entry1 = {
				caret: {start: 0, end: 0},
				newContent: 'hello'
			};
			manager.push(entry1);

			const entry2 = {
				caret: {start: 5, end: 5},
				newContent: ' world'
			};
			manager.push(entry2);

			const entry3 = {
				caret: {start: 5, end: 5},
				newContent: ' new'
			};
			manager.push(entry3);

			const entry4 = {
				caret: {start: 0, end: 5},
				newContent: 'goodbye'
			};
			manager.push(entry4);

			expect(manager.content()).toEqual('goodbye new world');

			expect(manager.undo()).toEqual('hello new world');
			expect(manager.undo()).toEqual('hello world');
			expect(manager.undo()).toEqual('hello world');
		});

		it('should pack with length', () => {
			const manager = new RecordsManager('', {pack: {maxSize: 2}});

			manager.push({newContent: 'h', caret: {start: 0, end: 0}});
			manager.push({newContent: 'e', caret: {start: 1, end: 1}});
			manager.push({newContent: 'l', caret: {start: 2, end: 2}});
			manager.push({newContent: 'l', caret: {start: 3, end: 3}});
			manager.push({newContent: 'o', caret: {start: 4, end: 4}});
			manager.push({newContent: ' world', caret: {start: 5, end: 5}});

			expect(manager.undo()).toEqual('hello');
			expect(manager.undo()).toEqual('hell');
			expect(manager.undo()).toEqual('he');
			expect(manager.undo()).toEqual('');
			expect(manager.undo()).toEqual('');

			expect(manager.redo()).toEqual('he');
			expect(manager.redo()).toEqual('hell');
			expect(manager.redo()).toEqual('hello');
			expect(manager.redo()).toEqual('hello world');
		});

		it('should pack with separators', () => {
			const manager = new RecordsManager('', {pack: {separators: [' ', '/']}});

			manager.push({newContent: 'h', caret: {start: 0, end: 0}});
			manager.push({newContent: 'e', caret: {start: 1, end: 1}});
			manager.push({newContent: 'l', caret: {start: 2, end: 2}});
			manager.push({newContent: 'l', caret: {start: 3, end: 3}});
			manager.push({newContent: 'o', caret: {start: 4, end: 4}});
			manager.push({newContent: ' ', caret: {start: 5, end: 5}});
			manager.push({newContent: 'w', caret: {start: 6, end: 6}});
			manager.push({newContent: 'o', caret: {start: 7, end: 7}});
			manager.push({newContent: 'r', caret: {start: 8, end: 8}});
			manager.push({newContent: 'l', caret: {start: 9, end: 9}});
			manager.push({newContent: 'd', caret: {start: 10, end: 10}});

			expect(manager.content()).toEqual('hello world');
			expect(manager.undo()).toEqual('hello ');
			expect(manager.undo()).toEqual('');

			expect(manager.redo()).toEqual('hello ');
			expect(manager.redo()).toEqual('hello world');

			manager.push({newContent: '/', caret: {start: 6, end: 6}});
			manager.push({newContent: ' ', caret: {start: 7, end: 7}});

			expect(manager.content()).toEqual('hello / world');
			expect(manager.undo()).toEqual('hello /world');
			expect(manager.undo()).toEqual('hello world');
			expect(manager.undo()).toEqual('hello ');

			manager.push({newContent: 'f', caret: {start: 6, end: 6}});
			manager.push({newContent: 'o', caret: {start: 7, end: 7}});
			manager.push({newContent: 'o', caret: {start: 8, end: 8}});

			expect(manager.content()).toEqual('hello foo');
			expect(manager.undo()).toEqual('hello ');
			expect(manager.undo()).toEqual('');

			manager.push({newContent: '42', caret: {start: 0, end: 0}});
			expect(manager.content()).toEqual('42');
		});

		it('should pack with timestamp', async () => {
			const manager = new RecordsManager('', {pack: {timeout: 20}});

			manager.push({newContent: 'h', caret: {start: 0, end: 0}});
			manager.push({newContent: 'e', caret: {start: 1, end: 1}});
			manager.push({newContent: 'l', caret: {start: 2, end: 2}});
			manager.push({newContent: 'l', caret: {start: 3, end: 3}});
			manager.push({newContent: 'o', caret: {start: 4, end: 4}});
			manager.push({newContent: ' ', caret: {start: 5, end: 5}});
			manager.push({newContent: 'w', caret: {start: 6, end: 6}});

			await new Promise(resolve => setTimeout(resolve, 100));

			manager.push({newContent: 'o', caret: {start: 7, end: 7}});
			manager.push({newContent: 'r', caret: {start: 8, end: 8}});
			manager.push({newContent: 'l', caret: {start: 9, end: 9}});
			manager.push({newContent: 'd', caret: {start: 10, end: 10}});

			expect(manager.content()).toEqual('hello world');

			expect(manager.undo()).toEqual('hello w');
			expect(manager.undo()).toEqual('');
		});
	}
);