import assert from 'assert'
class IsLL1 {
  productions = Array.of()
  isLL1Label = true
  constructor(grammar) {
    // 深拷贝 grammar
    this.grammar = grammar.clone()
  }

  isLL1New() {
    const empty = this.grammar.getEmptySign()
    const nonterminals = this.grammar.getNonterminals()
    assert(nonterminals.length, '文法没有非终止符号')
    for (const nonterminal of nonterminals) {
      const head = nonterminal // 记录所有头部相同的产生式的头部
      const sameHeadProductions = this.grammar.getDerivations(nonterminal) // 存放所有头部相同的产生式
      if (sameHeadProductions.length > 0) { // 确保有以 head 为头部的产生式
        let firstFollowIntersectionIsEmpty = true // 标志位，标识产生式头部的 First 集合和 Follow 集合相交是否为空
        let headFirstSetHasEmpty = false // 标志位，标识产生式头部的First集合中是否有 ε
        const headFirstSet = new Set(this.grammar.getSignFirstSet(head)) // 存放 head 的 First 集合
        const headFollowSet = new Set(this.grammar.getSignFollowSet(head)) // 存放 head 的 Follow 集合
        const firstFollowIntersection = [...this.intersection(headFirstSet, headFollowSet)] // 存放产生式头部 First 集合和 Follow 集合的交集
        if (headFirstSet.has(empty)) {
          headFirstSetHasEmpty = true
          if (firstFollowIntersection.length > 0) {
            this.isLL1Label = false
            firstFollowIntersectionIsEmpty = false
          }
        }

        let bodyFirstSetIntersectionIsEmpty = true // 标志位，标识在所有头部相同的产生式中，任意两个产生式的产生式体的 First 集合相交是否为空
        const productionBodyFirstSets = [] // 存放所有头部相同的产生式的产生式体的 First 集合
        const bodyFirstSetIntersectionNoEmptyProduction = [] // 存放产生式体 First 集合相交不为空的产生式
        let index = [] // 存放产生式体 First 集合相交不为空的产生式在 productionBodyFirstSets 中的下标
        for (const production of sameHeadProductions) {
          const productionBodyFirstSet = {
            production: production,
            bodyFirstSet: this.grammar.getProductionBodyFirstSet(production)
          }
          index.push(this.grammar.getProductionBodyFirstSet(production))
          productionBodyFirstSets.push(productionBodyFirstSet)
        }
        index = this.findProductionBodyFirstSetIntersectionNotEmpty(index)
        if (index.length > 0) {
          bodyFirstSetIntersectionIsEmpty = false
          this.isLL1Label = false
          for (const i of index) {
            bodyFirstSetIntersectionNoEmptyProduction.push(productionBodyFirstSets[i].production)
          }
        }
        const item = {
          head: head, // 记录所有头部相同的产生式的头部
          sameHeadProductions: sameHeadProductions, // 存放所有头部相同的产生式
          firstFollowIntersectionIsEmpty: firstFollowIntersectionIsEmpty, // 标志位，标识产生式头部的 First 集合和 Follow 集合相交是否为空
          headFirstSetHasEmpty: headFirstSetHasEmpty, // 标志位，标识产生式头部的First集合中是否有 ε
          headFirstSet: [...headFirstSet], // 存放 head 的 First 集合
          headFollowSet: [...headFollowSet], // 存放 head 的 Follow 集合
          firstFollowIntersection: firstFollowIntersection, // 存放产生式头部 First 集合和 Follow 集合的交集
          bodyFirstSetIntersectionIsEmpty: bodyFirstSetIntersectionIsEmpty, // 标志位，标识在所有头部相同的产生式中，任意两个产生式的产生式体的 First 集合相交是否为空
          productionBodyFirstSets: productionBodyFirstSets, // 存放所有头部相同的产生式的产生式体的 First 集合
          bodyFirstSetIntersectionNoEmptyProduction: bodyFirstSetIntersectionNoEmptyProduction // 存放产生式体 First 集合相交不为空的产生式
        }
        this.productions.push(item)
      }
    }
    return {
      isLL1: this.isLL1Label,
      productions: this.productions
    }
  }

  isLL1() {
    const nonterminals = this.grammar.getNonterminals()
    assert(nonterminals.length, '文法没有非终止符号')
    for (const item of nonterminals) {
      const productions = this.grammar.getDerivations(item)
      if (productions.length !== 0) {
        const nonFirstSet = new Set(this.grammar.getSignFirstSet(item)) // 不要使用字符串
        // assert(nonFirstSet.size, `First(${item.symbol})为空`)
        const nonFollowSet = new Set(this.grammar.getSignFollowSet(item)) // 不要使用字符串
        // assert(nonFollowSet.size, `Follow(${item.symbol})为空`)
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
              errorBodyIndex: errorBodyIndex, // 相交不为空的产生式在 production 中的下标
              notice: noticeArr
            }
            this.isLL1Label = false
            this.productions.push(errorProduction)
          } else {
            const rightProductionArray = this.grammar.getDerivations(item)
            const rightProduction = {
              error: false,
              production: rightProductionArray,
              errorBodyIndex: [],
              notice: ['产生式没问题']
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
  const result = temp.isLL1New()
  // result.productions.forEach(e => {
  //   let productionString = e.production[0].getHeadString() + ' -> '
  //   for (const i of e.production) {
  //     productionString += i.getBodyString() + ' | '
  //   }
  //   productionString = productionString.slice(0, -3)
  //   e.production = productionString
  // })
  return result
}
