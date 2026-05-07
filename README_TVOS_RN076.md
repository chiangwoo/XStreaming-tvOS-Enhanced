# XStreaming tvOS Enhanced

> 基于 XStreaming 的 tvOS 支持增强版本，使用 React Native 0.76+

## ⚠️ 重要说明

这是一个从 **React Native 0.72.14** 升级到 **React Native 0.76.5** 的项目分支，同时保持了对 Apple TV (tvOS) 的支持。

### 主要升级

- ✅ React Native: 0.72.14 → 0.76.5
- ✅ React: 18.2.0 → 19.0.0
- ✅ React Navigation: 6.x → 7.x
- ✅ TypeScript: 4.8.4 → 5.5.4
- ✅ 所有主要依赖均升级到最新兼容版本
- ✅ tvOS 支持改进

---

## 📋 环境要求

### 开发环境

- **macOS**: 12.0+ (Monterey 或更新版本)
- **Xcode**: 15.0+ (支持 tvOS 17.0)
- **Node.js**: 18.0+ (推荐 20.x LTS)
- **Yarn**: 4.x (使用 Yarn Berry)
- **CocoaPods**: 1.15+

### Apple TV 开发

- **Apple TV**: tvOS 15.1+
- **Apple Developer Account**: 用于真机测试和分发

---

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/chiangwoo/XStreaming-tvOS-Enhanced.git
cd XStreaming-tvOS-Enhanced
```

### 2. 安装依赖

```bash
# 使用 Yarn (推荐)
yarn install

# 或使用 npm
npm install
```

### 3. 安装 iOS Pods

```bash
cd ios
pod install
cd ..
```

### 4. 构建 tvOS 应用

#### 方式一：使用构建脚本（推荐）

```bash
# tvOS 模拟器构建
node scripts/build-tvos-rn076.js simulator

# tvOS 真机构建
node scripts/build-tvos-rn076.js device

# tvOS Archive 构建
node scripts/build-tvos-rn076.js archive
```

#### 方式二：使用 Xcode

```bash
# 在 Xcode 中打开项目
open ios/XStreaming.xcworkspace

# 选择 Apple TV 模拟器或真机
# 点击 Run 或 Cmd+R
```

#### 方式三：手动 xcodebuild

```bash
# tvOS 模拟器
xcodebuild -workspace ios/XStreaming.xcworkspace \
  -scheme XStreaming \
  -configuration Debug \
  -destination "platform=tvOS Simulator,name=Apple TV 4K" \
  build

# tvOS 真机
xcodebuild -workspace ios/XStreaming.xcworkspace \
  -scheme XStreaming \
  -configuration Release \
  -destination "platform=tvOS" \
  CODE_SIGN_IDENTITY="iPhone Developer" \
  CODE_SIGNING_REQUIRED=NO \
  CODE_SIGNING_ALLOWED=NO \
  build
```

---

## 📱 在真机上运行

### 1. 配置代码签名

1. 在 Xcode 中打开 `ios/XStreaming.xcworkspace`
2. 选择项目 Navigator → XStreaming
3. Signing & Capabilities
4. 选择你的 Team
5. Bundle Identifier 确保唯一

### 2. 构建并运行

```bash
# 使用脚本
node scripts/build-tvos-rn076.js device

# 或在 Xcode 中
# 选择你的 Apple TV 真机
# 点击 Run
```

### 3. 导出 IPA（用于分发）

```bash
# 1. Archive 构建
node scripts/build-tvos-rn076.js archive

# 2. 导出 IPA
# 编辑 scripts/tvos-export-options.plist，填入你的 Team ID
xcodebuild \
  -exportArchive \
  -archivePath build/XStreaming-tvOS.xcarchive \
  -exportPath build/tvos-export \
  -exportOptionsPlist scripts/tvos-export-options.plist
