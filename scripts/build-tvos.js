#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📺 开始构建 tvOS 应用...\n');

// 检查必要的目录
const buildDir = path.join(__dirname, '..', 'build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
  console.log('✅ 创建 build 目录');
}

const bundleDir = path.join(__dirname, '..', 'ios', 'bundle');
if (!fs.existsSync(bundleDir)) {
  fs.mkdirSync(bundleDir, { recursive: true });
  console.log('✅ 创建 bundle 目录');
}

try {
  // 步骤 1: 生成 JS Bundle
  console.log('\n📦 步骤 1/3: 生成 tvOS JS Bundle...');
  execSync('yarn bundle:tvos', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  console.log('✅ JS Bundle 生成成功');

  // 步骤 2: 安装 CocoaPods 依赖
  console.log('\n📦 步骤 2/3: 安装 CocoaPods 依赖...');
  execSync('cd ios && pod install', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  console.log('✅ CocoaPods 依赖安装成功');

  // 步骤 3: 构建 Archive
  console.log('\n📦 步骤 3/3: 构建 tvOS Archive...');
  const workspacePath = path.join(__dirname, '..', 'ios', 'XStreaming.xcworkspace');
  const archivePath = path.join(__dirname, '..', 'build', 'XStreaming-tvOS.xcarchive');

  execSync(
    `xcodebuild -workspace "${workspacePath}" -scheme XStreaming -destination 'generic/platform=tvOS' -configuration Release archive -archivePath "${archivePath}"`,
    {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    }
  );
  console.log('✅ Archive 构建成功');

  // 步骤 4: 导出 IPA
  console.log('\n📦 步骤 4/4: 导出 IPA 文件...');
  const exportOptionsPath = path.join(__dirname, 'tvos-export-options.plist');
  const exportPath = path.join(__dirname, '..', 'build', 'tvos-export');

  if (!fs.existsSync(exportOptionsPath)) {
    console.error('❌ 错误: tvos-export-options.plist 文件不存在');
    console.log('💡 提示: 请先创建 tvos-export-options.plist 文件');
    process.exit(1);
  }

  execSync(
    `xcodebuild -exportArchive -archivePath "${archivePath}" -exportPath "${exportPath}" -exportOptionsPlist "${exportOptionsPath}"`,
    {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    }
  );

  console.log('\n✅ tvOS IPA 构建完成！');
  console.log(`📂 IPA 位置: ${path.join(exportPath, 'XStreaming.ipa')}`);

} catch (error) {
  console.error('\n❌ 构建失败:', error.message);
  process.exit(1);
}
