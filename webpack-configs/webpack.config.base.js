/**
 * Base webpack config used across other specific configs
 */

import path from 'path';
import webpack from 'webpack';
import fs from 'fs';
import { SOLC_LIST_URL, SOLC_BIN_URL } from 'config';

import { dependencies } from '../package.json';

export default {
	externals: [...Object.keys(dependencies || {})],

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
		],
	},

	output: {
		path: path.join(__dirname, '..', 'app'),
		// https://github.com/webpack/webpack/issues/1114
		libraryTarget: 'commonjs2',
	},

	/**
   * Determine the array of extensions that should be used to resolve modules.
   */
	resolve: {
		extensions: ['.js', '.jsx', '.json'],
	},

	plugins: [
		new webpack.EnvironmentPlugin({
			NODE_ENV: 'production',
		}),
		new webpack.DefinePlugin({
			SOLC_LIST_URL: JSON.stringify(SOLC_LIST_URL),
			SOLC_BIN_URL: JSON.stringify(SOLC_BIN_URL),
			ELECTRON: !!process.env.ELECTRON,
			COMMITHASH: fs.existsSync('./.git') ? JSON.stringify(gitRevisionPlugin.commithash()) : '',
		}),
		new webpack.NamedModulesPlugin(),
	],
};
