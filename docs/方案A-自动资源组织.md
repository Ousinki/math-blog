# 方案A：自动资源组织系统

## 工作原理

**两步式自动组织**：CMS上传到统一目录 → Git Pull自动组织到文章专属文件夹

## 工作流程

### 1. 作者在CMS添加视频

```
作者操作：
1. 在CMS打开文章编辑器
2. 点击Body编辑器的"+"按钮
3. 选择"Video"
4. 上传视频文件（如 demo.mp4）
5. 保存并发布

结果：
- 文件保存到：public/posts/demo.mp4
- MDX内容：<Video src="/posts/demo.mp4" />
- Git commit自动创建
```

### 2. 你Git Pull后自动处理

```bash
$ git pull
remote: 1 file changed...
Updating abc123..def456

🔧 Running post-merge fixes...
📦 Organizing resources into article folders...
  ✅ Moved demo.mp4 → my-article/
  📝 Updated path in my-article.mdx
🔍 Processing MDX files...
  ✅ Added import to my-article.mdx
✅ All MDX files processed
✨ Post-merge fixes complete!
```

**自动完成的任务：**
- ✅ 检测 `public/posts/demo.mp4`
- ✅ 扫描MDX文件找到引用它的文章
- ✅ 创建 `public/posts/my-article/` 文件夹
- ✅ 移动文件到 `public/posts/my-article/demo.mp4`
- ✅ 更新MDX路径为 `/posts/my-article/demo.mp4`
- ✅ 添加 `import Video` 语句

### 3. 最终结果

```
公开 public/
└── posts/
    └── my-article/          ← 文章专属文件夹
        └── demo.mp4         ← 视频自动组织

src/content/post/
└── my-article.mdx
    内容：
    ---
    title: My Article
    ---
    
    import Video from "../../components/Video.astro";
    
    <Video src="/posts/my-article/demo.mp4" />
```

## 删除文章时的自动清理

```bash
# 作者在CMS删除文章
CMS → Delete "my-article" → Git commit

# 你执行
$ git pull

# Post-merge hook自动检测并清理
🗑️ Checking for orphaned article folders...
  🗑️ Removing orphaned folder: my-article
✨ Post-merge fixes complete!

# 结果：public/posts/my-article/ 整个文件夹被删除
```

## 优点

✅ **完全自动化** - 作者只需上传，无需关心文件组织
✅ **资源集中管理** - 每篇文章的资源在专属文件夹
✅ **自动清理** - 删除文章自动清理所有资源
✅ **路径自动更新** - MDX路径自动修正
✅ **Import自动添加** - 无需手动添加import语句
✅ **零学习成本** - 对CMS作者透明

## 注意事项

### CMS配置
确保 `public/admin/config.yml` 中：
```yaml
media_folder: "public/posts"
public_folder: "/posts"
```

### 手动上传文件
如果你手动添加文件到 `public/posts/`：
1. 放到 `public/posts/` 根目录
2. 在MDX中引用为 `/posts/filename.ext`
3. 下次git pull时会自动组织

### 清理孤立资源
如果需要手动清理：
```bash
npm run clean-orphaned              # 查看孤立文件夹
npm run clean-orphaned -- --auto-remove  # 自动删除
```

## 与其他方案的对比

| 特性 | 方案A（当前） | 方案B（模板） | 方案C（全局注入） |
|------|-------------|-------------|-----------------|
| CMS体验 | 🟡 路径先临时 | ✅ 直接正确 | ✅ 直接正确 |
| 自动化 | ✅ 全自动 | 🔴 需选模板 | ✅ 全自动 |
| 技术风险 | ✅ 低 | ✅ 低 | 🔴 高 |
| 维护成本 | ✅ 低 | 🟡 中 | 🔴 高 |
| Astro兼容 | ✅ 完全兼容 | ✅ 完全兼容 | 🔴 需hack |

## 故障排除

### 文件没有被组织到文章文件夹
**原因**：MDX文件中没有引用这个文件

**解决**：
1. 检查MDX中的路径是否正确：`/posts/filename.ext`
2. 手动运行hook测试：`.git/hooks/post-merge`

### Import语句没有自动添加
**原因**：文件不是.mdx格式

**解决**：确保文件扩展名是`.mdx`（hook会自动转换.md为.mdx）

### 旧文件没有被组织
**原因**：只处理新上传的文件

**解决**：将文件移动到 `public/posts/` 根目录，更新MDX路径，然后运行hook
