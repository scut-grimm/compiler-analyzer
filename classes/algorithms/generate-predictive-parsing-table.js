import PredictiveParsingTable from '../predictive-parsing-table'
class GeneratePredictiveParsingTable{
  constructor(grammar){
    this.grammar = grammar
  }
  // 获取初始化context
  getInitContext(){
    return {
      cur_g_index: 0,
      table: new PredictiveParsingTable()
    }
  }
  // epoch函数为generator，执行算法的每一轮循环，返回一个数组[isFinish, nextContext]。该函数接受curContext作为本轮算法的上下文，并在nextContext中返回经过该次算法迭代后的算法上下文
  // 由于每个算法循环中都包含几个步骤，考虑到前端的展示需求，在需要前端展示变化的时候，通过yield返回视图上所需的变化
  *epoch(curContext){
    let {cur_g_index,table} = curContext
    const G = this.grammar
    if(cur_g_index >= G.grammars.length){
      return [true, table]
    }
    const curGrammarItem = G.grammars[cur_g_index]

    let curFirstSet = new Set(G.getGrammarItemRightFirstSet(curGrammarItem))
    let curFollowSet = new Set(G.getSignFollowSet(curGrammarItem.leftSign))
    const Empty = G.getSign('ε','Terminal')
    const End = G.getSign('$','Terminal')
    yield {
      curGrammarItem,
      notice: '分析产生式(' + curGrammarItem.getStr() +')',
      step: 0,
      highlightSymbols: []
    }
    for(let symbol of curFirstSet) {
      yield {
        curGrammarItem,
        notice: `First(${curGrammarItem.getRightStr()})中存在终止符 ${symbol.getStr()} , 将产生式 ${curGrammarItem.getStr()} 加入到分析表M[${curGrammarItem.getLeftStr()}, ${symbol.getStr()}]中`,
        step: 0,
        highlightSymbols: [symbol]
      }
      table.set(curGrammarItem.leftSign, symbol, curGrammarItem)
    }
    if(curFirstSet.has(Empty)){
      yield {
        curGrammarItem,
        notice: `First(${curGrammarItem.getRightStr()})中存在${Empty.getStr()}`,
        step: 1,
        highlightSymbols: [Empty]
      }
      for(let symbol of curFollowSet){
        yield {
          curGrammarItem,
          notice: `Follow(${curGrammarItem.getLeftStr()})中存在终止符 ${symbol.getStr()} , 将产生式 ${curGrammarItem.getStr()} 加入到分析表M[${curGrammarItem.getLeftStr()}, ${symbol.getStr()}]中`,
          step: 1,
          highlightSymbols: [symbol]
        }
        table.set(curGrammarItem.leftSign, symbol, curGrammarItem)
      }
      if(curFollowSet.has(End)){
        yield {
          curGrammarItem,
          notice: `Follow(${curGrammarItem.getLeftStr()})中存在 $ , 将产生式 ${curGrammarItem.getStr()} 加入到分析表M[${curGrammarItem.getLeftStr()}, $]中`,
          step: 2,
          highlightSymbols: [End]
        }
        table.set(curGrammarItem.leftSign, End, curGrammarItem)
      }else{
        yield {
          curGrammarItem,
          notice: `Follow(${curGrammarItem.getLeftStr()})中不存在 $ ，跳过`,
          step: 2,
          highlightSymbols: []
        }
      }
    }else{
      yield {
        curGrammarItem,
        notice: `First(${curGrammarItem.getRightStr()})中不存在 ${Empty.getStr()} ，跳过`,
        step: 1,
        highlightSymbols: []
      }
    }
    const nextContext = {
      cur_g_index: cur_g_index+1,
      table
    }
    return [false, nextContext]
  }
  getCurResult({table}){
    return table.getTableData()
  }
  getResultFromContext({table}){
    return table
  }
  //包装器，用于完整运行每一个epoch，返回[isFinish, nextContext]
  runEpoch(curContext){
    let run = this.epoch(curContext)
    let ret = null;
    do{
      ret = run.next()
    }while(ret.done === false)
    return ret.value
  }
  //执行整个算法，返回该算法的输出
  run(){
    let ret = [false, this.getInitContext()]
    while(ret[0] == false){
      ret = runEpoch(ret[1])
    }
    return this.getResultFromContext(ret[1])
  }
}
export default GeneratePredictiveParsingTable
