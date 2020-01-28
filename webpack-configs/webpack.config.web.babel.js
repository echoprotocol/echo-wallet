const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const {
	SOLC_LIST_URL,
	SOLC_BIN_URL,
	CRYPTO_API_URL,
} = require('config');


const gitRevisionPlugin = new GitRevisionPlugin();
const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
	template: `${path.join(__dirname, '..')}/src/assets/index.html`,
	filename: 'index.html',
	inject: 'body',
});

const miniExtractSass = new MiniCssExtractPlugin({
	filename: '[name].[hash].css',
	disable: process.env.NODE_ENV === 'local',
});

const { version } = require('../package.json');

const config = {
	entry: {
		app: path.resolve('src/index.js'),
	},
	output: {
		publicPath: process.env.ELECTRON ? './' : '/',
		path: process.env.ELECTRON ? path.resolve('build') : path.resolve('dist'),
		filename: `[name].${version}.js`,
		pathinfo: process.env.NODE_ENV === 'local',
		sourceMapFilename: '[name].js.map',
		chunkFilename: '[name].bundle.js',
	},
	devtool: process.env.NODE_ENV !== 'local' ? 'cheap-module-source-map' : 'source-map',
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
		HTMLWebpackPluginConfig,
		miniExtractSass,
		new CopyWebpackPlugin([{ from: 'resources/icons', to: '' }]),
		new webpack.DefinePlugin({
			SOLC_LIST_URL: JSON.stringify(SOLC_LIST_URL),
			SOLC_BIN_URL: JSON.stringify(SOLC_BIN_URL),
			ELECTRON: !!process.env.ELECTRON,
			COMMITHASH: fs.existsSync('./.git') ? JSON.stringify(gitRevisionPlugin.commithash()) : '',
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
			CRYPTO_API_KEY: JSON.stringify(process.env.CRYPTO_API_KEY),
			CRYPTO_API_URL: JSON.stringify(CRYPTO_API_URL),
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
};

if (fs.existsSync('./.git')) {
	config.plugins.push(gitRevisionPlugin);
}

module.exports = config;
