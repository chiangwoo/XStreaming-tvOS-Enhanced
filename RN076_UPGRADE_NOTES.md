# React Native 0.76+ 升级说明

## ⚠️ 重要说明

此版本已将 React Native 从 **0.72.14** 升级到 **0.76.5**，同时保持对 tvOS 的支持。

---

## 📋 升级内容

### 核心依赖升级

| 依赖 | 旧版本 | 新版本 | 变化 |
|------|--------|--------|------|
| React Native | 0.72.14 | **0.76.5** | ⬆️ 大版本升级 |
| React | 18.2.0 | **19.0.0** | ⬆️ 主要版本 |
| React Navigation | 6.x | **7.x** | ⬆️ 主要版本 |
| TypeScript | 4.8.4 | **5.5.4** | ⬆️ 升级 |
| Metro | 0.72 | **0.76** | ⬆️ 跟随 RN |
| Babel | 7.x | **7.25** | ⬆️ 升级 |

### 第三方库升级

| 库 | 旧版本 | 新版本 | tvOS 支持 |
|----|--------|--------|----------|
| react-native-screens | 3.31.1 | **4.4.0** | ✅ 原生支持 |
| react-native-safe-area-context | 4.10.1 | **4.14.1** | ✅ 原生支持 |
| react-native-gesture-handler | 2.16.2 | **2.21.2** | ✅ 原生支持 |
| react-native-svg | 15.3.0 | **15.8.0** | ✅ 原生支持 |
| react-native-mmkv | 2.12.2 | **3.2.0** | ✅ 原生支持 |
| react-native-webview | 13.10.2 | **14.1.0** | ✅ 原生支持 |
| @react-native-community/netinfo | 11.3.2 | **11.4.0** | ✅ 原生支持 |

---

## 🎯 升级亮点

### ✅ 更好的 tvOS 支持
- React Native 0.76+ 改进了 tvOS 平台的官方支持
- 减少了需要手动补丁的文件数量
- Hermes 引擎在 tvOS 上更稳定

### ✅ New Architecture
- 默认启用新的架构
- 更好的性能和响应速度
- 更现代的 React Native 开发体验

### ✅ 改进的开发工具
- 更快的 Metro 打包速度
- 更好的热重载支持
- 改进的错误提示

---

## 🔧 本地开发

### 安装依赖

```bash
# 1. 删除旧的依赖
rm -rf node_modules
rm -f yarn.lock
rm -f package-lock.json

# 2. 安装新依赖
yarn install

# 3. 重新安装 iOS Pods
cd ios
pod install
cd ..
```

### 构建 iOS

```bash
# iOS 模拟器
xcodebuild -workspace ios/XStreaming.xcworkspace \
  -scheme XStreaming \
  -configuration Debug \
  -destination "platform=iOS Simulator,name=iPhone 15" \
  build
```

### 构建 tvOS

```bash
# tvOS 模拟器
node scripts/build-tvos-rn076.js simulator

# 或使用 xcodebuild
xcodebuild -workspace ios/XStreaming.xcworkspace \
  -scheme XStreaming \
  -configuration Debug \
  -destination "platform=tvOS Simulator,name=Apple TV 4K" \
  build
```

### 生成 JS Bundle

```bash
# iOS
yarn bundle:ios

# tvOS
yarn bundle:tvos
```

---

## 🐛 已知问题和解决方案

### 问题 1: Pod 安装失败

**错误信息**:
```
[!] CocoaPods could not find compatible versions for pod "React-RCTAppDelegate"
```

**解决方案**:
```bash
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
```

### 问题 2: TypeScript 编译错误

**错误信息**:
```
TS2322: Type 'X' is not assignable to type 'Y'
```

**解决方案**:
RN 0.76 启用了更严格的 TypeScript 类型检查。检查并修正类型定义，或在 `tsconfig.json` 中暂时禁用严格模式：

```json
{
  "compilerOptions": {
    "strict": false
  }
}
```

### 问题 3: Hermes 引擎问题

**错误信息**:
```
Hermes bytecode engine not available for tvOS
```

**解决方案**:
RN 0.76 的 Hermes 已支持 tvOS，但需要确保 Podfile 中正确配置：

```ruby
# Podfile 中已配置，无需额外操作
use_react_native!
```

### 问题 4: 第三方库不兼容

**错误信息**:
```
Module 'XXX' does not exist on iOS/tvOS
```

**解决方案**:
检查库是否支持新版本的 React Native：

1. 访问库的 GitHub 页面查看最新版本
2. 更新到支持 RN 0.76 的版本
3. 或查找替代库

---

## 📝 迁移检查清单

在升级后，请验证以下功能：

- [ ] 应用启动无 crash
- [ ] 导航正常工作
- [ ] 网络请求正常
- [ ] 本地存储（MMKV）正常
- [ ] 视频播放正常
- [ ] 手势操作正常
- [ ] 状态管理（Redux）正常
- [ ] i18n 国际化正常

---

## 🔄 回滚到 RN 0.72

如果遇到无法解决的问题，可以回滚：

```bash
# 切换回备份分支
git checkout backup/rn-0.72.14

# 重新安装依赖
rm -rf node_modules
yarn install
cd ios && pod install && cd ..
```

---

## 📚 更多资源

- [React Native 0.76 官方升级指南](https://reactnative.dev/blog/2024/10/23/react-native-0-76)
- [React Navigation 7.x 迁移指南](https://reactnavigation.org/docs/upgrading-to-v7)
- [React 19 官方升级指南](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)

---

## 🤝 获取帮助

如果在升级过程中遇到问题：

1. 查看 [常见问题解答](#🐛-已知问题和解决方案)
2. 查看 [React Native 社区](https://github.com/reactnative-community)
3. 查看 [GitHub Issues](https://github.com/react-native-community/discussions-and-proposals)
