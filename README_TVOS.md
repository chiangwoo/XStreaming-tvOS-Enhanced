# XStreaming tvOS 版本

![License](https://img.shields.io/badge/License-MIT-yellow.svg)
![Platform](https://img.shields.io/badge/Platform-tvOS-orange.svg)

## ⚠️ 重要声明

**本项目是基于 [Geocld/XStreaming](https://github.com/Geocld/XStreaming) 的衍生版本，添加了 tvOS 支持。**

### 原项目信息
- **原始仓库**: https://github.com/Geocld/XStreaming
- **原始作者**: Geocld
- **原始分支**: ios

### 本项目修改内容
本分支/仓库仅添加了以下功能：
- ✅ 添加 tvOS 平台支持（Apple TV）
- ✅ 创建 tvOS 构建脚本和配置
- ✅ 添加 tvOS 相关文档

**所有原始代码和功能均属于原作者 Geocld，本项目仅添加了 tvOS 构建能力。**

### 许可证
本项目遵循原项目的许可证。请参考原始仓库的许可协议：
- [XStreaming 原始许可证](https://github.com/Geocld/XStreaming/blob/ios/LICENSE)

### 使用须知
1. 本项目仅供学习和测试使用
2. 如需使用或分发，请遵守原项目的许可证
3. 尊重原作者的版权和劳动成果
4. 建议优先支持原项目

### 联系方式
- **原项目问题**: 请在 [原项目仓库](https://github.com/Geocld/XStreaming) 提交 issue
- **tvOS 支持问题**: 可在本仓库提交 issue（但请注意可能无法解决原项目本身的问题）

---

## 📺 tvOS 支持说明

本项目添加了完整的 tvOS 支持，可以构建适用于 Apple TV 的应用。

### 快速开始

#### 一键构建（推荐）

```bash
# 1. 安装依赖
yarn install

# 2. 安装 CocoaPods
cd ios && pod install && cd ..

# 3. 构建tvOS IPA
yarn build:tvos
```

构建完成后，IPA 文件位于：`build/tvos-export/XStreaming.ipa`

#### 分步构建

```bash
yarn bundle:tvos    # 生成 JS Bundle
yarn archive:tvos   # 构建 Archive
yarn export:tvos    # 导出 IPA
```

### 前置要求

- macOS 系统
- Xcode 14.0+
- CocoaPods
- Apple Developer 账号（用于代码签名）

### 配置说明

#### 修改 Team ID

编辑 `scripts/tvos-export-options.plist`：
```xml
<key>teamID</key>
<string>YOUR_TEAM_ID</string>
```

#### 修改导出方式

在 `scripts/tvos-export-options.plist` 中修改：
- `app-store` - App Store（默认）
- `ad-hoc` - Ad Hoc 分发
- `enterprise` - 企业分发

## 📚 文档

- [详细构建指南](./TVOS_BUILD_GUIDE.md)
- [快速参考](./TVOS_README.md)
- [变更说明](./TVOS_CHANGES.md)

## 🔧 技术细节

### 修改的文件

1. **ios/XStreaming.xcodeproj/project.pbxproj**
   - 添加 tvOS 平台支持
   - 更新设备家族支持

2. **package.json**
   - 添加 tvOS 构建命令

3. **新增文件**
   - `scripts/build-tvos.js` - 自动化构建脚本
   - `scripts/tvos-export-options.plist` - 导出配置
   - `TVOS_BUILD_GUIDE.md` - 详细文档
   - `TVOS_README.md` - 快速参考
   - `TVOS_CHANGES.md` - 变更说明

## ⚠️ 免责声明

1. **原作者版权**：本项目仅添加 tvOS 支持，所有原始代码的版权属于原作者 Geocld
2. **稳定性**：tvOS 支持尚未经过充分测试，可能存在 bug
3. **功能完整性**：部分 iOS 功能在 tvOS 上可能不可用或需要适配
4. **使用风险**：使用本项目产生的一切后果由使用者自行承担

## 🤝 贡献

由于这是衍生项目，建议：
1. 如果发现 bug，先在原项目确认是否为共性问题
2. 如果修复的是 tvOS 特定问题，可提交 PR 到本仓库
3. 如果是通用问题，建议提交到原项目

## 📄 许可证

本项目遵循原项目的许可证。

---

**再次感谢原作者 Geocld 的优秀工作！**
