# React Native 0.76.5 tvOS 构建修复日志 v5

**日期**: 2025-05-07
**版本**: v5 (Final)

---

## 问题总结

之前的 regex 修复将 RCTTextView.mm 文件搞乱了，导致编译错误。本次重新正确修复所有问题。

---

## 本次修复内容

### 1. RCTTextView.mm - 重新正确修复

**问题**: 之前的 regex 替换不完整，导致文件语法错误

**修复方式**: 
- 从 React Native 0.76.5 官方包重新解压干净的 RCTTextView.mm
- 手动添加正确的条件编译

**修复的 API**:
1. `UIEditMenuInteractionDelegate` 协议声明
2. `UIEditMenuInteraction` 属性
3. `enableContextMenu` 方法
4. `disableContextMenu` 方法
5. `handleLongPress` 方法 - **整个方法用 #if !TARGET_OS_TV 包裹**
6. `UIPasteboard` 在 `copy:` 方法中

### 2. RCTBaseTextInputView.mm - UIToolbar 问题

**问题**: InputAccessoryView 使用 UIToolbar，tvOS 可能不支持

**修复**: 添加 `#if !TARGET_OS_TV` 条件编译

### 3. RCTDynamicTypeRamp.mm - UIFontMetrics 问题

**问题**: Dynamic Type 在 tvOS 上不可用

**修复**: 
- 为 `RCTUIFontMetricsForDynamicTypeRamp` 函数添加 tvOS 条件编译
- tvOS 上返回 `nil`

### 4. Podfile 修正

- 修正 `fix_react_native_cookies_for_tvos` 中的路径格式
- 确保所有路径正确

---

## 完整修复清单

| # | 文件 | 问题 | 修复方式 |
|---|------|------|----------|
| 1 | utilities.cc | `syscall(__NR_gettid)` | `#if !TARGET_OS_TV` |
| 2 | raw_logging.cc | `syscall(__NR_gettid)` | `#if !TARGET_OS_TV` |
| 3 | RCTTextView.mm | UIEditMenuInteractionDelegate | 条件编译 |
| 4 | RCTTextView.mm | UIEditMenuInteraction 属性 | 条件编译 |
| 5 | RCTTextView.mm | enableContextMenu | `#if !TARGET_OS_TV` |
| 6 | RCTTextView.mm | disableContextMenu | `#if !TARGET_OS_TV` |
| 7 | RCTTextView.mm | handleLongPress | **整个方法条件编译** |
| 8 | RCTTextView.mm | UIPasteboard | `#if !TARGET_OS_TV` |
| 9 | RCTUITextView.mm | scrollsToTop | `#if !TARGET_OS_TV` |
| 10 | RCTBaseTextInputView.mm | InputAccessoryView | `#if !TARGET_OS_TV` |
| 11 | RCTDynamicTypeRamp.mm | UIFontMetrics | tvOS 返回 nil |
| 12 | RCTConvert.h | UIInterfaceOrientationMask | 条件编译 |
| 13 | RCTUtils.h | UIStatusBarManager | 条件编译 |
| 14 | PrivacyInfo.xcprivacy | 重复 | Podfile 删除 |
| 15 | react-native-cookies | WebKit | 条件编译 |
| 16 | Hermes tarball | 下载损坏 | debug 覆盖 release |

---

## 构建命令

```bash
cd ios
pod install
cd ..
xcodebuild -workspace XStreaming.xcworkspace \
  -scheme XStreaming \
  -sdk appletvos \
  -configuration Release \
  CODE_SIGN_IDENTITY="" \
  CODE_SIGNING_REQUIRED=NO \
  CODE_SIGNING_ALLOWED=NO \
  build
```

---

## 修改的文件

1. `node_modules/react-native/Libraries/Text/Text/RCTTextView.mm` - 重新正确修复
2. `node_modules/react-native/Libraries/Text/TextInput/RCTBaseTextInputView.mm` - 添加 UIToolbar 条件编译
3. `node_modules/react-native/Libraries/Text/Text/RCTDynamicTypeRamp.mm` - 添加 tvOS 回退
4. `ios/Podfile` - 修正路径和函数

---

## 注意事项

1. 所有修复都在 `node_modules` 中进行
2. `pod install` 会自动应用 Podfile 中的修复函数
3. 如果修改了 `package.json` 或升级了 `react-native`，需要重新运行 npm install

---

## 测试结果

预期：`BUILD SUCCEEDED`

如果遇到新错误，请提供完整的构建日志。
