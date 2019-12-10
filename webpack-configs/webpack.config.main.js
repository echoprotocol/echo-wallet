/**
 * Webpack config for production electron main process
 */

import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import baseConfig from './webpack.config.base';
import CheckNodeEnv from '../scripts/CheckNodeEnv';

CheckNodeEnv('production');

export default merge.smart(baseConfig, {
	devtool: 'source-map',

	mode: 'production',

	target: 'electron-main',

	entry: './app/main.dev',

	output: {
		path: path.join(__dirname, '..'),
		filename: './app/main.prod.js',
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

		/**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     */
		new webpack.EnvironmentPlugin({
			NODE_ENV: 'production',
			DEBUG_PROD: false,
			START_MINIMIZED: false,
		}),
		new webpack.DefinePlugin({
			NETWORKS: {
				devnet: {
					remote: {
						name: JSON.stringify('Remote node'),
						url: JSON.stringify('wss://devnet.echo-dev.io/ws'),
					},
					local: {
						name: JSON.stringify('Local node'),
						seed: JSON.stringify('node1.devnet.echo-dev.io:6310'),
					},
				},
				testnet: {
					remote: {
						name: JSON.stringify('Remote node'),
						url: JSON.stringify('ws://testnet.echo-dev.io/ws'),
					},
					local: {
						name: JSON.stringify('Local node'),
						seed: JSON.stringify('node1.devnet.echo-dev.io:6310'),
					},
				},
			},
			EXPLORER_URL: {
				devnet: JSON.stringify('https://656-echo-explorer.pixelplex-test.by'),
				testnet: JSON.stringify('https://explorer.echo.org'),
			},
			ECHODB: {
				devnet: {
					HTTP_LINK: JSON.stringify('https://645-echodb.pixelplex-test.by/graphql'),
					WS_LINK: JSON.stringify('wss://645-echodb.pixelplex-test.by/graphql'),
				},
				testnet: {
					HTTP_LINK: JSON.stringify('https://645-echodb.pixelplexlabs.com/graphql'),
					WS_LINK: JSON.stringify('wss://645-echodb.pixelplexlabs.com/graphql'),
				},
			},
			QR_SERVER_URL: {
				devnet: JSON.stringify('https://649-bridge-landing.pixelplex-test.by/receive/'),
				testnet: JSON.stringify('https://649-bridge-landing.pixelplexlabs.com/receive/'),
			},
		}),
	],

	/**
   * Disables webpack processing of __dirname and __filename.
   * If you run the bundle in node.js it falls back to these values of node.js.
   * https://github.com/webpack/webpack/issues/2010
   */
	node: {
		__dirname: false,
		__filename: false,
	},
});
