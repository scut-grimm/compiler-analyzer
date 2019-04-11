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
  // epoll函数为generator，执行算法的每一轮循环，返回一个数组[isFinish, nextContext]。该函数接受curContext作为本轮算法的上下文，并在nextContext中返回经过该次算法迭代后的算法上下文
  // 由于每个算法循环中都包含几个步骤，考虑到前端的展示需求，在需要前端展示变化的时候，通过yield返回视图上所需的变化
  *epoll(curContext){
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
      notice: '分析产生式(' + curGrammarItem.getStr() +')'
    }
    yield {
      curGrammarItem,
      notice: '对于每个产生式A->α，将First(α)中的每个终结符a，将产生式A->α加入到分析表M[A,a]中'
    }
    for(let symbol of curFirstSet) {
      yield {
        curGrammarItem,
        notice: `First(${curGrammarItem.getRightStr()})中存在终止符${symbol.getStr()}, 将产生式${curGrammarItem.getStr()}加入到分析表M[${curGrammarItem.getLeftStr()},${symbol.str()}]中`
      }
      table.set(curGrammarItem.leftSign, symbol, curGrammarItem)
    }
    yield {
      curGrammarItem,
      notice: `若First(α)中存在${Empty.getStr()}，则将Follow(A)中的每个终结符号b，将A->α加入到分析表M[A,b]中`
    }
    if(curFirstSet.has(Empty)){
      yield {
        curGrammarItem,
        notice: `First(${curGrammarItem.getRightStr()})中存在${Empty.getStr()}`
      }
      for(let symbol of this.curFollowSet){
        yield {
          curGrammarItem,
          notice: `Follow(${curGrammarItem.getLeftStr()})中存在终止符${symbol.getStr()}, 将产生式${curGrammarItem.getStr()}加入到分析表M[${curGrammarItem.getLeftStr()},${symbol.str()}]中`
        }
        table.set(curGrammarItem.leftSign, symbol, curGrammarItem)
      }
      yield {
        curGrammarItem,
        notice: `若Follow(A)中存在$，则将A->α加入到M[A,$]中`
      }
      if(curFollowSet.has(End)){
        yield {
          curGrammarItem,
          notice: `Follow(${curGrammarItem.getLeftStr()})中存在$, 将产生式${curGrammarItem.getStr()}加入到分析表M[${curGrammarItem.getLeftStr()},$]中`
        }
        this.PPT.set(this.curGrammarItem.leftSign, End, this.curGrammarItem)
      }else{
        yield {
          curGrammarItem,
          notice: `Follow(${curGrammarItem.getLeftStr()})中不存在$`
        }
      }
    }else{
      yield {
        curGrammarItem,
        notice: `First(${curGrammarItem.getRightStr()})中不存在${Empty.getStr()}`
      }
    }
    const nextContext = {
      cur_g_index: cur_g_index+1,
      table
    }
    return [false, nextContext]
  }
  getResultFromContext({table}){
    return table
  }
  //包装器，用于完整运行每一个epoll，返回[isFinish, nextContext]
  runEpoll(curContext){
    let run = this.epoll(curContext)
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
      ret = runEpoll(ret[1])
    }
    return this.getResultFromContext(ret[1])
  }
}
export default GeneratePredictiveParsingTable
