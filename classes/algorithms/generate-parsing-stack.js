import ParsingStack from '../parsing-stack'

class GenerateParsingStack {
  constructor(grammar, PredictiveParsingTable, strToken) {
    this.grammar = grammar
    this.PredictiveParsingTable = PredictiveParsingTable
    this.end = this.grammar.getSign('$','Terminal')
    this.strToken=[...strToken]
    this.strToken.push(this.end)
    this.started = false
  }

  getInitContext() {
    return {
      cur_index: 0,
      // stack: new ParsingStack().push(this.grammar.getSign('$','Terminal')).push(this.grammar.getStartSign())
      stack:new ParsingStack().push(this.grammar.getSign('$','Terminal')).push([this.grammar.getSign('E','Nonterminal')])
    }
  }

  * epoch(curContext) {
    let {cur_index, stack} = curContext

    const G = this.grammar
    const end = this.end
    const PPT = this.PredictiveParsingTable
    const strToken = this.strToken
    let X = stack.peek()
    let p = strToken[cur_index]
    let M = PPT.get(X,p)

    //返回初始值
    if(!this.started){
      yield {
        Production:'',
        notice:``
      }
      this.started=true
    }


    while(X !== p){
    if(X.isTerminal()){
        console.log("栈顶：",X.getString(),"\t字符：",p.getString())
        return this.error()
      }
      else if(!M){
        console.log("M is null:",M)
        return this.error()
      }
      else if(M.getBody().length ===1 && M.getBody()[0]===G.getSign('ε', 'Terminal')){
        stack.pop()
        yield {
          Production:M.getString(),
          notice:`输出${M.getHeadString()} -> ${M.getBodyString()}`
        }
      }
      else {
        stack.pop()
        stack.push(M.getBody())
        yield {
            Production:M.getString(),
            notice:`输出${M.getHeadString()} -> ${M.getBodyString()}`
        }
      }
      X = stack.peek()
      M = PPT.get(X,p)
    }


    if(X === end){
      return [true,true]
    }

    // todo:debug
    stack.pop()    // 匹配非终结符号
    yield {
      Production:null,
      notice : `匹配${X.getString()}`
    }


    const nextContext = {
      cur_index: cur_index+1,
      stack
    }
    return [false,nextContext]
  }


  runEpoch(curContext) {
    let run = this.epoch(curContext)
    let ret = null;
    do{
      ret = run.next()
    }while(ret.done === false)
    return ret.value
  }

  run() {
    let ret = [false, this.getInitContext()]

    while(ret[0] == false){
      ret = this.runEpoch(ret[1])
     }
    return ret[1]

  }
  error(){
    console.log("发生错误")
    // 第二个参数表示失败
    return [true, false]
  }
  getCurResult({stack,cur_index}){
    return {
      "stack":stack,
      "strToken":this.strToken.slice(cur_index)
    }
  }

}

export default GenerateParsingStack
