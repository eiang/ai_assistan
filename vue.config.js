const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

// 加载环境变量
function loadEnv() {
  // 获取当前环境
  const NODE_ENV = process.env.NODE_ENV || 'development';
  const envFile = `.env.${NODE_ENV}`;
  
  // 配置存储
  const envConfig = {};
  
  // 检查环境变量文件是否存在
  if (fs.existsSync(envFile)) {
    console.log(`加载环境配置文件: ${envFile}`);
    
    // 读取配置文件
    const content = fs.readFileSync(envFile, 'utf8');
    const lines = content.split('\n');
    
    // 解析配置
    lines.forEach(line => {
      // 跳过注释和空行
      if (!line || line.startsWith('#')) return;
      
      // 拆分键值对
      const [key, value] = line.split('=');
      if (key && value) {
        // 添加VUE_APP_前缀，便于webpack注入
        const envKey = `VUE_APP_${key.trim()}`;
        const envValue = value.trim();
        
        // 存储环境变量
        envConfig[envKey] = envValue;
        // 同时设置到process.env，便于开发时使用
        process.env[envKey] = envValue;
      }
    });
    
    console.log('成功加载环境变量');
  } else {
    console.warn(`环境配置文件不存在: ${envFile}`);
  }
  
  return envConfig;
}

// 加载环境变量
const envConfig = loadEnv();

module.exports = {
  configureWebpack: {
    plugins: [
      // 注入环境变量
      new webpack.DefinePlugin({
        // 注入所有环境变量
        ...Object.keys(envConfig).reduce((result, key) => {
          result[key] = JSON.stringify(envConfig[key]);
          return result;
        }, {}),
        // 注入当前环境
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
      })
    ],
    resolve: {
      alias: {
        '@': require('path').resolve(__dirname, './'),
        '@static': require('path').resolve(__dirname, './static'),
        '@components': require('path').resolve(__dirname, './components'),
        '@pages': require('path').resolve(__dirname, './pages')
      }
    }
  }
} 