# 如何投稿文章

欢迎投稿！以下是投稿的几种方式。

## 方式 1：通过 CMS 可视化编辑器（最简单，推荐）⭐

### 步骤：

1. **访问 CMS 管理后台**
   - 打开：`https://你的网站域名/admin`
   - 例如：`https://math-blog-6hw.pages.dev/admin`

2. **登录 GitHub**
   - 点击 "Login with GitHub"
   - 授权访问你的 GitHub 账号

3. **创建新文章**
   - 点击左侧 "Posts" 或 "Notes"
   - 点击 "New Post" 或 "New Note"
   - 填写表单：
     - Title（标题）
     - Description（描述）
     - Publish Date（发布日期）
     - Tags（标签，可选）
     - Body（正文内容，支持 Markdown）

4. **保存并发布**
   - 点击 "Save" 保存草稿
   - 点击 "Publish" 发布文章
   - 系统会自动创建 Pull Request

5. **等待审核**
   - 维护者会审核你的 PR
   - 合并后自动部署到网站

**优点**：
- ✅ 可视化界面，无需技术知识
- ✅ 实时预览
- ✅ 自动格式化
- ✅ 支持图片上传

## 方式 2：通过 GitHub Web 编辑器

### 步骤：

1. **访问仓库**
   - 打开：https://github.com/Ousinki/math-blog
   - 登录你的 GitHub 账号

2. **创建新文件**
   - 点击 "Add file" → "Create new file"
   - 文件路径：`src/content/post/你的文章标题.md`

3. **使用模板**
   - 复制以下模板到编辑器中：

```markdown
---
title: "你的文章标题"
description: "文章简短描述（50-160 字符）"
publishDate: "2025-01-20"
tags: ["标签1", "标签2"]
draft: false
---

# 文章标题

这里是你的文章内容...

## 章节标题

更多内容...
```

4. **提交**
   - 在页面底部填写提交信息
   - 选择 "Create a new branch for this commit"
   - 点击 "Propose new file"

5. **创建 Pull Request**
   - 点击 "Create pull request"
   - 等待审核和合并

## 方式 2：通过 Git（适合熟悉 Git 的作者）

### 步骤：

1. **克隆仓库**
```bash
git clone https://github.com/Ousinki/math-blog.git
cd math-blog
```

2. **安装依赖**
```bash
npm install
```

3. **创建新分支**
```bash
git checkout -b add-your-post
```

4. **创建文章**
   - 在 `src/content/post/` 目录下创建 `.md` 文件
   - 使用上面的模板

5. **提交并推送**
```bash
git add .
git commit -m "Add new post: 文章标题"
git push origin add-your-post
```

6. **创建 Pull Request**
   - 在 GitHub 上创建 PR
   - 等待审核

## 文章格式要求

### Posts（文章）Frontmatter 模板：

```markdown
---
title: "文章标题（最多 60 字符）"
description: "文章描述（必填）"
publishDate: "2025-01-20"  # 或 "20 January 2025"
tags: ["标签1", "标签2"]   # 可选
draft: false              # 可选，true 表示草稿
pinned: false             # 可选，true 表示置顶
updatedDate: "2025-01-21" # 可选，更新日期
---
```

### Notes（笔记）Frontmatter 模板：

```markdown
---
title: 笔记标题
description: "笔记描述（可选）"
publishDate: "2025-01-20T14:30:00Z"  # 必须包含时间
---
```

## 文件命名建议

- 使用英文或拼音
- 避免特殊字符
- 可以使用连字符：`my-article.md`
- 可以使用子目录组织：`2025/january/article.md`

## 注意事项

- 文章会在审核后自动发布
- 草稿文章（`draft: true`）不会在生产环境显示
- 合并 PR 后，网站会自动部署
- 如有问题，请创建 Issue 或联系维护者

## 需要帮助？

- 查看现有文章示例：`src/content/post/`
- 创建 Issue 提问
- 联系项目维护者

