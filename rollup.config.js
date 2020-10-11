import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import pkg from './package.json';

// The content that is actually exported to be used within a React or Node application.
const libConfig = [
	{
		inlineDynamicImports: true,
		input: './src/index.js',
		output: [
			{
				file: './lib/index.js',
				format: 'cjs'
			},
		],
		external: [...Object.keys(pkg.dependencies || {})],
		plugins: [
			commonjs(),
			resolve(),
			babel({exclude: 'node_modules/**'})
		]
	}
];

// Used to generate a bundle that is directly executable within a browser environment, for E2E testing.
const testConfig = [
	{
		inlineDynamicImports: true,
		input: './src/index.js',
		output: [
			{
				file: './dist/index.js',
				format: 'umd',
				name: 'tachyon'
			},
		],
		external: [...Object.keys(pkg.dependencies || {})],
		plugins: [
			commonjs(),
			resolve(),
			babel({runtimeHelpers: true})
		]
	}
];

const config = process.env.NODE_ENV === 'test' ? testConfig : libConfig;
export default config;