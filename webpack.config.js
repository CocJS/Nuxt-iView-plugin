var webpack = require('webpack')
var path = require('path')
var VueLoaderPlugin = require('vue-loader/lib/plugin')
var MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
	entry : './src/index.js' , 
	mode : 'development' ,
	output : {
		path : path.resolve(__dirname ,'./dist') ,
		filename : 'bundle.js'
	},
	module: {
		rules: [
			{ test: /\.js$/, 
				exclude: /node_modules/, 
				loader: 'babel-loader' 
			} ,
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
						}
					},
					'css-loader'
				]
			},
			{
				test: /\.s[ac]ss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
						}
					},
					'css-loader' , 
					'sass-loader'
				]
			}
    
		]
	},
	plugins : [
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: '[name].css',
			chunkFilename: '[id].css'
		}),
		new VueLoaderPlugin()
	]
}   