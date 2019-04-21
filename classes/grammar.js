import GrammarItem from './grammar-item'
import Sign from './sign'
import assert from 'assert'
import MapSet from './map-set'
class Grammar{
  constructor(){
    this.grammars = []
    this.signs = new Map()
    this.firstSet = new MapSet()
    this.followSet = new MapSet()
    this.startSign = null
  }
  setStartSign(sign){
    assert.strictEqual(this.checkSignsExist([sign]), true, 'Sign should be added first')
    this.startSign = sign
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
  checkSignsExist(signs){
    for(let sign of signs){
      if(!this.signs.has(sign.symbol) || this.signs.get(sign.symbol) !== sign){
        return false
      }
    }
    return true
  }
  addGrammarItem(leftSign, rightSigns){
    assert.strictEqual(this.checkSignsExist([leftSign,...rightSigns]), true, 'All Sign should be add first')
    let grammarItem = new GrammarItem(leftSign, rightSigns)
    this.grammars.push(grammarItem)
    return grammarItem
  }
  getGrammarItems(){
    return this.grammars
  }
  getDerivations(leftSign){
    if(typeof(leftSign) === 'string'){
      assert.strictEqual(this.signs.has(leftSign),true)
      leftSign = this.signs.get(leftSign)
    }
    return this.grammars.filter(e => e.leftSign.symbol === leftSign.symbol)
  }
  getTerminals(){
    return [...this.signs.values()].filter(e => e.type === 'Terminal')
  }
  getNonterminals(){
    return [...this.signs.values()].filter(e => e.type === 'Nonterminal')
  }
  getSignFirstSet(sign){
    assert.strictEqual(this.signs.has(sign.symbol),true)
    if(sign.isTerminal()){
      return [sign]
    }
    sign = this.getSign(sign.symbol)
    if(!this.firstSet.has(sign)){
      return []
    }
    return [...this.firstSet.get(sign)]
  }
  getGrammarItemRightFirstSet(grammarItem){
    const result = new Set()
    let frontAllHaveEmpty = true
    const Empty = this.getSign('ε', 'Terminal')
    for(let sign of grammarItem.rightSigns){
      if(frontAllHaveEmpty===true){
        this.getSignFirstSet(sign).filter(e => e.isTerminal()).forEach(e => result.add(e))
      }
      if(!(new Set(this.getSignFirstSet(sign))).has(Empty)){
        frontAllHaveEmpty = false
      }
    }
    if(frontAllHaveEmpty && grammarItem.rightSigns.length > 0){
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
