const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
});
module.exports = {
  devServer: {
    // 项目启动端口之后会变成9000
    port: 9000,
    allowedHosts: [
      'www.xyfwpt.com', // 允许访问的域名地址，即花生壳内网穿透的地址
      '.xyfwpt.com'   // .是二级域名的通配符
    ],
  }


}


