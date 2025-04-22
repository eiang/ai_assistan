<template>
  <view class="chat-container">
    <!-- 顶部导航栏 -->
    <view class="chat-header">
      <view class="back-btn" @click="goBack">
        <tui-icon name="arrowleft"></tui-icon>
      </view>
      <view class="chat-title">AI 聊天助手</view>
      <view class="chat-settings" @click="goToSettings">
        <tui-icon name="setup"></tui-icon>
      </view>
    </view>
    
    <!-- 聊天内容区域 -->
    <scroll-view 
      class="chat-content" 
      scroll-y 
      :scroll-top="scrollTop"
      scroll-with-animation
      @scrolltolower="loadMoreMessages"
      :style="{ height: contentHeight + 'px' }"
      :scroll-into-view="scrollToView"
    >
      <!-- 日期分割线 -->
      <view class="day-divider">{{currentDate}}</view>
      
      <!-- 消息列表 -->
      <block v-for="(message, index) in messageList" :key="index">
        <!-- AI消息 -->
        <view :id="'msg-' + index" class="message-container ai" v-if="message.type === 'ai'">
          <view class="message-row">
            <view class="message-avatar">
              <img alt="svgImg" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICB2aWV3Qm94PSIwIDAgNDggNDgiIHdpZHRoPSI0OHB4IiBoZWlnaHQ9IjQ4cHgiPjxwYXRoIGZpbGw9IiNmZmUwYjIiIGQ9Ik0yNiwxNmMtMTAuNzQ3LDAtMTkuODk5LDMuNC0yNS44NTYsNi4zNzVDMC4wNTEsMjMuMDczLDAsMjMuNzgyLDAsMjQuNUMwLDM1LjI3LDEwLjc0NSw0NCwyNCw0NAlzMjQtOC43MywyNC0xOS41YzAtMS4zNi0wLjE3Mi0yLjY4Ny0wLjQ5OS0zLjk2OUM0MC40NDYsMTcuNTMzLDMzLjIxNywxNiwyNiwxNnoiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMjQsMjMuNjE5Yy0wLjAxNSwzLjc2NywyLjk0OCw3LjIzOSw2LjU3OSw3LjM3NmMzLjU4OCwwLjEzNiw1LjkyOC0zLjA2Niw1LjMyNi02Ljc4NgljLTAuNTQ2LTMuMzctMy4zNjQtNi4wMjItNi4zNjctNi4yMDFDMjYuNTA2LDE3LjgyOSwyNC4wMTQsMjAuMjEzLDI0LDIzLjYxOXoiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMjQsMjMuNjE5YzAuMDE1LDMuNzY3LTIuOTQ0LDcuMjM5LTYuNTcxLDcuMzc2Yy0zLjU4MywwLjEzNi01LjkyMS0zLjA2Ni01LjMxOS02Ljc4NgljMC41NDUtMy4zNywzLjM1OS02LjAyMiw2LjM1OC02LjIwMUMyMS40OTgsMTcuODI5LDIzLjk4NiwyMC4yMTMsMjQsMjMuNjE5eiIvPjxjaXJjbGUgY3g9IjIxIiBjeT0iMjQiIHI9IjEiIGZpbGw9IiMyMTIxMjEiLz48Y2lyY2xlIGN4PSIyOCIgY3k9IjI0IiByPSIxIiBmaWxsPSIjMjEyMTIxIi8+PHBhdGggZmlsbD0iIzIxMjEyMSIgZD0iTTI0Ljc1NCw0MGMtMi43NSwwLTQuNzE5LTEuMTQ4LTQuODAyLTEuMTk3bDEuMDIxLTEuNzIxQzIwLjk4NSwzNy4wODksMjIuNTc1LDM4LDI0Ljc1NCwzOAljMS44MDUsMCwzLjI1My0wLjcyNCwzLjI2OC0wLjczMWwwLjkxMywxLjc4QzI4Ljg2LDM5LjA4NywyNy4wNjEsNDAsMjQuNzU0LDQweiIvPjxwYXRoIGZpbGw9IiMwMDk3YTciIGQ9Ik0wLjM2MSwyMS4xNTFjLTAuMDg2LDAuNDA0LTAuMTU3LDAuODExLTAuMjE0LDEuMjIzQzYuMTA0LDE5LjM5OSwxNS4yNTQsMTYsMjYsMTYJYzcuMjEsMCwxNC40MzMsMS41MzEsMjEuNDgzLDQuNTI0Yy0wLjExMi0wLjQxNi0wLjI0LTAuODI4LTAuMzc5LTEuMjM2Yy0wLjEwMi0wLjA0Mi0wLjIwNC0wLjA3Ni0wLjMwNS0wLjExNwljMC4yMDEsMC4wNjYsMC4zMjcsMC4xMDksMC4zMjcsMC4xMDlDNDQuMzE3LDExLjA0NiwzNS4wMjksNSwyNCw1QzEyLjE1MSw1LDIuMzEsMTEuOTc2LDAuMzU1LDIxLjE0OWMwLDAsMC4wODktMC4wNDIsMC4yNTQtMC4xMTUJQzAuNTI4LDIxLjA3MywwLjQ0MSwyMS4xMTIsMC4zNjEsMjEuMTUxeiIvPjxwYXRoIGZpbGw9IiNmZmVhMDAiIGQ9Ik00Ny43NTIsMjEuNzE1Yy0wLjE0Ni0wLjgyOS0wLjM3OC0xLjYzNS0wLjY0OC0yLjQyN0M0MC4xNzQsMTYuNDU0LDMzLjA4MywxNSwyNiwxNQljLTEwLjU0NCwwLTE5LjU3NywzLjIxMS0yNS42MzksNi4xNTFjLTAuMTY3LDAuNzg1LTAuMjg0LDEuNTg1LTAuMzMyLDIuMzk5QzYuNDEsMjAuMjgzLDE1LjQ0NiwxNywyNiwxNwlDMzQuNTYxLDE3LDQyLjAxNywxOS4yLDQ3Ljc1MiwyMS43MTV6Ii8+PHBvbHlnb24gZmlsbD0iI2ZmZWEwMCIgcG9pbnRzPSIxNiw2LjExIDE2LjgyNiw0LjQwOCAxOCw0IDIwLDMgMjMsMyAyNCwyIDI2LjA2MSwyLjM0NCAyNy41LDMuNSAyOS41LDQgMzAsNS42MTQgMjksNi41IDI3LDYgMjYsNyAyNC41LDcgMjMsNiAyMC41LDcgMjAsNS41IDE4LjUsNyAxNi41LDciLz48L3N2Zz4="/>
            </view>
            <view class="message message-ai" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
              <!-- 文本消息 -->
              <text v-if="!message.isImage" class="ai-message-text">{{message.content}}</text>
              <!-- 图片消息 -->
              <view v-else class="ai-image-container">
                <image 
                  class="ai-generated-image" 
                  :src="message.content" 
                  mode="widthFix" 
                  @click="previewImage(message.content)" 
                  @longpress="saveImage(message.content)"
                />
                <view class="image-hint">点击可查看，长按可保存</view>
              </view>
              <tui-alert :show="showModal" size="30" btnColor="#3b3b3b" btnText="复制" maskClosable="false" @click="copyContent(message.content)" @cancel="hideAlert">
                {{message.content}}
              </tui-alert>
            </view>
          </view>
          <view class="message-time">{{message.time}}</view>
        </view>
        
        <!-- 用户消息 -->
        <view :id="'msg-' + index" class="message-container user" v-else-if="message.type === 'user'">
          <view class="message-row">
            <view class="message-avatar">
              <text class="fa fa-user"></text>
            </view>
            <view class="message message-user">
              <text>{{message.content}}</text>
            </view>
          </view>
          <view class="message-time">{{message.time}}</view>
        </view>
      </block>
      
      <!-- AI思考中状态 -->
      <view class="message-container ai" v-if="isThinking" id="thinking-msg">
        <view class="message-row">
          <view class="message-avatar">
                    <img alt="svgImg" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICB2aWV3Qm94PSIwIDAgNDggNDgiIHdpZHRoPSI0OHB4IiBoZWlnaHQ9IjQ4cHgiPjxwYXRoIGZpbGw9IiNmZmUwYjIiIGQ9Ik0yNiwxNmMtMTAuNzQ3LDAtMTkuODk5LDMuNC0yNS44NTYsNi4zNzVDMC4wNTEsMjMuMDczLDAsMjMuNzgyLDAsMjQuNUMwLDM1LjI3LDEwLjc0NSw0NCwyNCw0NAlzMjQtOC43MywyNC0xOS41YzAtMS4zNi0wLjE3Mi0yLjY4Ny0wLjQ5OS0zLjk2OUM0MC40NDYsMTcuNTMzLDMzLjIxNywxNiwyNiwxNnoiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMjQsMjMuNjE5Yy0wLjAxNSwzLjc2NywyLjk0OCw3LjIzOSw2LjU3OSw3LjM3NmMzLjU4OCwwLjEzNiw1LjkyOC0zLjA2Niw1LjMyNi02Ljc4NgljLTAuNTQ2LTMuMzctMy4zNjQtNi4wMjItNi4zNjctNi4yMDFDMjYuNTA2LDE3LjgyOSwyNC4wMTQsMjAuMjEzLDI0LDIzLjYxOXoiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMjQsMjMuNjE5YzAuMDE1LDMuNzY3LTIuOTQ0LDcuMjM5LTYuNTcxLDcuMzc2Yy0zLjU4MywwLjEzNi01LjkyMS0zLjA2Ni01LjMxOS02Ljc4NgljMC41NDUtMy4zNywzLjM1OS02LjAyMiw2LjM1OC02LjIwMUMyMS40OTgsMTcuODI5LDIzLjk4NiwyMC4yMTMsMjQsMjMuNjE5eiIvPjxjaXJjbGUgY3g9IjIxIiBjeT0iMjQiIHI9IjEiIGZpbGw9IiMyMTIxMjEiLz48Y2lyY2xlIGN4PSIyOCIgY3k9IjI0IiByPSIxIiBmaWxsPSIjMjEyMTIxIi8+PHBhdGggZmlsbD0iIzIxMjEyMSIgZD0iTTI0Ljc1NCw0MGMtMi43NSwwLTQuNzE5LTEuMTQ4LTQuODAyLTEuMTk3bDEuMDIxLTEuNzIxQzIwLjk4NSwzNy4wODksMjIuNTc1LDM4LDI0Ljc1NCwzOAljMS44MDUsMCwzLjI1My0wLjcyNCwzLjI2OC0wLjczMWwwLjkxMywxLjc4QzI4Ljg2LDM5LjA4NywyNy4wNjEsNDAsMjQuNzU0LDQweiIvPjxwYXRoIGZpbGw9IiMwMDk3YTciIGQ9Ik0wLjM2MSwyMS4xNTFjLTAuMDg2LDAuNDA0LTAuMTU3LDAuODExLTAuMjE0LDEuMjIzQzYuMTA0LDE5LjM5OSwxNS4yNTQsMTYsMjYsMTYJYzcuMjEsMCwxNC40MzMsMS41MzEsMjEuNDgzLDQuNTI0Yy0wLjExMi0wLjQxNi0wLjI0LTAuODI4LTAuMzc5LTEuMjM2Yy0wLjEwMi0wLjA0Mi0wLjIwNC0wLjA3Ni0wLjMwNS0wLjExNwljMC4yMDEsMC4wNjYsMC4zMjcsMC4xMDksMC4zMjcsMC4xMDlDNDQuMzE3LDExLjA0NiwzNS4wMjksNSwyNCw1QzEyLjE1MSw1LDIuMzEsMTEuOTc2LDAuMzU1LDIxLjE0OWMwLDAsMC4wODktMC4wNDIsMC4yNTQtMC4xMTUJQzAuNTI4LDIxLjA3MywwLjQ0MSwyMS4xMTIsMC4zNjEsMjEuMTUxeiIvPjxwYXRoIGZpbGw9IiNmZmVhMDAiIGQ9Ik00Ny43NTIsMjEuNzE1Yy0wLjE0Ni0wLjgyOS0wLjM3OC0xLjYzNS0wLjY0OC0yLjQyN0M0MC4xNzQsMTYuNDU0LDMzLjA4MywxNSwyNiwxNQljLTEwLjU0NCwwLTE5LjU3NywzLjIxMS0yNS42MzksNi4xNTFjLTAuMTY3LDAuNzg1LTAuMjg0LDEuNTg1LTAuMzMyLDIuMzk5QzYuNDEsMjAuMjgzLDE1LjQ0NiwxNywyNiwxNwlDMzQuNTYxLDE3LDQyLjAxNywxOS4yLDQ3Ljc1MiwyMS43MTV6Ii8+PHBvbHlnb24gZmlsbD0iI2ZmZWEwMCIgcG9pbnRzPSIxNiw2LjExIDE2LjgyNiw0LjQwOCAxOCw0IDIwLDMgMjMsMyAyNCwyIDI2LjA2MSwyLjM0NCAyNy41LDMuNSAyOS41LDQgMzAsNS42MTQgMjksNi41IDI3LDYgMjYsNyAyNC41LDcgMjMsNiAyMC41LDcgMjAsNS41IDE4LjUsNyAxNi41LDciLz48L3N2Zz4="/>
          </view>
          <view class="message message-ai thinking">
            <text>正在思考</text>
            <view class="loading-dots">
              <view class="dot"></view>
              <view class="dot"></view>
              <view class="dot"></view>
            </view>
          </view>
        </view>
        <view class="message-time">{{currentTime}}</view>
      </view>
      
      <!-- 底部安全区域 - 防止内容被底部输入栏遮挡 -->
      <view class="safe-bottom-area"></view>
    </scroll-view>
    
    <!-- 底部输入区域 -->
    <view 
      class="chat-bottom" 
      :class="{'keyboard-active': isKeyboardShow}"
      :style="{ transform: isKeyboardShow ? 'translateY(-' + keyboardHeight + 'px)' : 'translateY(0)' }"
    >
      <!-- 提示词区域 -->
      <view class="suggestion-area" v-show="showSuggestions">
        <view class="suggestion-title">你可以这样问我</view>
        <view class="suggestion-chips">
          <view 
            class="suggestion-chip" 
            v-for="(suggestion, idx) in suggestions" 
            :key="idx"
            @tap="useSuggestion(suggestion)"
          >
            {{suggestion}}
          </view>
        </view>
        <view class="ai-intro">
          <text class="intro-title">友情提示：</text>
          <text class="intro-content">我是一个智能AI助手，可以回答问题、提供信息、写作、规划行程、提供建议等。我会不断学习和改进，为您提供更好的服务体验。请注意，我偶尔可能会出现错误，对于专业领域的问题请谨慎参考。</text>
        </view>
      </view>
      
      <!-- 输入框区域 -->
      <view class="chat-input-area">
        <!-- 模式切换按钮区域 -->
        <view class="input-mode-toggle">
          <view class="mode-indicator">
            <text class="mode-label">当前模式:</text>
            <tui-tag 
              size="small" 
              padding="6px 10px" 
              :type="isText2Pic ? 'light-blue' : 'gray'" 
              @click="toggleVoiceInput"
            >
              <view class="toggle-mode">
                <tui-icon :name="isText2Pic ? 'picture' : 'strategy'" :size="16"></tui-icon>
                <text>{{isText2Pic ? '图像生成' : '文本对话'}}</text>
              </view>
            </tui-tag>
          </view>
        </view>
        
        <!-- 输入框和发送按钮区域 -->
        <view class="input-send-area">
          <textarea 
            class="chat-input" 
            v-model="inputMessage" 
            placeholder="输入消息..." 
            :auto-height="true"
            :cursor-spacing="8"
            :show-confirm-bar="false"
            :adjust-position="false"
            @input="adjustInputHeight"
            @focus="onInputFocus"
            @blur="onInputBlur"
            @keyboardheightchange="onKeyboardHeightChange"
            :maxlength="-1"
            confirm-type="return"
            :confirm-hold="true"
          />
          <view class="send-btn-area">
            <view class="chat-btn send-btn" @tap="sendMessage" :class="{'btn-active': inputMessage.trim().length > 0}">
              <tui-icon name="send" :color="inputMessage.trim().length > 0 ? '#4A90E2' : '#999'"></tui-icon>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 录音中提示框 -->
    <!-- <view class="recording-hint" v-if="isText2Pic">
      正在录音...
    </view> -->
  </view>
