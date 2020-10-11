const path = require('path');
const { JSDOM } = require('jsdom');
require('dotenv').config({path: path.resolve(process.cwd(), '.env.test')});

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
global.window = jsdom.window;
global.document = jsdom.window.document;