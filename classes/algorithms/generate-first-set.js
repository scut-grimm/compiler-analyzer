/* eslint-disable prefer-const */
import assert from 'assert'
import MapSet from '../map-set'
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
      symbolIndex: 0,
      firstSet: new MapSet()
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
    let { symbolIndex, firstSet } = currentContext
    const nextContext = {
      symbolIndex: 0,
      firstSet
    }
    const symbol = this.allFirstSet[symbolIndex][0]
    if (symbol.isTerminal()) {
      if (!this.firstSetHasTheSymbol(this.allFirstSet[symbolIndex][2], symbol)) {
        this.allFirstSet[symbolIndex][2].push(symbol)
        this.allFirstSet[symbolIndex][1] = true
        firstSet.add(symbol, symbol)
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
          notice: `
          <h3>
            当前计算
            <span 
            style="color: #409EFF;
            background-color: rgba(64,158,255,.1);
            border-radius: 4px;
            margin: 2px; 
            padding:1px 3px 3px 10px;
            border: 1px solid rgba(64,158,255,.2);"
            >
              First( ${symbol.getString()} )
            </span><br><br>
            符号
            <span 
            style="color: #409EFF;
            background-color: rgba(64,158,255,.1);
            margin-right: 6px;
            padding:0px 1px 0px 8px;
            border-radius: 4px;
            border: 1px solid rgba(64,158,255,.2);"
            >
              ${symbol.getString()}
            </span>是终止符号<br><br>
            <span 
            style="color: #409EFF;
            background-color: rgba(64,158,255,.1);
            margin: 2px;
            padding:2px 2px 2px 2px;
            border-radius: 4px;
            border: 1px solid rgba(64,158,255,.2);"
            >
              First( ${symbol.getString()} )={ ${symbol.getString()} }
            </span>
          </h3>`
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
        // {
        //   console.log('turn: ' + this.turn)
        //   const terminals = this.grammar.getTerminals()
        //   const nonterminals = this.grammar.getNonterminals()
        //   for (const terminal of terminals) {
        //     const index = this.getIndex(terminal)
        //     const firstSet = this.allFirstSet[index][2]
        //     let firstSetString = ''
        //     firstSet.forEach(e => {
        //       firstSetString += e.getString() + ','
        //     })
        //     firstSetString = firstSetString.slice(0, -1)
        //     let done = ''
        //     if (this.allFirstSet[this.getIndex(terminal)][1]) {
        //       done = 'true'
        //     } else {
        //       done = 'false'
        //     }
        //     console.log(`first(${terminal.getString()})={${firstSetString}} Done: ${done}`)
        //   }
        //   for (const nonterminal of nonterminals) {
        //     const index = this.getIndex(nonterminal)
        //     const firstSet = this.allFirstSet[index][2]
        //     let firstSetString = ''
        //     firstSet.forEach(e => {
        //       firstSetString += e.getString() + ','
        //     })
        //     firstSetString = firstSetString.slice(0, -1)
        //     let done = ''
        //     if (this.allFirstSet[this.getIndex(nonterminal)][1]) {
        //       done = 'true'
        //     } else {
        //       done = 'false'
        //     }
        //     console.log(`first(${nonterminal.getString()})={${firstSetString}} Done: ${done}`)
        //   }
        // }
        this.turn++
        nextContext.symbolIndex = 0
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
              firstSet.add(symbol, newSymbol)
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
                notice: `
                <h3>
                  当前计算
                  <span 
                  style="color: #409EFF;
                  background-color: rgba(64,158,255,.1);
                  border-radius: 4px;
                  margin: 2px; 
                  padding:1px 3px 3px 10px;
                  border: 1px solid rgba(64,158,255,.2);"
                  >
                    First( ${symbol.getString()} )
                  </span><br><br>
                  基于产生式
                  <span 
                  style="color: #409EFF;
                  background-color: rgba(64,158,255,.1);
                  border-radius: 4px;
                  margin: 2px; 
                  padding:1px 3px 3px 10px;
                  border: 1px solid rgba(64,158,255,.2);"
                  >
                    ${production.getString()}
                  </span><br><br>
                  将
                  <span 
                  style="color: #409EFF;
                  background-color: rgba(64,158,255,.1);
                  margin-right: 6px;
                  padding:0px 1px 0px 8px;
                  border-radius: 4px;
                  border: 1px solid rgba(64,158,255,.2);"
                  >
                    ${newSymbol.getString()}
                  </span>加入
                  <span 
                  style="color: #409EFF;
                  background-color: rgba(64,158,255,.1);
                  border-radius: 4px;
                  margin: 2px; 
                  padding:1px 3px 3px 10px;
                  border: 1px solid rgba(64,158,255,.2);"
                  >
                    First( ${symbol.getString()} )
                  </span>中
                </h3>`
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
                notice: `
                <h3>
                  当前计算
                  <span 
                  style="color: #409EFF;
                  background-color: rgba(64,158,255,.1);
                  border-radius: 4px;
                  margin: 2px; 
                  padding:1px 3px 3px 10px;
                  border: 1px solid rgba(64,158,255,.2);"
                  >
                      First( ${symbol.getString()} )
                  </span><br><br>
                  基于产生式
                  <span 
                  style="color: #409EFF;
                  background-color: rgba(64,158,255,.1);
                  border-radius: 4px;
                  margin: 2px; 
                  padding:1px 3px 3px 10px;
                  border: 1px solid rgba(64,158,255,.2);"
                  >
                    ${production.getString()}
                  </span><br><br>
                  需要将
                  <span 
                  style="color: #409EFF;
                  background-color: rgba(64,158,255,.1);
                  border-radius: 4px;
                  margin: 2px; 
                  padding:1px 3px 3px 10px;
                  border: 1px solid rgba(64,158,255,.2);"
                  >
                      First( ${this.allFirstSet[dependSymbolIndex][0].getString()} )
                  </span>中的所有符号加入
                  <span 
                  style="color: #409EFF;
                  background-color: rgba(64,158,255,.1);
                  border-radius: 4px;
                  margin: 2px; 
                  padding:1px 3px 3px 10px;
                  border: 1px solid rgba(64,158,255,.2);"
                  >
                      First( ${symbol.getString()} )
                  </span>中<br><br>
                  但是当前
                  <span 
                  style="color: #409EFF;
                  background-color: rgba(64,158,255,.1);
                  border-radius: 4px;
                  margin: 2px; 
                  padding:1px 3px 3px 10px;
                  border: 1px solid rgba(64,158,255,.2);"
                  >
                      First( ${this.allFirstSet[dependSymbolIndex][0].getString()} ) 
                  </span>为空
                </h3>`
              }
              break
            } else {
              if (this.firstSetHasEmpty(this.allFirstSet[dependSymbolIndex][2])) {
                if (body.indexOf(i) < body.length - 1) {
                  for (const newSymbol of this.allFirstSet[dependSymbolIndex][2]) {
                    if (!newSymbol.isEmpty() && !this.firstSetHasTheSymbol(this.allFirstSet[symbolIndex][2], newSymbol)) {
                      this.allFirstSet[symbolIndex][2].push(newSymbol)
                      firstSet.add(symbol, newSymbol)
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
                        notice: `
                        <h3>
                          当前计算
                          <span 
                          style="color: #409EFF;
                          background-color: rgba(64,158,255,.1);
                          border-radius: 4px;
                          margin: 2px; 
                          padding:1px 3px 3px 10px;
                          border: 1px solid rgba(64,158,255,.2);"
                          >
                            First( ${symbol.getString()} )
                          </span><br><br>
                          基于产生式
                          <span 
                          style="color: #409EFF;
                          background-color: rgba(64,158,255,.1);
                          border-radius: 4px;
                          margin: 2px; 
                          padding:1px 3px 3px 10px;
                          border: 1px solid rgba(64,158,255,.2);"
                          >
                            ${production.getString()}
                          </span><br><br>
                          需要将
                          <span 
                          style="color: #409EFF;
                          background-color: rgba(64,158,255,.1);
                          border-radius: 4px;
                          margin: 2px; 
                          padding:1px 3px 3px 10px;
                          border: 1px solid rgba(64,158,255,.2);"
                          >
                            First( ${this.allFirstSet[dependSymbolIndex][0].getString()} )
                          </span>中的所有符号加入
                          <span 
                          style="color: #409EFF;
                          background-color: rgba(64,158,255,.1);
                          border-radius: 4px;
                          margin: 2px; 
                          padding:1px 3px 3px 10px;
                          border: 1px solid rgba(64,158,255,.2);"
                          >
                            First( ${symbol.getString()} )
                          </span>中
                        </h3>`
                      }
                    }
                  }
                } else {
                  for (const newSymbol of this.allFirstSet[dependSymbolIndex][2]) {
                    if (!this.firstSetHasTheSymbol(this.allFirstSet[symbolIndex][2], newSymbol)) {
                      this.allFirstSet[symbolIndex][2].push(newSymbol)
                      firstSet.add(symbol, newSymbol)
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
                        notice: `
                        <h3>
                          当前计算
                          <span 
                          style="color: #409EFF;
                          background-color: rgba(64,158,255,.1);
                          border-radius: 4px;
                          margin: 2px; 
                          padding:1px 3px 3px 10px;
                          border: 1px solid rgba(64,158,255,.2);"
                          >
                            First( ${symbol.getString()} )
                          </span><br><br>
                          基于产生式
                          <span 
                          style="color: #409EFF;
                          background-color: rgba(64,158,255,.1);
                          border-radius: 4px;
                          margin: 2px; 
                          padding:1px 3px 3px 10px;
                          border: 1px solid rgba(64,158,255,.2);"
                          >
                            ${production.getString()}
                          </span><br><br>
                          需要将
                          <span 
                          style="color: #409EFF;
                          background-color: rgba(64,158,255,.1);
                          border-radius: 4px;
                          margin: 2px; 
                          padding:1px 3px 3px 10px;
                          border: 1px solid rgba(64,158,255,.2);"
                          >
                            First( ${this.allFirstSet[dependSymbolIndex][0].getString()} )
                          </span>中的所有符号加入
                          <span 
                          style="color: #409EFF;
                          background-color: rgba(64,158,255,.1);
                          border-radius: 4px;
                          margin: 2px; 
                          padding:1px 3px 3px 10px;
                          border: 1px solid rgba(64,158,255,.2);"
                          >
                            First( ${symbol.getString()} )
                          </span>中
                        </h3>`
                      }
                    }
                  }
                }
              } else {
                for (const newSymbol of this.allFirstSet[dependSymbolIndex][2]) {
                  if (!this.firstSetHasTheSymbol(this.allFirstSet[symbolIndex][2], newSymbol)) {
                    this.allFirstSet[symbolIndex][2].push(newSymbol)
                    firstSet.add(symbol, newSymbol)
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
                      notice: `
                      <h3>
                        当前计算
                        <span 
                          style="color: #409EFF;
                          background-color: rgba(64,158,255,.1);
                          border-radius: 4px;
                          margin: 2px; 
                          padding:1px 3px 3px 10px;
                          border: 1px solid rgba(64,158,255,.2);"
                          >
                          First( ${symbol.getString()} )
                        </span><br><br>
                        基于产生式
                        <span 
                          style="color: #409EFF;
                          background-color: rgba(64,158,255,.1);
                          border-radius: 4px;
                          margin: 2px; 
                          padding:1px 3px 3px 10px;
                          border: 1px solid rgba(64,158,255,.2);"
                          >
                          ${production.getString()}
                        </span><br><br>
                        需要将
                        <span 
                        style="color: #409EFF;
                        background-color: rgba(64,158,255,.1);
                        border-radius: 4px;
                        margin: 2px; 
                        padding:1px 3px 3px 10px;
                        border: 1px solid rgba(64,158,255,.2);"
                        >
                          First( ${this.allFirstSet[dependSymbolIndex][0].getString()} )
                        </span>中的所有符号加入
                        <span 
                        style="color: #409EFF;
                        background-color: rgba(64,158,255,.1);
                        border-radius: 4px;
                        margin: 2px; 
                        padding:1px 3px 3px 10px;
                        border: 1px solid rgba(64,158,255,.2);"
                        >
                          First( ${symbol.getString()} )
                        </span>中
                      </h3>`
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
        // {
        //   console.log('turn: ' + this.turn)
        //   const terminals = this.grammar.getTerminals()
        //   const nonterminals = this.grammar.getNonterminals()
        //   for (const terminal of terminals) {
        //     const index = this.getIndex(terminal)
        //     const firstSet = this.allFirstSet[index][2]
        //     let firstSetString = ''
        //     firstSet.forEach(e => {
        //       firstSetString += e.getString() + ','
        //     })
        //     firstSetString = firstSetString.slice(0, -1)
        //     let done = ''
        //     if (this.allFirstSet[this.getIndex(terminal)][1]) {
        //       done = 'true'
        //     } else {
        //       done = 'false'
        //     }
        //     console.log(`first(${terminal.getString()})={${firstSetString}} Done:${done}`)
        //   }
        //   for (const nonterminal of nonterminals) {
        //     const index = this.getIndex(nonterminal)
        //     const firstSet = this.allFirstSet[index][2]
        //     let firstSetString = ''
        //     firstSet.forEach(e => {
        //       firstSetString += e.getString() + ','
        //     })
        //     firstSetString = firstSetString.slice(0, -1)
        //     let done = ''
        //     if (this.allFirstSet[this.getIndex(nonterminal)][1]) {
        //       done = 'true'
        //     } else {
        //       done = 'false'
        //     }
        //     console.log(`first(${nonterminal.getString()})={${firstSetString}} Done:${done}`)
        //   }
        // }
        this.turn++
        nextContext.symbolIndex = 0
      } else {
        nextContext.symbolIndex = ++symbolIndex
      }
    }
    return [false, nextContext]
  }

  getCurResult({ firstSet }) {
    return firstSet
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
    return this.getCurResult(ret[1])
  }
}
export default FirstSet
