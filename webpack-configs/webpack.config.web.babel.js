import path from 'path';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import GitRevisionPlugin from 'git-revision-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';

import webpack from 'webpack';
import fs from 'fs';
import { SOLC_LIST_URL, SOLC_BIN_URL } from 'config';

const { version } = require('../package.json');

const gitRevisionPlugin = new GitRevisionPlugin();
const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
	template: `${__dirname}/../src/assets/index.html`,
	filename: 'index.html',
	inject: 'body',
});
const miniExtractSass = new MiniCssExtractPlugin({
	filename: '[name].[hash].css',
	disable: process.env.NODE_ENV === 'local',
});

const config = {
	entry: [path.resolve('src/index.js')],
	output: {
		publicPath: '/',
		path: path.resolve('dist'),
		filename: `[name].${version}.js`,
		pathinfo: process.env.NODE_ENV === 'local',
		sourceMapFilename: '[name].js.map',
		chunkFilename: '[name].bundle.js',
	},
	devtool:
    process.env.NODE_ENV !== 'local' ? 'cheap-module-source-map' : 'source-map',
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
		splitChunks: {
			cacheGroups: {
				default: false,
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendor',
					chunks: 'all',
				},
			},
		},
	},
	resolve: {
		modules: [
			'node_modules',
			path.resolve('src'),
		],
		extensions: ['.js', '.jsx', '.json'],
	},
	plugins: [
		new CleanWebpackPlugin(['build', 'dist']),
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
};

if (fs.existsSync('./.git')) {
	config.plugins.push(gitRevisionPlugin);
}

export default config;
