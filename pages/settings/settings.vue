<template>
  <view class="settings-container">
    <!-- 顶部导航栏 -->
    <view class="settings-header">
      <view class="history-back" @click="goBack">
        <text class="fa fa-arrow-left"></text>
      </view>
      <view class="settings-title">设置</view>
      <view style="width: 36px;"></view> <!-- 为了标题居中的占位元素 -->
    </view>
    
    <!-- 用户信息 -->
    <view class="settings-user-header">
      <view class="settings-avatar">
        <text class="fa fa-user"></text>
      </view>
      <view class="settings-user-info">
        <view class="settings-username">{{ userInfo.nickName || '未登录' }}</view>
        <view class="settings-userid">{{ userInfo.openid ? '微信ID: ' + userInfo.openid : '游客模式' }}</view>
      </view>
    </view>
    
    <!-- 设置项列表 -->
    <view class="settings-list">
      <!-- 深色模式 -->
      <view class="settings-item">
        <view class="settings-item-left">
          <view class="settings-item-icon">
            <text class="fa fa-moon-o"></text>
          </view>
          <view class="settings-item-title">深色模式</view>
        </view>
        <view class="settings-item-right">
          <label class="settings-switch">
            <input type="checkbox" :checked="isDarkMode" @change="toggleDarkMode">
            <span class="settings-slider"></span>
          </label>
        </view>
      </view>
      
      <!-- 语音播报 -->
      <view class="settings-item">
        <view class="settings-item-left">
          <view class="settings-item-icon">
            <text class="fa fa-volume-up"></text>
          </view>
          <view class="settings-item-title">语音播报</view>
        </view>
        <view class="settings-item-right">
          <label class="settings-switch">
            <input type="checkbox" :checked="autoRead" @change="toggleAutoRead">
            <span class="settings-slider"></span>
          </label>
        </view>
      </view>
      
      <!-- 保存聊天记录 -->
      <view class="settings-item">
        <view class="settings-item-left">
          <view class="settings-item-icon">
            <text class="fa fa-save"></text>
          </view>
          <view class="settings-item-title">保存聊天记录</view>
        </view>
        <view class="settings-item-right">
          <label class="settings-switch">
            <input type="checkbox" :checked="saveHistory" @change="toggleSaveHistory">
            <span class="settings-slider"></span>
          </label>
        </view>
      </view>
      
      <!-- 历史记录 -->
      <view class="settings-item" @tap="goToHistory">
        <view class="settings-item-left">
          <view class="settings-item-icon">
            <text class="fa fa-history"></text>
          </view>
          <view class="settings-item-title">历史记录</view>
        </view>
        <view class="settings-item-right">
          <view class="settings-item-arrow">
            <text class="fa fa-angle-right"></text>
          </view>
        </view>
      </view>
      
      <!-- 关于我们 -->
      <view class="settings-item" @tap="showAboutInfo">
        <view class="settings-item-left">
          <view class="settings-item-icon">
            <text class="fa fa-info-circle"></text>
          </view>
          <view class="settings-item-title">关于我们</view>
        </view>
        <view class="settings-item-right">
          <view class="settings-item-arrow">
            <text class="fa fa-angle-right"></text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 底部按钮 -->
    <button class="settings-button danger" @tap="clearChatHistory">清空聊天记录</button>
    
    <button v-if="userInfo.openid" class="settings-button" @tap="handleLogout">退出登录</button>
    <button v-else class="settings-button" @tap="goToLogin">去登录</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isDarkMode: false,
      autoRead: false,
      saveHistory: true,
      userInfo: {
        nickName: '',
        avatar: '',
        openid: ''
      }
    };
  },
  
  onLoad() {
    // 从全局数据读取深色模式设置
    this.isDarkMode = getApp().globalData.isDarkMode || false;
    
    // 获取用户信息
    this.loadUserInfo();
    
    // 读取本地存储的设置
    this.loadSettings();
    console.log('设置页面已加载');
  },
  
  onShow() {
    console.log('设置页面显示');
    // 确保页面正确显示
    uni.showToast({
      title: '设置页面已打开',
      icon: 'none',
      duration: 1000
    });
    
    // 强制更新页面内容
    this.$forceUpdate();
  },
  
  methods: {
    /**
     * 加载用户信息
     */
    loadUserInfo() {
      try {
        const userInfoStr = uni.getStorageSync('userInfo');
        if (userInfoStr) {
          this.userInfo = JSON.parse(userInfoStr);
        }
      } catch (e) {
        console.error('获取用户信息失败', e);
      }
    },
    
    /**
     * 加载设置
     */
    loadSettings() {
      try {
        const autoReadStr = uni.getStorageSync('autoRead');
        if (autoReadStr !== '') {
          this.autoRead = autoReadStr === 'true';
        }
        
        const saveHistoryStr = uni.getStorageSync('saveHistory');
        if (saveHistoryStr !== '') {
          this.saveHistory = saveHistoryStr === 'true';
        } else {
          // 默认开启保存聊天记录
          this.saveHistory = true;
          uni.setStorageSync('saveHistory', 'true');
        }
      } catch (e) {
        console.error('获取设置失败', e);
      }
    },
    
    /**
     * 切换深色模式
     */
    toggleDarkMode(e) {
      const isDarkMode = e.detail.value;
      this.isDarkMode = isDarkMode;
      
      // 更新全局设置
      getApp().globalData.isDarkMode = isDarkMode;
      
      // 保存到本地存储
      uni.setStorageSync('isDarkMode', isDarkMode.toString());
      
      // 应用深色模式
      if (isDarkMode) {
        // 为body添加深色模式类
        // #ifdef H5
        document.body.classList.add('dark-mode');
        // #endif
        
        // 设置TabBar样式
        uni.setTabBarStyle({
          backgroundColor: '#222',
          borderStyle: 'black',
          color: '#8F8F8F',
          selectedColor: '#4A90E2'
        });
      } else {
        // 移除深色模式类
        // #ifdef H5
        document.body.classList.remove('dark-mode');
        // #endif
        
        // 恢复TabBar样式
        uni.setTabBarStyle({
          backgroundColor: '#ffffff',
          borderStyle: 'black',
          color: '#8F8F8F',
          selectedColor: '#4A90E2'
        });
      }
    },
    
    /**
     * 切换语音播报
     */
    toggleAutoRead(e) {
      this.autoRead = e.detail.value;
      uni.setStorageSync('autoRead', this.autoRead.toString());
    },
    
    /**
     * 切换保存聊天记录
     */
    toggleSaveHistory(e) {
      this.saveHistory = e.detail.value;
      uni.setStorageSync('saveHistory', this.saveHistory.toString());
    },
    
    /**
     * 清空聊天记录
     */
    clearChatHistory() {
      uni.showModal({
        title: '确认清空',
        content: '确定要清空所有聊天记录吗？此操作不可恢复。',
        confirmColor: '#E74C3C',
        success: (res) => {
          if (res.confirm) {
            // 清空聊天记录逻辑
            // 实际开发中需要调用API或清空本地存储
            uni.removeStorageSync('chatHistory');
            
            // 显示提示
            uni.showToast({
              title: '聊天记录已清空',
              icon: 'success'
            });
          }
        }
      });
    },
    
    /**
     * 显示关于我们信息
     */
    showAboutInfo() {
      uni.showModal({
        title: '关于我们',
        content: 'AI聊天助手 v1.0.0\n\n我们致力于提供智能、便捷的AI对话服务，帮助用户解决日常问题，提升工作效率。',
        showCancel: false,
        confirmText: '知道了'
      });
    },
    
    /**
     * 跳转到历史记录页面
     */
    goToHistory() {
      uni.navigateTo({
        url: '/pages/history/history'
      });
    },
    
    /**
     * 退出登录
     */
    handleLogout() {
      uni.showModal({
        title: '确认退出',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            // 清除用户信息
            uni.removeStorageSync('userInfo');
            this.userInfo = {
              nickName: '',
              avatar: '',
              openid: ''
            };
            
            // 更新全局数据
            getApp().globalData.userInfo = null;
            
            // 显示提示
            uni.showToast({
              title: '已退出登录',
              icon: 'success'
            });
          }
        }
      });
    },
    
    /**
     * 跳转到登录页面
     */
    goToLogin() {
      uni.navigateTo({
        url: '/pages/login/login'
      });
    },
    
    /**
     * 返回上一页
     */
    goBack() {
      uni.navigateBack({
        delta: 1
      });
    }
  }
};
</script>

