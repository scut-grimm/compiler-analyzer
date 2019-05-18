import assert from 'assert'
class PredictiveParsingTable {
  constructor() {
    this.map = new Map()
    this.nonterminals = new Set()
    this.terminals = new Set()
  }
  get(nonterminal, terminal) {
    if (!this.map.has(nonterminal)) {
      return null
    }
    const submap = this.map.get(nonterminal)
    if (!submap.has(terminal)) {
      return null
    }
    return submap.get(terminal)
  }
  set(nonterminal, terminal, production) {
    if (!this.map.has(nonterminal)) {
      this.map.set(nonterminal, new Map())
    }
    const submap = this.map.get(nonterminal)
    if (submap.has(terminal)) {
      console.log(nonterminal.getString(), terminal.getString(), production.getString())
      console.log(submap.get(terminal).getString(), production.getString())
      assert.strictEqual(submap.get(terminal).getString(), production.getString(), 'has more than one item')
    }
    submap.set(terminal, production)
    this.nonterminals.add(nonterminal)
    this.terminals.add(terminal)
  }
  getTableData() {
    const nonterminals = [...this.nonterminals]
    const terminals = [...this.terminals]
    const table = []
    for (const nonterminal of nonterminals) {
      const cur = []
      for (const terminal of terminals) {
        cur.push(this.get(nonterminal, terminal))
      }
      table.push(cur)
    }
    return {
      nonterminals,
      terminals,
      table
    }
  }
}
export default PredictiveParsingTable
