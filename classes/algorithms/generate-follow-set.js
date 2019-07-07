import MapSet from '../map-set'
class GenerateFollowSet {
  constructor(grammar) {
    this.grammar = grammar
  }
  // 获取初始化context
  getInitContext() {
    return {
      followset: new MapSet(),
      first: true,
      pass_results: []
    }
  }
  // epoch函数为generator，执行算法的每一轮循环，返回一个数组[isFinish, nextContext]。该函数接受curContext作为本轮算法的上下文，并在nextContext中返回经过该次算法迭代后的算法上下文
  // 由于每个算法循环中都包含几个步骤，考虑到前端的展示需求，在需要前端展示变化的时候，通过yield返回视图上所需的变化
  * epoch(curContext) {
    const firstset = this.grammar.firstset
    console.log(this.grammar)
    const { followset ,first, pass_results } = curContext
    followset.clearDirty()
    const stackBottomSign = this.grammar.getStackBottomSign()
    const startSign = this.grammar.getStartSign()
    const Empty = this.grammar.getEmptySign()
    const processedSigns = new Set()
    let active = 0
    if(first){

      followset.add(startSign, stackBottomSign)
      yield{
        curProduction: {},
        notice: `将\`$\`放入\`Follow(${startSign.getString()})\`中`,
        step: 0,
        highlightSymbols: [],
        active,
        gettingFirst: []
      }
    }
    for(const production of this.grammar.getProductions()){

      // yield {
      //   production,
      //   notice: '分析产生式(' + production.getString() + ')',
      //   step: 1,
      //   highlightSymbols: []
      // }
      const body = production.getBody()
      for(let i=0;i<body.length;i++){
        const sign = body[i]
        const remains = body.slice(i+1)
        processedSigns.add(sign)
        if(sign.isNonterminal()){
          const toAdd = [...this.grammar.getSignsFirstSet(remains)].filter(e => !e.isEmpty())
          if(toAdd.length > 0){

            for(const item of toAdd){
              followset.add(sign, item)
            }
            yield {
              production,
              notice: `\`FIRST(${remains.map(e=>e.getString()).join('')})\`=\`${toAdd.map(e=>e.getString()).join('')}\`，将除\`${Empty.getString()}\`之外的符号加入\`FOLLOW(${sign.getString()})\`中`,
              step: 1,
              highlightSymbols: [],
              processedSigns: [...processedSigns],
              active,
              gettingFirst: [...remains]
            }
          }

          const remainsFirstSet = new Set(this.grammar.getSignsFirstSet(remains))
          if(remainsFirstSet.size === 0){
            yield {
              production,
              notice: `在产生式\`${production.getString()}\`中，\`${sign.getString()}\`之后无符号`,
              step: 2,
              highlightSymbols: [],
              processedSigns: [...processedSigns],
              active,
              gettingFirst: []
            }
          }else if(remainsFirstSet.has(Empty)){
            yield {
              production,
              notice: `在产生式\`${production.getString()}\`中，\`${sign.getString()}\`之后的符号的\`FITST(${remains.map(e=>e.getString()).join('')})\`中存在\`${Empty.getString()}\``,
              step: 2,
              highlightSymbols: [],
              processedSigns: [...processedSigns],
              active,
              gettingFirst: [...remains]
            }
          }
          if(remainsFirstSet.size === 0 || remainsFirstSet.has(Empty)){

            if(followset.has(production.getHead())){
              const toAdd = [...followset.get(production.getHead())]
              for(const item of toAdd){
                followset.add(sign, item)
              }
            }
            yield {
              production,
              notice: `将\`FOLLOW(${production.getHead().getString()})\`中的所有符号放入\`FOLLOW(${sign.getString()})\`中`,
              step: 2,
              highlightSymbols: [],
              processedSigns: [...processedSigns],
              active,
              gettingFirst: [production.getHead()]
            }

          }
        }
      }
      active++
    }
    if(followset.isDirty()){
      pass_results.push(followset.clone())
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
