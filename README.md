# AI聊天助手 (AI Chat Assistant)

![AI聊天助手](https://img.shields.io/badge/AI-%E8%81%8A%E5%A4%A9%E5%8A%A9%E6%89%8B-blue)
![uni-app](https://img.shields.io/badge/framework-uni--app-green)
![Version](https://img.shields.io/badge/version-1.0.0-orange)

一个基于uni-app开发的AI聊天助手微信小程序前端，提供智能对话服务，让用户随时随地解决问题。

## 📱 应用截图

<div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
  <img src="screenshots/welcome.png" alt="欢迎页面" width="200"/>
  <img src="screenshots/chat.png" alt="聊天页面" width="200"/>
  <img src="screenshots/settings.png" alt="设置页面" width="200"/>
</div>

> 注意：实际使用时请替换为您的应用截图

## ✨ 功能特点

- 🤖 **智能问答**: 回答各类问题，提供准确信息和专业知识
- 📝 **创意写作**: 协助撰写邮件、文案、故事和各类文本内容
- 📅 **规划助手**: 帮助规划行程、制定计划和安排日程
- 🈯 **语言助手**: 提供翻译、语法检查和语言学习支持
- 🌙 **深色模式**: 支持明暗主题切换，保护用户视力
- 🔊 **语音朗读**: 可将AI回复内容转为语音播放
- 📦 **聊天记录**: 自动保存聊天历史，方便查阅

## 🛠️ 技术栈

- **前端框架**: [uni-app](https://uniapp.dcloud.io/)
- **UI组件**: [thorui](https://thorui.cn/doc/)
- **状态管理**: [Vuex](https://vuex.vuejs.org/)
- **JavaScript框架**: [Vue 2](https://v2.vuejs.org/)

## 📦 安装与运行

### 前置条件

- Node.js (推荐 v14.0.0 以上)
- npm 或 yarn
- 微信开发者工具（用于预览微信小程序）

### 安装步骤

1. 克隆仓库到本地
   ```bash
   git clone https://github.com/你的用户名/ai-assistant-front.git
   cd ai-assistant-front
   ```

2. 安装依赖
   ```bash
   npm install
   # 或者使用 yarn
   yarn install
   ```

3. 开发模式运行
   ```bash
   # 微信小程序
   npm run dev:mp-weixin
   
   # H5
   npm run dev:h5
   
   # 其他平台请参考package.json中的脚本
   ```

4. 构建生产版本
   ```bash
   # 微信小程序
   npm run build:mp-weixin
   
   # H5
   npm run build:h5
   ```

## 📱 预览方式

### 微信小程序
使用微信开发者工具导入 `/dist/dev/mp-weixin` 或 `/dist/build/mp-weixin` 目录。

### H5版本
开发模式下，访问 `http://localhost:8080/` 预览。

## 🔧 配置说明

项目配置位于 `manifest.json` 文件中，可根据需要修改:

- AppID 配置
- 权限配置
- 页面配置
- 云服务配置

## 📄 页面介绍

- **首页 (index)**: 展示功能概览和快速入口
- **欢迎页 (welcome)**: 新用户引导和功能介绍
- **聊天页 (chat)**: 主要的AI对话界面
- **历史记录 (history)**: 查看历史对话记录
- **设置页 (settings)**: 应用设置和用户信息

## 🤝 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的改动 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建一个 Pull Request

## 📄 许可证

本项目使用 ISC 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件

## 🔗 相关链接

- [uni-app官方文档](https://uniapp.dcloud.io/)
- [Vue.js官方文档](https://cn.vuejs.org/)
- [thorui组件库](https://thorui.cn/doc/)

## 📧 联系方式

如有任何问题或建议，请通过以下方式联系我们：

- 邮箱: your.email@example.com
- GitHub Issues: [提交问题](https://github.com/你的用户名/ai-assistant-front/issues)

---

💡 **提示**: 这是一个前端项目，需要配合后端API使用才能发挥完整功能。 