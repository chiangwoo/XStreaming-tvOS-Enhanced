# React Native 0.76+ 升级计划

## 当前状态分析

### 版本信息
- **React Native**: 0.72.14
- **React**: 18.2.0
- **Node**: >= 16
- **Yarn**: 4.2.2

### 主要依赖
- React Navigation 6.x
- Redux 5.x
- 多个 React Native 原生模块

### 问题诊断
1. **React Native 0.72.14** 官方对 tvOS 支持不完整
2. 需要修改 25+ 个 RN 核心文件
3. Hermes vtool hack 导致运行时 crash
4. 第三方库大量不支持 tvOS

---

## 升级目标

**目标版本**: React Native 0.76.x

### 为什么选择 0.76
- ✅ 更好的 tvOS 支持
- ✅ New Architecture 默认启用
- ✅ 改进的 Hermes 引擎
- ✅ 减少手动补丁需求
- ✅ 社区 tvOS 兼容库成熟

---

## 升级路径

### 阶段 1: 准备工作

#### 1.1 备份当前代码
```bash
git checkout -b backup/rn-0.72.14
git push origin backup/rn-0.72.14
```

#### 1.2 创建升级分支
```bash
git checkout -b upgrade/rn-0.76
```

---

### 阶段 2: 依赖升级

#### 2.1 升级核心依赖

**package.json 变更**:

```json
{
  "dependencies": {
    "react": "19.0.0",
    "react-native": "0.76.5",
    "react-native-screens": "^4.4.0",
    "react-native-safe-area-context": "^4.14.0",
    "@react-navigation/native": "^7.0.0",
    "@react-navigation/native-stack": "^7.0.0",
    "react-native-gesture-handler": "^2.21.0",
    "@react-native-community/netinfo": "^11.4.0",
    "react-native-svg": "^15.8.0"
  },
  "devDependencies": {
    "@react-native/metro-config": "^0.76.0",
    "@types/react": "^19.0.0",
    "react-test-renderer": "19.0.0",
    "typescript": "^5.0.0"
  }
}
```

#### 2.2 升级步骤

```bash
# 1. 删除 node_modules 和锁文件
rm -rf node_modules yarn.lock package-lock.json ios/Pods ios/Podfile.lock

# 2. 更新 package.json（使用新的依赖版本）

# 3. 安装依赖
yarn install

# 4. 重新生成 iOS Pods
cd ios && pod install && cd ..
```

---

### 阶段 3: 代码迁移

#### 3.1 TypeScript 配置

更新 `tsconfig.json`:
```json
{
  "extends": "@tsconfig/react-native/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

#### 3.2 Babel 配置

更新 `babel.config.js`:
```javascript
module.exports = {
  presets: ['module:@react-native/babel-preset'],
};
```

#### 3.3 Metro 配置

更新 `metro.config.js`:
```javascript
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

---

### 阶段 4: tvOS 配置

#### 4.1 更新 Podfile

```ruby
# Resolve react_native_pods.rb with node to allow for hoisting
require Pod::Executable.execute_command('node', ['-p',
  'require.resolve(
    "react-native/scripts/react_native_pods.rb",
    {paths: [process.argv[1]]},
  )', __dir__]).strip

# iOS 平台
platform :ios, '15.1'

# tvOS 平台
platform :tvos, '15.1'

prepare_react_native_project!

linkage = ENV['USE_FRAMEWORKS']
if linkage != nil
  Pod::UI.puts "Configuring Pod with #{linkage}ally linked Frameworks".green
  use_frameworks! :linkage => linkage.to_sym
end

target 'XStreaming' do
  config = use_native_modules!

  use_react_native!(
    :path => config[:reactNativePath],
    :app_path => "#{Pod::Config.instance.installation_root}/..",
    # tvOS 支持
    :tvossrc => "#{config[:reactNativePath]}/../node_modules/react-native/ReactApple/TvOS",
  )

  target 'XStreamingTests' do
    inherit! :complete
  end

  post_install do |installer|
    react_native_post_install(
      installer,
      config[:reactNativePath],
      :mac_catalyst_enabled => false
    )
    
    # tvOS 特定配置
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '15.1'
        config.build_settings['TVOS_DEPLOYMENT_TARGET'] = '15.1'
      end
    end
  end
end
```

#### 4.2 Xcode 项目配置

需要更新:
- `project.pbxproj` - 添加 tvOS target
- 添加 `XStreaming-tvOS` scheme
- 配置 tvOS 专用设置

---

### 阶段 5: 第三方库兼容性

#### 5.1 需要替换的库

