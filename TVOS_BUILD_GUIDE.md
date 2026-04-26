# XStreaming tvOS 构建指南

## 📺 概述

本项目已经配置了 tvOS 支持，可以构建适用于 Apple TV 的 IPA 文件。以下是构建和使用说明。

## ✅ 已完成的配置

### 1. Xcode 项目配置更新
- ✅ 修改了 `ios/XStreaming.xcodeproj/project.pbxproj`
  - 添加了 tvOS 平台支持 (`appletvos`, `appletvsimulator`)
  - 更新了 `SUPPORTED_PLATFORMS` 包含 tvOS
  - 添加了 `SUPPORTS_TV_DESIGNED_FOR_IPHONE_IPAD` 配置
  - 扩展了 `TARGETED_DEVICE_FAMILY` 包含 tvOS 设备 (3, 4)

### 2. package.json 脚本添加
新增了以下 yarn 命令：

```bash
# 生成 tvOS JS Bundle
yarn bundle:tvos

# 一键构建 tvOS（推荐）
yarn build:tvos

# 手动构建 Archive
yarn archive:tvos

# 手动导出 IPA
yarn export:tvos
```

### 3. 构建脚本和配置
- ✅ 创建了 `scripts/build-tvos.js` - 自动化构建脚本
- ✅ 创建了 `scripts/tvos-export-options.plist` - 导出选项配置

## 🚀 快速开始

### 前置要求

在构建 tvOS 应用之前，请确保已满足以下要求：

1. **macOS 环境**：需要在 macOS 上构建（因为需要 Xcode）
2. **Xcode**：安装 Xcode 14.0 或更高版本
3. **Xcode Command Line Tools**：安装 Xcode 命令行工具
   ```bash
   xcode-select --install
   ```
4. **CocoaPods**：安装 CocoaPods
   ```bash
   sudo gem install cocoapods
   ```
5. **开发者账号**：需要有 Apple Developer 账号
   - 用于代码签名
   - 用于 App Store 上传

### 构建步骤

#### 方法 1: 一键构建（推荐）

```bash
# 1. 安装依赖
yarn install

# 2. 安装 iOS CocoaPods 依赖
cd ios
pod install
cd ..

# 3. 一键构建 tvOS
yarn build:tvos
```

构建完成后，IPA 文件将位于：
```
build/tvos-export/XStreaming.ipa
```

#### 方法 2: 分步构建

如果你想更好地控制构建过程，可以分步执行：

```bash
# 1. 生成 tvOS JS Bundle
yarn bundle:tvos

# 2. 构建 Archive
yarn archive:tvos

# 3. 导出 IPA
yarn export:tvos
```

### 构建配置

#### 修改 Team ID

如果你需要使用不同的开发团队，请修改以下文件：

1. **tvos-export-options.plist**
   ```xml
   <key>teamID</key>
   <string>YOUR_TEAM_ID</string>
   ```

2. **Xcode 项目设置**
   - 打开 `ios/XStreaming.xcworkspace`
   - 选择 XStreaming target
   - 在 "Signing & Capabilities" 中修改 Team

#### 修改导出方法

在 `scripts/tvos-export-options.plist` 中修改导出方法：

- `app-store`：上传到 App Store（默认）
- `ad-hoc`：Ad Hoc 分发
- `enterprise`：企业分发
- `development`：开发版本

## 📋 项目结构

```
XStreaming-tvOS/
├── build/                          # 构建输出目录
│   ├── XStreaming-tvOS.xcarchive  # Archive 文件
│   └── tvos-export/               # 导出的 IPA 文件
├── ios/
│   ├── XStreaming.xcodeproj/     # Xcode 项目文件
│   │   └── project.pbxproj       # 项目配置（已更新支持 tvOS）
│   ├── XStreaming.xcworkspace/   # Xcode Workspace
│   └── bundle/                   # JS Bundle 输出
│       └── main.tvos.jsbundle   # tvOS Bundle
├── scripts/
│   ├── build-tvos.js            # tvOS 构建脚本
│   └── tvos-export-options.plist # 导出选项配置
└── package.json                 # 包含 tvOS 构建命令
```

## 🔧 常见问题

### 1. 构建失败：找不到 xcodebuild

**错误信息**: `command not found: xcodebuild`

**解决方案**:
```bash
# 安装 Xcode Command Line Tools
xcode-select --install

# 或者设置 Xcode 路径
sudo xcode-select --switch /Applications/Xcode.app
```

### 2. 签名错误

**错误信息**: `Code signing is required`

**解决方案**:
- 确保在 Xcode 项目中配置了正确的签名团队
- 检查 `tvos-export-options.plist` 中的 teamID 是否正确
- 确保你的开发者账号有效

### 3. Bundle 生成失败

**错误信息**: React Native bundle 相关错误

**解决方案**:
```bash
# 清理缓存
yarn start --reset-cache

# 重新安装依赖
rm -rf node_modules
yarn install

# 重新生成 Bundle
yarn bundle:tvos
```

### 4. CocoaPods 依赖问题

**错误信息**: Pod 安装失败

**解决方案**:
```bash
cd ios
pod deintegrate
pod install
cd ..
```

## 📝 注意事项

### tvOS 特殊考虑

1. **输入方式**：tvOS 主要使用遥控器输入，项目中已经集成了 GameController 框架支持游戏手柄
2. **UI 适配**：确保 UI 适配电视的大屏幕，考虑焦点管理和遥控器导航
3. **性能优化**：Apple TV 性能较强，但仍然需要注意内存使用
4. **后台运行**：tvOS 应用在后台会被暂停，需要妥善处理状态保存

### 开发建议

1. **使用模拟器测试**：在真机构建前，先在 tvOS 模拟器中测试
   ```bash
   yarn react-native run-ios --simulator="Apple TV"
   ```

2. **检查 tvOS 特定 API**：某些 iOS API 在 tvOS 上不可用，需要检查兼容性

3. **测试控制器输入**：在模拟器中可以模拟遥控器操作

## 🎯 下一步

构建完成后，你可以：

1. **上传到 App Store**
   ```bash
   # 使用 Application Loader 或 Xcode
   xcrun altool --upload-app --type app-store --file build/tvos-export/XStreaming.ipa
   ```

2. **测试安装**
   - 使用 Apple Configurator 2 安装到真机
   - 或通过 TestFlight 进行内部测试

3. **提交审核**
   - 在 App Store Connect 中创建新的 tvOS 应用
   - 提交 IPA 进行审核

## 📞 支持

如果遇到问题，请检查：
1. Xcode 版本是否符合要求
2. 开发者账号是否有效
3. 代码签名配置是否正确
4. 查看构建日志获取详细错误信息

---

**祝你构建成功！🎉**
