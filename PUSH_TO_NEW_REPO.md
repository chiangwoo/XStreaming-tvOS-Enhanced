# 🚀 新项目创建和推送指南

## 步骤 1: 在 GitHub 上创建新仓库

### 1.1 访问 GitHub
打开浏览器，访问：https://github.com/new

### 1.2 配置仓库信息

建议配置如下：

```
Repository name: XStreaming-tvOS-Enhanced
Description: XStreaming with tvOS support - A derivative work adding Apple TV support to the original XStreaming project

❌ Don't initialize this repository with:
   ☐ Add a README file (我们已经有 README 了)
   ☐ Add .gitignore (我们已经有 .gitignore 了)
   ☐ Choose a license (我们已经有 LICENSE 了)
```

### 1.3 可见性设置
- **Private（私有）**: 推荐，仅你自己可见
- **Public（公开）**: 如果你希望其他人也能看到

### 1.4 点击 "Create repository"

---

## 步骤 2: 配置 Git Remote

创建仓库后，GitHub 会显示推送命令，按照以下方式操作：

### 2.1 添加新的远程仓库

```bash
cd /workspace/XStreaming-tvOS

# 添加新的远程仓库（new-origin）
git remote add new-origin https://github.com/YOUR_USERNAME/XStreaming-tvOS-Enhanced.git
```

**注意**: 将 `YOUR_USERNAME` 替换为你的 GitHub 用户名

### 2.2 验证远程仓库

```bash
git remote -v
```

应该显示：
```
origin      https://github.com/Geocld/XStreaming.git (fetch)
origin      https://github.com/Geocld/XStreaming.git (push)
new-origin  https://github.com/YOUR_USERNAME/XStreaming-tvOS-Enhanced.git (fetch)
new-origin  https://github.com/YOUR_USERNAME/XStreaming-tvOS-Enhanced.git (push)
```

---

## 步骤 3: 推送到新仓库

### 3.1 推送所有分支和标签

```bash
# 推送 ios 分支
git push -u new-origin ios

# 如果有其他分支需要推送
git push -u new-origin --all

# 推送标签（如果有）
git push -u new-origin --tags
```

---

## 步骤 4: 设置新仓库为主远程仓库（可选）

如果你想让 `new-origin` 成为默认推送目标：

```bash
# 修改默认推送远程为 new-origin
git config push.default current
git remote set-head new-origin ios
```

或者，你想让 `new-origin` 完全替换 `origin`：

```bash
# 删除旧的 origin
git remote remove origin

# 重命名 new-origin 为 origin
git remote rename new-origin origin

# 验证
git remote -v
```

---

## 步骤 5: 验证推送成功

### 5.1 检查本地状态

```bash
git status
git log --oneline -5
```

### 5.2 在 GitHub 上查看

访问你的新仓库：https://github.com/YOUR_USERNAME/XStreaming-tvOS-Enhanced

确认所有文件都已推送：
- ✅ README_TVOS.md
- ✅ TVOS_BUILD_GUIDE.md
- ✅ TVOS_README.md
- ✅ TVOS_CHANGES.md
- ✅ LICENSE_DERIVATIVE.md
- ✅ scripts/build-tvos.js
- ✅ scripts/tvos-export-options.plist
- ✅ package.json（已修改）
- ✅ ios/XStreaming.xcodeproj/project.pbxproj（已修改）

---

## 📝 后续操作

### 6.1 更新仓库说明

在 GitHub 仓库页面，点击 "Settings" → "General"，可以添加：
- 仓库描述
- 仓库网站
- Topics（标签），例如：`react-native`, `tvos`, `apple-tv`, `streaming`

### 6.2 设置仓库可见性

如果创建时选择了私有，后续可以改为公开：
- Settings → General → Danger Zone → Change visibility

### 6.3 添加协作者（如果需要）

Settings → Collaborators → Add people

---

## 🔐 身份验证

推送时会要求输入：
- **Username**: 你的 GitHub 用户名
- **Password**: 你的 Personal Access Token

### 如何获取 Personal Access Token

1. 访问：https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 选择权限：`repo`（完整仓库访问权限）
4. 点击生成并复制 token

---

## ✅ 完成检查清单

- [ ] 在 GitHub 上创建了新仓库
- [ ] 添加了 `new-origin` 远程仓库
- [ ] 推送了 `ios` 分支
- [ ] 验证所有文件都已上传
- [ ] 检查了 README 和许可证文件
- [ ] 确认仓库说明清晰明确

---

## 🆘 常见问题

### Q: 推送失败，提示 "Authentication failed"
A: 使用 Personal Access Token，不要使用 GitHub 账号密码

### Q: 如何保留对原仓库的引用？
A: 保留 `origin` 指向原仓库，使用 `new-origin` 指向你的仓库

### Q: 如何从原仓库拉取最新更新？
A: `git fetch origin` 然后 `git merge origin/ios`

### Q: 如何将修改合并回原仓库？
A: 测试完成后，可以向原仓库提交 Pull Request

---

## 📞 需要帮助？

如果遇到问题，请检查：
1. Personal Access Token 是否有效
2. 仓库名称是否正确
3. 是否有推送权限

准备好后，告诉我你的仓库名称，我可以帮你推送！
