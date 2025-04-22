# API 调用示例

本文档提供了使用封装的 API 模块的示例代码，帮助开发者理解如何在项目中正确使用 API 调用。

## 引入 API 模块

```javascript
// 引入所需的 API 模块
import { authApi, userApi, chatApi, aiApi, fileApi } from '@/api/index';
```

## 认证相关 API 示例

### 微信登录

```javascript
// 微信登录
const loginData = {
  code: 'wx_auth_code', // 微信登录获取的 code
  userInfo: {
    nickName: '用户昵称',
    avatarUrl: '头像URL'
  }
};

authApi.wechatLogin(loginData)
  .then(res => {
    console.log('登录成功', res);
    // res 中包含 token 和用户信息
  })
  .catch(err => {
    console.error('登录失败', err);
  });
```

### 退出登录

```javascript
authApi.logout()
  .then(res => {
    console.log('退出登录成功', res);
    // 可以跳转到登录页
    uni.reLaunch({
      url: '/pages/index/index'
    });
  })
  .catch(err => {
    console.error('退出登录失败', err);
  });
```

## 用户相关 API 示例

### 获取用户信息

```javascript
userApi.getUserInfo()
  .then(userInfo => {
    console.log('用户信息', userInfo);
    // 可以更新用户信息到页面
    this.userInfo = userInfo;
  })
  .catch(err => {
    console.error('获取用户信息失败', err);
  });
```

### 更新用户资料

```javascript
const profileData = {
  nickname: '新昵称',
  avatar: '新头像URL',
  gender: 1, // 1-男，2-女，0-未知
  // 其他资料字段...
};

userApi.updateProfile(profileData)
  .then(res => {
    console.log('更新资料成功', res);
    // 可以提示用户更新成功
    uni.showToast({
      title: '更新成功',
      icon: 'success'
    });
  })
  .catch(err => {
    console.error('更新资料失败', err);
  });
```

### 更新用户设置

```javascript
const settings = {
  theme: 'dark', // 主题设置
  notification: true, // 通知设置
  language: 'zh-CN', // 语言设置
  // 其他设置...
};

userApi.updateSettings(settings)
  .then(res => {
    console.log('更新设置成功', res);
    // 可以应用新设置
    applySettings(settings);
  })
  .catch(err => {
    console.error('更新设置失败', err);
  });
```

## 聊天相关 API 示例

### 创建聊天会话

```javascript
const sessionData = {
  title: '新的聊天',
  type: 'chat', // 聊天类型
};

chatApi.createSession(sessionData)
  .then(session => {
    console.log('创建会话成功', session);
    // 可以跳转到聊天页面
    uni.navigateTo({
      url: `/pages/chat/chat?sessionId=${session.id}`
    });
  })
  .catch(err => {
    console.error('创建会话失败', err);
  });
```

### 获取会话列表

```javascript
// 可选的分页参数
const params = {
  page: 1,
  size: 20
};

chatApi.getSessions(params)
  .then(sessions => {
    console.log('获取会话列表成功', sessions);
    // 可以更新会话列表
    this.sessionList = sessions.items;
    this.totalCount = sessions.total;
  })
  .catch(err => {
    console.error('获取会话列表失败', err);
  });
```

### 发送消息

```javascript
const messageData = {
  content: '这是一条测试消息',
  sessionId: 'session_123', // 会话ID
};

chatApi.sendMessage(messageData)
  .then(res => {
    console.log('发送消息成功', res);
    // 可能包含 AI 的回复消息
    const aiReply = res.reply;
    // 更新消息列表
    this.messageList.push({
      type: 'user',
      content: messageData.content,
      time: new Date().toISOString()
    });
    
    if (aiReply) {
      this.messageList.push({
        type: 'ai',
        content: aiReply.content,
        time: new Date().toISOString()
      });
    }
  })
  .catch(err => {
    console.error('发送消息失败', err);
  });
```

### 获取聊天历史

```javascript
const historyParams = {
  sessionId: 'session_123', // 会话ID
  page: 1,
  size: 20
};

chatApi.getHistory(historyParams)
  .then(history => {
    console.log('获取聊天历史成功', history);
    // 更新消息列表
    this.messageList = history.items;
    this.totalCount = history.total;
  })
  .catch(err => {
    console.error('获取聊天历史失败', err);
  });
```

### 删除会话

```javascript
const sessionId = 'session_123'; // 会话ID

chatApi.deleteSession(sessionId)
  .then(res => {
    console.log('删除会话成功', res);
    // 可以从会话列表中移除该会话
    this.sessionList = this.sessionList.filter(item => item.id !== sessionId);
  })
  .catch(err => {
    console.error('删除会话失败', err);
  });
```

### 清除聊天历史

```javascript
const sessionId = 'session_123'; // 会话ID

chatApi.clearHistory(sessionId)
  .then(res => {
    console.log('清除聊天历史成功', res);
    // 清空消息列表
    this.messageList = [];
  })
  .catch(err => {
    console.error('清除聊天历史失败', err);
  });
```

## AI 相关 API 示例

### 语音识别

