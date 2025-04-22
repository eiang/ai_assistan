/**
 * 登录状态管理工具
 * 提供登录状态的检查、存储和清除功能
 */

// 登录信息存储键名
const TOKEN_KEY = 'token';
const USER_INFO_KEY = 'userInfo';
const LOGIN_TIME_KEY = 'loginTime';

// 登录过期时间（毫秒）- 30分钟
const LOGIN_EXPIRE_TIME = 30 * 60 * 1000;

/**
 * 保存登录信息
 * @param {Object} loginData - 包含token和用户信息的对象
 */
export function saveLoginInfo(loginData) {
  const { token, userInfo } = loginData;
  
  // 保存token
  if (token) {
    uni.setStorageSync(TOKEN_KEY, token);
  }
  
  // 保存用户信息
  if (userInfo) {
    uni.setStorageSync(USER_INFO_KEY, userInfo);
  }
  
  // 保存登录时间戳
  const loginTime = Date.now();
  uni.setStorageSync(LOGIN_TIME_KEY, loginTime);
}

/**
 * 获取用户信息
 * @returns {Object|null} 用户信息对象，未登录则返回null
 */
export function getUserInfo() {
  try {
    return uni.getStorageSync(USER_INFO_KEY) || null;
  } catch (e) {
    console.error('获取用户信息失败', e);
    return null;
  }
}

/**
 * 获取token
 * @returns {string|null} 用户token，未登录则返回null
 */
export function getToken() {
  try {
    return uni.getStorageSync(TOKEN_KEY) || null;
  } catch (e) {
    console.error('获取token失败', e);
    return null;
  }
}

/**
 * 获取登录时间
 * @returns {number|null} 登录时间戳，未登录则返回null
 */
export function getLoginTime() {
  try {
    return uni.getStorageSync(LOGIN_TIME_KEY) || null;
  } catch (e) {
    console.error('获取登录时间失败', e);
    return null;
  }
}

/**
 * 清除登录信息
 */
export function clearLoginInfo() {
  try {
    uni.removeStorageSync(TOKEN_KEY);
    uni.removeStorageSync(USER_INFO_KEY);
    uni.removeStorageSync(LOGIN_TIME_KEY);
  } catch (e) {
    console.error('清除登录信息失败', e);
  }
}

/**
 * 检查登录状态
 * @returns {boolean} 是否已登录且未过期
 */
export function checkLoginStatus() {
  const token = getToken();
  const loginTime = getLoginTime();
  
  // 未登录
  if (!token || !loginTime) {
    return false;
  }
  
  // 检查是否过期
  const currentTime = Date.now();
  const timeElapsed = currentTime - loginTime;
  
  // 登录已过期
  if (timeElapsed > LOGIN_EXPIRE_TIME) {
    // 清除过期的登录信息
    clearLoginInfo();
    return false;
  }
  
  // 刷新登录时间
  uni.setStorageSync(LOGIN_TIME_KEY, currentTime);
  return true;
} 