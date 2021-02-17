import Sequencer, {COMBOS} from './keys';
import {getOS, OS} from './os';
import {getRange, setRange} from './selection';
import {goTo, isActive, buildQueryString, buildUrl, fillParams} from './url';

const literals = {OS, COMBOS};

export {
	Sequencer,
	literals,
	getOS,
	getRange,
	setRange,
	goTo,
	isActive,
	buildQueryString,
	buildUrl,
	fillParams
};