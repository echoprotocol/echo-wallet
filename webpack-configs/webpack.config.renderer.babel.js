/**
 * Build config for electron renderer process
 */

import path from 'path';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import merge from 'webpack-merge';
import fs from 'fs';
import { SOLC_LIST_URL, SOLC_BIN_URL } from 'config';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import GitRevisionPlugin from 'git-revision-webpack-plugin';

import baseConfig from './webpack.config.base.babel';
import CheckNodeEnv from '../scripts/CheckNodeEnv';

const { version } = require('../package.json');

const gitRevisionPlugin = new GitRevisionPlugin();
const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
	template: `${__dirname}/../src/assets/index.html`,
	filename: 'index.html',
	inject: 'body',
});

const miniExtractSass = new MiniCssExtractPlugin({
	filename: '[name].[hash].css',
});

CheckNodeEnv('production');
const config = merge.smart(baseConfig, {
	mode: 'production',
	entry: [path.resolve('src/index.js')],
	output: {
		publicPath: './',
		path: path.resolve('build'),
		filename: `[name].${version}.js`,
		sourceMapFilename: '[name].js.map',
		chunkFilename: '[name].bundle.js',
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: /\.jsx$/,
				include: /src/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: /\.scss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: false,
							importLoaders: 1,
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: false,
						},
					},
				],
			},
			{
				test: /\.(png|woff|woff2|eot|ttf|otf|svg)$/,
				loader: 'url-loader?limit=100000',
			},
		],
	},
	resolve: {
		modules: [
			'node_modules',
			path.resolve('src'),
		],
		extensions: ['.js', '.jsx', '.json'],
	},

	optimization: {
		minimizer: [
			new TerserPlugin({
				parallel: true,
				sourceMap: true,
				cache: true,
			}),
			new OptimizeCSSAssetsPlugin({
				cssProcessorOptions: {
					map: {
						inline: false,
						annotation: true,
					},
				},
			}),
		],
	},

	plugins: [
		new webpack.EnvironmentPlugin({
			NODE_ENV: 'production',
		}),
		HTMLWebpackPluginConfig,
		miniExtractSass,
		new webpack.DefinePlugin({
			SOLC_LIST_URL: JSON.stringify(SOLC_LIST_URL),
			SOLC_BIN_URL: JSON.stringify(SOLC_BIN_URL),
			ELECTRON: !!process.env.ELECTRON,
			COMMITHASH: fs.existsSync('./.git') ? JSON.stringify(gitRevisionPlugin.commithash()) : '',
		}),
	],
	node: {
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
		module: 'empty',
	},
});

if (fs.existsSync('./.git')) {
	config.plugins.push(gitRevisionPlugin);
}

export default config;
