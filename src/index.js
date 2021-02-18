import Sequencer, {COMBOS} from './keys';
import RecordsManager from './records';
import {getOS, OS} from './os';
import {getRange, setRange} from './selection';
import {goTo, isActive, buildQueryString, buildUrl, fillParams} from './url';

const literals = {OS, COMBOS};

export {
	Sequencer,
	RecordsManager,
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