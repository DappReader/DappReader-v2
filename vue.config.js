module.exports = {
  publicPath: './',
  configureWebpack: (config)=>{
    if(process.env.NODE_ENV === 'production'){
      // config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  }
}