</template>

<script>
import { checkLoginStatus } from '@/utils/auth'
import request from '@/utils/request'
import envConfig from '@/utils/env-config'

export default {
  data() {
    return {
      messageList: [],
      inputMessage: '',
      scrollTop: 0,
      scrollToView: '',
      contentHeight: 500, // 会在onLoad中计算
      showSuggestions: true,
      isThinking: false,
      isText2Pic: false,
      isKeyboardShow: false,
      keyboardHeight: 0,
      baseUrl: '',
      // 当前日期和时间
      currentDate: '今天 ' + this.formatTime(new Date()),
      currentTime: this.formatTime(new Date()),
      
      // 示例提示词
      suggestions: [
        '帮我写一封邮件',
        '如何提高英语口语水平？',
        '今天北京天气怎么样？',
        '帮我规划一次旅行',
        '你能做什么？'
      ],
      
      // 用户信息
      userInfo: {
        nickName: '游客',
        avatar: '',
        openid: 'guest_' + Math.random().toString(36).substr(2, 10)
      },
      
      // 底部输入区域高度
      bottomHeight: 130,

      lastTapTime: 0,
      showModal: false,
    };
  },
  
  onLoad() {
    // 从环境配置中获取API基础URL
    this.baseUrl = envConfig.API_BASE_URL;
    console.log('从配置文件加载API基础URL:', this.baseUrl);
    
    // 如果配置中没有找到，则尝试从App全局变量获取
    if (!this.baseUrl) {
      const app = getApp();
      this.baseUrl = app.globalData.apiBaseUrl;
      console.log('从App全局变量获取API基础URL:', this.baseUrl);
    }
    
    // 确保baseUrl有值，设置最终的默认值
    if (!this.baseUrl) {
      this.baseUrl = 'http://localhost:8000';
      console.warn('API基础URL未在配置中找到，使用默认值:', this.baseUrl);
    }
    
    // 检查登录状态
    this.checkLoginStatus();
    
    // 获取预设问题
    const app = getApp();
    const globalData = app.globalData;
    if (globalData && globalData.presetQuestion) {
      // 设置输入内容
      this.inputMessage = globalData.presetQuestion;
      // 自动发送消息
      this.$nextTick(() => {
        this.sendMessage();
      });
      // 清除预设问题
      globalData.presetQuestion = '';
    }

    // 检查用户信息，如果没有则使用默认值
    try {
      const userInfoData = uni.getStorageSync('userInfo');
      if (userInfoData) {
        // 检查是否需要解析
        if (typeof userInfoData === 'string') {
          try {
            this.userInfo = JSON.parse(userInfoData);
          } catch (e) {
            console.error('解析用户信息字符串失败', e);
            this.userInfo = {
              nickName: '游客',
              avatar: '',
              openid: 'guest_' + Math.random().toString(36).substr(2, 10)
            };
          }
        } else {
          // 已经是对象，直接使用
          this.userInfo = userInfoData;
        }
      } else {
        // 未登录用户使用默认信息
        this.userInfo = {
          nickName: '游客',
          avatar: '',
          openid: 'guest_' + Math.random().toString(36).substr(2, 10)
        };
        console.log('用户未登录，使用游客模式');
      }
    } catch (e) {
      console.error('获取用户信息失败', e);
      // 使用默认用户信息
      this.userInfo = {
        nickName: '游客',
        avatar: '',
        openid: 'guest_' + Math.random().toString(36).substr(2, 10)
      };
    }
    
    // 计算内容区域高度
    const systemInfo = uni.getSystemInfoSync();
    // 计算底部输入区域的高度
    const query = uni.createSelectorQuery().in(this);
    
    // 延迟计算以确保DOM已渲染
    setTimeout(() => {
      query.select('.chat-bottom').boundingClientRect();
      query.select('.chat-header').boundingClientRect();
      query.exec(res => {
        if (res && res[0] && res[1]) {
          this.bottomHeight = res[0].height || 130;
          const headerHeight = res[1].height || 50;
          
          // 计算内容区域高度 = 屏幕高度 - 导航栏高度 - 底部输入区域高度
          this.contentHeight = systemInfo.windowHeight - headerHeight - this.bottomHeight;
          console.log('计算高度：', this.contentHeight, '底部高度：', this.bottomHeight);
        } else {
          // 如果获取失败，使用默认值
          this.contentHeight = systemInfo.windowHeight - 180; // 默认值
        }
      });
    }, 100);
    
    // 初始化示例消息
    this.initMessages();
  },
  
  onReady() {
    // 页面加载完成后，滚动到底部
    this.scrollToBottom();
  },
  
  // 每次页面显示时检查登录状态
  onShow() {
    // 检查登录状态
    this.checkLoginStatus();
  },
  
  methods: {
    // 检查登录状态
    checkLoginStatus() {
      // 使用工具函数检查登录状态
      const isLoggedIn = checkLoginStatus();
      
      if (!isLoggedIn) {
        uni.showToast({
          title: '登录已过期，请重新登录',
          icon: 'none',
          duration: 2000
        });
        
        // 延迟跳转到登录页面
        setTimeout(() => {
          uni.redirectTo({
            url: '/pages/index/index'
          });
        }, 2000);
      }
    },
  	hideAlert() {
 		this.showModal = false
 	  },
    handleTouchStart(e) {
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - this.lastTapTime;
      if (timeDiff < 300 && timeDiff > 0) {
        this.showModal = true;
      }
      this.lastTapTime = currentTime;
    },
    handleTouchEnd() {
      // 这里可以处理手势结束，如果有需要
    },
    copyContent(message) {
      uni.setClipboardData({
        data: message,
        success: () => {
          uni.showToast({
            title: '复制成功',
            icon: 'success'
          });
          this.showModal = false;
        }
      });
    },

    /**
     * 监听键盘高度变化
     */
    onKeyboardHeightChange(e) {
      const height = e.detail.height;
      console.log('键盘高度变化：', height);
      
      if (height > 0) {
        // 键盘弹出
        this.keyboardHeight = height;
        this.isKeyboardShow = true;
      } else {
        // 键盘收起
        this.isKeyboardShow = false;
      }
      
      // 滚动到底部
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    
    /**
     * 输入框获取焦点
     */
    onInputFocus() {
      this.showSuggestions = false;
      
      // 滚动到底部，延迟执行确保在键盘弹出后滚动
      setTimeout(() => {
        this.scrollToBottom();
      }, 300);
    },
    
    /**
     * 输入框失去焦点
     */
    onInputBlur() {
      // 当键盘收起时，延迟一点时间再重置，防止闪烁
      setTimeout(() => {
        this.isKeyboardShow = false;
        
        if (this.messageList.length <= 1 && !this.inputMessage) {
          this.showSuggestions = true;
        }
      }, 100);
    },
    
    /**
     * 初始化示例聊天消息
     */
    initMessages() {
      const now = new Date();
      const timeStr = this.formatTime(now);
      
      this.messageList = [
        {
          type: 'ai',
          content: '你好！我是你的AI聊天助手，有什么我可以帮助你的吗？',
          time: timeStr
        }
      ];
    },
    
    /**
     * 发送消息
     */
    sendMessage() {

      if (!this.inputMessage.trim()) return;
      
      // 获取当前时间
      const now = new Date();
      const timeStr = this.formatTime(now);
      
      // 添加用户消息
      this.messageList.push({
        type: 'user',
        content: this.inputMessage,
        time: timeStr
      });
      
      // 清空输入框
      const message = this.inputMessage;
      this.inputMessage = '';
      
      // 显示思考状态
      this.isThinking = true;
      this.showSuggestions = false;
      
      // 滚动到底部
      this.$nextTick(() => {
        // 设置滚动到思考消息
        this.scrollToView = 'thinking-msg';
        
        // 300ms后再次尝试滚动
        setTimeout(() => {
          this.scrollToBottom();
        }, 300);
      });
      
      // 调用AI响应函数
      if(!this.isText2Pic){
        // 调用AI生成文字方法
        this.getAiResponse(message).then(response => {
        
        // 添加AI回复
        this.messageList.push({
          type: 'ai',
          content: response,
          isImage: false,
          time: this.formatTime(new Date())
        });
        
        // 滚动到底部
        this.$nextTick(() => {
          // 设置滚动到最新消息
          this.scrollToView = 'msg-' + (this.messageList.length - 1);
          
          // 额外的滚动保障
          setTimeout(() => {
            this.scrollToBottom();
          }, 300);
          
          setTimeout(() => {
            this.scrollToBottom();
          }, 600);
        });
      }).catch(error => {
        this.isThinking = false;
        console.error('AI响应错误:', error);
        
        // 添加错误消息
        this.messageList.push({
          type: 'ai',
          content: '抱歉，出现了一些问题，请稍后再试。',
          isImage: false,
          time: this.formatTime(new Date())
        });
        
        // 滚动到底部
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }).finally(() => {
        this.isThinking = false;
      });
      }else{
        // 调用文生图方法
        this.getText2ImageResponse(message).then(response => {
          console.log('文生图AI响应:', response);
          
          try {
            // 解析响应数据以获取图片URL
            let imageUrl = '';
            
            if (response && response.result) {
              // 解析嵌套的JSON字符串
              const resultData = typeof response.result === 'string' 
                ? JSON.parse(response.result) 
                : response.result;
              
              console.log('解析后的图片数据:', resultData);
              
              if (resultData.success && resultData.data && resultData.data.length > 0) {
                imageUrl = resultData.data[0].image_url;
                console.log('获取到的图片URL:', imageUrl);
              }
            }
            
            if (imageUrl) {
              // 添加AI回复-图片消息
              this.messageList.push({
                type: 'ai',
                content: imageUrl,
                isImage: true,
                time: this.formatTime(new Date())
              });
            } else {
              // 如果未找到图片URL，显示错误消息
              this.messageList.push({
                type: 'ai',
                content: '抱歉，图片生成失败，请稍后再试。',
                isImage: false,
                time: this.formatTime(new Date())
              });
            }
          } catch (e) {
            console.error('处理图片响应出错:', e);
            this.messageList.push({
              type: 'ai',
              content: '抱歉，处理图片响应时出错，请稍后再试。',
              isImage: false,
              time: this.formatTime(new Date())
            });
          }
          
          // 滚动到底部
          this.$nextTick(() => {
            this.scrollToView = 'msg-' + (this.messageList.length - 1);
            setTimeout(() => {
              this.scrollToBottom();
            }, 300);
          });
        }).catch(error => {
          console.error('文生图AI响应错误:', error);
          this.messageList.push({
            type: 'ai',
            content: '抱歉，图片生成失败，请稍后再试。',
            isImage: false,
            time: this.formatTime(new Date())
          });
          
          // 滚动到底部
          this.$nextTick(() => {
            this.scrollToBottom();
          });
        }).finally(() => {
          this.isThinking = false;
        });
      }
    },
    
    /**
     * AI的响应生成函数
     */
    getAiResponse(userMessage) {
        // 返回一个 Promise 对象
        return new Promise((resolve, reject) => {
          console.log('请求AI回复，使用配置的baseUrl:', this.baseUrl);
          
          request.get('/chat/chatAi', { message: userMessage }, {
            loading: false, // 不显示loading，因为我们有自己的加载状态
          }).then(response => {
            console.log('AI响应数据:', response);
            resolve(response);
          }).catch(error => {
            console.error('AI请求失败:', error);
            const errorMsg = error.message || '获取AI回复失败';
            uni.showToast({
              title: errorMsg,
              icon: 'none'
            });
            resolve('抱歉，我现在无法回答您的问题。请稍后再试。');
          });
        });
    },

    /*
     * 调用后端文生图api
     */
    getText2ImageResponse(userMessage) {
      return new Promise((resolve, reject) => {
        console.log('请求生成图片，使用配置的baseUrl:', this.baseUrl);
        
        request.get('/chat/text2imagewithdeepseek', { message: userMessage }, {
          loading: false, // 不显示loading，因为我们有自己的加载状态
          resInterceptor: (response) => {
            // 自定义响应拦截器，直接返回原始响应数据
            if (response.statusCode === 200) {
              return response.data;
            } else {
              uni.showToast({
                title: '生成图片失败',
                icon: 'none'
              });
              return Promise.reject({
                code: response.statusCode,
                message: '生成图片失败'
              });
            }
          }
        }).then(response => {
          console.log('图片生成响应:', response);
          resolve(response);
        }).catch(error => {
          console.error('图片生成请求失败:', error);
          reject(error);
        });
      });
    },
      
     
    /**
     * 将时间格式化为 HH:MM 格式
     */
    formatTime(date) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    },
    
    /**
     * 滚动到聊天底部
     */
    scrollToBottom() {
      // 计算滚动区域的高度
      const query = uni.createSelectorQuery().in(this);
      query.select('.chat-content').boundingClientRect();
      query.exec(res => {
        if (res && res[0]) {
          // 设置滚动到最新消息，并预留底部空间
          this.scrollTop = 100000;
          
          // 设置滚动到最新消息，并预留底部空间
          if (this.messageList.length > 0) {
            this.scrollToView = 'msg-' + (this.messageList.length - 1);
          }
          
          // 强制更新DOM
          this.$forceUpdate();
        }
      });
    },
    
    /**
     * 加载更多历史消息（上拉加载）
     */
    loadMoreMessages() {
      // 真实场景中，这里会调用API加载更多历史消息
      console.log('加载更多历史消息');
    },
    
    /**
     * 使用提示词
     */
    useSuggestion(suggestion) {
      this.inputMessage = suggestion;
      this.sendMessage();
    },
    
    /**
     * 调整输入框高度
     */
    adjustInputHeight(e) {
      // 输入框高度自适应
    },
    
    /**
     * 切换语音输入
     */
    toggleVoiceInput() {
      this.isText2Pic = !this.isText2Pic;
      
      if (this.isText2Pic) {
        uni.showToast({
          title: '已切换到图片生成模式',
          icon: 'none',
          duration: 1500
        });
      } else {
        uni.showToast({
          title: '已切换到文字生成模式',
          icon: 'none',
          duration: 1500
        });
      }
    },
    
    /**
     * 跳转到设置页面
     */
    goToSettings() {
      uni.navigateTo({
        url: '/pages/settings/settings'
      });
    },
    
    /**
     * 返回上一页
     */
    goBack() {
      uni.navigateBack({
        delta: 1
      });
    },
    
    /**
     * 预览图片
     */
    previewImage(url) {
      uni.previewImage({
        urls: [url],
        current: url,
        indicator: 'number',
        loop: false
      });
    },
    
    /**
     * 保存图片
     */
    saveImage(url) {
      uni.showLoading({
        title: '保存中...'
      });
      
      // 下载图片
      uni.downloadFile({
        url: url,
        success: (res) => {
          if (res.statusCode === 200) {
            // 保存图片到相册
            uni.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: () => {
                uni.showToast({
                  title: '保存成功',
                  icon: 'success'
                });
              },
              fail: (err) => {
                console.error('保存图片失败', err);
                uni.showToast({
                  title: '保存失败',
                  icon: 'none'
                });
              }
            });
          } else {
            uni.showToast({
              title: '下载失败',
              icon: 'none'
            });
          }
        },
        fail: (err) => {
          console.error('下载图片失败', err);
          uni.showToast({
            title: '下载失败',
            icon: 'none'
          });
        },
        complete: () => {
          uni.hideLoading();
        }
      });
    },
  }
};
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
  background-color: var(--light-gray);
  overflow: hidden; /* 防止内容溢出 */
}

