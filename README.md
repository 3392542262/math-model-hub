# 📐 数模助手 · 数学建模竞赛真题库

全国大学生数学建模竞赛（CUMCM）学习辅助工具。
- **v1.0 真题库**：收录近 10 年（2016-2025）国赛真题，支持按年份 / 组别 / 题型筛选与关键词搜索，47 道题目可在线查看 PDF。
- **v2.0 AI 提示词生成器**：粘贴题目自动识别题型（关键词规则，免费）→ 推荐稳妥/冲分模型 → 一键生成可复制给 AI 的提示词；可选填 DeepSeek API Key 进行 AI 深度分析。

技术栈：Vue 3 + Vite（纯前端，零后端），部署于 GitHub Pages。

## 功能

- 📚 **真题检索**：2016-2025 共 10 年 54 道真题，A-E 题在线查看 PDF（官网压缩包仅含 A-E 五题）
- 🔍 **多维筛选**：年份 / 组别（本科、本专科、专科）/ 11 种题型标签 + 关键词搜索
- 🤖 **AI 提示词生成器**：
  - 关键词自动识别题型（11 类），支持手动修正
  - 每类题型推荐「稳妥模型」与「冲分模型」
  - 一键生成结构化 AI 提示词并复制
  - 可选 DeepSeek API Key 进行 AI 深度分析（key 仅存于浏览器 localStorage，不写入代码）
- 📄 **论文模板**：cumcmthesis LaTeX 国赛论文模板介绍与上手指引

## 在线体验

**[点我打开 → https://3392542262.github.io/math-model-hub/](https://3392542262.github.io/math-model-hub/)**

## 本地开发

```bash
npm install
npm run dev      # 开发模式（http://localhost:5173）
npm run build    # 构建到 dist/
```

## 部署

仓库已配置 GitHub Actions（`.github/workflows/deploy.yml`），推送 `main` 分支后自动构建并发布到 GitHub Pages。

## 数据说明

- 赛题链接来自全国大学生数学建模竞赛官网（mcm.edu.cn）
- 题目名称与题型标签整理自公开资料，如有出入以官方赛题 PDF 为准；部分专科组 E/F 题题名暂缺

## 提示

> 数据仅供学习交流，参赛请遵守竞赛章程与人工智能工具使用规定。
