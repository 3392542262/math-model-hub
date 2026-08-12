<script setup>
import { ref, computed } from 'vue'
import hints from '../data/type-hints.json' with { type: 'json' }
import { detectTypes } from '../utils/typeDetect.js'

const ALL_TYPES = Object.keys(hints.types)

// 输入
const problemText = ref('')
const requirement = ref('建模思路 + 代码 + 论文框架')
const REQUIREMENTS = ['建模思路 + 代码 + 论文框架', '仅建模思路', '建模思路 + 可运行代码', '论文写作框架']

// 识别结果与手动选择
const detected = ref([])
const selectedTypes = ref([])

function analyze() {
  const text = problemText.value.trim()
  if (!text) { detected.value = []; return }
  detected.value = detectTypes(text)
  selectedTypes.value = detected.value.map((d) => d.type)
}

function toggleType(t) {
  const i = selectedTypes.value.indexOf(t)
  if (i >= 0) selectedTypes.value.splice(i, 1)
  else selectedTypes.value.push(t)
}

const isAuto = (t) => detected.value.some((d) => d.type === t)

// 模型推荐（对每个选中类型，来自知识库）
const modelRecs = computed(() =>
  selectedTypes.value.map((t) => ({
    type: t,
    desc: hints.types[t].desc,
    stable: hints.types[t].stableModels,
    high: hints.types[t].highModels,
  }))
)

// ===== DeepSeek AI 深度分析 =====
const apiKey = ref(localStorage.getItem('mmh_api_key') || '')
const aiLoading = ref(false)
const aiUsed = ref(false)
const aiResult = ref(null)

function saveKey() {
  localStorage.setItem('mmh_api_key', apiKey.value.trim())
}

const AI_SYSTEM_PROMPT = `你是全国大学生数学建模竞赛（CUMCM）资深指导专家，负责分析题目并进行题型分类。

【题型判定标准（结合真题示例）】
- 优化：追求成本最小/收益最大/路径最优等，如"钢板最优切割路径问题""定日镜场的优化设计"→ 优化
- 预测：基于历史数据推断未来，如"销量趋势预测""炉温曲线反演"→ 预测
- 评价：多对象综合评价排序，如"宜居城市综合评价"→ 评价
- 决策：方案选择/策略制定，如"生产过程中的决策问题""信贷决策"→ 决策
- 统计：数据分析/回归/显著性，如"黄河水沙监测数据分析"→ 统计
- 分类：对象鉴别/聚类，如"古代玻璃制品成分鉴别"→ 分类
- 规划：排班/路径/选址/调度，如"巡检线路排班""多波束测线"→ 规划
- 概率：随机性/命中概率/可靠性，如"反潜深弹命中概率"→ 概率
- 图像处理：图像/点云/三维重建，如"CT成像""地形三维建模"→ 图像处理
- 物理模型：物理机理建模（温度/压力/力学/能量），如"高压油管压力控制"→ 物理模型
- 几何：坐标/定位/角度/轨迹，如"无人机无源定位"→ 几何

【任务】分析用户给出的题目：
1. 判定 1-3 个最贴合的题型（必须从上述 11 类中选择）
2. 简述判定理由（30 字内）
3. 各推荐 1-2 个稳妥模型和冲分模型（针对本题具体场景，不要空泛）
4. 生成一段可直接复制给 AI 使用的完整提示词（包含：角色设定、题目信息、作答要求、六步作答结构：问题分析/模型推荐/模型建立/代码实现/结果分析/论文框架）

【输出要求】只输出一个 JSON 对象，不要任何多余文字、不要代码块标记，格式：
{"types":["题型1","题型2"],"reason":"判定理由","stable":[{"name":"稳妥模型","why":"适用理由"}],"high":[{"name":"冲分模型","why":"适用理由"}],"prompt":"完整AI提示词"}`