/* 顶部导航栏 */
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--primary-color);
  color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  height: 30px;
}

.back-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--primary-color);
  transition: all 0.2s ease;
}

.back-btn:active {
  background-color: rgba(255, 255, 255, 0.3);
}

.chat-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
}

.chat-settings {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--primary-color);
  transition: all 0.2s ease;
}

.chat-settings:active {
  background-color: rgba(255, 255, 255, 0.3);
}

/* 聊天内容区域 */
.chat-content {
  flex: 1;
  background-color: var(--light-gray);
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  position: relative;
  padding-bottom: 20px; /* 添加底部padding，确保时间显示完整 */
}

.day-divider {
  text-align: center;
  color: var(--text-light);
  font-size: var(--font-size-xs);
  margin: var(--spacing-lg) 0;
  position: relative;
}

.day-divider::before,
.day-divider::after {
  content: "";
  position: absolute;
  height: 1px;
  background-color: var(--border-color);
  top: 50%;
  width: calc(50% - 50px);
}

.day-divider::before {
  left: 0;
}

.day-divider::after {
  right: 0;
}
.tui-alert-mask {
  background-color: rgba(0, 0, 0, 0.1);
}
/* 消息容器 */
.message-container {
  display: flex;
  flex-direction: column;
  margin-bottom: var(--spacing-lg);
  max-width: 95%;
  width: 100%; /* 确保容器有足够宽度 */
}

