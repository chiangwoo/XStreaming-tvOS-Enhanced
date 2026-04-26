# tvOS 构建快速指南

## ✅ 已完成的配置

我已经为 XStreaming 项目添加了完整的 tvOS 支持，包括：

1. **Xcode 项目配置** (`ios/XStreaming.xcodeproj/project.pbxproj`)
   - ✅ 添加 tvOS 平台支持 (appletvos, appletvsimulator)
   - ✅ 更新设备家族支持 (TARGETED_DEVICE_FAMILY = "1,2,3,4")

2. **构建脚本**
   - ✅ `scripts/build-tvos.js` - 自动化构建脚本
   - ✅ `scripts/tvos-export-options.plist` - 导出配置

3. **Yarn 命令** (`package.json`)
   - ✅ `yarn bundle:tvos` - 生成 tvOS JS Bundle
   - ✅ `yarn build:tvos` - 一键构建 tvOS IPA

## 🚀 快速开始

### 一键构建（推荐）

```bash
# 1. 安装依赖
yarn install

# 2. 安装 CocoaPods
cd ios && pod install && cd ..

# 3. 构建tvOS IPA
yarn build:tvos
```

构建完成后，IPA 文件位于：
```
build/tvos-export/XStreaming.ipa
```

### 分步构建

```bash
# 1. 生成 JS Bundle
yarn bundle:tvos

# 2. 构建 Archive
yarn archive:tvos

# 3. 导出 IPA
yarn export:tvos
```

## ⚠️ 前置要求

- macOS 系统
- Xcode 14.0+
- CocoaPods
- Apple Developer 账号（用于签名）

## 📝 配置修改

### 修改 Team ID

编辑 `scripts/tvos-export-options.plist`：
```xml
<key>teamID</key>
<string>YOUR_TEAM_ID</string>
```

### 修改导出方式

在 `scripts/tvos-export-options.plist` 中修改：
- `app-store` - App Store（默认）
- `ad-hoc` - Ad Hoc 分发
- `enterprise` - 企业分发

## 📚 详细文档

查看完整构建指南：[TVOS_BUILD_GUIDE.md](./TVOS_BUILD_GUIDE.md)

## 🔧 故障排除

**找不到 xcodebuild？**
```bash
xcode-select --install
```

**签名错误？**
- 检查 Team ID 配置
- 确保开发者账号有效

**Bundle 生成失败？**
```bash
yarn start --reset-cache
```

---

**项目已准备好构建 tvOS IPA！🎉**
