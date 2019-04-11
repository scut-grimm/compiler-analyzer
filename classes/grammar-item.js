class GrammarItem{
  constructor(leftSign, rightSigns){
    this.leftSign = leftSign
    this.rightSigns = rightSigns
  }
  getStr(){
    return this.leftSign.getStr() + '->' + this.rightSigns.map(e => e.getStr()).join('')
  }
  getTerminals(){
    return this.rightSigns.filter(e => e.type === 'Terminal')
  }
  getNonterminals(){
    return this.rightSigns.filter(e => e.type === 'Nonterminal')
  }
  getLeftStr(){
    return this.leftSign.getStr()
  }
  getRightStr(){
    return this.rightSigns.map(e => e.getStr()).join('')
  }
}
export default GrammarItem
