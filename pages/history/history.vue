<template>
  <view class="history-container">
    <!-- 顶部导航栏 -->
    <view class="history-header">
      <view class="history-back" @click="goBack">
        <text class="fa fa-arrow-left"></text>
      </view>
      <view class="history-title">聊天记录</view>
      <view class="history-action" @click="showClearConfirm">
        <text class="fa fa-trash"></text>
      </view>
    </view>
    
    <!-- 搜索框 -->
    <view class="history-search">
      <input type="text" class="search-input" placeholder="搜索聊天记录..." v-model="searchText" @input="searchHistory" />
    </view>
    
    <!-- 历史记录内容区域 -->
    <scroll-view 
      class="history-list" 
      scroll-y 
      @scrolltolower="loadMoreHistory"
      :style="{ height: contentHeight + 'px' }"
    >
      <!-- 空历史记录提示 -->
      <view v-if="historyList.length === 0" class="history-empty">
        <view class="history-empty-icon">
          <text class="fa fa-history"></text>
        </view>
        <view class="history-empty-text">暂无聊天记录</view>
      </view>
      
      <!-- 历史记录列表 -->
      <view 
        v-for="(item, index) in historyList" 
        :key="index" 
        class="history-item"
        @tap="enterChat(item)"
      >
        <view class="history-item-header">
          <view class="history-item-title">{{ item.title }}</view>
          <view class="history-item-date">{{ item.time }}</view>
        </view>
        <view class="history-item-preview">
          你：{{ item.userMessage }} AI：{{ item.lastMessage }}
        </view>
      </view>
      
      <!-- 加载更多 -->
      <view v-if="historyList.length > 0 && !isEnd" class="history-load-more" @tap="loadMoreHistory">
        加载更多
      </view>
    </scroll-view>
    
    <!-- 清空历史确认弹窗 -->
    <view class="confirm-modal" v-if="showConfirm">
      <view class="confirm-content">
        <view class="confirm-title">确认清空</view>
        <view class="confirm-message">确定要清空所有聊天记录吗？此操作不可恢复。</view>
        <view class="confirm-buttons">
          <button class="cancel-btn" @tap="cancelClear">取消</button>
          <button class="confirm-btn" @tap="clearHistory">确认</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      historyList: [],
      contentHeight: 500,
      showConfirm: false,
      isLoading: false,
      isEnd: false,
      searchText: '',
      originalList: []
    };
  },
  
  onLoad() {
    // 计算内容区域高度
    const systemInfo = uni.getSystemInfoSync();
    this.contentHeight = systemInfo.windowHeight - 105; // 顶部导航和搜索框高度
    
    // 加载历史记录
    this.loadHistoryData();
  },
  
  methods: {
    /**
     * 加载历史聊天记录
     */
    loadHistoryData() {
      // 模拟加载历史记录数据
      // 实际开发中应从本地存储或服务器获取
      setTimeout(() => {
        this.historyList = [
          {
            id: '1',
            title: '天气查询',
            userMessage: '你好，请告诉我今天的天气如何？',
            lastMessage: '根据您的位置信息，今天天气晴朗，气温22-28°C，微风，适合户外活动。但下午可能有轻微阵雨，建议出门携带雨具。',
            time: '今天 14:25',
            messageCount: 12
          },
          {
            id: '2',
            title: '英语学习建议',
            userMessage: '如何提高英语口语？',
            lastMessage: '提高英语口语需要多听多说，建议您每天练习口语，多听英语播客和看英语视频，并尝试跟读模仿。此外，找语伴交流也很重要。',
            time: '昨天 09:30',
            messageCount: 8
          },
          {
            id: '3',
            title: '旅行规划',
            userMessage: '帮我规划三天两夜杭州旅行',
            lastMessage: '杭州三天两夜行程安排：第一天游览西湖景区，包括断桥、白堤和苏堤；第二天参观灵隐寺和西溪湿地；第三天可以去千岛湖或乌镇。',
            time: '04-06 16:45',
            messageCount: 15
          }
        ];
        this.originalList = [...this.historyList];
      }, 500);
    },
    
    /**
     * 搜索历史记录
     */
    searchHistory() {
      if (!this.searchText) {
        this.historyList = [...this.originalList];
        return;
      }
      
      this.historyList = this.originalList.filter(item => 
        item.title.includes(this.searchText) || 
        item.lastMessage.includes(this.searchText) ||
        item.userMessage.includes(this.searchText)
      );
    },
    
    /**
     * 加载更多历史记录
     */
    loadMoreHistory() {
      if (this.isLoading || this.isEnd) return;
      this.isLoading = true;
      
      // 模拟加载更多
      setTimeout(() => {
        // 添加更多历史记录
        if (this.originalList.length < 10) {
          const newItems = [
            {
              id: '4',
              title: '健康饮食建议',
              userMessage: '请给我一些健康饮食的建议',
              lastMessage: '健康饮食的核心是均衡营养和适量摄入。建议每天摄入多种蔬菜水果，选择全谷物，减少加工食品和糖分摄入。',
              time: '04-01 11:20',
              messageCount: 6
            },
            {
              id: '5',
              title: '编程问题解答',
              userMessage: 'JavaScript中如何实现深拷贝？',
              lastMessage: '在JavaScript中实现深拷贝有多种方法：1. 使用JSON.parse(JSON.stringify(object))，这种方法简单但有局限性。2. 使用递归函数。',
              time: '03-25 09:15',
              messageCount: 10
            }
          ];
          
          this.originalList = [...this.originalList, ...newItems];
          
          // 如果有搜索关键词，需要过滤新增数据
          if (this.searchText) {
            this.searchHistory();
          } else {
            this.historyList = [...this.originalList];
          }
        } else {
          this.isEnd = true;
        }
        
        this.isLoading = false;
      }, 1000);
    },
    
    /**
     * 进入特定的聊天会话
     */
    enterChat(item) {
      uni.navigateTo({
        url: '/pages/chat/chat?id=' + item.id + '&title=' + encodeURIComponent(item.title),
        success: (res) => {
          console.log('跳转成功', res);
        },
        fail: (err) => {
          console.error('跳转失败', err);
        }
      });
    },
    
    /**
     * 显示清空历史确认弹窗
     */
    showClearConfirm() {
      this.showConfirm = true;
    },
    
    /**
     * 取消清空操作
     */
    cancelClear() {
      this.showConfirm = false;
    },
    
    /**
     * 确认清空历史记录
     */
    clearHistory() {
      // 清空历史记录
      this.historyList = [];
      this.originalList = [];
      this.showConfirm = false;
      this.isEnd = false;
      
      // 显示提示
      uni.showToast({
        title: '已清空聊天记录',
        icon: 'success'
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

.history-container {
  width: 100%;
  background-color: #ffffff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* 顶部导航栏 */
.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  background-color: var(--primary-color);
  color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.history-title {
  font-size: 18px;
  font-weight: 600;
}

.history-back, .history-action {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.history-back:active, .history-action:active {
  background-color: rgba(255, 255, 255, 0.3);
}

/* 搜索区域 */
.history-search {
  padding: 15px;
  border-bottom: 1px solid #eaeaea;
  background-color: #ffffff;
}

.search-input {
  width: 100%;
  padding: 10px 15px;
  border-radius: 20px;
  border: 1px solid #e0e0e0;
  font-size: 14px;
  background-color: var(--light-gray);
  outline: none;
  transition: all 0.3s;
}

.search-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.1);
}

/* 历史记录列表 */
.history-list {
  flex: 1;
  background-color: #ffffff;
}

.history-item {
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.2s;
}

.history-item:active {
  background-color: var(--light-gray);
}

.history-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.history-item-title {
  font-weight: 500;
  color: var(--text-color);
  font-size: 16px;
}

.history-item-date {
  font-size: 12px;
  color: #999;
}

.history-item-preview {
  font-size: 13px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
}

/* 加载更多 */
.history-load-more {
  padding: 15px;
  text-align: center;
  color: var(--primary-color);
  font-size: 14px;
  border-top: 1px solid #f0f0f0;
}

.history-load-more:active {
  background-color: var(--light-gray);
}

/* 空历史记录提示 */
.history-empty {
  padding: 40px 20px;
  text-align: center;
  color: #999;
}

.history-empty-icon {
  font-size: 40px;
  margin-bottom: 15px;
  color: #ddd;
}

.history-empty-text {
  font-size: 14px;
}

/* 确认弹窗 */
.confirm-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.confirm-content {
  width: 80%;
  max-width: 300px;
  background-color: white;
  border-radius: var(--border-radius);
  padding: 20px;
}

.confirm-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 15px;
  text-align: center;
}

.confirm-message {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.6;
  text-align: center;
}

.confirm-buttons {
  display: flex;
  justify-content: space-between;
}

.cancel-btn, .confirm-btn {
  flex: 1;
  padding: 10px 0;
  border-radius: 5px;
  font-size: 14px;
  text-align: center;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #666;
  margin-right: 10px;
}

.confirm-btn {
  background-color: #e74c3c;
  color: white;
}

/* 深色模式样式 */
.dark-mode .history-container {
  background-color: #2a2a2a;
}

.dark-mode .history-search {
  border-bottom-color: #444;
  background-color: #2a2a2a;
}

.dark-mode .search-input {
  background-color: #383838;
  border-color: #444;
  color: #f0f0f0;
}

.dark-mode .search-input:focus {
  border-color: var(--primary-color);
}

.dark-mode .history-list {
  background-color: #2a2a2a;
}

.dark-mode .history-item {
  border-bottom-color: #3a3a3a;
}

.dark-mode .history-item:active {
  background-color: #383838;
}

.dark-mode .history-item-title {
  color: #f0f0f0;
}

.dark-mode .history-item-date {
  color: #aaa;
}

.dark-mode .history-item-preview {
  color: #bbb;
}

.dark-mode .history-empty-icon {
  color: #555;
}

.dark-mode .history-empty-text {
  color: #999;
}

.dark-mode .history-load-more {
  border-top-color: #444;
}

.dark-mode .confirm-content {
  background-color: #333;
}

.dark-mode .confirm-title {
  color: #f0f0f0;
}

.dark-mode .confirm-message {
  color: #ccc;
}

.dark-mode .cancel-btn {
  background-color: #444;
  color: #ccc;
}
</style> 