<script setup>
import { ref, computed } from 'vue'
import contest from '../data/contest.json'

// 可筛选的题型标签（同时是第二阶段提示词生成器的基础分类）
const ALL_TYPES = ['评价', '预测', '优化', '决策', '统计', '分类', '规划', '概率', '图像处理', '物理模型', '几何']
const YEARS = contest.years.map((y) => y.year)
const GROUPS = ['本科', '本专科', '专科']

// 筛选状态
const filterYear = ref('all')
const filterGroup = ref('all')
const filterTypes = ref([])
const keyword = ref('')

function toggleType(t) {
  const i = filterTypes.value.indexOf(t)
  if (i >= 0) filterTypes.value.splice(i, 1)
  else filterTypes.value.push(t)
}

function resetFilters() {
  filterYear.value = 'all'
  filterGroup.value = 'all'
  filterTypes.value = []
  keyword.value = ''
}

// 扁平化 + 筛选
const filtered = computed(() => {
  const k = keyword.value.trim().toLowerCase()
  return contest.years
    .flatMap((year) => year.problems.map((p) => ({ ...p, year: year.year, yearUrl: year.url })))
    .filter((p) => filterYear.value === 'all' || p.year === filterYear.value)
    .filter((p) => filterGroup.value === 'all' || p.group === filterGroup.value)
    .filter((p) => filterTypes.value.length === 0 || p.types.some((t) => filterTypes.value.includes(t)))
    .filter((p) => !k || `${p.year}${p.label}${p.title}`.toLowerCase().includes(k))
})

const totalCount = computed(() => contest.years.reduce((n, y) => n + y.problems.length, 0))
</script>

<template>
  <section class="problems">
    <div class="stats">
      共 <b>{{ totalCount }}</b> 道真题（{{ contest.years.length }} 年） · 当前显示 <b>{{ filtered.length }}</b> 道
    </div>

    <!-- 筛选栏 -->
    <div class="filters">
      <div class="filter-row">
        <span class="filter-label">年份</span>
        <select v-model="filterYear" class="select">
          <option value="all">全部年份</option>
          <option v-for="y in YEARS" :key="y" :value="y">{{ y }} 年</option>
        </select>

        <span class="filter-label">组别</span>
        <select v-model="filterGroup" class="select">
          <option value="all">全部组别</option>
          <option v-for="g in GROUPS" :key="g" :value="g">{{ g }}</option>
        </select>

        <input v-model="keyword" class="search" type="search" placeholder="🔍 搜索题目名 / 题号（如 A、2024）">
        <button class="btn-reset" @click="resetFilters">重置</button>
      </div>

      <div class="filter-row types-row">
        <span class="filter-label">题型</span>
        <button
          v-for="t in ALL_TYPES"
          :key="t"
          class="type-chip"
          :class="{ on: filterTypes.includes(t) }"
          @click="toggleType(t)"
        >{{ t }}</button>
      </div>
    </div>

    <!-- 题目卡片 -->
    <div v-if="filtered.length" class="card-grid">
      <article v-for="(p, i) in filtered" :key="`${p.year}-${p.label}-${i}`" class="card">
        <div class="card-head">
          <span class="badge-year">{{ p.year }}</span>
          <span class="badge-label">{{ p.label }} 题</span>
          <span class="badge-group" :class="'g-' + p.group">{{ p.group }}</span>
        </div>
        <h3 class="card-title">{{ p.title || '详见官方赛题' }}</h3>
        <div v-if="p.types.length" class="card-types">
          <span v-for="t in p.types" :key="t" class="type-tag">{{ t }}</span>
        </div>
        <div class="card-actions">
          <a v-if="p.pdf" class="btn-link" :href="p.pdf" target="_blank" rel="noopener">📖 在线查看题目</a>
          <a class="btn-link ghost" :href="p.yearUrl" target="_blank" rel="noopener">📥 官方赛题下载</a>
          <a class="btn-link ghost" :href="contest.papersChannel" target="_blank" rel="noopener">📄 优秀论文</a>
        </div>
      </article>
    </div>

    <div v-else class="empty">没有符合条件的题目，试试调整筛选条件</div>

    <p class="note">数据来源：<a :href="contest.official" target="_blank" rel="noopener">全国大学生数学建模竞赛官网</a> · 题目名称整理自公开资料，以官方 PDF 为准</p>
  </section>
</template>

<style scoped>
.problems { display: flex; flex-direction: column; gap: 14px; }

.stats { color: #5c6f88; font-size: 0.9rem; }

.filters {
  background: #fff;
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 2px 8px rgba(18, 53, 107, 0.06);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.filter-label { font-size: 0.85rem; color: #4a5a72; font-weight: 600; }

.select, .search {
  padding: 8px 10px;
  border: 1px solid #ccd6e4;
  border-radius: 8px;
  font-size: 0.92rem;
  background: #f7f9fc;
  outline: none;
}
.search { flex: 1; min-width: 180px; }

.btn-reset {
  border: 1px solid #ccd6e4;
  background: #fff;
  color: #4a5a72;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
}
.btn-reset:hover { border-color: #1d5fd6; color: #1d5fd6; }

.type-chip {
  border: 1px solid #d4dce8;
  background: #f7f9fc;
  color: #3b5b92;
  padding: 5px 12px;
  border-radius: 16px;
  font-size: 0.85rem;
  cursor: pointer;
}
.type-chip.on {
  background: #1d5fd6;
  border-color: #1d5fd6;
  color: #fff;
}

.card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; }

.card {
  background: #fff;
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 2px 8px rgba(18, 53, 107, 0.06);
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 4px solid #1d5fd6;
}

.card-head { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.badge-year { background: #12356b; color: #fff; font-size: 0.8rem; padding: 2px 10px; border-radius: 12px; }
.badge-label { background: #e8eefc; color: #1d5fd6; font-weight: 700; font-size: 0.85rem; padding: 2px 10px; border-radius: 12px; }
.badge-group { font-size: 0.75rem; padding: 2px 8px; border-radius: 10px; }
.g-本科 { background: #e3f6ec; color: #1f8a4c; }
.g-本专科 { background: #fdf3e0; color: #b0781a; }
.g-专科 { background: #fde9ec; color: #c23850; }

.card-title { font-size: 1rem; color: #24344d; min-height: 2.6em; }

.card-types { display: flex; gap: 5px; flex-wrap: wrap; }
.type-tag { background: #f0f4fb; color: #4a6a9a; font-size: 0.75rem; padding: 2px 8px; border-radius: 8px; }

.card-actions { display: flex; gap: 8px; margin-top: auto; flex-wrap: wrap; }
.btn-link {
  text-decoration: none;
  font-size: 0.85rem;
  background: #1d5fd6;
  color: #fff;
  padding: 6px 14px;
  border-radius: 8px;
}
.btn-link.ghost { background: #eef2f8; color: #3b5b92; }

.empty { text-align: center; color: #8494ad; padding: 30px 0; }
.note { font-size: 0.78rem; color: #8494ad; }
.note a { color: #1d5fd6; }
</style>
