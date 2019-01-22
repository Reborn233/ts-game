const resolve = require('path').resolve;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const url = require('url');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const publicPath = '';

const config = require('./config');
console.log(config.htmlPlugin);
module.exports = (options = {}) => ({
  entry: config.entries,
  output: {
    path: resolve(__dirname, 'dist'),
    filename: options.dev
      ? 'static/js/[name].js'
      : 'static/js/[name].js?[chunkhash]',
    chunkFilename: 'static/js/[id].js?[chunkhash]',
    publicPath: options.dev ? '/assets/' : publicPath
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader', 'tslint-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        use: ['url-loader?limit=8192&name=static/images/[hash:8].[name].[ext]']
      }
    ]
  },
  // plugins: config.htmlPlugin,
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      chunks: ['index'],
      favicon: 'src/favicon.ico'
    }),
    new HtmlWebpackPlugin({
      filename: 'snake.html',
      template: 'src/index.html',
      chunks: ['snake'],
      favicon: 'src/favicon.ico'
    }),
    new HtmlWebpackPlugin({
      filename: 'flappy.html',
      template: 'src/index.html',
      chunks: ['flappy'],
      favicon: 'src/favicon.ico'
    }),
    new HtmlWebpackPlugin({
      filename: 'dodge.html',
      template: 'src/index.html',
      chunks: ['dodge'],
      favicon: 'src/favicon.ico'
    }),
    new HtmlWebpackPlugin({
      filename: '2048.html',
      template: 'src/index.html',
      chunks: ['2048'],
      favicon: 'src/favicon.ico'
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    minimizer: [
      new UglifyJsPlugin({
        /* your config */
        uglifyOptions: {
          compress: true,
          ecma: 6,
          output: {
            comments: false
          },
          compress: {
            dead_code: true,
            drop_console: true
          }
        },
        sourceMap: false
      })
    ]
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
      '@': resolve('src')
    },
    extensions: ['.js', '.json', '.css', '*', '.ts', '.tsx']
  },
  devServer: {
    host: '127.0.0.1',
    port: 8010,
    proxy: {
      '/api/': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    historyApiFallback: {
      index: url.parse(options.dev ? '/assets/' : publicPath).pathname
    }
  },
  devtool: options.dev ? '#eval-source-map' : '#source-map'
});
