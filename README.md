# 本地运行与预览

这个网站是纯静态页面，不依赖构建工具。

## 方式一：直接打开

1. 进入文件夹 `C:\Users\Windows\Documents\Codex\2026-04-22-1-2-49-9-3-4`
2. 双击 `index.html`
3. 浏览器里即可预览首页，并可继续点击导航查看服务页和联系页

也可以在 PowerShell 里执行：

```powershell
Start-Process .\index.html
```

## 方式二：用编辑器插件预览

如果你使用 VS Code，可以安装 `Live Server` 扩展，然后右键 `index.html` 选择 `Open with Live Server`。

这会提供一个本地预览地址，适合你一边改文案一边刷新查看。

## 文件说明

- `index.html`：首页
- `services.html`：服务页
- `contact.html`：联系方式
- `styles.css`：统一样式

## 可直接替换的内容

- `contact.html` 里的邮箱、微信、社交账号
- 首页作品区里的项目名称和介绍
- “快速诊断 49.9” 的服务描述
- 导航左上角品牌名 `Studio / Portfolio`
