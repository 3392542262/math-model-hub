import contest from '../data/contest.json' with { type: 'json' }

// 特征提取：字符 bigram（相邻两字组合），适合中文短文本
function tokenize(text) {
  const s = String(text || '').replace(/\s+/g, '')
  const grams = new Set()
  for (let i = 0; i < s.length - 1; i++) grams.add(s.slice(i, i + 2))
  return [...grams]
}

// 训练集：真题库中有题名的 40 道题（title → 主标签）
function buildTrainingSet() {
  const samples = []
  for (const y of contest.years) {
    for (const p of y.problems) {
      if (p.title && p.types.length) samples.push({ text: p.title, label: p.types[0] })
    }
  }
  return samples
}

/**
 * 朴素贝叶斯分类器（多项式模型 + 拉普拉斯平滑）
 * 训练集来自真题库，可对未见过的题目按概率推测题型
 */
export function trainNaiveBayes() {
  const samples = buildTrainingSet()
  const classes = {} // label -> 样本数
  const classWords = {} // label -> Map(word -> 次数)
  const vocab = new Set()

  for (const s of samples) {
    classes[s.label] = (classes[s.label] || 0) + 1
    if (!classWords[s.label]) classWords[s.label] = new Map()
    for (const w of tokenize(s.text)) {
      classWords[s.label].set(w, (classWords[s.label].get(w) || 0) + 1)
      vocab.add(w)
    }
  }

  const total = samples.length
  const V = vocab.size

  return {
    classes,
    total,
    vocabSize: V,
    /** @returns {Array<{type:string, score:number}>} 按对数概率降序 */
    predict(text) {
      const words = tokenize(text)
      if (!words.length) return []
      const scores = []
      for (const label of Object.keys(classes)) {
        let logp = Math.log(classes[label] / total)
        const cw = classWords[label]
        for (const w of words) {
          const cnt = cw.get(w) || 0
          logp += Math.log((cnt + 1) / (cw.size + V)) // 拉普拉斯平滑
        }
        scores.push({ type: label, score: logp })
      }
      scores.sort((a, b) => b.score - a.score)
      return scores
    },
  }
}

let _nb = null
export function getNB() {
  if (!_nb) _nb = trainNaiveBayes()
  return _nb
}
