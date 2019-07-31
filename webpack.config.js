const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
	template: `${__dirname}/src/assets/index.html`,
	filename: 'index.html',
	inject: 'body',
});

const miniExtractSass = new MiniCssExtractPlugin({
	filename: '[name].[hash].css',
	disable: process.env.NODE_ENV === 'local',
});

const { version } = require('./package.json');

module.exports = {
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
	devtool: process.env.NODE_ENV !== 'local' ? 'cheap-module-source-map' : 'eval',
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
		new CleanWebpackPlugin(['build']),
		HTMLWebpackPluginConfig,
		miniExtractSass,
		new CopyWebpackPlugin([{ from: 'src/assets/app_resources', to: '' }]),
		new webpack.DefinePlugin({ ELECTRON: !!process.env.ELECTRON }),
	],
	node: {
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
	},
};
