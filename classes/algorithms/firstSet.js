import assert from 'assert'
class FirstSet {
  allFirstSet = Array.of()
  allDone = true
  turn = 1
  constructor(grammar) {
    this.grammar = grammar
    const terminals = this.grammar.getTerminals()
    assert(terminals.length, '当前文法没有终止符号')
    const nonterminals = this.grammar.getNonterminals()
    assert(nonterminals.length, '当前文法没有非终止符号')
    for (const i of terminals) {
      const temp = Array.of()
      const firstSet = Array.of()
      temp.push(i)
      temp.push(false)
      temp.push(firstSet)
      temp.push(firstSet.length)
      this.allFirstSet.push(temp)
    }
    for (const i of nonterminals) {
      const temp = Array.of()
      const firstSet = Array.of()
      temp.push(i)
      temp.push(false)
      temp.push(firstSet)
      temp.push(firstSet.length)
      this.allFirstSet.push(temp)
    }
  }

  getInitContext() {
    return {
      symbolIndex: 0
    }
  }

  getIndex(val) {
    for (let i = 0; i < this.allFirstSet.length; i++) {
      // 按理说这里可以不用getString()的
      if (val.getString() === this.allFirstSet[i][0].getString()) {
        return i
      }
    }
    return -100
  }

  firstSetHasEmpty(val) {
    let hasEmpty = false
    for (const i of val) {
      if (i.isEmpty()) {
        hasEmpty = true
        break
      }
    }
    return hasEmpty
  }

  firstSetHasTheSymbol(firstSet, symbol) {
    let hasTheSymbol = false
    for (const i of firstSet) {
      if (i.getString() === symbol.getString()) {
        hasTheSymbol = true
        break
      }
    }
    return hasTheSymbol
  }