async function aiAnalyze() {
  const key = apiKey.value.trim()
  const text = problemText.value.trim()
  if (!key) { alert('请先在上方填写 DeepSeek API Key（申请方法见下方提示）'); return }
  if (!text) { alert('请先粘贴题目内容'); return }
  aiLoading.value = true
  aiUsed.value = false
  aiResult.value = null
  try {
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({
        model: 'deepseek-chat',
        temperature: 0.3,
        messages: [
          { role: 'system', content: AI_SYSTEM_PROMPT },
          { role: 'user', content: text },
        ],
      }),
    })
    if (!res.ok) {
      const err = await res.text()
      throw new Error(`API 返回 ${res.status}：${err.slice(0, 120)}`)
    }
    const data = await res.json()
    const content = data.choices[0].message.content || ''
    const m = content.match(/\{[\s\S]*\}/)
    if (!m) throw new Error('AI 返回内容不是有效 JSON')
    const parsed = JSON.parse(m[0])
    if (Array.isArray(parsed.types) && parsed.types.length) {
      selectedTypes.value = parsed.types.filter((t) => ALL_TYPES.includes(t))
    }
    aiResult.value = parsed
    aiUsed.value = true
  } catch (e) {
    alert('AI 分析失败：' + e.message)
  } finally {
    aiLoading.value = false
  }
}

// ===== 提示词生成 =====
const promptResult = ref('')

function buildPrompt() {
  const types = selectedTypes.value.length ? selectedTypes.value.join('、') : '（未选择，请根据题目自判）'
  const text = problemText.value.trim() || '（请在此粘贴题目内容）'
  promptResult.value = `你是一位全国大学生数学建模竞赛（CUMCM）资深指导专家，精通${types}类问题的建模与求解。

【题目信息】
- 题目类型：${types}
- 题目内容：
"""
${text}
"""

【作答要求】
${requirement.value}

请按以下结构完整作答：
1. 问题分析：用 300 字以内说明题目本质、难点与解题思路；
2. 模型推荐：推荐 2-3 个适合的模型并比较优缺点，明确指出哪个最稳妥、哪个最可能拿高分；
3. 模型建立：给出首选模型的详细数学建模过程（变量定义、目标函数、约束条件、关键公式）；
4. 求解实现：提供可运行的 Python 代码，含关键注释并说明所用库；
5. 结果分析：给出结果检验、灵敏度分析与模型评价的方法；
6. 论文框架：给出论文各章节的写作建议。`
}