.message-container.ai {
  align-items: flex-start;
  margin-right: auto;
}

.message-container.user {
  align-items: flex-end;
  margin-left: auto;
}

.message-row {
  display: flex;
  align-items: flex-start; /* 改为从顶部对齐 */
  gap: var(--spacing-sm);
  width: 100%; /* 确保行宽度充足 */
  position: relative; /* 添加相对定位 */
  margin-bottom: 4px; /* 增加消息行间距 */
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background-color: var(--light-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-light);
  z-index: 1; /* 确保在其他元素上方 */
  position: relative; /* 添加相对定位 */
}

.message-container.user .message-row {
  flex-direction: row-reverse;
}

.message-container.user .message-avatar {
  background-color: var(--primary-color);
}

.message-container.user .message-avatar text {
  color: white;
}

.message {
  max-width: 66%;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  position: relative;
  word-break: break-word;
  font-size: var(--font-size-md);
  line-height: 1.5;
  box-shadow: 8px 8px 8px 0 rgba(0, 0, 0, 0.08), -8px -8px 12px 0 rgba(255, 255, 255, 0.3);
  margin-top: 0; /* 确保没有顶部边距 */
}

.message-time {
  font-size: var(--font-size-xs);
  color: var(--text-light);
  margin: var(--spacing-xs) var(--spacing-sm);
  line-height: 1;
  clear: both; /* 确保时间显示不受浮动影响 */
  border: 1px;
}

