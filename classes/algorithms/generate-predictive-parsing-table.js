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
    if(cur_g_index >= G.productions.length){
      return [true, table]
    }
    const curProduction = G.productions[cur_g_index]

    let curFirstSet = new Set(G.getProductionBodyFirstSet(curProduction))
    let curFollowSet = new Set(G.getSignFollowSet(curProduction.head))
    const Empty = G.getSign('ε','Terminal')
    const End = G.getSign('$','Terminal')
    yield {
      curProduction,
      notice: '分析产生式(' + curProduction.getString() +')',
      step: 0,
      highlightSymbols: []
    }
    for(let symbol of curFirstSet) {
      yield {
        curProduction,
        notice: `First(${curProduction.getBodyString()})中存在终止符 ${symbol.getString()} , 将产生式 ${curProduction.getString()} 加入到分析表M[${curProduction.getHeadString()}, ${symbol.getString()}]中`,
        step: 0,
        highlightSymbols: [symbol]
      }
      table.set(curProduction.head, symbol, curProduction)
    }
    if(curFirstSet.has(Empty)){
      yield {
        curProduction,
        notice: `First(${curProduction.getBodyString()})中存在${Empty.getString()}`,
        step: 1,
        highlightSymbols: [Empty]
      }
      for(let symbol of curFollowSet){
        yield {
          curProduction,
          notice: `Follow(${curProduction.getHeadString()})中存在终止符 ${symbol.getString()} , 将产生式 ${curProduction.getString()} 加入到分析表M[${curProduction.getHeadString()}, ${symbol.getString()}]中`,
          step: 1,
          highlightSymbols: [symbol]
        }
        table.set(curProduction.head, symbol, curProduction)
      }
      if(curFollowSet.has(End)){
        yield {
          curProduction,
          notice: `Follow(${curProduction.getHeadString()})中存在 $ , 将产生式 ${curProduction.getString()} 加入到分析表M[${curProduction.getHeadString()}, $]中`,
          step: 2,
          highlightSymbols: [End]
        }
        table.set(curProduction.head, End, curProduction)
      }else{
        yield {
          curProduction,
          notice: `Follow(${curProduction.getHeadString()})中不存在 $ ，跳过`,
          step: 2,
          highlightSymbols: []
        }
      }
    }else{
      yield {
        curProduction,
        notice: `First(${curProduction.getBodyString()})中不存在 ${Empty.getString()} ，跳过`,
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
