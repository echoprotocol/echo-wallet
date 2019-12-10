import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import GitRevisionPlugin from 'git-revision-webpack-plugin';
import fs from 'fs';

import { SOLC_LIST_URL, SOLC_BIN_URL } from 'config';
import baseConfig from './webpack.config.base.babel';
import CheckNodeEnv from '../scripts/CheckNodeEnv';

CheckNodeEnv('production');
const gitRevisionPlugin = new GitRevisionPlugin();

export default merge.smart(baseConfig, {
	devtool: 'source-map',

	mode: 'production',

	target: 'electron-main',

	entry: './src/assets/app_resources/debug.js',

	output: {
		path: path.join(__dirname, '..'),
		filename: './build/electron/index.js',
	},

	optimization: {
		minimizer: process.env.E2E_BUILD
			? []
			: [
				new TerserPlugin({
					parallel: true,
					sourceMap: true,
					cache: true,
				}),
			],
	},

	plugins: [
		new BundleAnalyzerPlugin({
			analyzerMode:
        process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
			openAnalyzer: process.env.OPEN_ANALYZER === 'true',
		}),
		new webpack.EnvironmentPlugin({
			NODE_ENV: 'production',
			DEBUG_PROD: false,
			START_MINIMIZED: false,
		}),
		new webpack.DefinePlugin({
			SOLC_LIST_URL: JSON.stringify(SOLC_LIST_URL),
			SOLC_BIN_URL: JSON.stringify(SOLC_BIN_URL),
			ELECTRON: !!process.env.ELECTRON,
			COMMITHASH: fs.existsSync('./.git') ? JSON.stringify(gitRevisionPlugin.commithash()) : '',
		}),
	],
	node: {
		__dirname: false,
		__filename: false,
	},
});