| 原库 | 替代库 | 原因 |
|------|--------|------|
| react-native-haptic-feedback | react-native-haptic-feedback (新版本) | 旧版本不支持 tvOS |
| react-native-mmkv | react-native-mmkv v3+ | 新版本支持 tvOS |
| react-native-orientation-locker | react-native-orientation-locker (新版本) | 新版本支持 tvOS |
| @react-native-community/slider | @react-native-community/slider (新版本) | 新版本支持 tvOS |

#### 5.2 可能需要移除的库

- `react-native-edge-to-edge` - 可能不兼容
- 部分不支持 tvOS 的原生模块

---

### 阶段 6: 编译修复

#### 6.1 预期的问题

1. **C++ 编译错误** - 需要升级到 C++20
2. **Pod 编译错误** - 需要更新 podspec
3. **Swift 版本问题** - 确保使用 Swift 5.0+
4. **桥接文件问题** - 使用新的架构

#### 6.2 解决方案

创建 `scripts/fix-tvos-compat.sh`:

```bash
#!/bin/bash
# tvOS 兼容性修复脚本

set -e

echo "🔧 Applying tvOS compatibility fixes..."

# 1. 修复 C++ 版本
cd ios
for file in $(find . -name "*.mm" -o -name "*.m" -o -name "*.h" -o -name "*.cpp" -o -name "*.cc" | xargs grep -l "APPLICATION_EXTENSION" 2>/dev/null); do
  if ! grep -q "APPLICATION_EXTENSION" "$file"; then
    echo "Adding APPLICATION_EXTENSION to $file"
    # 添加条件编译
  fi
done

# 2. 修复条件编译
find ../node_modules -name "*.podspec" -exec sed -i '' \
  -e 's/s.source = { :git/s.source = { :git/' \
  -e 's/ios-deployment-target/ios-deployment-target, :tvos-deployment-target/' {} \;

echo "✅ tvOS compatibility fixes applied"
```

---

### 阶段 7: 构建验证

#### 7.1 iOS 构建
```bash
xcodebuild -workspace ios/XStreaming.xcworkspace \
  -scheme XStreaming \
  -configuration Debug \
  -destination "platform=iOS Simulator,name=iPhone 15" \
  build
```

#### 7.2 tvOS 构建
```bash
xcodebuild -workspace ios/XStreaming.xcworkspace \
  -scheme XStreaming \
  -configuration Debug \
  -destination "platform=tvOS Simulator,name=Apple TV 4K" \
  build
```

#### 7.3 Bundle 验证
```bash
# iOS
yarn bundle:ios

# tvOS
yarn bundle:tvos
```

---

## 回滚计划

如果升级失败:

```bash
# 1. 切换回备份分支
git checkout backup/rn-0.72.14

# 2. 恢复 node_modules
yarn install

# 3. 恢复 iOS Pods
cd ios && pod install && cd ..

# 4. 验证备份可用
yarn start
```

---

## 时间估算

| 阶段 | 预估时间 | 备注 |
|------|---------|------|
| 准备工作 | 10 分钟 | 备份、创建分支 |
| 依赖升级 | 30 分钟 | yarn install, pod install |
| 代码迁移 | 2-4 小时 | 依赖复杂度 |
| tvOS 配置 | 1-2 小时 | Xcode 配置 |
| 编译修复 | 2-4 小时 | 解决编译错误 |
| 构建验证 | 1-2 小时 | iOS + tvOS |

**总计**: 7-14 小时（取决于问题复杂度）

---

## 风险评估

### 高风险
- ❌ Hermes 引擎 tvOS 支持
- ❌ 第三方库兼容性
- ❌ New Architecture 迁移

### 中风险
- ⚠️ Babel 配置变更
- ⚠️ TypeScript 严格模式
- ⚠️ Pod 依赖解析

### 低风险
- ✅ Metro 配置
- ✅ TypeScript 版本升级
- ✅ React 版本升级

---

## 成功标准

1. ✅ iOS 模拟器构建成功
2. ✅ tvOS 模拟器构建成功
3. ✅ JS Bundle 生成成功（iOS + tvOS）
4. ✅ 应用在模拟器启动不 crash
5. ✅ 核心功能可用（导航、数据加载）

---

## 下一步行动

1. [ ] 创建备份分支
2. [ ] 创建升级分支
3. [ ] 更新 package.json
4. [ ] 删除 node_modules
5. [ ] yarn install
6. [ ] 解决依赖冲突
7. [ ] 更新 iOS 配置
8. [ ] 测试构建
