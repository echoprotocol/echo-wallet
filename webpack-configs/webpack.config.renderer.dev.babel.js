/* eslint global-require: off, import/no-dynamic-require: off */

/**
 * Build config for development electron renderer process that uses
 * Hot-Module-Replacement
 *
 * https://webpack.js.org/concepts/hot-module-replacement/
 */

import path from 'path';
import fs from 'fs';
import webpack from 'webpack';
import chalk from 'chalk';
import merge from 'webpack-merge';
import { spawn, execSync } from 'child_process';
import { SOLC_BIN_URL, SOLC_LIST_URL } from 'config';
import baseConfig from './webpack.config.base.babel';
import CheckNodeEnv from '../scripts/CheckNodeEnv';

CheckNodeEnv('development');

const port = process.env.PORT || 1212;
const publicPath = `http://localhost:${port}/dist`;
const dll = path.join(__dirname, '..', 'dll');
const manifest = path.resolve(dll, 'renderer.json');
const requiredByDLLConfig = module.parent.filename.includes('webpack.config.renderer.dev.dll');

/**
 * Warn if the DLL is not built
 */
if (!requiredByDLLConfig && !(fs.existsSync(dll) && fs.existsSync(manifest))) {
	console.log(chalk.black.bgYellow.bold('The DLL files are missing. Sit back while we build them for you with "yarn build-dll"'));
	execSync('yarn build-dll');
}

export default merge.smart(baseConfig, {
	devtool: 'inline-source-map',

	mode: 'development',

	target: 'electron-renderer',

	entry: [
		'react-hot-loader/patch',
		`webpack-dev-server/client?http://localhost:${port}/`,
		'webpack/hot/only-dev-server',
		require.resolve('../src/index'),
	],

	output: {
		publicPath: `http://localhost:${port}/dist/`,
		filename: 'renderer.dev.js',
	},

	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						cacheDirectory: true,
					},
				},
			},
			{
				test: /\.global\.css$/,
				use: [
					{
						loader: 'style-loader',
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: false,
						},
					},
				],
			},
			{
				test: /^((?!\.global).)*\.css$/,
				use: [
					{
						loader: 'style-loader',
					},
					{
						loader: 'css-loader',
						options: {
							modules: false,
							sourceMap: false,
							importLoaders: 1,
							localIdentName: '[name]__[local]__[hash:base64:5]',
						},
					},
				],
			},
			// SASS support - compile all .global.scss files and pipe it to style.css
			{
				test: /\.global\.(scss|sass)$/,
				use: [
					{
						loader: 'style-loader',
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: false,
						},
					},
					{
						loader: 'sass-loader',
					},
				],
			},
			// SASS support - compile all other .scss files and pipe it to style.css
			{
				test: /^((?!\.global).)*\.(scss|sass)$/,
				use: [
					{
						loader: 'style-loader',
					},
					{
						loader: 'css-loader',
						options: {
							modules: false,
							sourceMap: false,
							importLoaders: 1,
						},
					},
					{
						loader: 'sass-loader',
					},
				],
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				loader: 'url-loader?limit=100000',
			},
			// SVG Font
			{
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
				use: {
					loader: 'url-loader',
					options: {
						limit: 10000,
						mimetype: 'image/svg+xml',
					},
				},
			},
			// Common Image Formats
			{
				test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
				use: 'url-loader',
			},
		],
	},

	plugins: [
		requiredByDLLConfig
			? null
			: new webpack.DllReferencePlugin({
				context: path.join(__dirname, '..', 'dll'),
				manifest: require(manifest),
				sourceType: 'var',
			}),

		new webpack.HotModuleReplacementPlugin({
			multiStep: true,
		}),

		new webpack.NoEmitOnErrorsPlugin(),

		/**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     *
     * By default, use 'development' as NODE_ENV. This can be overriden with
     * 'staging', for example, by changing the ENV variables in the npm scripts
     */
		new webpack.EnvironmentPlugin({
			NODE_ENV: 'development',
		}),

		new webpack.LoaderOptionsPlugin({
			debug: true,
		}),
		new webpack.DefinePlugin({
			SOLC_LIST_URL: JSON.stringify(SOLC_LIST_URL),
			SOLC_BIN_URL: JSON.stringify(SOLC_BIN_URL),
			ELECTRON: !!process.env.ELECTRON,
		}),
	],

	node: {
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
		module: 'empty',
		__dirname: false,
		__filename: false,
	},

	devServer: {
		port,
		publicPath,
		compress: true,
		noInfo: true,
		stats: 'errors-only',
		inline: true,
		lazy: false,
		hot: true,
		headers: { 'Access-Control-Allow-Origin': '*' },
		contentBase: path.join(__dirname, 'dist'),
		watchOptions: {
			aggregateTimeout: 300,
			ignored: /node_modules/,
			poll: 100,
		},
		historyApiFallback: {
			verbose: true,
			disableDotRule: false,
		},
		before() {
			if (process.env.START_HOT) {
				console.log('Starting Main Process...');
				spawn('npm', ['run', 'start-main-dev'], {
					shell: true,
					env: process.env,
					stdio: 'inherit',
				})
					.on('close', (code) => process.exit(code))
					.on('error', (spawnError) => console.error(spawnError));
			}
		},
	},
});