.message-ai {
  background-color: white;
  border-bottom-left-radius: 4px;
  color: var(--text-color);
  padding: var(--spacing-md) var(--spacing-lg);
  word-break: break-word;
}

/* Markdown内容样式调整 */
.message-ai :deep(.markdown-content) {
  min-width: 100%;
  font-size: var(--font-size-md);
  line-height: 1.5;
}

/* 代码块样式增强 */
.message-ai :deep(.md-pre) {
  margin: 10rpx 0;
  border-radius: 8rpx;
}

/* 表格样式优化 */
.message-ai :deep(.md-table) {
  max-width: 100%;
  overflow-x: auto;
}

/* 列表样式增强 */
.message-ai :deep(.md-ul), .message-ai :deep(.md-ol) {
  padding-left: 20rpx;
}

.message-user {
  background-color: var(--primary-color);
  color: white;
  border-bottom-right-radius: 4px;

}

/* 底部输入区域 */
.chat-bottom {
  background-color: white;
  border-top: 1px solid var(--border-color);
  position: fixed; /* 固定定位 */
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100; /* 确保在最上层 */
  width: 100%;
  transform: translateY(0); /* 初始位置 */
  transition: transform 0.25s ease-out; /* 控制动画时间和曲线，使其更贴近键盘动画 */
  will-change: transform; /* 优化性能 */
  padding-bottom: env(safe-area-inset-bottom, 0px); /* 适配安全区 */
  box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.05); /* 添加微妙阴影 */
}

