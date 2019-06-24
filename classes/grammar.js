import Production from './production'
import Sign from './sign'
import assert from 'assert'
import MapSet from './map-set'
import PPT from './predictive-parsing-table'
class Grammar {
  constructor() {
    this.productions = []
    this.signs = new Map()
    this.firstSet = new MapSet()
    this.followSet = new MapSet()
    this.PPT = new PPT()
    this.startSign = null
    this.getEmptySign()
    this.getStackBottomSign()
  }
  clone() {
    const other = new Grammar()
    for (const key of this.signs.keys()) {
      other.signs.set(key, this.signs.get(key))
    }
    other.productions = [...this.productions]
    other.firstSet = this.firstSet.clone()
    other.followSet = this.followSet.clone()
    other.PPT = this.PPT.clone()
    other.startSign = this.startSign
    return other
  }
  setFirstSet(firstSet) {
    this.firstSet = firstSet
  }
  setFollowSet(followSet) {
    this.followSet = followSet
  }
  setPPT(PPT) {
    this.PPT = PPT
  }
  setStartSign(sign) {
    assert.strictEqual(this.checkSignsExist([sign]), true, 'Sign should be added first')
    this.startSign = this.getSign(sign)
  }
  getStartSign() {
    assert.notStrictEqual(this.startSign, null, 'Start Sign has not been defined.')
    return this.startSign
  }
  getSign(symbol, type = undefined) {
    // override getSign(sign:Sign)
    if (symbol instanceof Sign) {
      const tmp = symbol
      symbol = tmp.symbol
      type = tmp.type
    }
    if (!this.signs.has(symbol)) {
      this.signs.set(symbol, new Sign(symbol, type))
    } else {
      if (type !== undefined) {
        assert.strictEqual(type, this.signs.get(symbol).type, 'type should be the same')
      }
    }
    return this.signs.get(symbol)
  }
  // symbol::string
  hasSymbol(symbol) {
    return this.signs.has(symbol)
  }
  printProductions() {
    for (const production of this.productions) {
      console.log(production.getString())
    }
  }
  getSignUnusedAlias(sign) {
    let cur = sign.getString()
    while (true) {
      cur = cur + "'"
      if (!this.hasSymbol(cur)) {
        return this.getSign(cur, sign.type)
      }
    }
  }
  getEmptySign() {
    return this.getSign('ε', 'Empty')
  }
  getStackBottomSign() {
    return this.getSign('$', 'StackBottom')
  }
  checkSignsExist(signs) {
    for (const sign of signs) {
      if (typeof sign === 'string') {
        if (!this.signs.has(sign) || this.signs.get(sign).symbol !== sign) {
          return false
        }
      } else {
        if (!this.signs.has(sign.symbol) || this.signs.get(sign.symbol) !== sign) {
          return false
        }
      }
      return true
    }
  }
  addProduction(head, body) {
    assert.strictEqual(this.checkSignsExist([head, ...body]), true, 'All Sign should be add first')
    const production = new Production(head, body)
    this.productions.push(production)
    return production
  }
  getProductions() {
    return this.productions
  }
  getDerivations(head) {
    if (typeof (head) === 'string') {
      assert.strictEqual(this.signs.has(head), true)
      head = this.signs.get(head)
    }
    return this.productions.filter(e => e.head.symbol === head.symbol)
  }
  deleteProduction(head, body) {
    for (let a = 0; a < this.productions.length; a++) {
      const production = this.productions[a]
      if (production.isSameOf(head, body)) {
        this.productions.splice(a, 1)
        return true
      }
    }
    return false
  }
  getTerminals() {
    return [...this.signs.values()].filter(e => e.type === 'Terminal')
  }
  getNonterminals() {
    return [...this.signs.values()].filter(e => e.type === 'Nonterminal')
  }
  getSignFirstSet(sign) {
    assert.strictEqual(this.signs.has(sign.symbol), true)
    if (!sign.isNonterminal()) {
      return [sign]
    }
    sign = this.getSign(sign.symbol)
    if (!this.firstSet.has(sign)) {
      return []
    }
    return [...this.firstSet.get(sign)]
  }
  getProductionBodyFirstSet(production) {
    return this.getSignsFirstSet(production.getBody())
  }
  getSignsFirstSet(signs) {
    const result = new Set()
    let frontAllHaveEmpty = true
    const Empty = this.getEmptySign()
    for (const sign of signs) {
      if (frontAllHaveEmpty === true) {
        this.getSignFirstSet(sign).filter(e => e.isTerminal()).forEach(e => result.add(e))
      }
      if (!(new Set(this.getSignFirstSet(sign))).has(Empty)) {
        frontAllHaveEmpty = false
      }
    }
    if (frontAllHaveEmpty && signs.length > 0) {
      result.add(Empty)
    }
    return [...result]
  }
  getSignFollowSet(sign) {
    assert.strictEqual(this.signs.has(sign.symbol), true)
    sign = this.getSign(sign.symbol)
    if (!this.followSet.has(sign)) {
      return []
    }
    return [...this.followSet.get(sign)]
  }
}
export default Grammar
