# React Native 0.76.5 tvOS 修复日志 - 2026-05-07

## 修复的问题

### 1. glog syscall tvOS 不兼容 ✅
- **问题**: glog 使用 `syscall(__NR_gettid)` 获取线程 ID，但 tvOS 禁用了 syscall
- **文件**: 
  - `Pods/glog/src/utilities.cc`
  - `Pods/glog/src/raw_logging.cc`
- **修复**: 使用条件编译 `#if !TARGET_OS_TV` 在 tvOS 上将 tid 设为 -1

### 2. React Native Text 组件 tvOS 不兼容 ✅ (新增)
- **问题**: RCTTextView 和 RCTUITextView 使用了 tvOS 不支持的 API
- **文件**:
  - `node_modules/react-native/Libraries/Text/Text/RCTTextView.mm`
  - `node_modules/react-native/Libraries/Text/TextInput/Multiline/RCTUITextView.mm`
- **修复**: 使用条件编译 `#if !TARGET_OS_TV` 包裹 iOS-only API

### 修复的 API 列表

#### RCTTextView.mm (9 个问题)
| 行号 | API | 原因 |
|------|-----|------|
| 19 | `UIEditMenuInteractionDelegate` | iOS 16+ 编辑菜单协议 |
| 21 | `UIEditMenuInteraction` | iOS 16+ 编辑菜单 |
| 222-224 | `UIEditMenuInteraction` | 同上 |
| 244-248 | `UIEditMenuConfiguration` | iOS 16+ 编辑菜单配置 |
| 250-256 | `UIMenuController` | iOS 上下文菜单 |
| 290 | `UIPasteboard` | iOS 剪贴板 |

#### RCTUITextView.mm (1 个问题)
| 行号 | API | 原因 |
|------|-----|------|
| 53 | `scrollsToTop` | tvOS 无滚动到顶部手势 |

## 修复方式

所有修复通过 `ios/Podfile` 中的 `fix_rn_text_for_tvos()` 函数自动完成。

在 `pod install` 时会自动：
1. 修复 `glog` 的 syscall 问题
2. 修复 `RCTTextView.mm` 的 iOS-only API
3. 修复 `RCTUITextView.mm` 的 scrollsToTop 问题

## 构建步骤

```bash
# 1. 安装依赖
yarn install
cd ios && pod install

# 2. 生成 JS Bundle
cd ..
npx react-native bundle \
  --platform tvOS \
  --dev false \
  --entry-file index.js \
  --bundle-output ios/main.jsbundle \
  --assets-dest ios

# 3. 构建 tvOS
cd ios
xcodebuild -workspace XStreaming.xcworkspace \
  -scheme XStreaming \
  -sdk appletvos \
  -configuration Release \
  CODE_SIGN_IDENTITY="" \
  CODE_SIGNING_REQUIRED=NO \
  CODE_SIGNING_ALLOWED=NO \
  build
```

## 验证

构建完成后应该看到:
```
** BUILD SUCCEEDED **
```

## 注意事项

1. **自动修复**: 所有 tvOS 不兼容的代码修复都在 `pod install` 时自动完成
2. **无需手动修改**: 不需要手动修改 `node_modules` 中的文件
3. **可重复运行**: 修复脚本会检查是否已经修复过，避免重复修改

## 备份

如果在调试过程中需要恢复原始文件:
- `RCTTextView.mm.backup`
- `RCTUITextView.mm.backup`
- `utilities.cc.backup`
- `raw_logging.cc.backup`
