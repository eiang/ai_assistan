<template>
  <view class="login-container">
    <view class="back-button" @tap="goBack">
      <text class="back-icon">←</text>
    </view>
    <view class="login-content">
      <view class="avatar-container">
        <view class="avatar">
          <img alt="svgImg" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICB2aWV3Qm94PSIwIDAgNDggNDgiIHdpZHRoPSI0OHB4IiBoZWlnaHQ9IjQ4cHgiPjxwYXRoIGZpbGw9IiNmZmUwYjIiIGQ9Ik0yNiwxNmMtMTAuNzQ3LDAtMTkuODk5LDMuNC0yNS44NTYsNi4zNzVDMC4wNTEsMjMuMDczLDAsMjMuNzgyLDAsMjQuNUMwLDM1LjI3LDEwLjc0NSw0NCwyNCw0NAlzMjQtOC43MywyNC0xOS41YzAtMS4zNi0wLjE3Mi0yLjY4Ny0wLjQ5OS0zLjk2OUM0MC40NDYsMTcuNTMzLDMzLjIxNywxNiwyNiwxNnoiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMjQsMjMuNjE5Yy0wLjAxNSwzLjc2NywyLjk0OCw3LjIzOSw2LjU3OSw3LjM3NmMzLjU4OCwwLjEzNiw1LjkyOC0zLjA2Niw1LjMyNi02Ljc4NgljLTAuNTQ2LTMuMzctMy4zNjQtNi4wMjItNi4zNjctNi4yMDFDMjYuNTA2LDE3LjgyOSwyNC4wMTQsMjAuMjEzLDI0LDIzLjYxOXoiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMjQsMjMuNjE5YzAuMDE1LDMuNzY3LTIuOTQ0LDcuMjM5LTYuNTcxLDcuMzc2Yy0zLjU4MywwLjEzNi01LjkyMS0zLjA2Ni01LjMxOS02Ljc4NgljMC41NDUtMy4zNywzLjM1OS02LjAyMiw2LjM1OC02LjIwMUMyMS40OTgsMTcuODI5LDIzLjk4NiwyMC4yMTMsMjQsMjMuNjE5eiIvPjxjaXJjbGUgY3g9IjIxIiBjeT0iMjQiIHI9IjEiIGZpbGw9IiMyMTIxMjEiLz48Y2lyY2xlIGN4PSIyOCIgY3k9IjI0IiByPSIxIiBmaWxsPSIjMjEyMTIxIi8+PHBhdGggZmlsbD0iIzIxMjEyMSIgZD0iTTI0Ljc1NCw0MGMtMi43NSwwLTQuNzE5LTEuMTQ4LTQuODAyLTEuMTk3bDEuMDIxLTEuNzIxQzIwLjk4NSwzNy4wODksMjIuNTc1LDM4LDI0Ljc1NCwzOAljMS44MDUsMCwzLjI1My0wLjcyNCwzLjI2OC0wLjczMWwwLjkxMywxLjc4QzI4Ljg2LDM5LjA4NywyNy4wNjEsNDAsMjQuNzU0LDQweiIvPjxwYXRoIGZpbGw9IiMwMDk3YTciIGQ9Ik0wLjM2MSwyMS4xNTFjLTAuMDg2LDAuNDA0LTAuMTU3LDAuODExLTAuMjE0LDEuMjIzQzYuMTA0LDE5LjM5OSwxNS4yNTQsMTYsMjYsMTYJYzcuMjEsMCwxNC40MzMsMS41MzEsMjEuNDgzLDQuNTI0Yy0wLjExMi0wLjQxNi0wLjI0LTAuODI4LTAuMzc5LTEuMjM2Yy0wLjEwMi0wLjA0Mi0wLjIwNC0wLjA3Ni0wLjMwNS0wLjExNwljMC4yMDEsMC4wNjYsMC4zMjcsMC4xMDksMC4zMjcsMC4xMDlDNDQuMzE3LDExLjA0NiwzNS4wMjksNSwyNCw1QzEyLjE1MSw1LDIuMzEsMTEuOTc2LDAuMzU1LDIxLjE0OWMwLDAsMC4wODktMC4wNDIsMC4yNTQtMC4xMTUJQzAuNTI4LDIxLjA3MywwLjQ0MSwyMS4xMTIsMC4zNjEsMjEuMTUxeiIvPjxwYXRoIGZpbGw9IiNmZmVhMDAiIGQ9Ik00Ny43NTIsMjEuNzE1Yy0wLjE0Ni0wLjgyOS0wLjM3OC0xLjYzNS0wLjY0OC0yLjQyN0M0MC4xNzQsMTYuNDU0LDMzLjA4MywxNSwyNiwxNQljLTEwLjU0NCwwLTE5LjU3NywzLjIxMS0yNS42MzksNi4xNTFjLTAuMTY3LDAuNzg1LTAuMjg0LDEuNTg1LTAuMzMyLDIuMzk5QzYuNDEsMjAuMjgzLDE1LjQ0NiwxNywyNiwxNwlDMzQuNTYxLDE3LDQyLjAxNywxOS4yLDQ3Ljc1MiwyMS43MTV6Ii8+PHBvbHlnb24gZmlsbD0iI2ZmZWEwMCIgcG9pbnRzPSIxNiw2LjExIDE2LjgyNiw0LjQwOCAxOCw0IDIwLDMgMjMsMyAyNCwyIDI2LjA2MSwyLjM0NCAyNy41LDMuNSAyOS41LDQgMzAsNS42MTQgMjksNi41IDI3LDYgMjYsNyAyNC41LDcgMjMsNiAyMC41LDcgMjAsNS41IDE4LjUsNyAxNi41LDciLz48L3N2Zz4="/>
        </view>
      </view>
      <text class="welcome-text">欢迎使用AI聊天助手</text>
      
      <button class="login-btn" @click="handleWechatLogin">
        <tui-icon name="wechat" size="18" color="white" style="margin-right: 8px;"></tui-icon>
        <text class="btn-text">微信授权登录</text>
      </button>
      
      <text class="privacy-tip">我们不会获取您的敏感信息</text>
      <text class="app-info">AI聊天助手 v1.0</text>
    </view>
  </view>
