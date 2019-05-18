const assert = require('assert')
const Types = {
  Terminal: 1,
  Nonterminal: 2,
  Empty: 3,
  StackBottom: 4
}
class Sign {
  constructor(symbol, type) {
    assert.notEqual(Types[type], undefined, 'type is not defined')
    this.symbol = symbol
    this.type = type
  }
  getString() {
    return this.symbol
  }
  isTerminal() {
    return this.type === 'Terminal'
  }
  isNonterminal() {
    return this.type === 'Nonterminal'
  }
  isEmpty() {
    return this.type === 'Empty'
  }
  isStackBottom() {
    return this.type === 'StackBottom'
  }
}
export default Sign