  * epoch(currentContext) {
    this.allDone = true
    for (const i of this.allFirstSet) {
      if (!i[1]) {
        this.allDone = false
        break
      }
    }
    if (this.allDone) {
      return [true, currentContext]
    }
    const nextContext = {
      symbolIndex: 0
    }
    let { symbolIndex } = currentContext
    const symbol = this.allFirstSet[symbolIndex][0]
    if (symbol.isTerminal()) {
      if (!this.firstSetHasTheSymbol(this.allFirstSet[symbolIndex][2], symbol)) {
        this.allFirstSet[symbolIndex][2].push(symbol)
        this.allFirstSet[symbolIndex][1] = true
        this.grammar.firstSet.add(symbol, symbol)
        yield {
          isTerminal: true,
          allFirstSet: this.allFirstSet,
          symbolIndex: symbolIndex,
          symbol: symbol,
          production: null,
          productionIndex: null,
          dependSymbolIndex: null,
          newlyIncreasedSymbol: symbol,
          turn: this.turn,
          notice: `符号 ${symbol.getString()} 是终止符号，first(${symbol.getString()})={${symbol.getString()}}`
        }
      }
      if (symbolIndex === this.allFirstSet.length - 1) {
        for (const i of this.allFirstSet) {
          if (i[2].length === i[3]) {
            i[1] = true
            i[3] = i[2].length
          } else {
            i[1] = false
            i[3] = i[2].length
          }
        }
        this.turn++
        nextContext.symbolIndex = 0

        // const terminals = this.grammar.getTerminals()
        // const nonterminals = this.grammar.getNonterminals()
        // for (const terminal of terminals) {
        //   const firstSet = this.grammar.getSignFirstSet(terminal)
        //   let firstSetString = ''
        //   firstSet.forEach(e => {
        //     firstSetString += e.getString() + ','
        //   })
        //   firstSetString = firstSetString.slice(0, -1)
        //   let done = ''
        //   if (this.allFirstSet[this.getIndex(terminal)][1]) {
        //     done = 'true'
        //   } else {
        //     done = 'false'
        //   }
        //   console.log(`first(${terminal.getString()})={${firstSetString}} Done: ${done}`)
        // }
        // for (const nonterminal of nonterminals) {
        //   const firstSet = this.grammar.getSignFirstSet(nonterminal)
        //   let firstSetString = ''
        //   firstSet.forEach(e => {
        //     firstSetString += e.getString() + ','
        //   })
        //   firstSetString = firstSetString.slice(0, -1)
        //   let done = ''
        //   if (this.allFirstSet[this.getIndex(nonterminal)][1]) {
        //     done = 'true'
        //   } else {
        //     done = 'false'
        //   }
        //   console.log(`first(${nonterminal.getString()})={${firstSetString}} Done: ${done}`)
        // }
      } else {
        nextContext.symbolIndex = ++symbolIndex
      }
    } else {
      const productions = this.grammar.getDerivations(symbol)
      for (const production of productions) {
        const body = production.getBody()
        for (const i of body) {
          if (i.isEmpty()) {
            const newSymbol = i
            if (!this.firstSetHasTheSymbol(this.allFirstSet[symbolIndex][2], newSymbol)) {
              this.allFirstSet[symbolIndex][2].push(newSymbol)
              this.grammar.firstSet.add(symbol, newSymbol)
              yield {
                isTerminal: false,
                allFirstSet: this.allFirstSet,
                symbolIndex: symbolIndex,
                symbol: symbol,
                production: production,
                productionIndex: this.grammar.getProductions().indexOf(production),
                dependSymbolIndex: null,
                newlyIncreasedSymbol: newSymbol,
                turn: this.turn,
                notice: `当前计算 first(${symbol.getString()})。基于产生式 ${production.getString()}，将 ${newSymbol.getString()} 放入 first(${symbol.getString()}) 集合中`
              }
            }
          } else {
            const dependSymbolIndex = this.getIndex(i)
            assert(dependSymbolIndex !== -100, `符号 ${i.getString()} 不存在`)
            if (this.allFirstSet[dependSymbolIndex][2].length === 0) {
              yield {
                isTerminal: false,
                allFirstSet: this.allFirstSet,
                symbolIndex: symbolIndex,
                symbol: symbol,
                production: production,
                productionIndex: this.grammar.getProductions().indexOf(production),
                dependSymbolIndex: dependSymbolIndex,
                newlyIncreasedSymbol: null,
                turn: this.turn,
                notice: `当前计算 first(${symbol.getString()})。
                基于产生式 ${production.getString()}，需要将first(${this.allFirstSet[dependSymbolIndex][0].getString()}) 的所有符号放入 first(${symbol.getString()}) 中，
                但是当前 first(${this.allFirstSet[dependSymbolIndex][0].getString()}) 为空`
              }
              break
            } else {
              if (this.firstSetHasEmpty(this.allFirstSet[dependSymbolIndex][2])) {
                if (body.indexOf(i) < body.length - 1) {
                  for (const newSymbol of this.allFirstSet[dependSymbolIndex][2]) {
                    if (!newSymbol.isEmpty() && !this.firstSetHasTheSymbol(this.allFirstSet[symbolIndex][2], newSymbol)) {
                      this.allFirstSet[symbolIndex][2].push(newSymbol)
                      this.grammar.firstSet.add(symbol, newSymbol)
                      yield {
                        isTerminal: false,
                        allFirstSet: this.allFirstSet,
                        symbolIndex: symbolIndex,
                        symbol: symbol,
                        production: production,
                        productionIndex: this.grammar.getProductions().indexOf(production),
                        dependSymbolIndex: dependSymbolIndex,
                        newlyIncreasedSymbol: newSymbol,
                        turn: this.turn,
                        notice: `当前计算 first(${symbol.getString()})。
                        基于产生式 ${production.getString()}，需要将first(${this.allFirstSet[dependSymbolIndex][0].getString()}) 的所有符号放入 first(${symbol.getString()}) 中。
                        将符号 ${newSymbol.getString()} 加进 first(${symbol.getString()}) 中`
                      }
                    }
                  }
                } else {
                  for (const newSymbol of this.allFirstSet[dependSymbolIndex][2]) {
                    if (!this.firstSetHasTheSymbol(this.allFirstSet[symbolIndex][2], newSymbol)) {
                      this.allFirstSet[symbolIndex][2].push(newSymbol)
                      this.grammar.firstSet.add(symbol, newSymbol)
                      yield {
                        isTerminal: false,
                        allFirstSet: this.allFirstSet,
                        symbolIndex: symbolIndex,
                        symbol: symbol,
                        production: production,
                        productionIndex: this.grammar.getProductions().indexOf(production),
                        dependSymbolIndex: dependSymbolIndex,
                        newlyIncreasedSymbol: newSymbol,
                        turn: this.turn,
                        notice: `当前计算 first(${symbol.getString()})。
                        基于产生式 ${production.getString()}，需要将first(${this.allFirstSet[dependSymbolIndex][0].getString()}) 的所有符号放入 first(${symbol.getString()}) 中。
                        将符号 ${newSymbol.getString()} 加进 first(${symbol.getString()}) 中`
                      }
                    }
                  }
                }
              } else {
                for (const newSymbol of this.allFirstSet[dependSymbolIndex][2]) {
                  if (!this.firstSetHasTheSymbol(this.allFirstSet[symbolIndex][2], newSymbol)) {
                    this.allFirstSet[symbolIndex][2].push(newSymbol)
                    this.grammar.firstSet.add(symbol, newSymbol)
                    yield {
                      isTerminal: false,
                      allFirstSet: this.allFirstSet,
                      symbolIndex: symbolIndex,
                      symbol: symbol,
                      production: production,
                      productionIndex: this.grammar.getProductions().indexOf(production),
                      dependSymbolIndex: dependSymbolIndex,
                      newlyIncreasedSymbol: newSymbol,
                      turn: this.turn,
                      notice: `当前计算 first(${symbol.getString()})。
                      基于产生式 ${production.getString()}，需要将first(${this.allFirstSet[dependSymbolIndex][0].getString()}) 的所有符号放入 first(${symbol.getString()}) 中。
                      将符号 ${newSymbol.getString()} 加进 first(${symbol.getString()}) 中`
                    }
                  }
                }
                break
              }
            }
          }
        }
      }
      if (symbolIndex === this.allFirstSet.length - 1) {
        for (const i of this.allFirstSet) {
          if (i[2].length === i[3]) {
            i[1] = true
            i[3] = i[2].length
          } else {
            i[1] = false
            i[3] = i[2].length
          }
        }
        this.turn++
        nextContext.symbolIndex = 0

        // const terminals = this.grammar.getTerminals()
        // const nonterminals = this.grammar.getNonterminals()
        // for (const terminal of terminals) {
        //   const firstSet = this.grammar.getSignFirstSet(terminal)
        //   let firstSetString = ''
        //   firstSet.forEach(e => {
        //     firstSetString += e.getString() + ','
        //   })
        //   firstSetString = firstSetString.slice(0, -1)
        //   let done = ''
        //   if (this.allFirstSet[this.getIndex(terminal)][1]) {
        //     done = 'true'
        //   } else {
        //     done = 'false'
        //   }
        //   console.log(`first(${terminal.getString()})={${firstSetString}} Done:${done}`)
        // }
        // for (const nonterminal of nonterminals) {
        //   const firstSet = this.grammar.getSignFirstSet(nonterminal)
        //   let firstSetString = ''
        //   firstSet.forEach(e => {
        //     firstSetString += e.getString() + ','
        //   })
        //   firstSetString = firstSetString.slice(0, -1)
        //   let done = ''
        //   if (this.allFirstSet[this.getIndex(nonterminal)][1]) {
        //     done = 'true'
        //   } else {
        //     done = 'false'
        //   }
        //   console.log(`first(${nonterminal.getString()})={${firstSetString}} Done:${done}`)
        // }
      } else {
        nextContext.symbolIndex = ++symbolIndex
      }
    }
    return [false, nextContext]
  }

  getCurResult({ symbolIndex }) {
    return this.allFirstSet[symbolIndex]
  }

  // 包装器，用于完整运行每一个epoch，返回[isFinish, nextContext]
  runEpoch(currentContext) {
    const run = this.epoch(currentContext)
    let ret = null
    do {
      ret = run.next()
    } while (ret.done === false)
    return ret.value
  }

  // 执行整个算法，返回该算法的输出
  run() {
    let ret = [false, this.getInitContext()]
    while (ret[0] === false) {
      ret = this.runEpoch(ret[1])
    }
    return ret[1]
  }
}
export default FirstSet
