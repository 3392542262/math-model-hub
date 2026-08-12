<template>
  <section class="tpl">
    <div class="tpl-card intro">
      <h2>📄 国赛论文 LaTeX 模板（cumcmthesis）</h2>
      <p>
        <b>cumcmthesis</b> 是为全国大学生数学建模竞赛设计的开源 LaTeX 论文模板，符合国赛论文格式规范，
        自动处理目录、章节编号、公式与参考文献排版，是书写正式参赛论文的主流方案。
      </p>
      <a class="btn-download" href="./template/cumcmthesis.zip" download>📦 下载论文模板（zip）</a>
      <p class="note">模板含：cumcmthesis.cls（格式核心）、example.tex（示例论文，从这里开始写）、example.pdf（成品参考）、figures/（插图示例）</p>
    </div>

    <div class="tpl-card">
      <h3>🚀 使用教程（选一种）</h3>

      <div class="way">
        <h4>方式一（推荐，不用装软件）：Overleaf 在线编译</h4>
        <ol class="steps">
          <li>打开 <a href="https://www.overleaf.com" target="_blank" rel="noopener">overleaf.com</a> 注册登录（免费）</li>
          <li>点 <b>New Project → Upload Project</b>，上传刚下载的 <code>cumcmthesis.zip</code></li>
          <li>在左侧编辑 <code>example.tex</code>（把示例内容替换成你的论文）</li>
          <li>点 <b>Recompile</b>，右侧自动生成 PDF，点 <b>Download PDF</b> 下载</li>
        </ol>
      </div>

      <div class="way">
        <h4>方式二：本地安装 TeX 发行版（电脑上编译）</h4>
        <ol class="steps">
          <li>下载安装 <a href="https://tug.org/texlive/" target="_blank" rel="noopener">TeX Live</a>（约 2~4 GB，时间较长）或 <a href="https://miktex.org/" target="_blank" rel="noopener">MiKTeX</a>（按需自动装包，较轻量）</li>
          <li>解压模板 zip，用 VS Code 安装「LaTeX Workshop」插件打开 <code>example.tex</code></li>
          <li>点右上角绿色 ▶ 一键编译，或命令行执行 <code>xelatex example.tex</code>（两遍生成目录）</li>
        </ol>
      </div>
    </div>

    <div class="tpl-card">
      <h3>📁 模板文件结构</h3>
      <table class="tbl">
        <thead>
          <tr><th>文件</th><th>作用</th></tr>
        </thead>
        <tbody>
          <tr><td><code>cumcmthesis.cls</code></td><td>模板核心类文件（定义了论文的版式与格式）</td></tr>
          <tr><td><code>example.tex</code></td><td>示例论文源文件（写作从这里开始）</td></tr>
          <tr><td><code>example.pdf</code></td><td>示例论文编译结果，可对照格式</td></tr>
          <tr><td><code>figures/</code></td><td>插图目录（流程图、示意图、结果图等）</td></tr>
        </tbody>
      </table>
    </div>

    <div class="tpl-card">
      <h3>✍️ 国赛论文结构要点</h3>
      <ul class="tips">
        <li><b>摘要</b>：独立成页，交代问题、模型、方法、结果（评委重点看）</li>
        <li><b>关键词</b>：3~5 个，概括模型与方法</li>
        <li><b>正文</b>：问题重述 → 模型假设 → 符号说明 → 模型建立与求解 → 模型检验与评价</li>
        <li><b>参考文献</b>：规范引用；附录放核心代码与长表格</li>
        <li>全文（含图表）一般控制在 <b>20 页左右</b>，摘要不超过一页</li>
      </ul>
    </div>

    <div class="tpl-card">
      <h3>🔗 相关资源</h3>
      <ul class="links">
        <li><a href="https://github.com/latexstudio/CUMCMThesis" target="_blank" rel="noopener">模板开源仓库 latexstudio/CUMCMThesis（GitHub，已适配 2023 格式）</a></li>
        <li><a href="https://www.mcm.edu.cn/html_cn/node/b5ab480af29da69a4806e51e714b3de4.html" target="_blank" rel="noopener">国赛论文格式规范（官网，2023 年修订稿）</a></li>
        <li><a href="https://cumcm.cnki.net" target="_blank" rel="noopener">中国知网 · 数学建模竞赛频道（报名与论文提交）</a></li>
        <li><a href="https://dxs.moe.gov.cn/zx/hd/sxjm/sxjmlw/qkt_sxjm_lw_lwzs.shtml" target="_blank" rel="noopener">中国大学生在线 · 优秀论文展示</a></li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.tpl { display: flex; flex-direction: column; gap: 14px; }

.tpl-card {
  background: #fff;
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 2px 8px rgba(18, 53, 107, 0.06);
}

.tpl-card h2 { color: #12356b; font-size: 1.2rem; margin-bottom: 8px; }
.tpl-card h3 { color: #1d5fd6; font-size: 1.02rem; margin-bottom: 10px; }
.tpl-card h4 { color: #3a4c68; font-size: 0.95rem; margin: 4px 0 8px; }
.tpl-card p, .tpl-card li { color: #3a4c68; font-size: 0.93rem; }
.tpl-card code { background: #f0f4fb; color: #c23850; padding: 1px 6px; border-radius: 5px; font-size: 0.88rem; }
.tpl-card a { color: #1d5fd6; }

.btn-download {
  display: inline-block;
  margin: 12px 0 8px;
  padding: 12px 28px;
  border-radius: 10px;
  background: linear-gradient(90deg, #1d5fd6, #12356b);
  color: #fff !important;
  font-size: 1.02rem;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 2px 10px rgba(18, 53, 107, 0.3);
}
.btn-download:hover { filter: brightness(1.12); }

.note { color: #8494ad !important; font-size: 0.8rem !important; }

.way { margin-bottom: 14px; padding: 12px; background: #f7fafd; border-radius: 10px; }

.steps { padding-left: 20px; display: flex; flex-direction: column; gap: 8px; }

.tbl { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
.tbl th, .tbl td { border: 1px solid #e3e8f0; padding: 8px 10px; text-align: left; }
.tbl th { background: #f4f7fb; color: #12356b; }

.tips { padding-left: 20px; display: flex; flex-direction: column; gap: 6px; }
.links { padding-left: 20px; display: flex; flex-direction: column; gap: 6px; }
</style>
