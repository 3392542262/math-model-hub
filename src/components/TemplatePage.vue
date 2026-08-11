<template>
  <section class="tpl">
    <div class="tpl-card intro">
      <h2>📄 国赛论文 LaTeX 模板（cumcmthesis）</h2>
      <p>
        <b>cumcmthesis</b> 是为全国大学生数学建模竞赛设计的开源 LaTeX 论文模板，符合国赛论文格式规范，
        自动处理目录、章节编号、公式与参考文献排版，是书写正式参赛论文的主流方案。
        你的本地 <code>D:\latex1\国赛模板</code> 就是这套模板（含示例论文）。
      </p>
    </div>

    <div class="tpl-card">
      <h3>🚀 快速上手</h3>
      <ol class="steps">
        <li><b>安装 TeX 发行版</b>：Windows 推荐 <a href="https://tug.org/texlive/" target="_blank" rel="noopener">TeX Live</a> 或 <a href="https://miktex.org/" target="_blank" rel="noopener">MiKTeX</a>（约 2~4 GB，安装时间较长）</li>
        <li><b>准备模板</b>：使用本地 <code>D:\latex1\国赛模板</code>，或用开源仓库中的最新版</li>
        <li><b>编辑论文</b>：在 <code>example.tex</code> 中按章节填写内容（摘要、问题重述、模型假设、模型建立与求解、模型检验、结论）</li>
        <li><b>编译</b>：命令行执行 <code>xelatex example.tex</code>（两遍以生成目录），或使用 VS Code + LaTeX Workshop 一键编译</li>
      </ol>
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
      <h3>🔗 有用链接</h3>
      <ul class="links">
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
.tpl-card p, .tpl-card li { color: #3a4c68; font-size: 0.93rem; }
.tpl-card code { background: #f0f4fb; color: #c23850; padding: 1px 6px; border-radius: 5px; font-size: 0.88rem; }
.tpl-card a { color: #1d5fd6; }

.steps { padding-left: 20px; display: flex; flex-direction: column; gap: 8px; }

.tbl { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
.tbl th, .tbl td { border: 1px solid #e3e8f0; padding: 8px 10px; text-align: left; }
.tbl th { background: #f4f7fb; color: #12356b; }

.tips { padding-left: 20px; display: flex; flex-direction: column; gap: 6px; }
.links { padding-left: 20px; display: flex; flex-direction: column; gap: 6px; }
</style>