/* 键盘激活时的样式 */
.chat-bottom.keyboard-active {
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1); /* 添加阴影效果，增强视觉分离 */
  background-color: #fafafa; /* 轻微改变背景色 */
}

.chat-input-area {
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 10px;
  max-width: 960px; /* 设置最大宽度，让在大屏上的显示更好 */
  margin: 0 auto; /* 居中显示 */
}

/* 模式切换区域 */
.input-mode-toggle {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 6px;
  padding: 0 4px;
}

.mode-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mode-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

/* 输入框和发送按钮区域 */
.input-send-area {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  position: relative;
  border: 1px solid var(--border-color);
  border-radius: 18px; /* 增加圆角使其更加圆润 */
  background-color: #fff;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  overflow: hidden; /* 防止内容溢出圆角 */
  margin: 0 2px; /* 增加两侧边距 */
}

.input-send-area:focus-within {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-focus);
}

.chat-input {
  flex: 1;
  border: none;
  border-radius: var(--border-radius-lg);
  padding: 12px 16px; /* 固定内边距，确保一致性 */
  padding-right: 50px; /* 为发送按钮留出空间 */
  font-size: var(--font-size-md);
  background-color: transparent;
  min-height: 44px;
  max-height: 120px;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  line-height: 1.5; /* 增加行高，让多行文本间距更合理 */
}