```

---

## 🎮 Apple TV 遥控器支持

项目已配置对 Apple TV 遥控器的支持：

- ✅ 触控板导航
- ✅ 方向键导航
- ✅ 菜单按钮
- ✅ 播放/暂停按钮
- ✅ Siri Remote 支持

### 键盘输入

由于 Apple TV 没有物理键盘，应用支持：

- ✅ 使用 iOS 设备作为键盘（Remoted iOS app）
- ✅ 使用 iPhone/iPad 上的 Apple TV Remote app
- ✅ 屏幕键盘输入（部分场景）

---

## 📦 生成 JavaScript Bundle

### iOS Bundle

```bash
yarn bundle:ios
# 输出: ios/bundle/main.jsbundle
```

### tvOS Bundle

```bash
yarn bundle:tvos
# 输出: ios/bundle/main.tvos.jsbundle
```

### 调试 Bundle

```bash
# 开发模式（带 sourcemap）
npx react-native bundle \
  --platform tvos \
  --dev true \
  --entry-file index.js \
  --bundle-output ios/bundle/debug.tvos.jsbundle \
  --assets-dest ios/bundle
```

---

## 🛠️ 开发工具

### Metro 打包器

```bash
# 启动 Metro
yarn start

# 清除 Metro 缓存
yarn start --reset-cache
```

### TypeScript

```bash
# 类型检查
npx tsc --noEmit

# 类型检查并生成报告
npx tsc --noEmit --pretty
```

### ESLint

```bash
# 检查代码
yarn lint

# 自动修复
yarn lint --fix
```

---

## 📂 项目结构

```
XStreaming-tvOS-Enhanced/
├── android/                 # Android 原生代码
├── ios/                     # iOS/tvOS 原生代码
│   ├── XStreaming/        # 应用代码
│   ├── XStreaming.xcworkspace
│   └── Podfile
├── src/                     # React Native 源代码
│   ├── components/         # UI 组件
│   ├── screens/           # 页面
│   ├── store/             # Redux store
│   ├── services/          # API 服务
│   └── utils/             # 工具函数
├── scripts/                # 构建脚本
│   ├── build-tvos-rn076.js # tvOS 构建脚本
│   ├── fix-tvos-compat.sh  # 兼容性修复
│   └── tvOS-export-options.plist
├── docs/                    # 文档
├── assets/                  # 静态资源
├── package.json
├── tsconfig.json
├── metro.config.js
├── babel.config.js
└── RN076_UPGRADE_NOTES.md  # 升级说明
```

---

## 🔧 常见问题

### Q: Pod install 失败

**A:** 尝试以下步骤：

```bash
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
```

### Q: Hermes 引擎在 tvOS 上 crash

**A:** 确保使用 React Native 0.76+ 和正确的 Hermes 配置。检查 `ios/Podfile` 中的 Hermes 配置。

### Q: 应用启动白屏

**A:** 
1. 检查 JS Bundle 是否正确生成
2. 确保 Metro 开发服务器正在运行（开发模式）
3. 检查 `AppDelegate` 配置

### Q: TypeScript 错误

**A:** React Native 0.76 启用了更严格的 TypeScript 类型检查。修复类型错误或临时禁用严格模式：

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": false
  }
}
```

### Q: tvOS 模拟器构建失败

**A:** 确保选择了正确的 scheme 和目标平台：

```bash
xcodebuild -workspace ios/XStreaming.xcworkspace \
  -list  # 查看可用 schemes
```

---

## 📚 更多资源

- [React Native 官方文档](https://reactnative.dev/docs/getting-started)
- [React Native 0.76 升级指南](./RN076_UPGRADE_NOTES.md)
- [tvOS 开发文档](https://developer.apple.com/documentation/tvos)
- [React Navigation 7.x 文档](https://reactnavigation.org/docs/getting-started)

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

---

## 📄 许可证

本项目基于 MIT 许可证，继承自原项目 [XStreaming](https://github.com/Geocld/XStreaming)。

详细说明请参考：
- [LICENSE](./LICENSE_DERIVATIVE.md) - 项目许可证
- [版权声明](./README_TVOS.md) - 版权和归属说明

---

## 🙏 致谢

- 原作者 [Geocld](https://github.com/Geocld) 和 [XStreaming](https://github.com/Geocld/XStreaming)
- React Native 团队和社区
- 所有贡献者

---

**祝你开发愉快！ 🎉**
