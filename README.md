# MTI 备考 Wiki（本地预览）

从 `D:\BaiduNetdiskDownload\MTI` 这个 Obsidian Vault 生成知识库站点，用 [Quartz v5](https://quartz.jzhao.xyz/)（MIT 许可）。

当前只接入了 **Glossary** 一个目录，共 10 篇笔记，用来确认框架效果。这是独立项目，与博客仓库无关。

## 怎么跑

双击 `预览wiki.bat`，它会先把 Vault 里的 Glossary 笔记镜像同步到 `content/Glossary`，再在 <http://localhost:8080> 起预览服务，关掉窗口即停止。

手动方式：

```powershell
npx quartz build --serve          # 只预览，不同步
npx quartz build                  # 只构建，产物在 public/
```

## 相对官方模板改了什么

| 配置项 | 改动 | 原因 |
| --- | --- | --- |
| `locale` | `en-US` → `zh-CN` | 界面用中文 |
| `pageTitle` | `Quartz 5` → `MTI 备考 Wiki` | 站点标题 |
| `analytics` | `plausible` → `null` | 本地预览不上报统计 |
| `quartz-fonts.options.fontOrigin` | `googleFonts` → `selfHosted` | 默认会在页面里插 Google Fonts 的 `<link>`，国内阻塞渲染；改成构建时下载、本地托管（产物在 `public/static/fonts/`） |
| `@quartz-community/obsidian-plugin-excalidraw` | 移除 | 该包未发布，加载报错，且 Vault 里没有 Excalidraw 文件 |
| `@quartz-community/graph` | `enabled: false` | 笔记之间没有互相引用，图谱是空的，没有意义 |
| `@quartz-community/backlinks` | `enabled: false` | 同上 |
| `@quartz-community/footer` | `enabled: false` | 去掉「Created with Quartz」和页脚链接 |
| `@quartz-community/article-title` | `enabled: false` | 笔记正文已经有 H1，避免顶部重复显示标题 |
| `@quartz-community/content-meta` | `enabled: false` | 按阅读页要求去掉「日期 / 阅读时长」元信息 |
| `@quartz-community/note-properties` | `hidePropertiesView: true` | 不展示 Properties 表格，**但插件必须保持 enabled**（见下） |
| `@quartz-community/table-of-contents` | `collapseByDefault: true`、`maxDepth: 2` | 目录默认收起，当成浮层用 |

其余保持 obsidian 模板默认值：中文分词搜索、双链、文件夹树、OG 图、sitemap、RSS 全部开启。

## 布局定制（`quartz/styles/custom.scss`）

- **左侧整栏变成弹出抽屉**：默认只在左上角显示「菜单」按钮；打开后，站名、搜索、明暗/阅读模式、目录树都收进同一个 320px 抽屉，按钮浮到抽屉左上角变成「关闭」。
- **右侧目录改成浮层**：固定在右下角，默认只显示一个「目录」小条，点开才展开；网格里的右侧栏列宽置 0，正文因此变宽。
- **正文按 Wikipedia 阅读页风格收敛**：白底、黑灰正文、蓝色链接、细边框表格；H2 加分隔线，去掉内链的彩色胶囊底纹。
- **隐藏重复标题**：`article-title` 已在配置层关闭；如果以后有笔记正文不写 H1，需要给这类页面单独恢复标题。

## ⚠️ 一个容易踩的坑：note-properties

`@quartz-community/note-properties` 表面上是「显示 Properties 表格」的组件，实际上它**同时负责用 gray-matter 解析并剥离 frontmatter**。把它 `enabled: false` 会导致整条 frontmatter 解析链失效——YAML 会当成正文渲染出来，标题、日期、标签全部丢失，日期退化成文件修改时间。

正确做法是保持 enabled，用 `hidePropertiesView: true` 只隐藏展示。

## 隐私与版权提醒

Quartz 的过滤器只过滤 Markdown，**非 Markdown 文件（PDF、docx、图片）会被无条件发布**。所以 `content/` 里只能放筛过的笔记，绝不能把整个 Vault 目录指过来——Vault 里有 93 个 PDF/docx 共 865MB。

Glossary 这一批是纯术语表，没有版权和隐私问题，可以放心预览。

## 现状与下一步

- Glossary 的 10 篇笔记内部**没有互相链接**，所以现在反链和关系图谱基本是空的，只有首页指向它们。Wiki 的双链价值要等接入真题、翻译复盘这些真正互相引用的笔记之后才体现。
- 这批笔记几乎全是 4-6 列的大表格，在 1037px 宽度下不溢出；手机窄屏还需要再验证。
- 下一步候选：`01_2026年考纲`、`211_基英_写作模版`、`448_百科_应用文写作`。
