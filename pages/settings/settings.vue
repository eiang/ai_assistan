<template>
  <view class="settings-container">
    <!-- 顶部导航栏 -->
    <view class="settings-header">
      <view class="history-back" @click="goBack">
        <tui-icon name="arrowleft"></tui-icon>
      </view>
      <view class="settings-title">设置</view>
      <view style="width: 36px;"></view> <!-- 为了标题居中的占位元素 -->
    </view>
    
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <image class="avatar" :src="userInfo.avatar || '/static/default-avatar.png'" mode="aspectFill"></image>
      <view class="user-info">
        <text class="nickname">{{ userInfo.nickName || '未登录' }}</text>
        <text class="id">ID: {{ userInfo.id || '--' }}</text>
      </view>
    </view>
    
    <!-- 设置列表 -->
    <view class="settings-list">
      <!-- 深色模式 -->
      <!-- <view class="settings-item" @click="toggleDarkMode">
        <text class="item-label">深色模式</text>
        <switch :checked="isDarkMode" @change="toggleDarkMode" color="#007AFF" />
      </view> -->
      
      <!-- 语音播报 -->
      <!-- <view class="settings-item" @click="toggleVoiceBroadcast">
        <text class="item-label">语音播报</text>
        <switch :checked="isVoiceBroadcast" @change="toggleVoiceBroadcast" color="#007AFF" />
      </view> -->
      
      <!-- 保存聊天记录 -->
      <!-- <view class="settings-item" @click="toggleSaveHistory">
        <text class="item-label">保存聊天记录</text>
        <switch :checked="isSaveHistory" @change="toggleSaveHistory" color="#007AFF" />
      </view> -->
      
      <!-- 聊天记录 -->
      <!-- <view class="settings-item" @click="navigateToHistory">
        <text class="item-label">聊天记录</text>
        <text class="item-arrow">></text>
      </view> -->
      
      <!-- 关于 -->
      <view class="settings-item" @click="showAbout">
        <text class="item-label">关于</text>
        <text class="item-arrow">></text>
      </view>
    </view>
    
    <!-- 操作按钮 -->
    <view class="action-buttons">
      <!-- <button class="clear-btn" @click="clearChatHistory">清除聊天记录</button> -->
      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </view>
  </view>
</template>

<script>
import { authApi } from '../../api/index'

