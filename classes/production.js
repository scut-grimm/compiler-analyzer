class Production{
  constructor(head, body){
    this.head = head
    this.body = body
  }
  getString(){
    return this.head.getString() + '->' + this.body.map(e => e.getString()).join('')
  }
  getTerminals(){
    return this.body.filter(e => e.type === 'Terminal')
  }
  getNonterminals(){
    return this.body.filter(e => e.type === 'Nonterminal')
  }
  getHeadString(){
    return this.head.getString()
  }
  getBodyString(){
    return this.body.map(e => e.getString()).join('')
  }
}
export default Production