<style scoped>
/* 根据index.html中的CSS变量定义 */
:root {
  --primary-color: #4A90E2;
  --text-color: #333333;
  --light-gray: #f5f5f5;
  --border-radius: 10px;
  --shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.settings-container {
  width: 100%;
  background-color: #ffffff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 顶部导航栏 */
.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  background-color: var(--primary-color);
  color: white;
}

.settings-title {
  font-size: 18px;
  font-weight: 600;
}

.history-back {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.history-back:active {
  background-color: rgba(255, 255, 255, 0.3);
}

/* 用户信息 */
.settings-user-header {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eaeaea;
}

.settings-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: var(--light-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(74, 144, 226, 0.2);
}

.settings-avatar .fa {
  font-size: 32px;
  color: var(--primary-color);
}

.settings-user-info {
  flex: 1;
}

.settings-username {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--text-color);
}

.settings-userid {
  font-size: 12px;
  color: #999;
}

/* 设置项列表 */
.settings-list {
  list-style: none;
}

.settings-item {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}

.settings-item:active {
  background-color: var(--light-gray);
}

.settings-item-left {
  display: flex;
  align-items: center;
}

.settings-item-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: var(--primary-color);
}

.settings-item-title {
  font-size: 15px;
  color: var(--text-color);
}

