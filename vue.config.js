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
  },
  devServer: {
    port: 8085
  }
}
