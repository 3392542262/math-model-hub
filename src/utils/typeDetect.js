import hints from '../data/type-hints.json' with { type: 'json' }

/**
 * 根据题目文本用关键词启发式识别题型
 * @param {string} text 题目文本
 * @returns {Array<{type:string, hits:string[], count:number}>} 按命中数降序
 */
export function detectTypes(text) {
  if (!text || !text.trim()) return []
  const results = []
  for (const [type, info] of Object.entries(hints.types)) {
    const hits = info.keywords.filter((k) => text.includes(k))
    if (hits.length > 0) results.push({ type, hits, count: hits.length })
  }
  results.sort((a, b) => b.count - a.count)
  return results
}