/* 发送按钮区域 */
.send-btn-area {
  position: absolute;
  right: 8px; /* 调整右侧边距 */
  bottom: 3px; /* 调整底部边距 */
}

.chat-btn.send-btn {
  width: 38px;
  height: 38px;
  background-color: #ffffff;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease-in-out;
}

.chat-btn.send-btn.btn-active {
  transform: scale(1.05);
}

.recording-hint {
  position: fixed;
  bottom: calc(70px + env(safe-area-inset-bottom, 0px));
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-sm);
  z-index: 100;
}

/* 提示词区域 */
.suggestion-area {
  padding: var(--spacing-lg);
  background-color: rgba(249, 249, 249, 0.95);
  border-bottom: 1px solid var(--border-color);
}

.suggestion-title {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
  font-weight: 500;
}

.suggestion-chips {
  display: flex;
  flex-wrap: nowrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.suggestion-chips::-webkit-scrollbar {
  display: none;
}

.suggestion-chip {
  background-color: rgb(255, 255, 255);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: var(--font-size-sm);
  color: #4b90e2;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.suggestion-chip:active {
  background-color: var(--primary-light);
  color: white;
  border-color: var(--primary-light);
}

.ai-intro {
  background-color: rgba(74, 144, 226, 0.08);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.5;
}

.intro-title {
  color: var(--primary-color);
  font-weight: 600;
}

/* AI思考中动效 */
.thinking {
  display: flex;
  align-items: center;
}

.loading-dots {
  display: flex;
  align-items: center;
  margin-left: var(--spacing-sm);
}

.dot {
  width: 6px;
  height: 6px;
  margin: 0 2px;
  background-color: var(--primary-color);
  border-radius: 50%;
  display: inline-block;
  animation: dot-pulse 1.5s infinite ease-in-out;
}

.dot:nth-child(1) {
  animation-delay: 0s;
}

.dot:nth-child(2) {
  animation-delay: 0.3s;
}

.dot:nth-child(3) {
  animation-delay: 0.6s;
}

@keyframes dot-pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
}

