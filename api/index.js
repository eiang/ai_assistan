import request from '../utils/request'
import envConfig from '../utils/env-config'

// 获取环境配置中的存储键和其他信息
const { STORAGE_KEYS } = envConfig;

/**
 * 认证相关接口
 */
export const authApi = {
  /**
   * 微信登录
   * @param {Object} data 登录数据
   * @returns {Promise} 登录结果
   */
  wechatLogin(data) {
    return request.post('/auth/wechat-login', {
      code: data.code,
      userInfo: data.userInfo || {
        nickName: "微信用户",
        avatarUrl: ""
      }
    });
  },
  
  /**
   * 退出登录
   * @returns {Promise} 退出结果
   */
  logout() {
    // 清除本地存储的登录信息
    uni.removeStorageSync(STORAGE_KEYS.TOKEN);
    uni.removeStorageSync(STORAGE_KEYS.USER_INFO);
    
    return request.post('/auth/logout');
  }
};

/**
 * 用户相关接口
 */
export const userApi = {
  /**
   * 获取用户信息
   * @returns {Promise} 用户信息
   */
  getUserInfo() {
    return request.get('/user/info');
  },
  
  /**
   * 更新用户资料
   * @param {Object} data 用户资料数据
   * @returns {Promise} 更新结果
   */
  updateProfile(data) {
    return request.put('/user/profile', data);
  },
  
  /**
   * 更新用户设置
   * @param {Object} settings 用户设置
   * @returns {Promise} 更新结果
   */
  updateSettings(settings) {
    return request.put('/user/settings', settings);
  }
};

/**
 * 聊天相关接口
 */
export const chatApi = {
  /**
   * 发送消息
   * @param {Object} data 消息数据
   * @returns {Promise} 消息响应
   */
  sendMessage(data) {
    return request.post('/chat/message', {
      content: data.content,
      sessionId: data.sessionId
    });
  },
  
  /**
   * 获取聊天历史
   * @param {Object} params 查询参数
   * @returns {Promise} 聊天历史
   */
  getHistory(params) {
    return request.get('/chat/history', params);
  },
  
  /**
   * 创建聊天会话
   * @param {Object} data 会话数据
   * @returns {Promise} 会话信息
   */
  createSession(data) {
    return request.post('/chat/session', data);
  },
  
  /**
   * 获取会话列表
   * @param {Object} params 查询参数
   * @returns {Promise} 会话列表
   */
  getSessions(params) {
    return request.get('/chat/sessions', params);
  },
  
  /**
   * 删除会话
   * @param {string} sessionId 会话ID
   * @returns {Promise} 删除结果
   */
  deleteSession(sessionId) {
    return request.delete(`/chat/session/${sessionId}`);
  },
  
  /**
   * 清除聊天历史
   * @param {string} sessionId 会话ID
   * @returns {Promise} 清除结果
   */
  clearHistory(sessionId) {
    return request.delete(`/chat/history/${sessionId}`);
  }
};

/**
 * AI相关接口
 */
export const aiApi = {
  /**
   * 语音识别
   * @param {string} filePath 音频文件路径
   * @param {Object} options 上传选项
   * @returns {Promise} 识别结果
   */
  speechToText(filePath, options = {}) {
    return request.upload('/ai/speech-to-text', {
      filePath,
      name: 'audio',
      formData: options.formData || {},
      loadingText: '识别中...'
    });
  },
  
  /**
   * 文本生成语音
   * @param {Object} data 文本数据
   * @returns {Promise} 语音文件路径
   */
  textToSpeech(data) {
    return request.post('/ai/text-to-speech', data, {
      responseType: 'arraybuffer',
      loadingText: '生成中...'
    });
  },
  
  /**
   * 获取AI模型列表
   * @returns {Promise} 模型列表
   */
  getModels() {
    return request.get('/ai/models');
  }
};

/**
 * 文件上传相关接口
 */
export const fileApi = {
  /**
   * 上传图片
   * @param {string} filePath 图片文件路径
   * @param {Object} options 上传选项
   * @returns {Promise} 上传结果
   */
  uploadImage(filePath, options = {}) {
    return request.upload('/file/image', {
      filePath,
      name: 'image',
      formData: options.formData || {}
    });
  },
  
  /**
   * 上传文件
   * @param {string} filePath 文件路径
   * @param {Object} options 上传选项
   * @returns {Promise} 上传结果
   */
  uploadFile(filePath, options = {}) {
    return request.upload('/file/upload', {
      filePath,
      name: 'file',
      formData: options.formData || {}
    });
  }
}; 