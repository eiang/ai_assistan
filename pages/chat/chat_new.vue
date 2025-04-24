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
    
    <!-- 模式切换按钮区域 - 移至顶部 -->
    <view class="top-mode-toggle">
      <view class="mode-indicator">
        <text class="mode-label">当前模式:</text>
        <tui-tag 
          size="small" 
          padding="6px 10px" 
          type="gray" 
          @click="toggleVoiceInput"
        >
          <view class="toggle-mode">
            <tui-icon name="strategy" :size="16"></tui-icon>
            <text>文本对话</text>
          </view>
        </tui-tag>
      </view>
      <view class="mode-indicator">
        <tui-tag 
          size="small" 
          padding="6px 12px" 
          type="gray" 
          @click="openDrawer"
        >
          <view class="toggle-mode">
            <tui-icon name="tool" :size="16"></tui-icon>
            <text>{{isOpenAddtionalFunction ? '附加功能: ' + selectedFunction.text : '附加功能关闭'}}</text>
          </view>
        </tui-tag>
      </view>
    </view>

    <tui-drawer 
      mode="bottom" 
      :visible="visible" 
      @close="closeDrawer"
    >
      <view style="padding: 20px; background-color: white;">
        <view style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <text style="font-size: 18px; font-weight: bold;">选择附加功能</text>
          <view @tap="closeDrawer" style="padding: 5px;">
            <tui-icon name="close" :size="20" color="#666"></tui-icon>
          </view>
        </view>
        <view style="height: 1px; background-color: #eee; margin-bottom: 15px;"></view>
        <tui-cascade-selection 
          :reset="reset" 
          height="300px" 
          :itemList="functionList" 
          @complete="complete"
        ></tui-cascade-selection>
      </view>
    </tui-drawer>

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
              <tui-alert 
                :show="showModal" 
                size="30" 
                btnColor="#3b3b3b" 
                btnText="复制" 
                maskClosable="false" 
                @click="copyContent(message.content)" 
                @cancel="hideAlert"
                class="custom-alert"
              >
                <scroll-view class="alert-scroll-view" scroll-y>
                  <text class="alert-content">{{message.content}}</text>
                </scroll-view>
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
