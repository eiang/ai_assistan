/**
 * 环境配置加载工具
 * 用于读取.env文件中的环境变量
 */

// 判断当前环境
const ENV = process.env.NODE_ENV || 'development';

// 从环境变量文件中加载的配置
let envConfig = {};

// 加载env文件
function loadEnvFile() {
  let config = {};
  
  try {
    // 根据不同平台判断加载方式
    // #ifdef H5
    // 在H5环境中，通过webpack的DefinePlugin注入或者全局变量获取
    // 这里假设已经通过webpack配置注入了VUE_APP_开头的环境变量
    Object.keys(process.env).forEach(key => {
      if (key.startsWith('VUE_APP_')) {
        config[key.replace('VUE_APP_', '')] = process.env[key];
      }
    });
    // #endif
    
    // #ifdef MP-WEIXIN
    // 小程序环境下，可以通过预先构建时注入或云函数获取配置
    // 这里假设配置已经预先构建时注入到global对象中
    if (global && global.__wxConfig && global.__wxConfig.envConfig) {
      config = {...global.__wxConfig.envConfig};
    }
    // #endif
    
    // 如果没有获取到配置，使用默认配置
    if (Object.keys(config).length === 0) {
      // 开发环境
      if (ENV === 'development') {
        config = {
          API_BASE_URL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:8000',
          API_TIMEOUT: process.env.VUE_APP_API_TIMEOUT || 10000,
          WECHAT_APP_ID: process.env.VUE_APP_WECHAT_APP_ID || 'wx_dev_app_id',
          WECHAT_APP_SECRET: process.env.VUE_APP_WECHAT_APP_SECRET || 'wx_dev_app_secret',
          OSS_ACCESS_KEY: process.env.VUE_APP_OSS_ACCESS_KEY || 'dev_access_key',
          OSS_SECRET_KEY: process.env.VUE_APP_OSS_SECRET_KEY || 'dev_secret_key',
          OSS_BUCKET: process.env.VUE_APP_OSS_BUCKET || 'dev-bucket',
          OSS_REGION: process.env.VUE_APP_OSS_REGION || 'oss-cn-hangzhou'
        };
      } 
      // 测试环境
      else if (ENV === 'test') {
        config = {
          API_BASE_URL: process.env.VUE_APP_API_BASE_URL || 'https://test-api.your-domain.com',
          API_TIMEOUT: process.env.VUE_APP_API_TIMEOUT || 15000,
          WECHAT_APP_ID: process.env.VUE_APP_WECHAT_APP_ID || 'wx_test_app_id',
          WECHAT_APP_SECRET: process.env.VUE_APP_WECHAT_APP_SECRET || 'wx_test_app_secret',
          OSS_ACCESS_KEY: process.env.VUE_APP_OSS_ACCESS_KEY || 'test_access_key',
          OSS_SECRET_KEY: process.env.VUE_APP_OSS_SECRET_KEY || 'test_secret_key',
          OSS_BUCKET: process.env.VUE_APP_OSS_BUCKET || 'test-bucket',
          OSS_REGION: process.env.VUE_APP_OSS_REGION || 'oss-cn-hangzhou'
        };
      } 
      // 生产环境
      else if (ENV === 'production') {
        config = {
          API_BASE_URL: process.env.VUE_APP_API_BASE_URL || 'https://api.your-domain.com',
          API_TIMEOUT: process.env.VUE_APP_API_TIMEOUT || 20000,
          WECHAT_APP_ID: process.env.VUE_APP_WECHAT_APP_ID || 'wx_prod_app_id',
          WECHAT_APP_SECRET: process.env.VUE_APP_WECHAT_APP_SECRET || 'wx_prod_app_secret',
          OSS_ACCESS_KEY: process.env.VUE_APP_OSS_ACCESS_KEY || 'prod_access_key',
          OSS_SECRET_KEY: process.env.VUE_APP_OSS_SECRET_KEY || 'prod_secret_key',
          OSS_BUCKET: process.env.VUE_APP_OSS_BUCKET || 'prod-bucket',
          OSS_REGION: process.env.VUE_APP_OSS_REGION || 'oss-cn-hangzhou'
        };
      }
    }
    
    console.log(`已加载${ENV}环境配置`);
  } catch (error) {
    console.error('加载环境配置失败:', error);
  }
  
  return config;
}

// 加载配置
envConfig = loadEnvFile();

// 导出配置对象
export default {
  // 当前环境
  ENV,
  
  // API配置
  API_BASE_URL: envConfig.API_BASE_URL,
  API_TIMEOUT: parseInt(envConfig.API_TIMEOUT || '10000'),
  
  // 微信小程序配置
  WECHAT: {
    APP_ID: envConfig.WECHAT_APP_ID,
    APP_SECRET: envConfig.WECHAT_APP_SECRET
  },
  
  // OSS配置
  OSS: {
    ACCESS_KEY: envConfig.OSS_ACCESS_KEY,
    SECRET_KEY: envConfig.OSS_SECRET_KEY,
    BUCKET: envConfig.OSS_BUCKET,
    REGION: envConfig.OSS_REGION
  },
  
  // 存储键名
  STORAGE_KEYS: {
    TOKEN: 'token',
    USER_INFO: 'userInfo'
  },
  
  // 判断是否为开发环境
  isDev: ENV === 'development',
  
  // 判断是否为测试环境
  isTest: ENV === 'test',
  
  // 判断是否为生产环境
  isProd: ENV === 'production',
  
  // 获取完整配置
  getConfig() {
    return {...envConfig};
  }
}; 