```javascript
// 先通过 uni.chooseMedia 选择或录制音频文件
uni.chooseMedia({
  count: 1,
  mediaType: ['video'],
  sourceType: ['album', 'camera'],
  maxDuration: 30,
  camera: 'back',
  success: (res) => {
    const filePath = res.tempFiles[0].tempFilePath;
    
    // 使用 AI API 进行语音识别
    aiApi.speechToText(filePath)
      .then(result => {
        console.log('语音识别结果', result);
        // 可以将识别结果显示在输入框中
        this.inputMessage = result.text;
      })
      .catch(err => {
        console.error('语音识别失败', err);
      });
  }
});
```

### 文本生成语音

```javascript
const textData = {
  text: '这是一段需要转换成语音的文本',
  voice: 'female', // 可选：语音类型
  rate: 1.0 // 可选：语速
};

aiApi.textToSpeech(textData)
  .then(audioPath => {
    console.log('文本转语音成功', audioPath);
    // 播放生成的语音
    const innerAudioContext = uni.createInnerAudioContext();
    innerAudioContext.src = audioPath;
    innerAudioContext.autoplay = true;
  })
  .catch(err => {
    console.error('文本转语音失败', err);
  });
```

### 获取 AI 模型列表

```javascript
aiApi.getModels()
  .then(models => {
    console.log('获取模型列表成功', models);
    // 可以更新模型选择下拉框
    this.modelList = models;
  })
  .catch(err => {
    console.error('获取模型列表失败', err);
  });
```

## 文件上传相关 API 示例

### 上传图片

```javascript
// 先通过 uni.chooseImage 选择图片
uni.chooseImage({
  count: 1,
  sizeType: ['compressed'],
  sourceType: ['album', 'camera'],
  success: (res) => {
    const filePath = res.tempFilePaths[0];
    
    // 使用 fileApi 上传图片
    fileApi.uploadImage(filePath, {
      formData: {
        type: 'avatar' // 可选：指定图片用途
      }
    })
      .then(result => {
        console.log('图片上传成功', result);
        // 可以将图片 URL 保存或显示
        this.imageUrl = result.url;
      })
      .catch(err => {
        console.error('图片上传失败', err);
      });
  }
});
```

### 上传文件

```javascript
// 先通过 uni.chooseFile 选择文件
uni.chooseFile({
  count: 1,
  type: 'all',
  success: (res) => {
    const filePath = res.tempFiles[0].path;
    
    // 使用 fileApi 上传文件
    fileApi.uploadFile(filePath, {
      formData: {
        type: 'document' // 可选：指定文件类型
      }
    })
      .then(result => {
        console.log('文件上传成功', result);
        // 可以将文件信息保存
        this.fileInfo = result;
      })
      .catch(err => {
        console.error('文件上传失败', err);
      });
  }
});
```

## 错误处理最佳实践

在实际项目中，推荐使用 try-catch 结合 async/await 来处理 API 请求，这样可以让代码更清晰：

```javascript
async function getUserProfile() {
  try {
    uni.showLoading({ title: '加载中...' });
    
    // 获取用户信息
    const userInfo = await userApi.getUserInfo();
    
    // 获取用户设置
    const settings = await userApi.getSettings();
    
    // 更新页面数据
    this.userInfo = userInfo;
    this.settings = settings;
    
    uni.hideLoading();
  } catch (error) {
    uni.hideLoading();
    console.error('获取用户资料失败', error);
    
    // 统一错误提示
    uni.showToast({
      title: error.message || '获取信息失败，请稍后再试',
      icon: 'none'
    });
  }
}
```

## 取消请求示例

如果需要取消请求（例如用户快速切换页面时），可以使用 AbortController：

```javascript
// 创建一个请求控制器
const controller = new AbortController();

// 发起请求
chatApi.getHistory({
  sessionId: 'session_123',
  page: 1,
  size: 20
}, {
  signal: controller.signal // 传入信号
})
  .then(/* ... */)
  .catch(err => {
    if (err.name === 'AbortError') {
      console.log('请求被取消');
    } else {
      console.error('请求失败', err);
    }
  });

// 在需要时取消请求（例如：组件销毁、页面切换时）
controller.abort();
```

注意：上述示例需要后端接口和网络库支持 AbortController。

## 请求的防抖与节流

对于某些频繁触发的操作（如搜索框输入），可以使用防抖来减少请求次数：

```javascript
let searchTimeout = null;

function handleSearchInput(keyword) {
  // 清除之前的计时器
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  // 设置新的计时器
  searchTimeout = setTimeout(() => {
    // 发送搜索请求
    api.search(keyword)
      .then(/* ... */)
      .catch(/* ... */);
  }, 500); // 500ms 的防抖时间
}
```

## 注意事项

1. 所有 API 返回的都是 Promise，可以使用 .then/.catch 或 async/await 处理
2. 大部分请求会自动显示 loading，可以通过设置 `loading: false` 来禁用
3. 网络错误和业务错误会自动通过 uni.showToast 提示用户
4. token 失效会自动跳转到登录页面
5. 请求超时默认为环境配置中的 API_TIMEOUT，可以在请求时单独设置 