export default {
  data() {
    return {
      userInfo: {},
      isDarkMode: false,
      isVoiceBroadcast: true,
      isSaveHistory: true
    }
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
    // uni.showToast({
    //   title: '设置页面已打开',
    //   icon: 'none',
    //   duration: 1000
    // });
    
    // 强制更新页面内容
    this.$forceUpdate();
  },
  
  methods: {
    /**
     * 加载用户信息
     */
    loadUserInfo() {
      try {
        const userInfoData = uni.getStorageSync('userInfo');
        if (userInfoData) {
          // 检查userInfoData是否已经是对象
          if (typeof userInfoData === 'string') {
            try {
              this.userInfo = JSON.parse(userInfoData);
            } catch (e) {
              console.error('解析用户信息字符串失败', e);
            }
          } else {
            // 已经是对象，直接使用
            this.userInfo = userInfoData;
          }
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
        const settings = uni.getStorageSync('settings') || {};
        this.isDarkMode = settings.isDarkMode || false;
        this.isVoiceBroadcast = settings.isVoiceBroadcast !== false;
        this.isSaveHistory = settings.isSaveHistory !== false;
      } catch (e) {
        console.error('获取设置失败', e);
      }
    },
    
    /**
     * 切换深色模式
     */
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      this.saveSettings();
      this.applyTheme();
    },
    
    /**
     * 切换语音播报
     */
    toggleVoiceBroadcast() {
      this.isVoiceBroadcast = !this.isVoiceBroadcast;
      this.saveSettings();
    },
    
    /**
     * 切换保存聊天记录
     */
    toggleSaveHistory() {
      this.isSaveHistory = !this.isSaveHistory;
      this.saveSettings();
    },
    
    /**
     * 保存设置
     */
    saveSettings() {
      uni.setStorageSync('settings', {
        isDarkMode: this.isDarkMode,
        isVoiceBroadcast: this.isVoiceBroadcast,
        isSaveHistory: this.isSaveHistory
      });
    },
    
    /**
     * 应用主题
     */
    applyTheme() {
      if (this.isDarkMode) {
        uni.setTabBarStyle({
          backgroundColor: '#1C1C1E',
          color: '#FFFFFF',
          selectedColor: '#007AFF'
        });
      } else {
        uni.setTabBarStyle({
          backgroundColor: '#FFFFFF',
          color: '#000000',
          selectedColor: '#007AFF'
        });
      }
    },
    
    /**
     * 清除聊天记录
     */
    clearChatHistory() {
      uni.showModal({
        title: '提示',
        content: '确定要清除所有聊天记录吗？',
        success: (res) => {
          if (res.confirm) {
            uni.removeStorageSync('chatHistory');
            uni.showToast({
              title: '聊天记录已清除',
              icon: 'success'
            });
          }
        }
      });
    },
    
    /**
     * 显示关于信息
     */
    showAbout() {
      uni.showModal({
        title: '关于',
        content: 'BQ-AI智能助手。\n\n\n一个智能的对话伙伴，随时解答您的问题。\n\n\n作者微信:Bro_Qiang102197',
        showCancel: false
      });
    },
    
    /**
     * 跳转到聊天记录页面
     */
    navigateToHistory() {
      uni.navigateTo({
        url: '/pages/history/history'
      });
    },
    
    /**
     * 处理退出登录
     */
    async handleLogout() {
      try {
        await authApi.logout();
        // 清除本地存储
        uni.removeStorageSync('token');
        uni.removeStorageSync('userInfo');
        // 跳转到登录页
        uni.reLaunch({
          url: '/pages/login/login'
        });
      } catch (error) {
        uni.showToast({
          title: '退出登录失败',
          icon: 'none'
        });
      }
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
  padding: 60px 20px;
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
  background-color: var(--primary-color);
  transition: all 0.2s ease;
}

.history-back:active {
  background-color: rgba(255, 255, 255, 0.3);
}

/* 用户信息卡片 */
.user-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: #FFFFFF;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 30px;
  margin-right: 15px;
}

.user-info {
  flex: 1;
}

.nickname {
  font-size: 18px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 4px;
}

.id {
  font-size: 14px;
  color: #999999;
}

/* 设置列表 */
.settings-list {
  background-color: #FFFFFF;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.settings-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #F5F5F5;
}

.settings-item:last-child {
  border-bottom: none;
}

.item-label {
  font-size: 16px;
  color: #333333;
}

.item-arrow {
  color: #999999;
  font-size: 16px;
}

/* 操作按钮 */
.action-buttons {
  padding: 0 20px;
}

.clear-btn {
   background-color: transparent;
  color: #6e6868;
  font-size: 14px;
  border: 1px solid #d4c8c8;
  border-radius: 100px;
  padding: 5px 64px;
  transition: all 0.2s ease;
  margin-bottom: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.logout-btn {
 background-color: #4A90E2;
  color: white;
  border: none;
  border-radius: 100px;
  padding: 5px 64px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(74, 144, 226, 0.3);
  margin-bottom: 10px;
  transition: all 0.2s ease;
}

/* 深色模式适配 */
.dark-mode .settings-container {
  background-color: #1C1C1E;
}

.dark-mode .user-card,
.dark-mode .settings-list {
  background-color: #2C2C2E;
}

.dark-mode .nickname,
.dark-mode .item-label {
  color: #FFFFFF;
}

.dark-mode .id,
.dark-mode .item-arrow {
  color: #8E8E93;
}

.dark-mode .settings-item {
  border-bottom-color: #3A3A3C;
}

.dark-mode .clear-btn {
  background-color: #2C2C2E;
  color: #FF453A;
  border-color: #FF453A;
}
</style> 