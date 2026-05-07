#!/usr/bin/env node

/**
 * tvOS 构建脚本 - React Native 0.76+
 * 
 * 支持：
 * - tvOS 模拟器构建
 * - tvOS 设备构建
 * - Archive 构建
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BUILDTYPE = process.argv[2] || 'simulator'; // simulator, device, archive
const CONFIG = process.argv[3] || 'Debug'; // Debug, Release

const BUILD_DIR = path.join(__dirname, '..', 'build');
const ARCHIVE_PATH = path.join(BUILD_DIR, 'XStreaming-tvOS.xcarchive');
const EXPORT_PATH = path.join(BUILD_DIR, 'tvos-export');

function log(message, type = 'info') {
  const prefix = {
    info: '\x1b[36m[INFO]\x1b[0m',
    success: '\x1b[32m[SUCCESS]\x1b[0m',
    warn: '\x1b[33m[WARN]\x1b[0m',
    error: '\x1b[31m[ERROR]\x1b[0m',
  };
  console.log(`${prefix[type]} ${message}`);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    log(`Created directory: ${dir}`);
  }
}

function run(command, options = {}) {
  log(`Running: ${command}`);
  try {
    execSync(command, {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
      ...options,
    });
    return true;
  } catch (error) {
    log(`Command failed: ${command}`, 'error');
    return false;
  }
}

function step1_检查环境() {
  log('Step 1: 检查构建环境...');
  
  // 检查 Xcode
  try {
    const xcodeVersion = execSync('xcodebuild -version', { encoding: 'utf8' });
    log(xcodeVersion.split('\n')[0]);
  } catch (error) {
    log('Xcode 未安装或无法访问', 'error');
    process.exit(1);
  }
  
  // 检查 CocoaPods
  try {
    const podVersion = execSync('pod --version', { encoding: 'utf8' });
    log(`CocoaPods version: ${podVersion.trim()}`);
  } catch (error) {
    log('CocoaPods 未安装', 'error');
    process.exit(1);
  }
  
  log('环境检查通过', 'success');
}

function step2_生成JSBundle() {
  log('Step 2: 生成 JavaScript Bundle...');
  
  ensureDir(path.join(__dirname, '..', 'ios', 'bundle'));
  
  // 为 tvOS 生成 bundle
  const bundleCmd = `npx react-native bundle \
    --platform tvos \
    --dev false \
    --entry-file index.js \
    --bundle-output ios/bundle/main.tvos.jsbundle \
    --assets-dest ios/bundle \
    --reset-cache`;
  
  if (!run(bundleCmd)) {
    log('JS Bundle 生成失败', 'error');
    process.exit(1);
  }
  
  log('JS Bundle 生成成功', 'success');
}

function step3_安装Pods() {
  log('Step 3: 安装 CocoaPods 依赖...');
  
  if (!run('cd ios && pod install && cd ..')) {
    log('Pod 安装失败', 'error');
    process.exit(1);
  }
  
  log('Pod 安装成功', 'success');
}

function step4_构建tvOS() {
  log(`Step 4: 构建 tvOS (${BUILDTYPE} - ${CONFIG})...`);
  
  ensureDir(BUILD_DIR);
  
  let buildCommand;
  
  switch (BUILDTYPE) {
    case 'simulator':
      buildCommand = `xcodebuild \
        -workspace ios/XStreaming.xcworkspace \
        -scheme XStreaming \
        -configuration ${CONFIG} \
        -destination "generic/platform=tvOS Simulator" \
        -UseNewBuildSystem=YES \
        build \
        CODE_SIGNING_ALLOWED=NO`;
      break;
      
    case 'device':
      buildCommand = `xcodebuild \
        -workspace ios/XStreaming.xcworkspace \
        -scheme XStreaming \
        -configuration ${CONFIG} \
        -destination "generic/platform=tvOS" \
        -UseNewBuildSystem=YES \
        build`;
      break;
      
    case 'archive':
      buildCommand = `xcodebuild \
        -workspace ios/XStreaming.xcworkspace \
        -scheme XStreaming \
        -configuration Release \
        -destination "generic/platform=tvOS" \
        -UseNewBuildSystem=YES \
        archive \
        -archivePath ${ARCHIVE_PATH}`;
      break;
      
    default:
      log(`未知的构建类型: ${BUILDTYPE}`, 'error');
      process.exit(1);
  }
  
  if (!run(buildCommand)) {
    log('构建失败', 'error');
    process.exit(1);
  }
  
  log(`构建成功: ${BUILDTYPE}`, 'success');
}

function step5_导出IPA() {
  if (BUILDTYPE !== 'archive') {
    log('跳过 IPA 导出（非 Archive 模式）');
    return;
  }
  
  log('Step 5: 导出 IPA...');
  
  ensureDir(EXPORT_PATH);
  
  const exportPlist = path.join(__dirname, 'tvos-export-options.plist');
  
  if (!fs.existsSync(exportPlist)) {
    log('导出配置文件不存在，创建默认配置...', 'warn');
    
    const defaultPlist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>method</key>
  <string>app-store</string>
  <key>teamID</key>
  <string>YOUR_TEAM_ID</string>
  <key>uploadBitcode</key>
  <false/>
  <key>uploadSymbols</key>
  <true/>
</dict>
</plist>`;
    
    fs.writeFileSync(exportPlist, defaultPlist);
    log('请编辑 scripts/tvos-export-options.plist 配置你的 Team ID', 'warn');
  }
  
  const exportCommand = `xcodebuild \
    -exportArchive \
    -archivePath ${ARCHIVE_PATH} \
    -exportPath ${EXPORT_PATH} \
    -exportOptionsPlist ${exportPlist}`;
  
  if (!run(exportCommand)) {
    log('IPA 导出失败', 'error');
    process.exit(1);
  }
  
  const ipaPath = path.join(EXPORT_PATH, 'XStreaming.ipa');
  if (fs.existsSync(ipaPath)) {
    const stats = fs.statSync(ipaPath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    log(`IPA 生成成功: ${ipaPath} (${sizeMB} MB)`, 'success');
  }
}

// 主函数
function main() {
  log('================================================');
  log('  XStreaming tvOS 构建脚本 (React Native 0.76+)');
  log('================================================');
  log('');
  log(`构建模式: ${BUILDTYPE}`);
  log(`配置: ${CONFIG}`);
  log('');
  
  try {
    step1_检查环境();
    step2_生成JSBundle();
    step3_安装Pods();
    step4_构建tvOS();
    step5_导出IPA();
    
    log('');
    log('================================================');
    log('  构建完成! 🎉');
    log('================================================');
    log('');
    log('下一步:');
    log('1. 在 Xcode 中打开 ios/XStreaming.xcworkspace');
    log('2. 选择你的 Apple TV 模拟器或真机');
    log('3. 点击 Run 运行应用');
    log('');
    
  } catch (error) {
    log(`构建失败: ${error.message}`, 'error');
    process.exit(1);
  }
}

main();
