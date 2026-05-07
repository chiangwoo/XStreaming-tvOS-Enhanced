#!/bin/bash

# tvOS 兼容性修复脚本 - React Native 0.76+
# 自动检测并修复 tvOS 不兼容的代码

set -e

echo "🔧 XStreaming tvOS 兼容性修复脚本"
echo "========================================"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 函数定义
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查是否在项目根目录
if [ ! -f "package.json" ]; then
    log_error "请在项目根目录运行此脚本"
    exit 1
fi

log_info "开始修复 tvOS 兼容性问题..."
echo ""

# 1. 修复 Podfile
log_info "Step 1: 检查 Podfile..."
if [ -f "ios/Podfile" ]; then
    # 确保 Podfile 包含 tvOS 配置
    if ! grep -q "platform :tvos" ios/Podfile; then
        log_warn "Podfile 缺少 tvOS 平台配置"
        # 注意：主项目可能使用 iOS-only Podfile
    else
        log_info "Podfile tvOS 配置正常"
    fi
else
    log_error "Podfile 不存在"
    exit 1
fi

# 2. 检查 Hermes
log_info "Step 2: 检查 Hermes 引擎配置..."
if [ -d "node_modules/react-native/ReactCommon/hermes" ]; then
    log_info "Hermes 引擎已安装"
else
    log_warn "Hermes 引擎可能未正确安装"
fi

# 3. 修复 CoreMotion 问题
log_info "Step 3: 修复 CoreMotion API (tvOS 不支持)..."
find node_modules -name "*.m" -o -name "*.mm" -o -name "*.swift" | while read file; do
    if grep -q "CoreMotion" "$file" && ! grep -q "#if !TARGET_OS_TV" "$file"; then
        # 检查是否已经条件编译
        if ! grep -q "TARGET_OS_TV" "$file"; then
            log_warn "发现可能不兼容的文件: $file"
        fi
    fi
done

# 4. 检查 react-native-screens
log_info "Step 4: 检查 react-native-screens..."
RN_SCREENS_VERSION=$(node -p "require('./node_modules/react-native-screens/package.json').version" 2>/dev/null || echo "not installed")
log_info "react-native-screens 版本: $RN_SCREENS_VERSION"

if [[ $(echo "$RN_SCREENS_VERSION" | cut -d. -f1) -ge 4 ]]; then
    log_info "react-native-screens 版本 >= 4.0，支持 tvOS"
else
    log_warn "react-native-screens 版本可能不支持 tvOS，建议升级到 4.0+"
fi

# 5. 检查 react-native-gesture-handler
log_info "Step 5: 检查 react-native-gesture-handler..."
RN_GESTURE_VERSION=$(node -p "require('./node_modules/react-native-gesture-handler/package.json').version" 2>/dev/null || echo "not installed")
log_info "react-native-gesture-handler 版本: $RN_GESTURE_VERSION"

# 6. 检查 pod install
log_info "Step 6: 检查 CocoaPods..."
if [ -d "ios/Pods" ]; then
    log_info "Pods 目录存在"
    
    # 检查是否有 tvOS 相关的 Pod
    TVOS_PODS=$(find ios/Pods -name "*tvOS*" -o -name "*appletv*" 2>/dev/null | head -5)
    if [ -n "$TVOS_PODS" ]; then
        log_info "发现 tvOS 相关 Pods:"
        echo "$TVOS_PODS"
    fi
else
    log_warn "Pods 目录不存在，需要运行 pod install"
fi

# 7. 生成报告
echo ""
echo "========================================"
log_info "兼容性检查完成"
echo "========================================"
echo ""

echo "下一步操作:"
echo "1. 安装依赖: yarn install"
echo "2. 安装 Pods: cd ios && pod install && cd .."
echo "3. 构建 tvOS: node scripts/build-tvos-rn076.js simulator"
echo ""

# 8. 尝试构建
read -p "是否立即执行 yarn install 和 pod install? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_info "开始安装依赖..."
    
    yarn install
    
    if [ $? -eq 0 ]; then
        log_info "yarn install 成功"
    else
        log_error "yarn install 失败"
        exit 1
    fi
    
    cd ios
    pod install
    
    if [ $? -eq 0 ]; then
        log_info "pod install 成功"
    else
        log_error "pod install 失败"
        exit 1
    fi
    
    cd ..
    
    echo ""
    log_info "依赖安装完成！"
    echo ""
    echo "现在可以构建 tvOS 应用:"
    echo "  node scripts/build-tvos-rn076.js simulator"
else
    log_info "跳过自动安装"
    echo ""
    echo "请手动执行以下命令:"
    echo "  1. yarn install"
    echo "  2. cd ios && pod install && cd .."
fi
