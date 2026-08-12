import hints from '../data/type-hints.json' with { type: 'json' }
import problemHints from '../data/problem-hints.json' with { type: 'json' }
import { getNB } from './bayes.js'

/**
 * 三层题型识别：
 * 1. 真题特征词精确匹配（与真题库标签一致）
 * 2. 通用关键词评分
 * 3. 朴素贝叶斯机器学习预测（对新题泛化，作为补充信号）
 * @param {string} text 题目文本
 * @returns {Array<{type:string, hits:string[], count:number}>} 按命中强度降序
 */
export function detectTypes(text) {
  if (!text || !text.trim()) return []
  const hitsByType = new Map() // type -> Set(来源/命中词)
  const hitStrength = new Map() // type -> 强度分

  // 1. 真题特征词优先（强度 +3）
  for (const h of problemHints.hints) {
    const hitKey = h.keys.find((k) => text.includes(k))
    if (!hitKey) continue
    for (const t of h.types) {
      if (!hitsByType.has(t)) { hitsByType.set(t, new Set()); hitStrength.set(t, 0) }
      hitsByType.get(t).add(`真题「${h.title}」`)
      hitStrength.set(t, (hitStrength.get(t) || 0) + 3)
    }
  }

  // 2. 通用关键词（强度 +1/词）
  for (const [type, info] of Object.entries(hints.types)) {
    const hits = info.keywords.filter((k) => text.includes(k))
    if (hits.length === 0) continue
    if (!hitsByType.has(type)) { hitsByType.set(type, new Set()); hitStrength.set(type, 0) }
    hits.forEach((k) => hitsByType.get(type).add(k))
    hitStrength.set(type, (hitStrength.get(type) || 0) + hits.length)
  }

  // 3. 朴素贝叶斯预测：仅在规则完全未命中时兜底（纯新题），避免噪音
  if (hitsByType.size === 0) {
    const mlTop = getNB().predict(text)[0]
    if (mlTop) {
      hitsByType.set(mlTop.type, new Set(['机器学习预测']))
      hitStrength.set(mlTop.type, 0.5)
    }
  }

  return [...hitsByType.entries()]
    .map(([type, set]) => ({ type, hits: [...set], count: hitStrength.get(type) }))
    .sort((a, b) => b.count - a.count)
}
