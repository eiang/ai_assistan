// 导入环境配置
import envConfig from './env-config';
const { API_BASE_URL, API_TIMEOUT, STORAGE_KEYS } = envConfig;

/**
 * 请求拦截器
 * @param {Object} config 请求配置
 * @returns {Object} 处理后的请求配置
 */
const requestInterceptor = (config) => {
  // 获取token
  const token = uni.getStorageSync(STORAGE_KEYS.TOKEN);
  if (token) {
    config.header = {
      ...config.header,
      'Authorization': `Bearer ${token}`
    };
  }
  return config;
};

/**
 * 响应拦截器
 * @param {Object} response 响应数据
 * @returns {Promise} 处理后的响应数据或错误
 */
const responseInterceptor = (response) => {
  const { statusCode, data } = response;
  
  // 正常请求（HTTP状态码200）
  if (statusCode === 200) {
    // 自定义业务状态码判断
    if (data.code === 200 || data.code === 0 || data.status === 'success') {
      return data.data !== undefined ? data.data : data;
    } else {
      // 处理业务错误
      const errorMsg = data.message || data.msg || '请求失败';
      uni.showToast({
        title: errorMsg,
        icon: 'none'
      });
      return Promise.reject({
        code: data.code,
        message: errorMsg,
        data: data.data
      });
    }
  } 
  // 未授权（401）- 通常是Token失效
  else if (statusCode === 401) {
    // 清除本地存储的token和用户信息
    uni.removeStorageSync(STORAGE_KEYS.TOKEN);
    uni.removeStorageSync(STORAGE_KEYS.USER_INFO);
    
    // 显示错误提示
    uni.showToast({
      title: '登录已过期，请重新登录',
      icon: 'none',
      duration: 2000
    });
    
    // 延迟跳转到登录页
    setTimeout(() => {
      uni.reLaunch({
        url: '/pages/index/index'
      });
    }, 2000);
    
    return Promise.reject(response);
  }
  // 参数验证错误（422）
  else if (statusCode === 422) {
    const errorMsg = data.message || '请求参数错误';
    uni.showToast({
      title: errorMsg,
      icon: 'none'
    });
    return Promise.reject({
      code: statusCode,
      message: errorMsg,
      data
    });
  }
  // 接口不存在（404）
  else if (statusCode === 404) {
    uni.showToast({
      title: '接口不存在，请检查后端服务',
      icon: 'none'
    });
    return Promise.reject({
      code: statusCode,
      message: '接口不存在'
    });
  }
  // 服务器错误（500）
  else if (statusCode >= 500) {
    uni.showToast({
      title: '服务器错误，请稍后再试',
      icon: 'none'
    });
    return Promise.reject({
      code: statusCode,
      message: '服务器错误'
    });
  }
  // 其他HTTP错误
  else {
    uni.showToast({
      title: `网络错误: ${statusCode}`,
      icon: 'none'
    });
    return Promise.reject({
      code: statusCode,
      message: `网络错误: ${statusCode}`
    });
  }
};

/**
 * 基础请求方法
 * @param {Object} options 请求配置
 * @param {Function} reqInterceptor 自定义请求拦截器
 * @param {Function} resInterceptor 自定义响应拦截器
 * @returns {Promise} 请求Promise
 */
function baseRequest(options, reqInterceptor, resInterceptor) {
  // 设置请求超时时间
  const timeout = options.timeout || API_TIMEOUT;
  
  // 如果没有提供完整URL，则添加基础URL
  if (options.url && !options.url.startsWith('http')) {
    options.url = `${API_BASE_URL}${options.url}`;
  }
  
  // 默认请求头
  if (!options.header) {
    options.header = {
      'Content-Type': 'application/json'
    };
  }
  
  return new Promise((resolve, reject) => {
    // 应用请求拦截器（优先使用传入的，否则使用默认的）
    const finalReqInterceptor = reqInterceptor || requestInterceptor;
    const config = finalReqInterceptor ? finalReqInterceptor(options) : options;
    
    // 显示loading
    if (options.loading !== false) {
      uni.showLoading({
        title: options.loadingText || '加载中...',
        mask: true
      });
    }
    
    // 发起请求
    uni.request({
      ...config,
      timeout: timeout,
      success: (res) => {
        // 应用响应拦截器（优先使用传入的，否则使用默认的）
        const finalResInterceptor = resInterceptor || responseInterceptor;
        if (finalResInterceptor) {
          try {
            const result = finalResInterceptor(res);
            // 判断是否是Promise.reject
            if (result instanceof Promise && result.catch) {
              result.catch(err => reject(err));
              // 如果是Promise.reject，不要调用resolve
              if (!result.then) return;
            }
            resolve(result);
          } catch (error) {
            reject(error);
          }
        } else {
          resolve(res);
        }
      },
      fail: (err) => {
        // 网络错误处理
        uni.showToast({
          title: '网络连接失败，请检查网络设置',
          icon: 'none'
        });
        reject(err);
      },
      complete: () => {
        // 隐藏loading
        if (options.loading !== false) {
          uni.hideLoading();
        }
      }
    });
  });
}

/**
 * HTTP请求工具类
 */
