import assert from 'assert'
class PredictiveParsingTable {
  constructor() {
    this.map = new Map()
    this.nonterminals = new Set()
    this.terminals = new Set()
    this.modify = {
      nonterminal: '',
      terminal: ''
    }
  }
  clone(){
    let other = new PredictiveParsingTable()
    for(let key of this.map.keys()){
      other.map.set(key, this.map.get(key))
    }
    other.nonterminals = new Set([...this.nonterminals])
    other.terminals = new Set([...this.terminals])
    return other
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
    this.modify = {
      nonterminal,
      terminal
    }
    this.nonterminals.add(nonterminal)
    this.terminals.add(terminal)
  }
  getModifyPosition(){
    return this.modify
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
