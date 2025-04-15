# 环境配置使用说明

本项目使用环境变量文件管理不同环境的配置，包括开发环境、测试环境和生产环境。

## 配置文件

项目中包含以下环境配置文件：

- `.env.development`: 开发环境配置
- `.env.test`: 测试环境配置
- `.env.production`: 生产环境配置
- `.env.example`: 配置示例（不会被实际加载）

## 配置项说明

每个环境配置文件中包含以下敏感配置信息：

```
# API配置
API_BASE_URL=https://api.example.com
API_TIMEOUT=10000

# 小程序配置
WECHAT_APP_ID=your_app_id
WECHAT_APP_SECRET=your_app_secret

# 其他敏感信息
OSS_ACCESS_KEY=your_access_key
OSS_SECRET_KEY=your_secret_key
OSS_BUCKET=your-bucket
OSS_REGION=oss-cn-hangzhou
```

## 使用方法

### 开发环境

在开发过程中，配置会自动从 `.env.development` 中加载：

```bash
npm run dev
# 或
npm run serve
```

### 测试环境

构建测试环境版本：

```bash
npm run build:test
# 或手动设置环境变量
NODE_ENV=test npm run build
```

### 生产环境

构建生产环境版本：

```bash
npm run build
# 或手动设置环境变量
NODE_ENV=production npm run build
```

## 在代码中访问配置

项目中可以通过 `utils/env-config.js` 工具访问当前环境的配置：

```javascript
import envConfig from '@/utils/env-config';

// 使用API基础URL
console.log(envConfig.API_BASE_URL);

// 使用微信配置
console.log(envConfig.WECHAT.APP_ID);

// 判断当前环境
if (envConfig.isDev) {
  console.log('当前是开发环境');
} else if (envConfig.isProd) {
  console.log('当前是生产环境');
}
```

## 注意事项

1. 敏感配置文件不应提交到代码库
2. 所有 `.env.*` 文件已添加到 `.gitignore` 中
3. 可以参考 `.env.example` 创建自己的环境配置文件
4. 切勿在代码中硬编码敏感信息，而应通过配置进行管理

## 打包发布流程

1. 确保各环境的配置文件已正确设置
2. 选择要构建的目标环境：
   ```bash
   # 开发环境
   NODE_ENV=development npm run build
   
   # 测试环境
   NODE_ENV=test npm run build
   
   # 生产环境
   NODE_ENV=production npm run build
   ```
3. 构建完成后，部署 `dist` 目录的内容到对应环境的服务器 