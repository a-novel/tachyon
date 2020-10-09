import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default [
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
			})
		]
	}
];