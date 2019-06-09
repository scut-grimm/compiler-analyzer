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
    let maxLength = bodys.reduce((a,b) => {
      let tmp = b.length
      if(a > tmp){
        return a
      }else{
        return tmp
      }
    }, 0)
    function getPrefixBodys(bodys, prefix){
      let ret = []
      for(let body of bodys){
        if(body.length < prefix.length){
          continue
        }
        let flag = true
        for(let i=0;i<prefix.length;i++){
          if(body[i] !== prefix[i]){
            flag = false
            break
          }
        }
        if(flag){
          ret.push(body)
        }
      }
      return ret
    }
    //1. 寻找有相同的前缀
    let prefix = []
    let commonPrefix = []
    for(let i=1;i<=maxLength;i++){
      let ok = false
      for(let body of bodys){
        if(body.length < i){
          continue
        }
        prefix = body.slice(0,i)
        commonPrefix = getPrefixBodys(bodys, prefix)
        if(commonPrefix.length > 1){
          ok = true
          break
        }
      }
      if(ok){
        break
      }
    }
    if(commonPrefix.length===0){
      return [[],[]]
    }
    //2.取最长长度的前缀
    let pickone = commonPrefix[0]
    for(let i = prefix.length + 1; i<pickone.length;i++){
      let cur = pickone[i]
      let tmpPrefix = [...prefix, cur]
      let tmpBodys = getPrefixBodys(commonPrefix, tmpPrefix)
      if(tmpBodys.length !== commonPrefix.length){
        break
      }
      commonPrefix = tmpBodys
      prefix = tmpPrefix
    }
    return [prefix, commonPrefix]
  }
  // epoch函数为generator，执行算法的每一轮循环，返回一个数组[isFinish, nextContext]。该函数接受curContext作为本轮算法的上下文，并在nextContext中返回经过该次算法迭代后的算法上下文
  // 由于每个算法循环中都包含几个步骤，考虑到前端的展示需求，在需要前端展示变化的时候，通过yield返回视图上所需的变化
  * epoch(curContext) {
    const { newGrammar } = curContext
    let changed = false
    let nonTerminals = newGrammar.getNonterminals()
    for(let head of nonTerminals){
      let bodys = newGrammar.getDerivations(head).map(e => e.getBody())
      let [prefix, commonBodys] = this.getCommonPrefix(bodys)
      if(commonBodys.length < 2){
        continue
      }
      let middleSign = newGrammar.getSignUnusedAlias(head)
      newGrammar.addProduction(head, [...prefix, middleSign])
      for(let body of commonBodys){
        newGrammar.deleteProduction(head, body)
      }
      for(let body of commonBodys){
        let remain = body.slice(prefix.length)
        newGrammar.addProduction(middleSign, [...remain])
      }
      yield{}
      changed = true
    }
    return [!changed, {
      newGrammar
    }]
  }

  getCurResult({newGrammar}) {
    return newGrammar
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
    return this.getCurResult(ret[1])
  }
}
export default GenerateFollowSet
