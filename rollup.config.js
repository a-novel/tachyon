import babel from 'rollup-plugin-babel';
import pkg from './package.json';
import {terser} from 'rollup-plugin-terser';

export default [
	// CommonJS
	{
		inlineDynamicImports: true,
		input: './src/index.js',
		output: [
			{
				file: './dist/index.js',
				format: 'cjs'
			}
		],
		external: [
			...Object.keys(pkg.dependencies || {})
		],
		plugins: [
			babel({
				exclude: 'node_modules/**'
			}),
			terser() // minifies generated bundles
		]
	}
];