const copied = ref(false)
async function copyPrompt() {
  if (!promptResult.value) return
  try {
    await navigator.clipboard.writeText(promptResult.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch (e) {
    alert('复制失败，请手动选择复制')
  }
}
</script>

<template>
  <section class="gen">
    <div class="gen-card">
      <h2>🤖 AI 提示词生成器</h2>
      <p class="hint">粘贴题目 → 自动识别题型 → 推荐模型 → 一键生成可复制给 AI 的提示词</p>

      <label class="field">
        <span>① 粘贴题目内容（可选，用于自动识别题型）</span>
        <textarea v-model="problemText" rows="5" placeholder="把题目全文粘贴到这里，点击「分析题型」自动识别……"></textarea>
      </label>

      <div class="row">
        <button class="btn primary" @click="analyze">🔍 分析题型</button>
        <button class="btn ai" :disabled="aiLoading" @click="aiAnalyze">
          {{ aiLoading ? '⏳ AI 识别中…' : '🤖 AI 精准识别' }}
        </button>
        <label class="field inline">
          <span>作答要求</span>
          <select v-model="requirement">
            <option v-for="r in REQUIREMENTS" :key="r" :value="r">{{ r }}</option>
          </select>
        </label>
      </div>

      <!-- API Key（存本浏览器） -->
      <div class="api-box">
        <label class="field inline grow">
          <span>DeepSeek API Key{{ apiKey ? ' ✅ 已保存' : '' }}（可选）</span>
          <input v-model="apiKey" type="password" :placeholder="apiKey ? '已保存，可重新输入更换' : 'sk-…'" @change="saveKey">
        </label>
        <p class="hint">
          填 key 后点「🤖 AI 精准识别」：大模型真正读懂题目，识别最准（推荐）。
          key 只保存在<em>你自己的浏览器</em>（localStorage），不会写入代码。
        </p>
        <p class="hint">申请教程：① 打开 <a href="https://platform.deepseek.com" target="_blank" rel="noopener">platform.deepseek.com</a> 注册登录 → ② 左侧「API Keys」→ 创建并复制 <code>sk-…</code> → ③ 粘贴到上方输入框。新用户有赠送额度，识别一次约几分钱。不填 key 也能用免费的关键词/贝叶斯识别。</p>
      </div>

      <!-- 识别结果 -->
      <div v-if="detected.length" class="detect-box">
        <h3>关键词识别结果</h3>
        <div class="chips">
          <span v-for="d in detected" :key="d.type" class="chip">
            {{ d.type }} <small>(命中：{{ d.hits.join('、') }})</small>
          </span>
        </div>
        <p class="hint">识别由关键词规则推测，可能不准，请手动修正：</p>
      </div>

      <!-- AI 分析结果 -->
      <div v-if="aiResult" class="ai-box">
        <h3>🤖 AI 深度分析结果</h3>
        <p><b>识别：</b>{{ aiResult.types.join('、') }} — {{ aiResult.reason }}</p>
        <div class="model-cols">
          <div class="model-col">
            <h4>🛡️ 稳妥模型</h4>
            <ul>
              <li v-for="s in aiResult.stable" :key="s.name"><b>{{ s.name }}</b> — {{ s.why }}</li>
            </ul>
          </div>
          <div class="model-col high">
            <h4>🚀 冲分模型</h4>
            <ul>
              <li v-for="h in aiResult.high" :key="h.name"><b>{{ h.name }}</b> — {{ h.why }}</li>
            </ul>
          </div>
        </div>
        <button class="btn primary" @click="promptResult = aiResult.prompt || ''">使用 AI 生成的提示词</button>
      </div>

      <!-- 题型选择 -->
      <div class="select-box">
        <h3>② 选择题型（可多选，识别结果已自动勾选）</h3>
        <div class="chips">
          <button
            v-for="t in ALL_TYPES"
            :key="t"
            class="chip-btn"
            :class="{ on: selectedTypes.includes(t), auto: isAuto(t) }"
            @click="toggleType(t)"
          >{{ t }}{{ isAuto(t) ? ' ⚡' : '' }}</button>
        </div>
        <p v-if="!selectedTypes.length" class="hint">至少选择一个题型才能生成提示词</p>
      </div>
    </div>

    <!-- 模型推荐（知识库） -->
    <div v-if="modelRecs.length" class="gen-card">
      <h2>🏆 模型推荐（题型知识库）</h2>
      <div v-for="m in modelRecs" :key="m.type" class="model-block">
        <h3>{{ m.type }}类 <small>{{ m.desc }}</small></h3>
        <div class="model-cols">
          <div class="model-col">
            <h4>🛡️ 稳妥模型（拿分稳）</h4>
            <ul>
              <li v-for="s in m.stable" :key="s.name"><b>{{ s.name }}</b> — {{ s.why }}</li>
            </ul>
          </div>
          <div class="model-col high">
            <h4>🚀 冲分模型（加分项）</h4>
            <ul>
              <li v-for="h in m.high" :key="h.name"><b>{{ h.name }}</b> — {{ h.why }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 提示词输出 -->
    <div class="gen-card">
      <div class="row">
        <button class="btn primary" :disabled="!selectedTypes.length" @click="buildPrompt">✨ 生成 AI 提示词</button>
        <button v-if="promptResult" class="btn" @click="copyPrompt">{{ copied ? '✅ 已复制' : '📋 复制提示词' }}</button>
      </div>
      <pre v-if="promptResult" class="prompt-box">{{ promptResult }}</pre>
      <p v-else class="hint">生成后点「复制」，粘贴到 ChatGPT / DeepSeek / 文心一言 等 AI 对话框即可使用</p>
    </div>
  </section>
</template>

<style scoped>
.gen { display: flex; flex-direction: column; gap: 14px; }

.gen-card { background: #fff; border-radius: 12px; padding: 18px; box-shadow: 0 2px 8px rgba(18, 53, 107, 0.06); }
.gen-card h2 { color: #12356b; font-size: 1.15rem; margin-bottom: 6px; }
.gen-card h3 { color: #1d5fd6; font-size: 1rem; margin: 10px 0 8px; }
.hint { color: #8494ad; font-size: 0.85rem; margin: 4px 0; }
.hint em { color: #b0781a; font-style: normal; }

.field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }
.field > span { font-size: 0.88rem; color: #4a5a72; font-weight: 600; }
.field textarea, .field input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccd6e4;
  border-radius: 8px;
  font-size: 0.92rem;
  font-family: inherit;
  resize: vertical;
  outline: none;
}
.field textarea:focus, .field input:focus { border-color: #1d5fd6; }
.field select { padding: 8px; border: 1px solid #ccd6e4; border-radius: 8px; background: #f7f9fc; }
.field.inline { flex-direction: row; align-items: center; gap: 8px; margin: 0; }
.field.inline.grow { flex: 1; min-width: 240px; }
.field.inline input { flex: 1; }

.row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

.btn {
  border: 1px solid #1d5fd6;
  background: #fff;
  color: #1d5fd6;
  padding: 9px 20px;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
}
.btn.primary { background: #1d5fd6; color: #fff; }
.btn.ai { border-color: #b0781a; color: #b0781a; }
.btn:hover { filter: brightness(1.08); }
.btn:disabled { opacity: 0.45; cursor: not-allowed; }

.api-box { margin-top: 12px; padding: 12px; background: #fdf8ee; border: 1px solid #f0e2c4; border-radius: 10px; }

.detect-box { margin-top: 12px; padding: 12px; background: #f0f7ff; border-radius: 10px; }
.ai-box { margin-top: 12px; padding: 12px; background: #f4fbf6; border: 1px solid #d4ecd9; border-radius: 10px; }

.chips { display: flex; flex-wrap: wrap; gap: 8px; }
.chip { background: #e8eefc; color: #1d5fd6; padding: 5px 12px; border-radius: 16px; font-size: 0.88rem; }
.chip small { opacity: 0.75; }

.select-box { margin-top: 6px; }
.chip-btn {
  border: 1px solid #d4dce8; background: #f7f9fc; color: #3b5b92;
  padding: 6px 14px; border-radius: 16px; font-size: 0.9rem; cursor: pointer;
}
.chip-btn.on { background: #1d5fd6; border-color: #1d5fd6; color: #fff; }
.chip-btn.auto { outline: 2px dashed #7fb0f0; }

.model-block { border-top: 1px dashed #d8e0ec; padding-top: 8px; }
.model-block h3 small { color: #8494ad; font-weight: 400; font-size: 0.8rem; }
.model-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.model-col { background: #f4f7fb; border-radius: 10px; padding: 10px 14px; }
.model-col.high { background: #fdf4e6; }
.model-col h4 { font-size: 0.9rem; margin-bottom: 6px; }
.model-col ul { padding-left: 18px; display: flex; flex-direction: column; gap: 5px; }
.model-col li { font-size: 0.85rem; color: #3a4c68; }

.prompt-box {
  margin-top: 12px;
  background: #0f1b30; color: #d7e3f5;
  padding: 14px; border-radius: 10px;
  font-size: 0.85rem; line-height: 1.7;
  white-space: pre-wrap; word-break: break-word;
  max-height: 420px; overflow-y: auto;
}

@media (max-width: 640px) { .model-cols { grid-template-columns: 1fr; } }
</style>
