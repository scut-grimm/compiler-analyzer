import Production from './production'
import Sign from './sign'
import assert from 'assert'
import MapSet from './map-set'
class Grammar{
  constructor(){
    this.productions = []
    this.signs = new Map()
    this.firstSet = new MapSet()
    this.followSet = new MapSet()
    this.startSign = null
  }
  setStartSign(sign){
    assert.strictEqual(this.checkSignsExist([sign]), true, 'Sign should be added first')
    this.startSign = this.getSign(sign)
  }
  getStartSign(){
    assert.notStrictEqual(this.startSign, null , 'Start Sign has not been defined.')
    return this.startSign
  }
  getSign(symbol, type = undefined){
    //override getSign(sign:Sign)
    if(symbol instanceof Sign){
      let tmp = symbol
      symbol = tmp.symbol
      type = tmp.type
    }
    if(!this.signs.has(symbol)){
      this.signs.set(symbol, new Sign(symbol, type))
    }else{
      if(type !== undefined){
        assert.strictEqual(type, this.signs.get(symbol).type, 'type should be the same')
      }
    }
    return this.signs.get(symbol)
  }
  getEmptySign(){
    return this.getSign('ε', 'Empty')
  }
  getStackBottomSign(){
    return this.getSign('$', 'StackBottom')
  }
  checkSignsExist(signs){
    for(let sign of signs){
      if(!this.signs.has(sign.symbol) || this.signs.get(sign.symbol) !== sign){
        return false
      }
    }
    return true
  }
  addProduction(head, body){
    assert.strictEqual(this.checkSignsExist([head,...body]), true, 'All Sign should be add first')
    let production = new Production(head, body)
    this.productions.push(production)
    return production
  }
  getProductions(){
    return this.productions
  }
  getDerivations(head){
    if(typeof(head) === 'string'){
      assert.strictEqual(this.signs.has(head),true)
      head = this.signs.get(head)
    }
    return this.productions.filter(e => e.head.symbol === head.symbol)
  }
  getTerminals(){
    return [...this.signs.values()].filter(e => e.type === 'Terminal')
  }
  getNonterminals(){
    return [...this.signs.values()].filter(e => e.type === 'Nonterminal')
  }
  getSignFirstSet(sign){
    assert.strictEqual(this.signs.has(sign.symbol),true)
    if(!sign.isNonterminal()){
      return [sign]
    }
    sign = this.getSign(sign.symbol)
    if(!this.firstSet.has(sign)){
      return []
    }
    return [...this.firstSet.get(sign)]
  }
  getProductionBodyFirstSet(production){
    const result = new Set()
    let frontAllHaveEmpty = true
    const Empty = this.getEmptySign()
    for(let sign of production.body){
      if(frontAllHaveEmpty===true){
        this.getSignFirstSet(sign).filter(e => e.isTerminal() || e.isEmpty() || e.isStackBottom()).forEach(e => result.add(e))
      }
      if(!(new Set(this.getSignFirstSet(sign))).has(Empty)){
        frontAllHaveEmpty = false
      }
    }
    if(frontAllHaveEmpty && production.body.length > 0){
      result.add(Empty)
    }
    return [...result]
  }
  getSignFollowSet(sign){
    assert.strictEqual(this.signs.has(sign.symbol),true)
    sign = this.getSign(sign.symbol)
    if(!this.followSet.has(sign)){
      return []
    }
    return [...this.followSet.get(sign)]
  }
}
export default Grammar
