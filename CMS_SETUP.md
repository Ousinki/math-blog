# Decap CMS 设置指南

本指南将帮助你设置 Decap CMS（原 Netlify CMS）以便其他作者可以通过可视化界面管理内容。

## 前置要求

- GitHub 仓库已设置
- Cloudflare Pages 已部署
- 仓库是公开的（或已配置 OAuth App）

## 设置步骤

### 1. 创建 GitHub OAuth App

由于使用 Cloudflare Pages（不是 Netlify），需要创建 GitHub OAuth App：

1. **访问 GitHub Settings**
   - 打开：https://github.com/settings/developers
   - 点击 "New OAuth App"

2. **填写信息**
   - **Application name**: `Math Blog CMS`（或任意名称）
   - **Homepage URL**: `https://math-blog-6hw.pages.dev`
   - **Authorization callback URL**: `https://math-blog-6hw.pages.dev/admin`
   - 点击 "Register application"

3. **获取 Client ID**
   - 复制 **Client ID**
   - 生成 **Client Secret**（点击 "Generate a new client secret"）
   - 保存这两个值（稍后需要）

### 2. 更新配置文件

编辑 `public/admin/config.yml`，确保以下信息正确：

```yaml
backend:
  name: github
  repo: Ousinki/math-blog  # 你的仓库
  branch: main             # 你的分支
  base_url: https://math-blog-6hw.pages.dev  # 你的网站 URL
```

### 3. 配置环境变量（可选）

如果需要更安全的配置，可以在 Cloudflare Pages 设置中添加环境变量：

- `GITHUB_CLIENT_ID`: 你的 GitHub OAuth Client ID
- `GITHUB_CLIENT_SECRET`: 你的 GitHub OAuth Client Secret

### 4. 测试 CMS

1. 访问 `https://math-blog-6hw.pages.dev/admin`
2. 点击 "Login with GitHub"
3. 授权访问
4. 尝试创建一篇测试文章

## 文件结构

```
public/
  └── admin/
      └── config.yml          # CMS 配置文件

src/
  └── pages/
      └── admin.astro         # CMS 管理页面
```

## 配置说明

### Posts Collection

- **位置**: `src/content/post/`
- **格式**: Markdown with Frontmatter
- **字段**:
  - title（必填）
  - description（必填）
  - publishDate（必填）
  - tags（可选）
  - draft（可选）
  - pinned（可选）
  - body（必填，Markdown 内容）

### Notes Collection

- **位置**: `src/content/note/`
- **格式**: Markdown with Frontmatter
- **字段**:
  - title（必填）
  - description（可选）
  - publishDate（必填，包含时间）
  - body（必填，Markdown 内容）

## 权限管理

### 添加作者

1. **方法 1：GitHub 协作者**
   - 在 GitHub 仓库设置中添加协作者
   - 协作者可以登录 CMS 并编辑内容

2. **方法 2：GitHub 组织/团队**
   - 使用 GitHub 组织管理权限
   - 更细粒度的权限控制

### 工作流程

1. 作者登录 CMS
2. 创建/编辑内容
3. CMS 自动创建 Pull Request
4. 维护者审核 PR
5. 合并后自动部署

## 故障排除

### 问题：无法登录

**解决方案**：
- 检查 OAuth App 的回调 URL 是否正确
- 确保仓库是公开的，或已正确配置权限
- 清除浏览器缓存

### 问题：无法保存

**解决方案**：
- 检查 GitHub 权限是否正确
- 确保有仓库的写入权限
- 查看浏览器控制台错误信息

### 问题：图片无法上传

**解决方案**：
- 检查 `media_folder` 和 `public_folder` 配置
- 确保路径正确

## 安全建议

1. **使用环境变量**存储敏感信息
2. **限制访问**：考虑添加访问控制
3. **定期审核**：检查 PR 内容
4. **备份**：定期备份内容

## 更多资源

- [Decap CMS 文档](https://decapcms.org/docs/)
- [GitHub OAuth App 文档](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)

