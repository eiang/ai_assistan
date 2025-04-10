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
            <view class="message message-ai">
              <text>{{message.content}}</text>
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
            <text class="fa fa-robot"></text>
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
      <view class="suggestion-area" v-if="showSuggestions">
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
          <text class="intro-title">AI助手介绍：</text>
          <text class="intro-content">我是一个智能AI助手，可以回答问题、提供信息、写作、规划行程、提供建议等。我会不断学习和改进，为您提供更好的服务体验。请注意，我偶尔可能会出现错误，对于专业领域的问题请谨慎参考。</text>
        </view>
      </view>
      
      <!-- 输入框区域 -->
      <view class="chat-input-area">
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
        <view class="chat-actions">
          <view class="chat-btn voice-btn" @tap="toggleVoiceInput">
            <tui-icon :name="isRecording ? 'voice-fill' : 'voice'"></tui-icon>
          </view>
          <view class="chat-btn send-btn" @tap="sendMessage" :class="{'btn-active': inputMessage.trim().length > 0}">
            <tui-icon name="send" :color="inputMessage.trim().length > 0 ? '#4A90E2' : '#999'"></tui-icon>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 录音中提示框 -->
    <view class="recording-hint" v-if="isRecording">
      正在录音...
    </view>
  </view>
</template>

<script>
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
      isRecording: false,
      isKeyboardShow: false,
      keyboardHeight: 0,
      
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
      bottomHeight: 130
    };
  },
  
  onLoad() {
    // 检查用户信息，如果没有则使用默认值
    try {
      const userInfoStr = uni.getStorageSync('userInfo');
      if (userInfoStr) {
        this.userInfo = JSON.parse(userInfoStr);
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
  
  methods: {
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
      
      // 模拟AI响应（实际项目中会调用API）
      setTimeout(() => {
        this.isThinking = false;
        
        // 添加AI回复
        this.messageList.push({
          type: 'ai',
          content: this.getSimpleResponse(message),
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
      }, 1500);
    },
    
    /**
     * 简单的响应生成函数（实际开发中会调用真实API）
     */
    getSimpleResponse(userMessage) {
      // 简单的模拟响应逻辑
      if (userMessage.includes('你好') || userMessage.includes('嗨') || userMessage.includes('hi')) {
        return '你好！很高兴为你服务。我是一个AI助手，你可以问我任何问题。';
      } 
      else if (userMessage.includes('天气')) {
        return '根据您的位置信息，今天天气晴朗，气温22-28°C，微风，适合户外活动。但下午可能有轻微阵雨，建议出门携带雨具。';
      }
      else if (userMessage.includes('邮件')) {
        return '好的，我可以帮你写一封邮件。请问是什么类型的邮件？给谁的？主题是什么？';
      }
      else if (userMessage.includes('旅行') || userMessage.includes('规划')) {
        return '我很乐意帮你规划旅行。请告诉我你想去的目的地、计划的时间和预算，以及你的兴趣爱好，我会为你提供详细的行程建议。';
      } 
      else {
        return '我理解你的问题是关于"' + userMessage + '"。这是一个有趣的话题，你能告诉我更多具体信息吗，这样我能给你提供更准确的帮助。';
      }
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
          // 使用一个足够大的值确保滚动到底部
          this.scrollTop = 100000;
          
          // 设置滚动到最新消息
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
      this.isRecording = !this.isRecording;
      
      if (this.isRecording) {
        // 开始录音
        console.log('开始录音');
        
        // 模拟3秒后自动结束录音
        setTimeout(() => {
          this.isRecording = false;
          // 模拟语音识别结果
          this.inputMessage = '这是一段语音识别的示例文本';
        }, 3000);
      } else {
        // 结束录音
        console.log('结束录音');
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
    }
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
  height: 50px;
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
  max-width: 85%;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  position: relative;
  word-break: break-word;
  font-size: var(--font-size-md);
  line-height: 1.5;
  box-shadow: var(--shadow-light);
  margin-top: 0; /* 确保没有顶部边距 */
}

.message-time {
  font-size: var(--font-size-xs);
  color: var(--text-light);
  margin: var(--spacing-xs) var(--spacing-sm);
  line-height: 1;
  clear: both; /* 确保时间显示不受浮动影响 */
}

.message-ai {
  background-color: white;
  border-bottom-left-radius: 4px;
  color: var(--text-color);
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
}

/* 键盘激活时的样式 */
.chat-bottom.keyboard-active {
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1); /* 添加阴影效果，增强视觉分离 */
}

.chat-input-area {
  padding: var(--spacing-md);
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  position: relative;
}

.chat-input {
  flex: 1;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md) var(--spacing-lg);
  padding-right: 90px; /* 为按钮留出空间 */
  font-size: var(--font-size-md);
  background-color: #fff;
  min-height: 44px;
  max-height: 120px;
  outline: none;
  transition: all 0.3s ease;
  margin-right: 0;
  width: 100%;
  box-sizing: border-box;
}

.chat-input:focus {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-focus);
}

.chat-actions {
  position: absolute;
  right: var(--spacing-md);
  bottom: var(--spacing-md);
  display: flex;
  gap: var(--spacing-sm);
}

.chat-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.chat-btn.send-btn {
  background-color: #ffffff; 
  color: white;
}

.chat-btn.send-btn.btn-active {
  transform: scale(1.05);
}

.chat-btn.voice-btn {
  background-color: var(--light-gray);
  color: var(--text-secondary);
}

.recording-hint {
  position: fixed;
  bottom: 70px;
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
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.suggestion-chip {
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--text-color);
  transition: all 0.2s ease;
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
  height: 50px; /* 提供额外空间防止被底部栏遮挡 */
  width: 100%;
  margin-bottom: 20px; /* 额外的底部边距 */
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
    padding: var(--spacing-sm);
  }
  
  .chat-input {
    min-height: 38px;
    padding: var(--spacing-sm) var(--spacing-md);
    padding-right: 80px;
  }
  
  .chat-btn {
    width: 34px;
    height: 34px;
  }
  
  .suggestion-chip {
    padding: 3px var(--spacing-sm);
  }
}
</style> 