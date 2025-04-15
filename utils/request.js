// 导入环境配置
import envConfig from './env-config';
const { API_BASE_URL, API_TIMEOUT, STORAGE_KEYS } = envConfig;

// 请求拦截器
const requestInterceptor = (config) => {
  // 获取token
  const token = uni.getStorageSync(STORAGE_KEYS.TOKEN)
  if (token) {
    config.header = {
      ...config.header,
      'Authorization': `Bearer ${token}`
    }
  }
  return config
}

// 响应拦截器
const responseInterceptor = (response) => {
  const { statusCode, data } = response
  console.log('响应数据:', response)
  
  if (statusCode === 200) {
    if (data.code === 200) {
      return data.data
    } else {
      // 处理业务错误
      uni.showToast({
        title: data.message || '请求失败',
        icon: 'none'
      })
      return Promise.reject(data)
    }
  } else if (statusCode === 422) {
    // 处理参数验证错误
    const errorMsg = data.message || '请求参数错误'
    uni.showToast({
      title: errorMsg,
      icon: 'none'
    })
    return Promise.reject(response)
  } else if (statusCode === 404) {
    // 处理404错误
    uni.showToast({
      title: '接口不存在，请检查后端服务',
      icon: 'none'
    })
    return Promise.reject(response)
  } else {
    // 处理其他HTTP错误
    uni.showToast({
      title: `网络错误: ${statusCode}`,
      icon: 'none'
    })
    return Promise.reject(response)
  }
}

// 请求工具
export default function request(options, requestInterceptor, responseInterceptor) {
  // 设置请求超时时间
  const timeout = options.timeout || API_TIMEOUT;
  
  // 如果没有提供完整URL，则添加基础URL
  if (options.url && !options.url.startsWith('http')) {
    options.url = `${API_BASE_URL}${options.url}`;
  }
  
  return new Promise((resolve, reject) => {
    // 应用请求拦截器
    const config = requestInterceptor ? requestInterceptor(options) : options
    
    // 发起请求
    uni.request({
      ...config,
      timeout: timeout,
      success: (res) => {
        // 应用响应拦截器
        if (responseInterceptor) {
          try {
            const result = responseInterceptor(res)
            resolve(result)
          } catch (error) {
            reject(error)
          }
        } else {
          resolve(res)
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
} 