.settings-item-right {
  display: flex;
  align-items: center;
}

/* 开关样式 */
.settings-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.settings-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.settings-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .3s;
  border-radius: 24px;
}

.settings-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .3s;
  border-radius: 50%;
}

input:checked + .settings-slider {
  background-color: var(--primary-color);
}

input:checked + .settings-slider:before {
  transform: translateX(20px);
}

.settings-item-arrow {
  color: #ccc;
  font-size: 16px;
}

/* 按钮样式 */
.settings-button {
  display: block;
  width: calc(100% - 40px);
  margin: 20px auto;
  padding: 12px 0;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.settings-button:hover {
  background-color: #3a80d2;
}

.settings-button.danger {
  background-color: #e74c3c;
}

.settings-button.danger:hover {
  background-color: #c0392b;
}

/* 深色模式样式 */
.dark-mode .settings-container {
  background-color: #2a2a2a;
}

.dark-mode .settings-user-header {
  border-bottom-color: #444;
}

.dark-mode .settings-avatar {
  background-color: #444;
}

.dark-mode .settings-avatar .fa {
  color: var(--primary-color);
}

.dark-mode .settings-username {
  color: #f0f0f0;
}

.dark-mode .settings-userid {
  color: #aaa;
}

.dark-mode .settings-item {
  border-bottom-color: #3a3a3a;
}

.dark-mode .settings-item:active {
  background-color: #383838;
}

.dark-mode .settings-item-title {
  color: #f0f0f0;
}

.dark-mode .settings-slider {
  background-color: #666;
}

.dark-mode .settings-item-arrow {
  color: #666;
}

.dark-mode .settings-button.danger {
  background-color: #e74c3c;
}

.dark-mode .settings-button.danger:hover {
  background-color: #c0392b;
}
</style> 