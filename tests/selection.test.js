import path from 'path';
import puppeteer from 'puppeteer';
import {describe, beforeAll, afterAll, it} from '@jest/globals';

const checkSelectionOutput = (output, absoluteStart, absoluteEnd, relativeStart, relativeEnd) => {
	if (output == null) {
		throw new Error('null output');
	}

	if (output.constructor.name === 'Error') {
		throw new Error(output);
	}

	const {witnessRange, selectionRange} = output;

	expect(witnessRange.start).toEqual(absoluteStart);
	expect(witnessRange.end).toEqual(absoluteEnd);
	expect(selectionRange.absolute.start).toEqual(absoluteStart);
	expect(selectionRange.absolute.end).toEqual(absoluteEnd);
	if (relativeStart != null) expect(selectionRange.start.offset).toEqual(relativeStart);
	if (relativeEnd != null) expect(selectionRange.end.offset).toEqual(relativeEnd);
};

describe(
	'getSelection should match setSelection',
	() => {
		let browser;
		let page;

		beforeAll(async done => {
			try {
				browser = await puppeteer.launch({
					headless: true,
					args: ['--disable-web-security', '--disable-features=SameSiteByDefaultCookies,CookiesWithoutSameSiteMustBeSecure'],
				});
				page = await browser.newPage();
				await page.goto(`file://${path.join(process.env.ROOT, 'tests/selection_test.html')}`, {waitUntil: 'networkidle0'});
				await page.setBypassCSP(true);
			} catch(error) {
				console.error(error);
			}

			done();
		});

		afterAll(async done => {
			await browser.close();
			done();
		});

		it('should match on a node with only one text node children', async () => {
			const output = await page.evaluate(() => {
				// Fix eslint warnings.
				window.tachyon = window.tachyon || null;
				if (window.tachyon == null) {
					return new Error(`cannot find tachyon module`);
				}

				const stn = document.getElementById('single-text-node');
				const witnessRange = tachyon.setRange(stn, 1, 10);
				const selectionRange = tachyon.getRange(stn);

				return {witnessRange, selectionRange};
			});

			checkSelectionOutput(output, 1, 10, 1, 10);
		});

		it('should match on a node with complex child structure', async () => {
			const output = await page.evaluate(() => {
				// Fix eslint warnings.
				window.tachyon = window.tachyon || null;
				if (window.tachyon == null) {
					return new Error(`cannot find tachyon module`);
				}

				const stn = document.getElementById('nested-text-node');
				const witnessRange = tachyon.setRange(stn, 6, 34);
				const selectionRange = tachyon.getRange(stn);

				return {witnessRange, selectionRange};
			});

			checkSelectionOutput(output, 6, 34, 6, 6);
		});


		it('should match on empty node', async () => {
			const output = await page.evaluate(() => {
				// Fix eslint warnings.
				window.tachyon = window.tachyon || null;
				if (window.tachyon == null) {
					return new Error(`cannot find tachyon module`);
				}

				const stn = document.getElementById('empty-node');
				const witnessRange = tachyon.setRange(stn, 6, 34);
				const selectionRange = tachyon.getRange(stn);

				return {witnessRange, selectionRange};
			});

			checkSelectionOutput(output, 0, 0, 0, 0);
		});

		it('should match on overflow with single text node', async () => {
			const output = await page.evaluate(() => {
				// Fix eslint warnings.
				window.tachyon = window.tachyon || null;
				if (window.tachyon == null) {
					return new Error(`cannot find tachyon module`);
				}

				const stn = document.getElementById('single-text-node');
				const witnessRange = tachyon.setRange(stn, 10, stn.innerText.length + 20);
				const selectionRange = tachyon.getRange(stn);

				return {witnessRange, selectionRange, content: stn.innerText.length};
			});

			checkSelectionOutput(output, 10, output.content, 10, output.content);
		});

		it('should match on overflow with complex child structure', async () => {
			const output = await page.evaluate(() => {
				// Fix eslint warnings.
				window.tachyon = window.tachyon || null;
				if (window.tachyon == null) {
					return new Error(`cannot find tachyon module`);
				}

				const stn = document.getElementById('nested-text-node');
				const witnessRange = tachyon.setRange(stn, 10, stn.innerText.length + 20);
				const selectionRange = tachyon.getRange(stn);

				return {witnessRange, selectionRange, content: stn.innerText.length};
			});

			checkSelectionOutput(output, 10, output.content, 10, 368);
		});

		it('should match with ignore parameter', async () => {
			let output = await page.evaluate(() => {
				// Fix eslint warnings.
				window.tachyon = window.tachyon || null;
				if (window.tachyon == null) {
					return new Error(`cannot find tachyon module`);
				}

				const stn = document.getElementById('single-text-node');
				const witnessRange = tachyon.setRange(stn, 10, 30, ['.ignore1']);
				const selectionRange = tachyon.getRange(stn);

				return {witnessRange, selectionRange, content: stn.innerText.length};
			});

			checkSelectionOutput(output, 10, 30, 10, 30);

			output = await page.evaluate(() => {
				// Fix eslint warnings.
				window.tachyon = window.tachyon || null;
				if (window.tachyon == null) {
					return new Error(`cannot find tachyon module`);
				}

				const stn = document.getElementById('nested-text-node');
				const witnessRange = tachyon.setRange(stn, 10, 30, ['.ignore1']);
				const selectionRange = tachyon.getRange(stn, ['.ignore1']);
				const fullSelectionRange = tachyon.getRange(stn);

				return {witnessRange, selectionRange, fullSelectionRange, content: stn.innerText.length};
			});

			checkSelectionOutput(output, 10, 30, 10, 18);
			expect(output.fullSelectionRange.absolute.start).toEqual(10);
			expect(output.fullSelectionRange.absolute.end).toEqual(74);
		});
	}
);