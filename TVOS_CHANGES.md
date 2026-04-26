# tvOS 支持添加 - 变更摘要

## 📅 修改日期
2025-04-26

## 🎯 目标
为 XStreaming 项目添加 tvOS 支持，使其能够构建适用于 Apple TV 的 IPA 文件。

## ✅ 完成的修改

### 1. Xcode 项目配置
**文件**: `ios/XStreaming.xcodeproj/project.pbxproj`

**修改内容**:
- ✅ 将 `SUPPORTED_PLATFORMS` 从 `"iphoneos iphonesimulator"` 更新为 `"iphoneos iphonesimulator appletvos appletvsimulator"`
- ✅ 添加 `SUPPORTS_TV_DESIGNED_FOR_IPHONE_IPAD = NO;` 配置
- ✅ 将 `TARGETED_DEVICE_FAMILY` 从 `"1,2"` 更新为 `"1,2,3,4"` (包含 tvOS 设备)

**影响**: 使项目能够构建 tvOS 和 tvOS 模拟器版本

### 2. package.json
**文件**: `package.json`

**新增脚本**:
```json
"bundle:tvos": "npx react-native bundle --entry-file index.js --platform tvos --dev false --bundle-output ios/bundle/main.tvos.jsbundle --assets-dest ios/bundle --reset-cache",
"build:tvos": "node scripts/build-tvos.js",
"archive:tvos": "xcodebuild -workspace ios/XStreaming.xcworkspace -scheme XStreaming -destination 'generic/platform=tvOS' -configuration Release archive -archivePath build/XStreaming-tvOS.xcarchive",
"export:tvos": "xcodebuild -exportArchive -archivePath build/XStreaming-tvOS.xcarchive -exportPath build/tvos-export -exportOptionsPlist scripts/tvos-export-options.plist"
```

### 3. 新增文件

#### scripts/build-tvos.js
**用途**: 自动化 tvOS 构建脚本

**功能**:
1. 创建必要的构建目录
2. 生成 tvOS JS Bundle
3. 安装 CocoaPods 依赖
4. 构建 Archive
5. 导出 IPA 文件

#### scripts/tvos-export-options.plist
**用途**: Xcode 导出配置文件

**配置**:
- 导出方法: `app-store`
- Team ID: `C4UJRY28NT`
- 代码签名: 自动签名
- Bitcode: 禁用

### 4. 文档文件

#### TVOS_BUILD_GUIDE.md
**用途**: 详细的 tvOS 构建指南

**包含内容**:
- 项目概述
- 已完成的配置说明
- 前置要求
- 构建步骤（一键构建和分步构建）
- 配置修改指南
- 项目结构说明
- 常见问题解答
- tvOS 特殊考虑事项

#### TVOS_README.md
**用途**: 快速参考指南

**包含内容**:
- 已完成配置列表
- 快速开始命令
- 前置要求
- 常用配置修改
- 故障排除快速指南

### 5. 备份文件
**文件**: `ios/XStreaming.xcodeproj/project.pbxproj.backup`

**用途**: 原始 project.pbxproj 文件的备份

## 📁 项目结构变更

```
XStreaming-tvOS/
├── build/                          # [新增] 构建输出目录
│   ├── XStreaming-tvOS.xcarchive  # [新增] Archive 文件
│   └── tvos-export/               # [新增] 导出的 IPA
├── ios/
│   ├── XStreaming.xcodeproj/
│   │   ├── project.pbxproj        # [修改] 添加 tvOS 支持
│   │   └── project.pbxproj.backup # [新增] 备份文件
│   └── bundle/
│       └── main.tvos.jsbundle    # [新增] tvOS Bundle（构建时生成）
├── scripts/
│   ├── build-tvos.js             # [新增] 构建脚本
│   └── tvos-export-options.plist # [新增] 导出配置
├── TVOS_BUILD_GUIDE.md           # [新增] 详细指南
├── TVOS_README.md                # [新增] 快速指南
└── TVOS_CHANGES.md               # [新增] 本文件
```

## 🚀 使用方法

### 一键构建
```bash
yarn build:tvos
```

### 分步构建
```bash
yarn bundle:tvos    # 生成 Bundle
yarn archive:tvos   # 构建 Archive
yarn export:tvos    # 导出 IPA
```

## ⚠️ 注意事项

1. **环境要求**
   - 必须在 macOS 上构建
   - 需要 Xcode 14.0+
   - 需要 Apple Developer 账号

2. **配置修改**
   - 如需修改 Team ID，编辑 `scripts/tvos-export-options.plist`
   - 如需修改导出方式，编辑 `scripts/tvos-export-options.plist`

3. **tvOS 特殊考虑**
   - 项目已集成 GameController 框架（支持游戏手柄）
   - UI 需要适配电视的大屏幕
   - 主要使用遥控器输入

## 🔧 验证修改

### 检查 project.pbxproj
```bash
grep -n "SUPPORTED_PLATFORMS\|TARGETED_DEVICE_FAMILY" ios/XStreaming.xcodeproj/project.pbxproj
```

预期输出应包含：
- `SUPPORTED_PLATFORMS = "iphoneos iphonesimulator appletvos appletvsimulator"`
- `TARGETED_DEVICE_FAMILY = "1,2,3,4"`

### 检查 package.json
```bash
cat package.json | grep "tvos"
```

预期输出应包含所有 tvOS 相关的脚本命令

## 📞 后续步骤

1. **配置代码签名**
   - 在 Xcode 中设置正确的开发团队
   - 更新 `tvos-export-options.plist` 中的 Team ID

2. **测试构建**
   - 在 macOS 上运行 `yarn build:tvos`
   - 检查是否成功生成 IPA 文件

3. **功能测试**
   - 使用 tvOS 模拟器测试应用
   - 在真机 Apple TV 上测试
   - 测试遥控器和游戏手柄输入

4. **准备发布**
   - 上传到 App Store Connect
   - 创建 tvOS 应用记录
   - 提交审核

## 📚 参考文档

- [TVOS_BUILD_GUIDE.md](./TVOS_BUILD_GUIDE.md) - 详细构建指南
- [TVOS_README.md](./TVOS_README.md) - 快速参考
- [Apple tvOS 开发文档](https://developer.apple.com/documentation/tvos)

---

**变更完成！项目现在支持 tvOS 构建。**
