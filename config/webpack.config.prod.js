const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const RemovePlugin = require('remove-files-webpack-plugin')

module.exports = merge(require('./webpack.config.common.js'), {
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                url: false,
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        })
      }
    ]
  },

  optimization: {
    minimize: true
  },

  plugins: [
    new RemovePlugin({
      before: {
        include: [path.join(__dirname, '..', 'www', 'assets', 'builds')]
      }
    }),

    // Extract all css into one file
    new ExtractTextPlugin({
      filename: (getPath) => {
        const ext = path.extname(getPath('[name]'))
        // If you import css from js entry files, these lines avoid to
        // override the js files with the extract-text-plugin output.
        // Instead, replace the bundle filepath extension by .css
        return (ext === '.css')
          ? getPath('[name]')
          : getPath('[name]').slice(0, -ext.length) + '.css'
      },
      allChunks: true
    }),

    // new MiniCssExtractPlugin({ filename: 'bundle.css' }),
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: '"production"' } }),
    new webpack.optimize.OccurrenceOrderPlugin()
  ],

  mode: 'production',
  devtool: 'source-map'
})
