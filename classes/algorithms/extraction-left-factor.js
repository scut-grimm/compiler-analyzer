import MapSet from '../map-set'
class GenerateFollowSet {
  constructor(grammar) {
    this.grammar = grammar
  }
  // 获取初始化context
  getInitContext() {
    return {
      newGrammar: this.grammar.clone()
    }
  }
  getCommonPrefix(bodys){
    let preCommonSet = new Set()
    let curCommonSet = new Set()
    let maxLength = bodys.reduce((a,b) => {
      let tmp = b.length
      if(a > tmp){
        return a
      }else{
        return tmp
      }
    }, 0)
    for(let i=0;i<maxLength;i++){

      for(let body of bodys){
        let curPre = []

      }
    }
  }
  // epoch函数为generator，执行算法的每一轮循环，返回一个数组[isFinish, nextContext]。该函数接受curContext作为本轮算法的上下文，并在nextContext中返回经过该次算法迭代后的算法上下文
  // 由于每个算法循环中都包含几个步骤，考虑到前端的展示需求，在需要前端展示变化的时候，通过yield返回视图上所需的变化
  * epoch(curContext) {
    const grammar = this.grammar
    const { newGrammar } = curContext
    let changed = false
    let terminals = newGrammar.getTerminals()
    for(let terminal of terminals){

    }
    return [!followset.isDirty(), {
      followset,
      first: false,
      pass_results
    }]
  }

  getCurResult({followset,pass_results}) {
    return {followset,pass_results}
  }
  getResultFromContext() {
  }
  // 包装器，用于完整运行每一个epoch，返回[isFinish, nextContext]
  runEpoch(curContext) {
    const run = this.epoch(curContext)
    let ret = null
    do {
      ret = run.next()
    } while (ret.done === false)
    return ret.value
  }
  // 执行整个算法，返回该算法的输出
  run() {
    let ret = [false, this.getInitContext()]
    while (ret[0] === false) {
      ret = this.runEpoch(ret[1])
    }
    return ret[1]['followset']
  }
}
export default GenerateFollowSet
