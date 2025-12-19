---
title: "可折叠的 Admonitions"
description: "展示如何使用可折叠的提示框功能"
publishDate: "19 Dec 2024"
tags: ["markdown", "admonitions", "collapsible"]
---

## 可折叠 Admonitions

Astro Cactus 支持可折叠的 admonitions，让您可以隐藏长内容或次要信息。

## 语法

### 默认展开（可折叠）

```markdown
:::note{fold=false}
这是默认展开的内容，用户可以点击折叠
:::
```

效果：

:::note{fold=false}
这是默认展开的内容，用户可以点击折叠
:::

### 默认折叠（推荐）

```markdown
:::warning{fold}
这是默认折叠的内容，用户需要点击查看
:::
```

效果：

:::warning{fold}
这是默认折叠的内容，用户需要点击查看

可以包含多段内容、代码块等。
:::

### 也可以使用 fold=true

```markdown
:::tip{fold=true}
fold=true 和 {fold} 效果相同，都是默认折叠
:::
```

效果：

:::tip{fold=true}
fold=true 和 {fold} 效果相同，都是默认折叠
:::

## 所有支持的类型

所有 admonition 类型都支持折叠：

:::note{fold}
**Note** - 用于一般信息
:::

:::tip{fold}
**Tip** - 用于提示和建议
:::

:::important{fold}
**Important** - 用于重要信息
:::

:::caution{fold}
**Caution** - 用于需要注意的事项
:::

:::warning{fold}
**Warning** - 用于警告信息
:::

## 语法总结

| 语法 | 效果 | 说明 |
|------|------|------|
| `{fold=false}` | 默认展开 | 可折叠 |
| `{fold=true}` | 默认折叠 | 需要点击展开 |
| `{fold}` | 默认折叠 | **最简洁** ✨ |
| 无 `fold` | 不可折叠 | 普通 admonition |

## 实际应用示例

:::note{fold=false}
### 什么时候使用可折叠？

可折叠的 admonitions 适合以下场景：

1. **长内容** - 避免页面过长
2. **可选信息** - 高级用户才需要的详细信息
3. **示例代码** - 让读者自行选择查看
4. **补充说明** - 非核心内容
:::

:::tip{fold}
### 最佳实践

- 默认折叠用于次要信息
- 默认展开用于重要但可隐藏的内容
- 普通（不折叠）用于关键信息
:::
