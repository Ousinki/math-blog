# CMS视频功能使用指南

## 功能概述

现在你可以在 CMS Admin 页面中为文章添加视频功能。所有包含视频的文章会自动保存为 `.mdx` 格式，以支持视频组件。

**✨ 自动化功能：**
- ✅ **自动import注入**：构建时自动检测Video组件并注入必要的import语句
- ✅ **路径自动修复**：提供脚本一键修复错误的视频路径

## 如何使用

### 1. 在CMS中添加视频

1. 访问 `http://localhost:4321/admin` 页面
2. 创建新文章或编辑现有文章  
3. 在 **Body** 编辑器中，点击工具栏的 **"+"** 按钮
4. 选择 **"Video"** 组件
5. 你会看到两个选项：
   - **Choose a video** - 从本地上传视频文件
   - **Insert from URL** - 输入视频URL
6. 上传的视频会自动保存到 `public/video/` 文件夹

### 2. Import语句（自动处理）

**好消息！** 你**不需要**手动添加import语句了！

系统会在构建时自动检测MDX文件中的 `<Video>` 组件，并自动注入：

```mdx
import Video from "../../components/Video.astro";
```

即使其他作者在CMS中创建的文件没有import语句，`git pull` 下来后也能正常工作！

### 3. 修复视频路径

如果从CMS pull下来的文件视频路径不正确（比如是 `/images/posts/` 而不是 `/video/`），运行以下命令一键修复：

```bash
npm run fix-videos
```

这个命令会：
- 扫描所有MDX文件  
- 自动将 `/images/posts/*.mp4` 替换为 `/video/*.mp4`
- 显示修复了多少个文件

## 文件格式说明

- **包含视频的文章**：必须使用 `.mdx` 格式（CMS已自动配置）
- **没有视频的文章**：可以使用 `.md` 或 `.mdx` 格式
- 所有通过CMS创建的新文章默认使用 `.mdx` 格式

## Git工作流程

当其他作者通过CMS添加视频后：

```bash
# 1. 拉取最新代码
git pull

# 2. 如果视频路径不对，运行修复脚本
npm run fix-videos

# 3. 正常启动开发服务器（import会自动注入）
npm run dev
```

就这么简单！不需要手动编辑任何文件。

## 技术细节

### 自动Import注入

通过 `remarkAutoImportVideo` 插件实现：
- 位置：`src/plugins/remark-auto-import-video.ts`
- 工作原理：在构建时扫描AST，检测Video组件，自动注入import
- 配置：已添加到 `astro.config.ts` 的 `remarkPlugins` 数组

### 路径自动修复

通过修复脚本实现：
- 位置：`scripts/fix-video-paths.mjs`  
- 运行：`npm run fix-videos`
- 功能：批量替换错误的视频路径

## 注意事项

1. **视频大小限制**：建议视频文件不超过50MB
2. **视频格式**：推荐使用MP4格式以获得最佳兼容性
3. **本地开发**：必须访问 `http://localhost:4321/admin`，不要访问生产环境的admin
4. **视频存储**：所有视频应该存储在 `public/video/` 文件夹

## 示例

完整的 MDX 文章示例：

```mdx
---
title: "如何使用视频功能"
description: "演示视频功能的使用方法"
publishDate: 2024-01-01
tags: ["教程", "视频"]
draft: false
video: "/video/tutorial.mp4"
---

import Video from "../../components/Video.astro";

<Video src="/video/tutorial.mp4" />

## 文章内容

这是一个包含视频的文章示例...
```

## 故障排除

### 视频不显示

1. 检查 import 语句是否正确
2. 确认视频路径是否正确（应该以 `/video/` 开头）
3. 确认文件扩展名是 `.mdx` 而不是 `.md`
4. 检查 import 语句后是否有空行

### MDX 解析错误

如果看到类似 "Unexpected ExpressionStatement" 的错误：

1. 确保 import 语句后有一个空行
2. 确保数学公式中的花括号使用了双花括号转义（`{{` 和 `}}`）

## 技术细节

- **视频组件位置**：`src/components/Video.astro`
- **视频存储位置**：`public/video/`
- **CMS 配置文件**：`public/admin/config.yml`
- **自定义 CMS 脚本**：`public/admin/cms-custom.js`
