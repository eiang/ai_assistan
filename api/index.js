import request from '../utils/request'

// 基础URL
const BASE_URL = 'http://localhost:8000'

// 请求拦截器
const requestInterceptor = (config) => {
  // 添加token到请求头
  const token = uni.getStorageSync('token')
  if (token) {
    config.header = {
      ...config.header,
      'Authorization': `Bearer ${token}`
    }
  }
  
  // 打印请求信息
  console.log('请求配置:', {
    url: config.url,
    method: config.method,
    data: config.data,
    header: config.header
  })
  
  return config
}

// 响应拦截器
const responseInterceptor = (response) => {
  const { statusCode, data } = response
  
  // 打印响应信息
  console.log('响应数据:', {
    statusCode,
    data
  })
  
  // 处理401未授权
  if (statusCode === 401) {
    uni.removeStorageSync('token')
    uni.removeStorageSync('userInfo')
    uni.reLaunch({
      url: '/pages/login/login'
    })
    return Promise.reject(new Error('登录已过期，请重新登录'))
  }
  
  // 处理422参数错误
  if (statusCode === 422) {
    let errorMsg = '参数错误'
    try {
      if (typeof data === 'string') {
        errorMsg = data
      } else if (data && typeof data === 'object') {
        // 处理FastAPI的422错误格式
        if (data.detail && Array.isArray(data.detail)) {
          errorMsg = data.detail.map(item => {
            console.log('错误项:', item)
            return `${item.loc ? item.loc.join('.') + ': ' : ''}${item.msg}`
          }).join('; ')
        } else if (data.detail) {
          errorMsg = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail)
        } else if (data.message) {
          errorMsg = data.message
        } else {
          errorMsg = JSON.stringify(data)
        }
      }
    } catch (e) {
      console.error('解析错误信息失败:', e)
      errorMsg = '参数错误，请检查输入'
    }
    console.error('422错误详情:', errorMsg, '原始数据:', data)
    return Promise.reject(new Error(errorMsg))
  }
  
  // 处理其他错误状态码
  if (statusCode !== 200) {
    let errorMsg = '请求失败'
    try {
      if (typeof data === 'string') {
        errorMsg = data
      } else if (data && typeof data === 'object') {
        errorMsg = data.message || data.detail || JSON.stringify(data)
      }
    } catch (e) {
      console.error('解析错误信息失败:', e)
      errorMsg = '请求失败，请稍后重试'
    }
    console.error('请求错误详情:', errorMsg, '原始数据:', data)
    return Promise.reject(new Error(errorMsg))
  }
  
  // 处理业务错误
  if (data && data.code !== undefined && data.code !== 200) {
    let errorMsg = '操作失败'
    try {
      if (typeof data === 'string') {
        errorMsg = data
      } else if (data && typeof data === 'object') {
        errorMsg = data.message || data.detail || JSON.stringify(data)
      }
    } catch (e) {
      console.error('解析错误信息失败:', e)
      errorMsg = '操作失败，请稍后重试'
    }
    console.error('业务错误详情:', errorMsg, '原始数据:', data)
    return Promise.reject(new Error(errorMsg))
  }
  
  // 处理响应数据
  if (data && data.data !== undefined) {
    return data.data
  }
  
  return data
}

// 认证相关接口
export const authApi = {
  // 微信登录
  wechatLogin(data) {
    return request({
      url: `${BASE_URL}/auth/wechat-login`,
      method: 'POST',
      data: {
        code: data.code,
        userInfo: {
          nickName: "微信用户",
          avatarUrl: ""
        }
      },
      header: {
        'Content-Type': 'application/json'
      }
    }, requestInterceptor, responseInterceptor)
  },
  
  // 退出登录
  logout() {
    return request({
      url: `${BASE_URL}/auth/logout`,
      method: 'POST'
    }, requestInterceptor, responseInterceptor)
  }
}

// 用户相关接口
export const userApi = {
  // 获取用户信息
  getUserInfo() {
    return request({
      url: `${BASE_URL}/user/info`,
      method: 'GET'
    }, requestInterceptor, responseInterceptor)
  },
  
  // 更新用户设置
  updateUserSettings(settings) {
    return request({
      url: `${BASE_URL}/user/settings`,
      method: 'PUT',
      data: settings
    }, requestInterceptor, responseInterceptor)
  }
}

// 聊天相关接口
export const chatApi = {
  // 发送消息
  sendMessage(data) {
    return request({
      url: `${BASE_URL}/chat/message`,
      method: 'POST',
      data: {
        content: data.content,
        sessionId: data.sessionId
      }
    }, requestInterceptor, responseInterceptor)
  },
  
  // 获取聊天历史
  getHistory(params) {
    return request({
      url: `${BASE_URL}/chat/history`,
      method: 'GET',
      data: params
    }, requestInterceptor, responseInterceptor)
  },
  
  // 清除聊天历史
  clearHistory() {
    return request({
      url: `${BASE_URL}/chat/history`,
      method: 'DELETE'
    }, requestInterceptor, responseInterceptor)
  }
}

// AI相关接口
export const aiApi = {
  // 语音识别
  speechToText(file) {
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        url: `${BASE_URL}/ai/speech-to-text`,
        filePath: file,
        name: 'audio',
        header: {
          'Authorization': `Bearer ${uni.getStorageSync('token')}`
        },
        success: (res) => {
          if (res.statusCode === 200) {
            const data = JSON.parse(res.data)
            if (data.code === 200) {
              resolve(data.data)
            } else {
              reject(new Error(data.message || '语音识别失败'))
            }
          } else {
            reject(new Error('上传失败'))
          }
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  }
} 