const request = {
  /**
   * GET请求
   * @param {string} url 请求地址
   * @param {Object} params 请求参数（查询参数）
   * @param {Object} options 其他选项
   * @returns {Promise} 请求Promise
   */
  get(url, params = {}, options = {}) {
    return baseRequest({
      url,
      method: 'GET',
      data: params,
      ...options
    });
  },
  
  /**
   * POST请求
   * @param {string} url 请求地址
   * @param {Object} data 请求体数据
   * @param {Object} options 其他选项
   * @returns {Promise} 请求Promise
   */
  post(url, data = {}, options = {}) {
    return baseRequest({
      url,
      method: 'POST',
      data,
      ...options
    });
  },
  
  /**
   * PUT请求
   * @param {string} url 请求地址
   * @param {Object} data 请求体数据
   * @param {Object} options 其他选项
   * @returns {Promise} 请求Promise
   */
  put(url, data = {}, options = {}) {
    return baseRequest({
      url,
      method: 'PUT',
      data,
      ...options
    });
  },
  
  /**
   * DELETE请求
   * @param {string} url 请求地址
   * @param {Object} data 请求体数据
   * @param {Object} options 其他选项
   * @returns {Promise} 请求Promise
   */
  delete(url, data = {}, options = {}) {
    return baseRequest({
      url,
      method: 'DELETE',
      data,
      ...options
    });
  },
  
  /**
   * PATCH请求
   * @param {string} url 请求地址
   * @param {Object} data 请求体数据
   * @param {Object} options 其他选项
   * @returns {Promise} 请求Promise
   */
  patch(url, data = {}, options = {}) {
    return baseRequest({
      url,
      method: 'PATCH',
      data,
      ...options
    });
  },
  
  /**
   * 上传文件
   * @param {string} url 上传地址
   * @param {Object} options 上传选项
   * @returns {Promise} 上传Promise
   */
  upload(url, options = {}) {
    if (!options.filePath && !options.files) {
      return Promise.reject(new Error('filePath或files至少需要提供一个'));
    }
    
    // 如果没有提供完整URL，则添加基础URL
    if (url && !url.startsWith('http')) {
      url = `${API_BASE_URL}${url}`;
    }
    
    // 获取token
    const token = uni.getStorageSync(STORAGE_KEYS.TOKEN);
    const header = options.header || {};
    if (token) {
      header['Authorization'] = `Bearer ${token}`;
    }
    
    return new Promise((resolve, reject) => {
      // 显示loading
      if (options.loading !== false) {
        uni.showLoading({
          title: options.loadingText || '上传中...',
          mask: true
        });
      }
      
      uni.uploadFile({
        url,
        filePath: options.filePath,
        files: options.files,
        name: options.name || 'file',
        formData: options.formData || {},
        header,
        success: (res) => {
          try {
            // 尝试解析返回的JSON数据
            const data = JSON.parse(res.data);
            
            if (res.statusCode === 200) {
              if (data.code === 200 || data.code === 0 || data.status === 'success') {
                resolve(data.data !== undefined ? data.data : data);
              } else {
                uni.showToast({
                  title: data.message || '上传失败',
                  icon: 'none'
                });
                reject(data);
              }
            } else {
              uni.showToast({
                title: `上传失败: ${res.statusCode}`,
                icon: 'none'
              });
              reject(data);
            }
          } catch (e) {
            // 如果不是JSON格式的响应，直接返回
            resolve(res.data);
          }
        },
        fail: (err) => {
          uni.showToast({
            title: '上传失败，请检查网络',
            icon: 'none'
          });
          reject(err);
        },
        complete: () => {
          // 隐藏loading
          if (options.loading !== false) {
            uni.hideLoading();
          }
        }
      });
    });
  },
  
  /**
   * 下载文件
   * @param {string} url 下载地址
   * @param {Object} options 下载选项
   * @returns {Promise} 下载Promise
   */
  download(url, options = {}) {
    // 如果没有提供完整URL，则添加基础URL
    if (url && !url.startsWith('http')) {
      url = `${API_BASE_URL}${url}`;
    }
    
    // 获取token
    const token = uni.getStorageSync(STORAGE_KEYS.TOKEN);
    const header = options.header || {};
    if (token) {
      header['Authorization'] = `Bearer ${token}`;
    }
    
    return new Promise((resolve, reject) => {
      // 显示loading
      if (options.loading !== false) {
        uni.showLoading({
          title: options.loadingText || '下载中...',
          mask: true
        });
      }
      
      const downloadTask = uni.downloadFile({
        url,
        header,
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.tempFilePath);
          } else {
            uni.showToast({
              title: `下载失败: ${res.statusCode}`,
              icon: 'none'
            });
            reject(res);
          }
        },
        fail: (err) => {
          uni.showToast({
            title: '下载失败，请检查网络',
            icon: 'none'
          });
          reject(err);
        },
        complete: () => {
          // 隐藏loading
          if (options.loading !== false) {
            uni.hideLoading();
          }
        }
      });
      
      // 监听下载进度
      if (typeof options.onProgress === 'function') {
        downloadTask.onProgressUpdate(res => {
          options.onProgress(res.progress, res);
        });
      }
    });
  },
  
  /**
   * 自定义请求
   * @param {Object} options 完整的请求配置
   * @returns {Promise} 请求Promise
   */
  custom(options) {
    return baseRequest(options);
  }
};

export default request; 