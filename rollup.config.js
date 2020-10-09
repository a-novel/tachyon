import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import pkg from './package.json';

export default [
	{
		inlineDynamicImports: true,
		input: './src/index.js',
		output: [
			{
				file: './lib/index.js',
				format: 'cjs'
			}
		],
		external: [...Object.keys(pkg.dependencies || {})],
		plugins: [
			commonjs(),
			resolve(),
			babel({exclude: 'node_modules/**'})
		]
	}
];