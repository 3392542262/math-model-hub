<script setup>
import { ref } from 'vue'
import ProblemList from './components/ProblemList.vue'
import TemplatePage from './components/TemplatePage.vue'

// 当前页面：problems（真题库）/ template（论文模板）
const currentPage = ref('problems')
</script>

<template>
  <div class="app">
    <header class="site-header">
      <h1>📐 数模助手</h1>
      <p class="subtitle">全国大学生数学建模竞赛 · 真题库与 AI 辅助工具</p>
      <nav class="nav">
        <button :class="{ active: currentPage === 'problems' }" @click="currentPage = 'problems'">
          📚 真题库
        </button>
        <button :class="{ active: currentPage === 'template' }" @click="currentPage = 'template'">
          📄 论文模板
        </button>
      </nav>
    </header>

    <main class="main">
      <ProblemList v-if="currentPage === 'problems'" />
      <TemplatePage v-else />
    </main>

    <footer class="site-footer">数模助手 v1.0 · 数据来源：全国大学生数学建模竞赛官网（mcm.edu.cn）</footer>
  </div>
</template>
