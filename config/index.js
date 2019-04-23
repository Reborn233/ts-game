const HtmlWebpackPlugin = require('html-webpack-plugin');

const htmls = ['snake', 'flappy', 'dodge', '2048', '3DSpace'];
/**
 * 多入口配置
 */
exports.entries = () => {
  const entry = {};
  htmls.forEach(name => {
    entry[name] = `./src/views/${name}.ts`;
  });
  entry['index'] = './src/main.ts';
  entry['flower'] = './src/views/flower.ts';

  return entry;
};
exports.htmlPlugin = (options = {}) => {
  let arrHtml = [];
  htmls.forEach(name => {
    const config = {
      filename: name + '.html',
      template: 'src/index.html',
      chunks: [name],
      favicon: 'src/favicon.ico',
      title: name,
      url: options.dev ? '/assets' : '.'
    };
    arrHtml.push(new HtmlWebpackPlugin(config));
  });
  arrHtml.push(
    new HtmlWebpackPlugin({
      filename: 'flower.html',
      template: 'src/flower.html',
      chunks: ['flower'],
      favicon: 'src/favicon.ico',
      title: 'flower',
      url: options.dev ? '/assets' : '.'
    })
  );
  return arrHtml;
};
