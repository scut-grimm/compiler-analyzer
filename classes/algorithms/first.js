import MapSet from '../map-set'
class First {
  constructor(grammar) {
    this.grammar = grammar
    this.production = this.grammar.getProductions()
    this.firstSet = new MapSet()
  }

  getFirstSetSize() {
    let size = 0
    const nonterminals = this.grammar.getNonterminals()
    for (let i = 0; i < nonterminals.length; i++) {
      if (this.firstSet.has(nonterminals[i])) { size += this.firstSet.get(nonterminals[i]).size }
    }
    return size
  }

  calFirstSet() {
    this.firstSet = this.grammar.firstSet
    let newSize = 0
    const terminals = this.grammar.getTerminals()
    for (let i = 0; i < terminals.length; i++) {
      this.firstSet.add(terminals[i], terminals[i])
    }
    let changed = true
    while (changed) {
      const originSize = this.getFirstSetSize()
      for (const production of this.production) {
        const head = production.getHead()
        const body = production.getBody()
        if (body[0].isTerminal() || body[0].isEmpty()) {
          this.firstSet.add(head, body[0])
        } else {
          const result = new Set()
          let frontAllHaveEmpty = true
          const Empty = this.grammar.getEmptySign()
          for (const sign of body) {
            if (frontAllHaveEmpty === true) {
              this.grammar.getSignFirstSet(sign).filter(e => e.isTerminal()).forEach(e => result.add(e))
            }
            if (!(new Set(this.grammar.getSignFirstSet(sign))).has(Empty)) {
              frontAllHaveEmpty = false
            }
          }
          if (frontAllHaveEmpty && body.length > 0) {
            result.add(Empty)
          }
          const result1 = [...result]
          for (let i = 0; i < result1.length; i++) { this.firstSet.add(head, result1[i]) }
        }
      }
      newSize = this.getFirstSetSize()
      if (newSize === originSize) { changed = false } else { changed = true }
    }
    this.grammar.firstSet = this.firstSet
    return this.firstSet
  }
}
export default First
