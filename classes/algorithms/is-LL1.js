import assert from 'assert'
class IsLL1 {
  productions = Array.of()
  isLL1Label = true
  constructor(grammar) {
    this.grammar = grammar
  }

  isLL1() {
    const nonterminals = this.grammar.getNonterminals()
    assert(nonterminals.length, '文法没有非终止符号')
    for (const item of nonterminals) {
      const productions = this.grammar.getDerivations(item)
      if (productions.length !== 0) {
        const nonFirstSet = new Set(this.grammar.getSignFirstSet(item)) // 不要使用字符串
        //assert(nonFirstSet.size, `First(${item.symbol})为空`)
        const nonFollowSet = new Set(this.grammar.getSignFollowSet(item)) // 不要使用字符串
        //assert(nonFollowSet.size, `Follow(${item.symbol})为空`)
        const intersection = this.intersection(nonFirstSet, nonFollowSet)
        // 不要使用字符串判断是否有 ε 直接用 set.has(Sign)
        if (!(nonFirstSet.has(this.grammar.getEmptySign()) && intersection.size > 0)) {
          const bodyFirstSets = productions.map(x => this.grammar.getProductionBodyFirstSet(x))
          const errorBodyIndex = this.findProductionBodyFirstSetIntersectionNotEmpty(bodyFirstSets)
          if (errorBodyIndex.length !== 0) {
            const noticeArr = Array.of()
            for (const i of errorBodyIndex) {
              noticeArr.push(`${this.genErrorNotice(productions, i)}相交不为空`)
            }
            const errorProductionArray = this.grammar.getDerivations(item)
            const errorProduction = {
              error: true,
              production: errorProductionArray, // 这里放原始的产生式对象，不要放字符串
              notice: noticeArr
            }
            this.isLL1Label = false
            this.productions.push(errorProduction)
          } else {
            const rightProductionArray = this.grammar.getDerivations(item)
            const rightProduction = {
              error: false,
              production: rightProductionArray,
              notice: ['产生式符合规则']
            }
            this.productions.push(rightProduction)
          }
        } else {
          const noticeArr = Array.of(`First(${item.symbol}) 中存在 ε 且 First(${item.symbol}) 与 Follow(${item.symbol}) 相交不为空`)
          const errorProductionArray = this.grammar.getDerivations(item)
          const errorProduction = {
            error: true,
            production: errorProductionArray, // 这里放原始的产生式对象，不要放字符串
            notice: noticeArr
          }
          this.isLL1Label = false
          this.productions.push(errorProduction)
        }
      }
    }
    return {
      isLL1: this.isLL1Label,
      productions: this.productions
    }
  }

  findProductionBodyFirstSetIntersectionNotEmpty(bodyFirstSets) {
    const errorBodyIndex = Array.of()
    for (let i = 0; i < bodyFirstSets.length; i++) {
      const tempIndex = new Set()
      for (let j = 0; j < bodyFirstSets[i].length; j++) {
        let interIndex = i + 1
        for (; interIndex < bodyFirstSets.length; interIndex++) {
          for (let k = 0; k < bodyFirstSets[interIndex].length; k++) {
            if (bodyFirstSets[i][j] === bodyFirstSets[interIndex][k]) {
              tempIndex.add(i)
              tempIndex.add(interIndex)
            }
          }
        }
      }
      if (tempIndex.size !== 0) {
        errorBodyIndex.push(tempIndex)
      }
    }
    return errorBodyIndex
  }

  intersection(setA, setB) { // 求交集
    const _intersection = new Set()
    for (const elem of setB) {
      if (setA.has(elem)) {
        _intersection.add(elem)
      }
    }
    return _intersection
  }

  genErrorNotice(production, index) { // 生成错误提示信息
    let temp = ''
    for (const i of index) {
      temp += 'First(' + production[i].getBodyString() + ') '
    }
    return temp
  }
}
export default function(grammar) {
  const temp = new IsLL1(grammar)
  const result = temp.isLL1()
  result.productions.forEach(e => {
    let productionString = e.production[0].getHeadString() + '->'
    for (const i of e.production) {
      productionString += i.getBodyString() + '|'
    }
    productionString = productionString.slice(0, -1)
    e.production = productionString
  })
  return result
}
