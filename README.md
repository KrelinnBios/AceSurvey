# AceSurvey

<p align="center">
  <img src="asexual-flag.svg" width="160" alt="Asexual pride flag">
</p>

<p align="center">
  <strong>AceSurvey</strong><br>
  面向无性恋社群的基本信息调查问卷与问卷卡片生成工具
</p>

## 项目简介

AceSurvey 是一个以静态网页形式呈现的问卷工具，聚焦无性恋谱系身份、发现经历、相关认知、性行为态度与社群期待等基本信息梳理。页面支持本地填写、浏览器草稿保存，并可将完整回答生成为图片卡片，便于填写者保存、分享或用于社群审核、自我介绍等场景。

## 内容与功能

- [index.html](./index.html)：问卷主页面，包含填写界面、草稿保存和图片导出逻辑。
- 问卷内容：涵盖无性恋谱系类型、年龄、发现经历、类型认同理由、Ace 谱系认知、性行为态度、相关社群议题看法和社群期待。
- 本地草稿：填写内容会保存到浏览器本地存储，刷新或退出页面后可继续编辑。
- 图片导出：基于 html2canvas 生成完整问卷卡片，默认文件名为 `ace_community_survey.png`。
- 移动端适配：针对移动浏览器和 QQ 内置浏览器做了输入、滚动、预览与长按保存优化。

## 使用方式

### 在线访问

访问 <https://acesurvey.pages.dev/>。

### 本地使用

直接用浏览器打开 [index.html](./index.html)。

页面会加载 Google Fonts 和 html2canvas CDN；如需完整字体与图片导出体验，请保持网络可用。

### 线上部署

本项目是静态网页，可部署到 GitHub Pages、Cloudflare Pages、Vercel、Netlify 等静态网站托管平台。

## 技术信息

- 主要技术：HTML、CSS、JavaScript。
- 图片导出：通过 html2canvas 在浏览器端生成 PNG。
- 本地暂存：通过浏览器 `localStorage` 保存草稿，不提供远程提交接口。
- 站点入口：[index.html](./index.html)。

## 内容边界

- 本项目内容仅供社群问卷填写、自我梳理和身份表达辅助，不构成医疗、心理、法律或其他专业建议。
- 页面中的问题设置不代表对任何身份、立场或经历的诊断、评估或价值判断。
- 本项目不提供远程提交接口；访问者在本地填写、暂存、截图或导出的个人回答不属于本仓库预设内容，其保存、分享和使用方式由访问者自行决定。
- 如果将导出的问卷卡片用于社群审核或公开分享，请先确认其中不包含不愿公开的个人信息。

## 许可协议

本项目依据 [MIT License](./LICENSE) 发布。

第三方资源（如字体、外部库、外链素材等）以其原作者或原项目的许可证声明为准。

## 反馈与贡献

欢迎通过 [GitHub Issue](https://github.com/KrelinnBios/AceSurvey/issues) 提交错别字、排版兼容问题、问卷表述建议、移动端适配问题或图片导出问题。
