class Production {
  constructor(head, body) {
    this.head = head
    this.body = body
  }
  getString() {
    return this.head.getString() + ' \u2192 ' + this.body.map(e => e.getString()).join(' ')
  }
  getTerminals() {
    return this.body.filter(e => e.type === 'Terminal')
  }
  getNonterminals() {
    return this.body.filter(e => e.type === 'Nonterminal')
  }
  getHeadString() {
    return this.head.getString()
  }
  getBodyString() {
    return this.body.map(e => e.getString()).join(' ')
  }
  getHead() {
    return this.head
  }
  getBody() {
    return this.body
  }
  isSameOf(head, body) {
    if (this.head === head && body.length === this.body.length) {
      let same = true
      for (let i = 0; i < body.length; i++) {
        if (body[i] !== this.body[i]) {
          same = false
          break
        }
      }
      return same
    }
    return false
  }
}
export default Production
