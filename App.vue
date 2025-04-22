<script>
import envConfig from '@/utils/env-config'

export default {
  globalData: {
    userInfo: null,
    isDarkMode: false,
    presetQuestion: '', // 预设问题，在页面跳转时可能会设置
    apiBaseUrl: envConfig.API_BASE_URL, // 从环境配置中读取API基础URL
  },
  onLaunch: function() {
    console.log('App Launch');
    
    // 记录环境信息
    console.log('当前运行环境:', envConfig.ENV);
    console.log('API基础URL:', envConfig.API_BASE_URL);
    
    // 从本地存储中读取用户主题设置
    try {
      const darkMode = uni.getStorageSync('isDarkMode');
      if (darkMode === 'true') {
        this.globalData.isDarkMode = true;
        // 设置页面背景和文字颜色等
        uni.setTabBarStyle({
          backgroundColor: '#222',
          borderStyle: 'black',
          color: '#8F8F8F',
          selectedColor: '#4A90E2'
        });
      }
    } catch (e) {
      console.log('读取主题设置失败');
    }
    
    // 检查用户是否已登录
    try {
      const userInfoData = uni.getStorageSync('userInfo');
      if (userInfoData) {
        // 检查是否需要解析
        if (typeof userInfoData === 'string') {
          try {
            this.globalData.userInfo = JSON.parse(userInfoData);
          } catch (e) {
            console.log('解析用户信息字符串失败', e);
            this.globalData.userInfo = null;
          }
        } else {
          // 已经是对象，直接使用
          this.globalData.userInfo = userInfoData;
        }
      }
    } catch (e) {
      console.log('读取用户信息失败');
    }
    
    // 动态添加Font Awesome图标库
    // 注意：实际开发中应该使用离线资源，这里为了演示使用CDN
    const addIconFont = () => {
      // #ifdef H5
      const fontAwesome = document.createElement('link');
      fontAwesome.rel = 'stylesheet';
      fontAwesome.href = 'https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css';
      document.head.appendChild(fontAwesome);
      // #endif
      
      // #ifdef MP-WEIXIN
      // 微信小程序需要通过自定义组件或图标组件实现
      // 此处仅为占位，实际需要在微信开发者工具中配置
      // #endif
    };
    
    // 在onLaunch中执行，确保图标库在应用启动时加载
    addIconFont();
  },
  onShow: function() {
    console.log('App Show');
  },
  onHide: function() {
    console.log('App Hide');
  }
};
</script>

<style>
/* 全局样式变量 */
page {
  /* 主色调 */
  --primary-color: #4A90E2;
  --primary-light: #6AADFF;
  --primary-dark: #3A80D2;
  
  /* 文本颜色 */
  --text-color: #333333;
  --text-secondary: #666666;
  --text-light: #999999;
  
  /* 背景颜色 */
  --bg-color: #ffffff;
  --bg-light: #f8f9fa;
  --bg-dark: #f5f5f5;
  
  /* 边框和圆角 */
  --border-color: #eaeaea;
  --border-radius-sm: 8px;
  --border-radius: 10px;
  --border-radius-lg: 12px;
  
  /* 阴影效果 */
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  --shadow-light: 0 1px 3px rgba(0, 0, 0, 0.04);
  --shadow-medium: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-focus: 0 0 0 3px rgba(74, 144, 226, 0.15);
  
  /* 间距 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 20px;
  
  /* 字体大小 */
  --font-size-xs: 12px;
  --font-size-sm: 13px;
  --font-size-md: 14px;
  --font-size-lg: 16px;
  --font-size-xl: 18px;
  
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  color: var(--text-color);
  background-color: var(--bg-color);
  font-size: var(--font-size-md);
  line-height: 1.6;
}

/* 为小屏幕调整尺寸 */
@media screen and (max-width: 375px) {
  page {
    --spacing-xs: 3px;
    --spacing-sm: 6px;
    --spacing-md: 10px;
    --spacing-lg: 14px;
    --spacing-xl: 18px;
    --font-size-xs: 11px;
    --font-size-sm: 12px;
    --font-size-md: 13px;
    --font-size-lg: 15px;
    --font-size-xl: 17px;
  }
}

/* 深色模式样式变量 */
.dark-mode {
  --primary-color: #5a9cf0;
  --primary-light: #7AADFA;
  --primary-dark: #4880D0;
  --text-color: #f0f0f0;
  --text-secondary: #c0c0c0;
  --text-light: #a0a0a0;
  --light-gray: #383838;
  --border-color: #444444;
  --shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  --shadow-light: 0 1px 3px rgba(0, 0, 0, 0.2);
  
  background-color: #222;
  color: var(--text-color);
}

/* 全局公共样式 */
.container {
  padding: var(--spacing-lg);
  box-sizing: border-box;
  width: 100%;
}

.card {
  background-color: #ffffff;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  transition: all 0.3s ease;
}

.dark-mode .card {
  background-color: #333;
}

/* 弹性布局工具类 */
.flex-row {
  display: flex;
  flex-direction: row;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flex-wrap {
  flex-wrap: wrap;
}

.flex-1 {
  flex: 1;
}

/* 间距工具类 */
.gap-sm {
  gap: var(--spacing-sm);
}

.gap-md {
  gap: var(--spacing-md);
}

.gap-lg {
  gap: var(--spacing-lg);
}

/* 按钮样式 */
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-md);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  outline: none;
  min-height: 44px;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:active {
  background-color: var(--primary-dark);
  transform: translateY(1px);
}

.btn-secondary {
  background-color: var(--light-gray);
  color: var(--text-color);
}

.btn-secondary:active {
  background-color: #e5e5e5;
  transform: translateY(1px);
}

.btn-icon {
  margin-right: var(--spacing-sm);
}

/* 输入框样式 */
.input {
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-md);
  background-color: #fff;
  transition: all 0.3s ease;
  min-height: 44px;
  outline: none;
}

.input:focus {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-focus);
}

.dark-mode .input {
  background-color: #444;
  border-color: #555;
  color: var(--text-color);
}

/* 网格布局 */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: var(--spacing-md);
}

/* FontAwesome图标兼容类 */
.fa {
  font-family: FontAwesome, sans-serif !important;
  font-style: normal;
}

/* 常用图标兼容类 */
.fa-user:before { content: '\f007'; }
.fa-robot:before { content: '\f544'; }
.fa-arrow-left:before { content: '\f060'; }
.fa-cog:before { content: '\f013'; }
.fa-settings:before { content: '\f013'; }
.fa-microphone:before { content: '\f130'; }
.fa-stop:before { content: '\f04d'; }
.fa-paper-plane:before { content: '\f1d8'; }
.fa-comments:before { content: '\f086'; }
.fa-wechat:before { content: '\f1d7'; }
.fa-lightbulb-o:before { content: '\f0eb'; }
.fa-pencil:before { content: '\f040'; }
.fa-calendar-check-o:before { content: '\f274'; }
.fa-language:before { content: '\f1ab'; }
.fa-history:before { content: '\f1da'; }
.fa-trash:before { content: '\f1f8'; }
.fa-moon-o:before { content: '\f186'; }
.fa-volume-up:before { content: '\f028'; }
.fa-save:before { content: '\f0c7'; }
.fa-info-circle:before { content: '\f05a'; }
.fa-angle-right:before { content: '\f105'; }
</style> 