import assert from 'assert'
class EliminateLeftRecursion {
    immedateProductionIndex = Array.of()
    indirectProductionIndex = Array.of()
    nollableNonterminal = Array.of()
    constructor(grammar) {
      this.grammar = grammar
    }
    scanImmedateLeftRecursion() {
      const productions = this.grammmar.getProductions()
      for (let i = 0; i < productions.length; i++) {
        if (productions[i].getHead() === productions[i].getBody()[0]) {
          this.immedateProductionIndex.push(i)
        }
      }
    }
    scanIndirectionLeftRecursion() {
      const productions = this.grammar.getProductions()
    }
}
export default EliminateLeftRecursion
