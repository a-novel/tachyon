import {describe, it} from '@jest/globals';
import Sequencer, {COMBOS} from '../src/keys';

describe(
	'test keys sequencer',
	() => {
		it('should hold keys', () => {
			const sequence = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');
			const compare = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('').reverse();
			const sequencer = new Sequencer();

			for (const i in sequence) {
				const letter = sequence[i];
				expect(sequencer.update()({code: letter})).toEqual(compare.slice(- i - 1));
			}
		});

		it('should remove keys', () => {
			const sequencer = new Sequencer();

			sequencer.update()({code: 'a'});
			sequencer.update()({code: 'b'});
			let keys = sequencer.update()({code: 'c'});

			expect(keys.join('')).toEqual('cba');

			keys = sequencer.remove({code: 'd'});
			expect(keys.join('')).toEqual('cba');

			keys = sequencer.remove({code: 'b'});
			expect(keys.join('')).toEqual('ca');

			keys = sequencer.remove({code: 'c'});
			expect(keys.join('')).toEqual('a');

			keys = sequencer.remove({code: 'a'});
			expect(keys.join('')).toEqual('');

			keys = sequencer.remove({code: 'a'});
			expect(keys.join('')).toEqual('');
		});

		it('should clean every keys', () => {
			const sequencer = new Sequencer();

			sequencer.update()({code: 'a'});
			sequencer.update()({code: 'b'});
			let keys = sequencer.update()({code: 'c'});

			expect(keys.join('')).toEqual('cba');

			sequencer.clear();
			expect(sequencer.keys()).toEqual(['']);
		});

		it('should remove keys passed lifespan', async () => {
			const sequencer = new Sequencer();

			let keys = sequencer.update({lifespan: 50})({code: 'a'});
			expect(keys.join('')).toEqual('a');

			await new Promise(resolve => setTimeout(resolve, 30));
			keys = sequencer.update({lifespan: 50})({code: 'b'});
			expect(keys.join('')).toEqual('ba');

			await new Promise(resolve => setTimeout(resolve, 30));
			keys = sequencer.update({lifespan: 50})({code: 'c'});
			expect(keys.join('')).toEqual('cb');

			await new Promise(resolve => setTimeout(resolve, 100));
			expect(sequencer.keys()).toEqual(['']);
		});

		it('should sustain', async () => {
			const sequencer = new Sequencer();

			let keys = sequencer.update({lifespan: 50, sustain: true})({code: 'a'});
			expect(keys.join('')).toEqual('a');

			await new Promise(resolve => setTimeout(resolve, 30));
			keys = sequencer.update({lifespan: 50, sustain: true})({code: 'b'});
			expect(keys.join('')).toEqual('ba');

			await new Promise(resolve => setTimeout(resolve, 30));
			keys = sequencer.update({lifespan: 50, sustain: true})({code: 'c'});
			expect(keys.join('')).toEqual('cba');

			await new Promise(resolve => setTimeout(resolve, 100));
			expect(sequencer.keys()).toEqual(['']);
		});

		it('should trigger combos', () => {
			const sequencer = new Sequencer();

			const copy = jest.fn();
			const paste = jest.fn();

			const ac = COMBOS.COPY[0];

			const combos = [
				{trigger: COMBOS.COPY, action: copy},
				{trigger: COMBOS.PASTE, action: paste}
			];

			sequencer.update({lifespan: 20, sustain: true, combos})({code: ac});
			sequencer.update({lifespan: 20, sustain: true, combos})({code: COMBOS.COPY[1]});
			expect(copy).toHaveBeenCalledTimes(1);
			expect(paste).not.toHaveBeenCalled();

			sequencer.update({lifespan: 20, sustain: true, combos})({code: COMBOS.PASTE[1]});
			expect(copy).toHaveBeenCalledTimes(1);
			expect(paste).not.toHaveBeenCalled();

			sequencer.update({lifespan: 20, sustain: true, combos})({code: ac});
			sequencer.update({lifespan: 20, sustain: true, combos})({code: COMBOS.PASTE[1]});
			expect(copy).toHaveBeenCalledTimes(1);
			expect(paste).toHaveBeenCalledTimes(1);
		});

		it('should trigger intermediate action', () => {
			const sequencer = new Sequencer();
			const action = jest.fn();
			const intermediateAction = jest.fn();

			const combos = [{trigger: COMBOS.KONAMI_CODE, action, intermediateAction}];

			for(let i = 0; i < (COMBOS.KONAMI_CODE.length - 1); i++) {
				const code = COMBOS.KONAMI_CODE[i];
				sequencer.update({lifespan: 20, sustain: true, combos})({code});
				expect(action).not.toHaveBeenCalled();
				expect(intermediateAction).toHaveBeenCalledTimes(i + 1);
			}

			sequencer.update({lifespan: 20, sustain: true, combos})({code: COMBOS.KONAMI_CODE[COMBOS.KONAMI_CODE.length - 1]});
			expect(action).toHaveBeenCalledTimes(1);
			expect(intermediateAction).toHaveBeenCalledTimes(COMBOS.KONAMI_CODE.length - 1);
		});
	}
);