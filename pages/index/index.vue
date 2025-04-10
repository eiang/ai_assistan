<template>
  <view class="welcome-container">
    <view class="welcome-content">
      <view class="welcome-logo">
        <img alt="svgImg" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICB2aWV3Qm94PSIwIDAgNDggNDgiIHdpZHRoPSI0OHB4IiBoZWlnaHQ9IjQ4cHgiPjxwYXRoIGZpbGw9IiNmZmUwYjIiIGQ9Ik0yNiwxNmMtMTAuNzQ3LDAtMTkuODk5LDMuNC0yNS44NTYsNi4zNzVDMC4wNTEsMjMuMDczLDAsMjMuNzgyLDAsMjQuNUMwLDM1LjI3LDEwLjc0NSw0NCwyNCw0NAlzMjQtOC43MywyNC0xOS41YzAtMS4zNi0wLjE3Mi0yLjY4Ny0wLjQ5OS0zLjk2OUM0MC40NDYsMTcuNTMzLDMzLjIxNywxNiwyNiwxNnoiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMjQsMjMuNjE5Yy0wLjAxNSwzLjc2NywyLjk0OCw3LjIzOSw2LjU3OSw3LjM3NmMzLjU4OCwwLjEzNiw1LjkyOC0zLjA2Niw1LjMyNi02Ljc4NgljLTAuNTQ2LTMuMzctMy4zNjQtNi4wMjItNi4zNjctNi4yMDFDMjYuNTA2LDE3LjgyOSwyNC4wMTQsMjAuMjEzLDI0LDIzLjYxOXoiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMjQsMjMuNjE5YzAuMDE1LDMuNzY3LTIuOTQ0LDcuMjM5LTYuNTcxLDcuMzc2Yy0zLjU4MywwLjEzNi01LjkyMS0zLjA2Ni01LjMxOS02Ljc4NgljMC41NDUtMy4zNywzLjM1OS02LjAyMiw2LjM1OC02LjIwMUMyMS40OTgsMTcuODI5LDIzLjk4NiwyMC4yMTMsMjQsMjMuNjE5eiIvPjxjaXJjbGUgY3g9IjIxIiBjeT0iMjQiIHI9IjEiIGZpbGw9IiMyMTIxMjEiLz48Y2lyY2xlIGN4PSIyOCIgY3k9IjI0IiByPSIxIiBmaWxsPSIjMjEyMTIxIi8+PHBhdGggZmlsbD0iIzIxMjEyMSIgZD0iTTI0Ljc1NCw0MGMtMi43NSwwLTQuNzE5LTEuMTQ4LTQuODAyLTEuMTk3bDEuMDIxLTEuNzIxQzIwLjk4NSwzNy4wODksMjIuNTc1LDM4LDI0Ljc1NCwzOAljMS44MDUsMCwzLjI1My0wLjcyNCwzLjI2OC0wLjczMWwwLjkxMywxLjc4QzI4Ljg2LDM5LjA4NywyNy4wNjEsNDAsMjQuNzU0LDQweiIvPjxwYXRoIGZpbGw9IiMwMDk3YTciIGQ9Ik0wLjM2MSwyMS4xNTFjLTAuMDg2LDAuNDA0LTAuMTU3LDAuODExLTAuMjE0LDEuMjIzQzYuMTA0LDE5LjM5OSwxNS4yNTQsMTYsMjYsMTYJYzcuMjEsMCwxNC40MzMsMS41MzEsMjEuNDgzLDQuNTI0Yy0wLjExMi0wLjQxNi0wLjI0LTAuODI4LTAuMzc5LTEuMjM2Yy0wLjEwMi0wLjA0Mi0wLjIwNC0wLjA3Ni0wLjMwNS0wLjExNwljMC4yMDEsMC4wNjYsMC4zMjcsMC4xMDksMC4zMjcsMC4xMDlDNDQuMzE3LDExLjA0NiwzNS4wMjksNSwyNCw1QzEyLjE1MSw1LDIuMzEsMTEuOTc2LDAuMzU1LDIxLjE0OWMwLDAsMC4wODktMC4wNDIsMC4yNTQtMC4xMTUJQzAuNTI4LDIxLjA3MywwLjQ0MSwyMS4xMTIsMC4zNjEsMjEuMTUxeiIvPjxwYXRoIGZpbGw9IiNmZmVhMDAiIGQ9Ik00Ny43NTIsMjEuNzE1Yy0wLjE0Ni0wLjgyOS0wLjM3OC0xLjYzNS0wLjY0OC0yLjQyN0M0MC4xNzQsMTYuNDU0LDMzLjA4MywxNSwyNiwxNQljLTEwLjU0NCwwLTE5LjU3NywzLjIxMS0yNS42MzksNi4xNTFjLTAuMTY3LDAuNzg1LTAuMjg0LDEuNTg1LTAuMzMyLDIuMzk5QzYuNDEsMjAuMjgzLDE1LjQ0NiwxNywyNiwxNwlDMzQuNTYxLDE3LDQyLjAxNywxOS4yLDQ3Ljc1MiwyMS43MTV6Ii8+PHBvbHlnb24gZmlsbD0iI2ZmZWEwMCIgcG9pbnRzPSIxNiw2LjExIDE2LjgyNiw0LjQwOCAxOCw0IDIwLDMgMjMsMyAyNCwyIDI2LjA2MSwyLjM0NCAyNy41LDMuNSAyOS41LDQgMzAsNS42MTQgMjksNi41IDI3LDYgMjYsNyAyNC41LDcgMjMsNiAyMC41LDcgMjAsNS41IDE4LjUsNyAxNi41LDciLz48L3N2Zz4="/>
      </view>
      <view class="welcome-header">
        <text class="welcome-title">AI聊天助手</text>
        <text class="welcome-subtitle">您的智能助手，随时解答问题，让生活更便捷</text>
      </view>
      
    
      <view  class="feature-list">
        <view class="feature-item">
          <view class="feature-icon">
            问
          </view>
          <text class="feature-title">智能问答</text>
          <text class="feature-desc">回答各类问题，提供准确信息和专业知识</text>
        </view>
        
        <view class="feature-item">
          <view class="feature-icon">
            写
          </view>
          <text class="feature-title">创意写作</text>
          <text class="feature-desc">协助撰写邮件、文案、故事和各类文本内容</text>
        </view>
        
        <view class="feature-item">
          <view class="feature-icon">
            规
          </view>
          <text class="feature-title">规划助手</text>
          <text class="feature-desc">帮助规划行程、制定计划和安排日程</text>
        </view>
        
        <view class="feature-item">
          <view class="feature-icon">
            语
          </view>
          <text class="feature-title">语言助手</text>
          <text class="feature-desc">提供翻译、语法检查和语言学习支持</text>
        </view>
      </view>
      
      <view class="quick-action-chips">
        <view class="quick-action-chip" @tap="useQuickAction('你能做什么？')">你能做什么？</view>
        <view class="quick-action-chip" @tap="useQuickAction('如何使用AI助手？')">如何使用AI助手？</view>
        <view class="quick-action-chip" @tap="useQuickAction('有什么使用技巧？')">有什么使用技巧？</view>
      </view>
      
      <view class="button-group">
        <button class="start-button" @tap="startChat">开始对话</button>
        <button class="login-button" @tap="goToLogin">登录账号</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: 'AI聊天助手',
      halfMaxCell: 25 // 默认值，将在onLoad中更新
    }
  },
  onLoad() {
    // 计算屏幕宽度下的最大cell值的一半
    this.calculateHalfMaxCell();
  },
  methods: {
    // 计算最大cell值的一半
    calculateHalfMaxCell() {
      try {
        const systemInfo = uni.getSystemInfoSync();
        const screenWidth = systemInfo.windowWidth;
        // tui-grid默认最大是50格
        const maxCell = 50;
        // 取一半，确保是整数
        this.halfMaxCell = Math.floor(maxCell / 2);
      } catch (e) {
        console.error('获取系统信息失败', e);
        // 保持默认值
      }
    },
    
    // 功能详情（需要实现）
    detail() {
      // 处理点击事件的逻辑
      uni.showToast({
        title: '功能演示',
        icon: 'none'
      });
    },
    
    // 前往登录页面
    goToLogin() {
      uni.navigateTo({
        url: '/pages/login/login'
      })
    },
    
    // 直接开始聊天
    startChat() {
      uni.navigateTo({
        url: '/pages/chat/chat'
      })
    },
    
    // 使用快速操作
    useQuickAction(action) {
      uni.navigateTo({
        url: '/pages/chat/chat',
        success: () => {
          // 这里可以设置全局状态来传递预设问题
          getApp().globalData.presetQuestion = action;
        }
      });
    }
  }
}
</script>

