const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@components', resolve('src/components'))
      .set('@mock', resolve('src/mock'))
      .set('@public', resolve('public'))
      .set('@assets', resolve('src/assets'))
      .set('@common', resolve('src/common'))
  },
  devServer: {
    port: 8085
  },
  pluginOptions: {
    //全局使用less
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, 'src/assets/styles/commonStyles.less')]
    }
  }
}