/* 底部安全区域 - 防止内容被底部遮挡 */
.safe-bottom-area {
  height: calc(50px + env(safe-area-inset-bottom, 0px));
  width: 100%;
  margin-bottom: 10px;
}

/* 响应式样式调整 */
@media screen and (max-width: 375px) {
  .chat-header {
    padding: var(--spacing-sm) var(--spacing-md);
    height: 44px;
  }
  
  .back-btn, .chat-settings {
    width: 32px;
    height: 32px;
  }
  
  .chat-content {
    padding: var(--spacing-md);
  }
  
  .message {
    max-width: 85%;
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-sm);
  }
  
  .message-avatar {
    width: 32px; /* 在小屏幕上略微减小头像尺寸 */
    height: 32px;
  }
  
  .chat-input-area {
    padding: var(--spacing-sm) var(--spacing-md);
    gap: 8px;
  }
  
  .input-mode-toggle {
    margin-bottom: 4px;
  }
  
  .mode-label {
    font-size: 10px;
  }
  
  .chat-input {
    padding: 8px 10px;
    padding-right: 40px;
    min-height: 38px;
  }
  
  .send-btn-area {
    right: 3px;
    bottom: 1px;
  }
  
  .chat-btn.send-btn {
    width: 34px;
    height: 34px;
  }
  
  .suggestion-chip {
    padding: 3px var(--spacing-sm);
  }
}

.ai-message-text {
  white-space: pre-wrap;
  word-break: break-word;
  font-size: var(--font-size-md);
  line-height: 1.5;
}

/* 图片消息样式 */
.ai-image-container {
  width: 100%;
  position: relative;
}

.ai-generated-image {
  width: 100%;
  height: auto;
  border-radius: 8rpx;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.image-hint {
  color: #999;
  font-size: 24rpx;
  text-align: center;
  margin-top: 10rpx;
}

/* 修改消息气泡样式以适应图片 */
.message-ai {
  max-width: 65vw;
  padding: var(--spacing-sm);
}

/* 保持文本消息的原有内边距 */
.message-ai .ai-message-text {
  padding: var(--spacing-sm) var(--spacing-md);
}

/* 模式切换按钮样式 */
.toggle-mode {
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}
</style>
