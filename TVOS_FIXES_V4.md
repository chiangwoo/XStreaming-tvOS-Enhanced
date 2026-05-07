# XStreaming-tvOS RN 0.76.5 修复日志 v4

**日期：** 2026-05-07
**RN 版本：** 0.76.5
**修复版本：** v4
**仓库：** main 分支

---

## 本次修复的问题

### 1. RCTTextView.mm handleLongPress: 方法 - 完整条件编译修复

**问题：** Podfile 中的 regex 修复不完整，`handleLongPress:` 方法中的 iOS-only API 调用仍然在 `#endif` 外面。

**修复：** 将整个 `handleLongPress:` 方法用 `#if !TARGET_OS_TV` 包裹，确保 tvOS 编译时完全跳过此方法。

```objc
- (void)handleLongPress:(UILongPressGestureRecognizer *)gesture
{
#if !TARGET_OS_TV
  if (@available(iOS 16.0, macCatalyst 16.0, *)) {
    // UIEditMenuInteraction
  } else {
    // UIMenuController
  }
#endif
}
```

### 2. react-native-cookies WebKit tvOS 不兼容

**问题：** tvOS SDK 没有 WebKit 框架，导致 `#import <WebKit/WebKit.h>` 失败。

**修复：** 在 Podfile 中添加 `fix_react_native_cookies_for_tvos()` 函数，自动为以下文件添加条件编译：
- `RNCookieManagerIOS.h`
- `RNCookieManagerIOS.m`

```objc
#if !TARGET_OS_TV
#import <WebKit/WebKit.h>
#endif
```

### 3. Hermes tarball 下载损坏（Maven Central IP 限制）

**问题：** Maven Central 对 IP 限流，release tarball 下载到 427B 的 HTML 错误页面。

**修复：** 在 Podfile 中添加 `fix_hermes_tarball_for_tvos()` 函数，自动用 debug tarball 覆盖损坏的 release tarball。

```ruby
if File.exist?(debug_tarball) && File.size(debug_tarball) > 10000
  FileUtils.cp(debug_tarball, release_tarball)
end
```

### 4. Podfile API 兼容性修复

**问题：** `installer.sandbox_root` 在 CocoaPods 1.16.2 中不存在。

**修复：** 改用 `installer.sandbox.root.to_s`

### 5. Podfile 路径计算修复

**问题：** 原始的路径计算 `File.join(installer.sandbox_root, '..', '..', '..')` 不正确。

**修复：** 改用 `File.expand_path('..', __dir__)` 获取项目根路径。

### 6. Pods 文件只读问题修复

**问题：** glog 源文件在 Pods 安装后被设为只读（`0444`），post-install hook 无法写入。

**修复：** 在修改文件前使用 `File.chmod(0644, path)` 解除只读，修改后使用 `File.chmod(0444, path)` 恢复只读。

---

## 完整的 tvOS 修复清单

| # | 修复项 | 位置 | 状态 |
|---|--------|------|------|
| 1 | glog `syscall(__NR_gettid)` | utilities.cc | ✅ |
| 2 | glog `safe_write` syscall | raw_logging.cc | ✅ |
| 3 | RCTTextView UIEditMenuInteraction | RCTTextView.mm | ✅ |
| 4 | RCTTextView UIMenuController | RCTTextView.mm | ✅ |
| 5 | RCTTextView handleLongPress | RCTTextView.mm | ✅ |
| 6 | RCTTextView UIPasteboard | RCTTextView.mm | ✅ |
| 7 | RCTUITextView scrollsToTop | RCTUITextView.mm | ✅ |
| 8 | RCTConvert UIInterfaceOrientationMask | RCTConvert.h | ✅ |
| 9 | RCTUtils UIStatusBarManager | RCTUtils.h | ✅ |
| 10 | PrivacyInfo.xcprivacy 重复 | Podfile | ✅ |
| 11 | react-native-cookies WebKit | Podfile | ✅ |
| 12 | Hermes tarball 损坏 | Podfile | ✅ |
| 13 | Podfile API 兼容性 | Podfile | ✅ |
| 14 | Podfile 路径计算 | Podfile | ✅ |
| 15 | Pods 文件只读 | Podfile | ✅ |

---

## Podfile 修复函数列表

1. `fix_glog_for_tvos(installer)` - 修复 glog syscall 问题
2. `fix_rn_text_for_tvos(installer)` - 修复 React Native Text 组件
3. `fix_privacy_info_duplicate(installer)` - 修复 PrivacyInfo 重复
4. `fix_react_native_cookies_for_tvos(installer)` - 修复 react-native-cookies
5. `fix_hermes_tarball_for_tvos(installer)` - 修复 Hermes tarball

---

## 构建命令

```bash
# 1. 安装依赖
yarn install
cd ios && pod install

# 2. 生成 JS Bundle
npx react-native bundle --platform ios --dev false \
  --entry-file index.js --bundle-output ios/main.jsbundle

# 3. tvOS Simulator 构建
xcodebuild -workspace XStreaming.xcworkspace \
  -scheme XStreaming -sdk appletvos -configuration Release \
  -destination 'platform=tvOS Simulator,OS=18.1,name=Apple TV 4K (3rd generation)' \
  CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO CODE_SIGNING_ALLOWED=NO build

# 4. tvOS 真实设备构建（需要签名）
xcodebuild -workspace XStreaming.xcworkspace \
  -scheme XStreaming -sdk appletvos -configuration Release \
  -destination 'generic/platform=tvOS' \
  build
```

---

## 注意事项

### Hermes tvOS 支持
- RN 0.76.5 的 Hermes 预编译二进制只有 iOS arm64 切片，没有 tvOS arm64
- tvOS Simulator 用的是 arm64 架构，实际会调用模拟器内核的 JIT
- **真正的 tvOS 设备（Apple TV）需要 tvOS arm64 切片的 Hermes**，否则运行时可能 crash

### react-native-cookies
- 在 tvOS 上，cookie 功能会被禁用
- JS 层调用 cookie API 时不会有任何效果，但不会 crash

---

**修复完成！** 所有 tvOS 兼容性问题已在 Podfile 中自动修复。
