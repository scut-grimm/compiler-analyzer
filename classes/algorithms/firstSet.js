import MapSet from '../map-set'
class FirstSet {
  constructor(grammar) {
    this.grammar = grammar;
    //this.production = this.grammar.getProductions();
    //this.firstSet = new MapSet()
  }


  getInitContext(){
    return {
      cur_g_index: 0,
      firstSet: new MapSet(),
      originSize: 0
    }
  }


  *epoch(curContext){
    //let firstSet = this.grammar.firstSet;
    let {cur_g_index, firstSet,originSize} = curContext;
    const curProduction =this.grammar.productions[cur_g_index];

    /*let terminals = this.grammar.getTerminals();
    for(let i=0; i<terminals.length; i++){
      firstSet.add(terminals[i], terminals[i]);
    }*/

    yield {
      curProduction,
      notice: '分析产生式(' + curProduction.getString() +')',
      highlightSymbols: []
    }
    //console.log(curProduction.getString())

    let nonterminals = this.grammar.getNonterminals();
    if(cur_g_index == 0){
      originSize = 0;
      for(let i=0; i<nonterminals.length; i++){
        if(firstSet.has(nonterminals[i]))
          originSize += firstSet.get(nonterminals[i]).size;
      }
    }


    let head = curProduction.getHead();
    let body = curProduction.getBody();
    if (body[0].isTerminal() || body[0].isEmpty()) {
      yield{
        curProduction,
        notice:`将${body[0].getString()}加入到First(${head.getString()} )中`,
        highlightSymbols:body[0],
      }
      firstSet.add(head, body[0])
    }
    else {
      const result = new Set();
      let frontAllHaveEmpty = true;
      const Empty = this.grammar.getEmptySign();
      for (let sign of body) {
        if (frontAllHaveEmpty === true) {
          yield{
            curProduction,
            notice: `将First(${sign.getString()})中除ε外的所有sign加入到First(${head.getString()} )中`,
            highlightSymbols: [sign]
          }
          this.grammar.getSignFirstSet(sign).filter(e => e.isTerminal()).forEach(e => result.add(e))
          }
          if (!(new Set(this.grammar.getSignFirstSet(sign))).has(Empty)) {
            frontAllHaveEmpty = false
          }
        }
        if (frontAllHaveEmpty && body.length > 0) {
          yield{
            curProduction,
            notice: `如果产生式体所有的非终止符的first集都存在ε，将ε加入到First(${head.getString()} )中`,
            highlightSymbols: []
          }
          result.add(Empty)
        }
        let result1=[...result];
        for(let i=0; i<result1.length; i++)
          firstSet.add(head, result1[i])
      }

    let newSize=0
    for(let i=0; i<nonterminals.length; i++){
      if(firstSet.has(nonterminals[i]))
        newSize += firstSet.get(nonterminals[i]).size;
    }


    let count=0;
    //console.log(originSize)
    //console.log(newSize)
    if(cur_g_index >= this.grammar.productions.length-1){
      if(newSize === originSize)
      {
        return [true, firstSet]
      }
      else{
        count++;
        cur_g_index = -1
      }
    }

    const nextContext = {
      cur_g_index: cur_g_index+1,
      firstSet,
      originSize
    }

    this.grammar.firstSet = firstSet;
    return [false, nextContext]
  }

  getCurResult({firstSet}){
    return firstSet
  }

  getResultFromContext({firstSet}){
    return firstSet
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
      ret = this.runEpoch(ret[1])
    }
    return ret[1]
  }

}
export default FirstSet
