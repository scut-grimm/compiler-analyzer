import assert from 'assert'
import Grammar from '../grammar'
class GenerateGrammarFromUserInput {
  productions = Array.of()
  startSymbol
  G = new Grammar()

  constructor(productions, startSymbol) {
    assert(productions.length, '前端传来的文法规则为空')
    this.productions = [...productions]
    if (startSymbol === undefined) {
      const start = this.G.getSign(this.productions[0][0].symbol, this.productions[0][0].type)
      this.startSymbol = start
    } else {
      this.startSymbol = this.G.getSign(startSymbol)
    }
    this.setGrammar()
  }

  setGrammar() {
    this.setProductions() // 设置产生式，同时会把文法符号设置好
    this.setStartSign() // 设置文法开始符号，默认是第一条产生式的头部
  }

  setStartSign() {
    this.G.setStartSign(this.startSymbol)
  }

  setProductions() {
    let head // 保证head通过this.G.getSign()得到
    for (let i = 0; i < this.productions.length; i++) {
      head = this.G.getSign(this.productions[i][0].symbol, this.productions[i][0].type)
      for (let j = 1; j < this.productions[i].length; j++) {
        const body = Array.of() // 保证body中的每一项都通过this.G.getSign()得到
        for (let k = 0; k < this.productions[i][j].length; k++) {
          body.push(this.G.getSign(this.productions[i][j][k].symbol, this.productions[i][j][k].type))
        }
        this.G.addProduction(head, body)
      }
    }
  }

  getGrammar() {
    return this.G
  }
}

export default function(productions, startSign) {
  const G = new GenerateGrammarFromUserInput(productions, startSign)
  return G.getGrammar()
}
