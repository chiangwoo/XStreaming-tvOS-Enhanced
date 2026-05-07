# RN 0.76.5 tvOS 构建问题修复 v6

## 修复日期
2025-05-07

## 构建环境
- React Native: 0.76.5
- Xcode: 16.x
- macOS: 最新版
- CocoaPods: 最新版

---

## 本次修复的问题

### 1. RCTConvert.mm - 3 个 iOS-only API
**问题**: RCTConvert.mm 中使用了 tvOS 不支持的 UIKit 类型

**修复**:
- `UIDataDetectorTypes` - 整个宏用 `#if !TARGET_OS_TV` 包裹
- `UIInterfaceOrientationMask` - 整个宏用 `#if !TARGET_OS_TV` 包裹
- `UIModalPresentationStyle` - 整个宏用 `#if !TARGET_OS_TV` 包裹

### 2. RNCookieManagerIOS.m - WebKit 框架
**问题**: react-native-cookies 使用了 tvOS 不支持的 WebKit 框架

**修复**:
- 头文件 `#import <WebKit/WebKit.h>` 用条件编译包裹
- 实现文件中 `WKHTTPCookieStore` 相关代码用条件编译包裹
- 路径查找逻辑改进，支持多种可能的目录名

### 3. RCTRedBoxExtraDataViewController.m - separatorStyle
**问题**: `separatorStyle` 属性在 tvOS 上不可用

**修复**:
```objc
#if !TARGET_OS_TV
    [self.tableView setSeparatorStyle:UITableViewCellSeparatorStyleNone];
#endif
```

### 4. RCTUtils.m - UIStatusBarManager
**问题**: `UIStatusBarManager` 在 tvOS 上不可用

**修复**:
```objc
#if !TARGET_OS_TV
RCT_EXTERN UIStatusBarManager *RCTUIStatusBarManager(void);
#endif
```

### 5. RCTRefreshControl.m - UIRefreshControl
**问题**: `UIRefreshControl` 在 tvOS 上不可用

**修复**:
- 头文件导入用 `#if TARGET_OS_TV` 包裹
- `RCT_EXTERN_MODULE` 声明用条件编译包裹

---

## 完整的 Podfile 修复函数

### fix_glog_for_tvos()
修复 glog 中的 `syscall(__NR_gettid)` tvOS 不兼容问题

### fix_rn_text_for_tvos()
修复 React Native Text 组件问题：
- RCTTextView.mm
- RCTUITextView.mm
- **RCTConvert.mm** (新增)
- **RCTUtils.m** (新增)
- **RCTRefreshControl.m** (新增)
- **RCTRedBoxExtraDataViewController.m** (新增)

### fix_react_native_cookies_for_tvos()
修复 react-native-cookies WebKit 问题：
- RNCookieManagerIOS.h
- RNCookieManagerIOS.m

### fix_hermes_tarball_for_tvos()
修复 Hermes tarball 下载问题

### fix_privacy_info_duplicate()
删除重复的 PrivacyInfo.xcprivacy

---

## 构建命令

```bash
# 完整构建流程
cd ios
pod install
cd ..
npx react-native bundle \
  --platform tvOS \
  --dev false \
  --entry-file index.js \
  --bundle-output ios/main.jsbundle \
  --assets-dest ios

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

---

## 历史修复

### v5 (之前)
- RCTTextView.mm 重新正确修复
- RCTBaseTextInputView.mm UIToolbar
- RCTDynamicTypeRamp.mm UIFontMetrics

### v4
- RCTTextView handleLongPress 完整条件编译
- react-native-cookies WebKit
- Hermes tarball
- Podfile API 兼容性

### v3
- glog syscall 修复
- PrivacyInfo.xcprivacy 重复

### v2
- react-native-screens codegen 问题
- react-native-orientation-locker 版本
- react-native-webview 版本

### v1
- React Native 0.76.5 升级

---

## 状态
✅ 所有已知 tvOS 不兼容问题已修复