</template>

<script>
import tuiIcon from "thorui-uni/lib/thorui/tui-icon/tui-icon.vue"
import { authApi } from '../../api/index'

export default {
  components: {
    tuiIcon
  },
  data() {
    return {
      loading: false
    };
  },
  onLoad() {
    // 页面加载时的逻辑
  },
  methods: {
    async handleWechatLogin() {
      if (this.loading) return
      
      this.loading = true
      try {
        console.log('开始微信登录...')
        
        // 获取微信登录code
        const loginRes = await new Promise((resolve, reject) => {
          uni.login({
            provider: 'weixin',
            success: (res) => {
              console.log('获取微信登录code成功:', res)
              resolve(res)
            },
            fail: (err) => {
              console.error('获取微信登录code失败:', err)
              reject(new Error('获取登录凭证失败，请重试'))
            }
          })
        })
        
        if (loginRes.errMsg !== 'login:ok') {
          throw new Error('微信登录失败: ' + loginRes.errMsg)
        }
        
        // 显示加载提示
        uni.showLoading({
          title: '登录中...',
          mask: true
        })
        
        // 调用后端登录接口
        const loginData = {
          code: loginRes.code,
          userInfo: {
            nickName: "微信用户",
            avatarUrl: ""
          }
        }
        
        console.log('发送登录请求:', loginData)
        const res = await authApi.wechatLogin(loginData)
        console.log('登录接口返回:', res)
        
        if (!res || !res.token) {
          throw new Error('登录返回数据格式错误')
        }
        
        // 保存token和用户信息
        uni.setStorageSync('token', res.token)
        
        // 确保用户信息是对象格式
        if (res.userInfo) {
          // 直接存储对象，不需要JSON.stringify
          uni.setStorageSync('userInfo', res.userInfo)
        }
        
        // 隐藏加载提示
        uni.hideLoading()
        
        // 显示登录成功提示
        uni.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 1500
        })
        
        // 延迟跳转，让用户看到成功提示
        setTimeout(() => {
          // 跳转到聊天页面
          uni.reLaunch({
            url: '/pages/chat/chat'
          })
        }, 1500)
      } catch (error) {
        console.error('登录失败:', error)
        // 隐藏加载提示
        uni.hideLoading()
        // 显示错误提示
        uni.showToast({
          title: error.message || '登录失败，请重试',
          icon: 'none',
          duration: 3000
        })
        // 打印详细错误信息
        if (error.response) {
          console.error('错误响应:', error.response)
        }
      } finally {
        this.loading = false
      }
    },
    
    // 返回上一页
    goBack() {
      uni.navigateBack({
        delta: 1
      });
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background-color: #ffffff;
  position: relative;
}

.back-button {
  position: absolute;
  top: 56px;
  left: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
}

.back-icon {
  color: #333;
  font-size: 24px;
  font-weight: bold;
}

.back-button:active {
  background-color: rgba(0, 0, 0, 0.2);
}

.login-content {
  width: 100%;
  max-width: 360px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 30px;
  text-align: center;
}

.avatar-container {
  margin-bottom: 20px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  overflow: hidden;
  box-shadow: 0 2px 6px #ffffff;
}

.fa-user {
  font-size: 40px;
  color: #4A90E2;
}

.welcome-text {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 30px;
  color: #333333;
}

.login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #07C160;
  color: white;
  padding: 0 12px;
  height: 44px;
  border-radius: 4px;
  border: none;
  font-size: 16px;
  font-weight: 500;
  width: 85%;
  margin: 16px auto;
  box-shadow: none;
}

.login-btn:active {
  opacity: 0.9;
  transform: none;
  background-color: #06ae56;
  box-shadow: none;
}

.fa-wechat {
  margin-right: 8px;
  font-size: 18px;
}

.btn-text {
  letter-spacing: 1px;
}

.privacy-tip {
  margin-top: 16px;
  font-size: 12px;
  color: #999;
}

.app-info {
  margin-top: 50px;
  font-size: 14px;
  color: #bbb;
}

/* 深色模式样式 */
.dark-mode .login-content {
  background-color: #333;
}

.dark-mode .welcome-text {
  color: #f0f0f0;
}

.dark-mode .privacy-tip {
  color: #aaa;
}

.dark-mode .app-info {
  color: #888;
}

.dark-mode .avatar {
  background-color: #444;
}

.dark-mode .back-button {
  background-color: rgba(255, 255, 255, 0.1);
}

.dark-mode .back-icon {
  color: #f0f0f0;
}
</style>