<style>
.welcome-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #ffffff;
  min-height: 100vh;
}

.welcome-content {
  width: 100%;
  max-width: 540px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  text-align: center;
  padding: 40px 20px;
}

.welcome-logo {
  width: 120px;
  height: 120px;
  margin: 0 auto 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4A90E2;
  color: white;
  border-radius: 50%;
  box-shadow: 0 4px 20px rgba(74, 144, 226, 0.3);
}

.fa-comments {
  font-size: 60px;
}

.welcome-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 6px;
}

.welcome-title {
  font-size: 28px;
  font-weight: 700;
  color: #333333;
  margin-bottom: 15px;
  display: block;
}

.welcome-subtitle {
  font-size: 16px;
  color: #666;
  margin-bottom: 40px;
  line-height: 1.6;
  padding: 0 20px;
  display: block;
}

.feature-list {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 12px;
}

.feature-item {
  width: calc(50% - 10px);
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 20px 15px;
  text-align: center;
  transition: all 0.3s;
}

.feature-item:active {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  width: 50px;
  height: 50px;
  background-color: #4A90E2;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}

.feature-icon text {
  font-size: 24px;
}

.feature-title {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 8px;
}

.feature-desc {
  display: block;
  font-size: 13px;
  color: #777;
  line-height: 1.5;
}

.quick-action-chips {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 15px;
  width: 100%;
  overflow-x: auto;
}

.quick-action-chip {
  background-color: white;
  border: 1px solid #4A90E2;
  color: #4A90E2;
  border-radius: 30px;
  padding: 10px 15px;
  font-size: 14px;
  white-space: nowrap;
  flex-shrink: 0;
}

.quick-action-chip:active {
  background-color: #4A90E2;
  color: white;
}

.button-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.start-button {
  background-color: #4A90E2;
  color: white;
  border: none;
  border-radius: 100px;
  padding: 5px 64px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(74, 144, 226, 0.3);
  margin-bottom: 10px;
}

.start-button:active {
  transform: scale(1.05);
  box-shadow: 0 5px 20px rgba(74, 144, 226, 0.4);
}

.login-button {
  background-color: transparent;
  color: #6e6868;
  font-size: 14px;
  border: 1px solid #d4c8c8;
  margin-top: -13px;
  border-radius: 100px;
  padding: 5px 64px;

}

/* 深色模式样式 */
.dark-mode .welcome-content {
  background-color: #2a2a2a;
}

.dark-mode .welcome-title {
  color: #f0f0f0;
}

.dark-mode .welcome-subtitle {
  color: #bbb;
}

.dark-mode .feature-item {
  background-color: #383838;
}

.dark-mode .feature-title {
  color: #f0f0f0;
}

.dark-mode .feature-desc {
  color: #aaa;
}

.dark-mode .quick-action-chip {
  background-color: #333;
  border-color: #5a9cf0;
  color: #5a9cf0;
}

.dark-mode .quick-action-chip:active {
  background-color: #5a9cf0;
  color: #f0f0f0;
}

.dark-mode .login-button {
  color: #aaa;
}
</style> 