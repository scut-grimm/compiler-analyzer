import assert from 'assert'
import Grammar from '../grammar'
import Production from '../production'
class Stack {
  constructor() {
    this.data = Array.of()
  }
  pop() {
    return this.data.pop()
  }
  push(val) {
    this.data.push(val)
  }
  top() {
    assert(this.data.length !== 0, '空栈')
    return this.data[this.data.length - 1]
  }
  bottom() {
    assert(this.data.length !== 0, '空栈')
    return this.data[0]
  }
  isEmpty() {
    if (this.data.length === 0) {
      return true
    } else {
      return false
    }
  }
  indexOf(val) {
    return this.data.indexOf(val)
  }
  getData() {
    return this.data
  }
}
class EliminateLeftRecursion {
  immedationRecursion = Array.of() // 记录立即左递归的产生式
  indirectRecursion = Array.of() // 二维数组，记录间接左递归的产生式
  nollableNonterminal = Array.of()
  solutionSpace = new Stack()
  derivationStack = new Stack() // 推导栈，记录当前推导链上的产生式，压栈之前先检测栈中是否存在左递归
  nullableNonterminals = Array.of()
  eliminatingEmptyGrammar = new Grammar() // 消除ε-production以后的新文法
  eliminatingCyclesGrammar = new Grammar() // 消除环以后的新文法
  constructor(grammar) {
    this.grammar = grammar
    this.scanImmedationLeftRecursion()
    const startProductions = this.grammar.getDerivations(this.grammar.getStartSign())
    const frame = {
      productions: Array.of(),
      index: 0,
      bodySymbolIndex: 0
    }
    for (const i of startProductions) { // 只压入以开始符号为头部的产生式
      if (!this.immedationRecursion.includes(i)) { // 检测产生式是否是立即左递归的
        frame.productions.push(i)
      }
    }
    this.solutionSpace.push(frame) // 解空间初始化
    this.derivationStack.push(frame.productions[frame.index]) // 推导栈初始化
    this.scanIndirectLeftRecursion(this.solutionSpace, this.derivationStack)
    this.eliminatingEmptyProduction()
    // console.log('消除ε产生式后的文法')
    // console.log('Start symbol: ' + this.eliminatingEmptyGrammar.getStartSign().getString())
    // console.log('Productions')
    // this.eliminatingEmptyGrammar.productions.forEach(e => {
    //   console.log(e.getHeadString() + '->' + e.getBodyString())
    // })
    // let nonterminals = ''
    // this.eliminatingEmptyGrammar.getNonterminals().forEach(e => {
    //   nonterminals += e.getString() + ' '
    // })
    // console.log('Nonterminals: ' + nonterminals)
    // let terminals = ''
    // this.eliminatingEmptyGrammar.getTerminals().forEach(e => {
    //   terminals += e.getString() + ' '
    // })
    // console.log('Terminals: ' + terminals)
  }
  // 扫描立即左递归
  scanImmedationLeftRecursion() {
    const productions = this.grammar.getProductions()
    for (let i = 0; i < productions.length; i++) {
      if (productions[i].getHead() === productions[i].getBody()[0]) {
        this.immedationRecursion.push(productions[i])
      }
    }
  }
  // 递归实现的回溯法扫描间接左递归
  scanIndirectLeftRecursion(solutionSpace, derivationStack) {
    // console.log('-----------------------------------')
    // const temp = solutionSpace.getData()
    // for (const i of temp) {
    //   let tempString = ''
    //   for (let j = 0; j < i.productions.length; j++) {
    //     tempString += i.productions[j].getString() + ', '
    //   }
    //   console.log(tempString + i.index.toString() + ', ' + i.bodySymbolIndex.toString())
    // }
    // console.log('************************************')
    // const tempDer = derivationStack.getData()
    // let tempString = ''
    // for (const i of tempDer) {
    //   if (i !== undefined) {
    //     tempString += i.getString() + ', '
    //   } else {
    //     tempString += 'undefined, '
    //   }
    // }
    // tempString = tempString.slice(0, -2)
    // console.log(tempString)
    // console.log('-----------------------------------')
    const bottom = solutionSpace.bottom()
    if (bottom.index === bottom.productions.length) { // 已经处理完解空间栈栈底产生式数组的最后一个产生式，算法结束
      return
    } else {
      const top = solutionSpace.pop()
      if (top.index === top.productions.length) { // 已经处理到解空间栈栈顶产生式数组的最后一个产生式，将下一层的记录位加一，更新推导栈
        const former = solutionSpace.pop()
        former.index++
        former.bodySymbolIndex = 0
        derivationStack.pop()
        derivationStack.pop()
        derivationStack.push(former.productions[former.index])
        solutionSpace.push(former)
        this.scanIndirectLeftRecursion(solutionSpace, derivationStack)
      } else {
        // 检测推导栈中是否含有左递归
        if (this.hasLeftRecursionInDerivationStack(solutionSpace, derivationStack)) {
          top.index++
          derivationStack.pop()
          derivationStack.push(top.productions[top.index])
          solutionSpace.push(top)
          this.scanIndirectLeftRecursion(solutionSpace, derivationStack)
        } else {
          const handleProduction = top.productions[top.index]
          if (top.bodySymbolIndex === handleProduction.getBody().length) { // 已经扫描到产生式体的最后一个符号
            top.index++
            top.bodySymbolIndex = 0
            derivationStack.pop()
            derivationStack.push(top.productions[top.index])
            solutionSpace.push(top)
            this.scanIndirectLeftRecursion(solutionSpace, derivationStack)
          } else {
            const current = handleProduction.getBody()[top.bodySymbolIndex]
            if (current.isTerminal()) { // 当前符号是终止符号，不可能是左递归
              top.index++
              top.bodySymbolIndex = 0
              derivationStack.pop()
              derivationStack.push(top.productions[top.index])
              solutionSpace.push(top)
              this.scanIndirectLeftRecursion(solutionSpace, derivationStack)
            } else if (current.isNonterminal()) {
              const frame = {
                productions: Array.of(),
                index: 0,
                bodySymbolIndex: 0
              }
              const tempProductions = this.grammar.getDerivations(current)
              for (let i = 0; i < tempProductions.length; i++) { // 检测产生式是否是立即左递归的
                if (!this.immedationRecursion.includes(tempProductions[i])) {
                  frame.productions.push(tempProductions[i])
                }
              }
              if (frame.productions.length === 0) { // 没有以当前符号为头部的产生式
                top.index++
                top.bodySymbolIndex = 0
                derivationStack.pop()
                derivationStack.push(top.productions[top.index])
                solutionSpace.push(top)
                this.scanIndirectLeftRecursion(solutionSpace, derivationStack)
              } else {
                solutionSpace.push(top)
                solutionSpace.push(frame)
                derivationStack.push(frame.productions[frame.index])
                this.scanIndirectLeftRecursion(solutionSpace, derivationStack)
              }
            } else if (current.isEmpty()) {
              const former = solutionSpace.pop()
              former.bodySymbolIndex++
              if (former.bodySymbolIndex === former.productions[former.index].getBody().length) {
                top.index++
                top.bodySymbolIndex = 0
                former.bodySymbolIndex--
                solutionSpace.push(former)
                solutionSpace.push(top)
                derivationStack.pop()
                derivationStack.push(top.productions[top.index])
                this.scanIndirectLeftRecursion(solutionSpace, derivationStack)
              } else {
                const tempSymbol = former.productions[former.index].getBody()[former.bodySymbolIndex]
                const tempProductions = this.grammar.getDerivations(tempSymbol)
                if (tempProductions.length === 0) {
                  top.index++
                  top.bodySymbolIndex = 0
                  former.bodySymbolIndex--
                  solutionSpace.push(former)
                  solutionSpace.push(top)
                  derivationStack.pop()
                  derivationStack.push(top.productions[top.index])
                  this.scanIndirectLeftRecursion(solutionSpace, derivationStack)
                } else {
                  const newFrame = {
                    productions: Array.of(),
                    index: 0,
                    bodySymbolIndex: 0
                  }
                  for (const i of tempProductions) {
                    if (!this.immedationRecursion.includes(i)) {
                      newFrame.productions.push(i)
                    }
                  }
                  solutionSpace.push(former)
                  solutionSpace.push(top)
                  solutionSpace.push(newFrame)
                  derivationStack.push(newFrame.productions[newFrame.index])
                  this.scanIndirectLeftRecursion(solutionSpace, derivationStack)
                }
              }
            }
          }
        }
      }
    }
  }
  // 判断当前推导链中是否有左递归
  hasLeftRecursionInDerivationStack(solutionSpace, derivationStack) {
    const data = derivationStack.getData()
    let aim = derivationStack.top().getBody()[0]
    if (aim.isEmpty()) { // 目标符号是ε
      const solutionSpaceData = solutionSpace.getData()
      const index = solutionSpaceData[solutionSpaceData.length - 2].bodySymbolIndex
      if (index + 1 === data[data.length - 2].getBody().length) { // 如果下标加一后等于产生式体的长度，说明这不是左递归
        return false
      } else {
        aim = data[data.length - 2].getBody()[index + 1]
        for (let i = data.length - 3; i >= 0; i--) {
          const tempSymbol = data[i].getHead()
          if (tempSymbol === aim) {
            const temp = Array.of() // 该数组记录了间接左递归涉及到的产生式
            for (let j = i; j < data.length; j++) {
              temp.push(data[j])
            }
            this.indirectRecursion.push(temp)
            return false // 这里return false是为了重复使用 head->ε 这种产生式
          }
        }
        return false
      }
    } else { // 目标符号是非终止符号
      for (let i = data.length - 2; i >= 0; i--) {
        const tempSymbol = data[i].getHead()
        if (tempSymbol === aim) {
          const temp = Array.of() // 该数组记录了间接左递归涉及到的产生式
          for (let j = i; j < data.length; j++) {
            temp.push(data[j])
          }
          this.indirectRecursion.push(temp)
          return true
        }
      }
      return false
    }
  }
  // 寻找所有可空的非终止符号
  findnullableNonterminals() {
    let done = false
    while (!done) {
      done = true
      const nonterminals = this.grammar.getNonterminals()
      for (const nonterminal of nonterminals) {
        const productions = this.grammar.getDerivations(nonterminal)
        for (const production of productions) {
          const body = production.getBody()
          for (const symbol of body) {
            if (symbol.isEmpty() || this.nullableNonterminals.includes(symbol)) {
              if (body.indexOf(symbol) === body.length - 1 && !this.nullableNonterminals.includes(nonterminal)) {
                this.nullableNonterminals.push(nonterminal)
                done = false
              } else {
                continue
              }
            } else {
              break
            }
          }
        }
      }
    }
  }
  // 消除ε产生式
  eliminatingEmptyProduction() {
    this.eliminatingEmptyGrammar.setStartSign(this.eliminatingEmptyGrammar.getSign(this.grammar.getStartSign()))
    this.findnullableNonterminals() // 找到所有可空非终止符号
    const productions = this.grammar.getProductions()
    for (const production of productions) {
      // console.log('******************')
      // console.log(production.getString())
      const head = this.eliminatingEmptyGrammar.getSign(production.getHead())
      const body = production.getBody()
      if (body[0].isEmpty()) { // 如果产生式体是ε，直接忽略
        continue
      } else if (this.allBodySymbolNotNullable(body)) { // 如果产生式体中的符号都是不可空的，则将该产生式直接放入新的文法中
        const newBody = []
        for (const symbol of body) {
          newBody.push(this.eliminatingEmptyGrammar.getSign(symbol))
        }
        this.eliminatingEmptyGrammar.addProduction(head, newBody)
      } else {
        // 处理另一种情况的步骤如下：
        // 假定某一非空产生式p的body为"aAbAAc"，其中A为可空符号，a,b,c为不可空符号。

        // 再构造一对象pos{position,value}，其中position用于存储某个A在body中出现的位置，value表示position位置的字符是否在
        // 新的body中出现（0不出现，1出现）。构造pos类型的数组posArray，用于存储所有A的位置信息(将value初始化为0)。则posArray的初始内容为
        // [{1,0},{3,0},{4,0}]。

        // 新字符串的数量由A的个数n决定，一般为2^n个(每个位置的A都可以选择出现或是不出现在新字符串中)。但是对于
        // 像S->AA(S不可空)这样的产生式。由于产生式体中不存在不可空符号。所以当所有A都选择不出现时，新产生式将是空产
        // 生式，而这种情况应该忽略。

        // 可以通过循环2^n次来生成不同情况下的posArray,例如第5次循环生成的posArray为[{1,1},{3,0},{4,1}]。然后根据posArray
        // 生成新的body,例如根据[{1,1},{3,0},{4,1}]而得到新的body为"aAbAc"。
        // 最后生成新产生式，并放入this.eliminatingEmptyGrammar中。为了避免产生式重复出现，加入之前先要判断产生式是否存在
        let turn = 0
        const nullableSymbolIndex = [] // 记录可空符号在body中的下标
        for (const symbol of body) {
          if (this.nullableNonterminals.includes(symbol)) {
            nullableSymbolIndex.push(body.indexOf(symbol))
            turn++
          }
        }
        turn = Math.pow(2, turn)
        // console.log(nullableSymbolIndex.length)
        // console.log(turn)
        for (let i = 0; i < turn; i++) {
          // console.log('turn:' + i.toString())
          let i1 = i
          let end = nullableSymbolIndex.length // 记录body中可空符号的个数
          const posArray = []
          for (const j of nullableSymbolIndex) { // 初始化 posArray
            const pos = { position: j, value: 0 }
            posArray.push(pos)
          }
          while (i1) { // 根据 i1 的值（循环的轮次），修改 posArray
            const i2 = i1 % 2
            posArray[end - 1].value = i2 // 下标和长度差1
            end--
            i1 = Math.floor(i1 / 2)
          }
          // 根据 posArray 生成新的 body
          const tempBody = [] // 一个临时的body
          for (const j of body) {
            tempBody.push(this.eliminatingEmptyGrammar.getSign(j))
          }
          for (const pos of posArray) {
            if (pos.value === 0) {
              tempBody.splice(pos.position, 1, 0)
            }
          }
          const newBody = [] // 新的body
          for (const j of tempBody) {
            if (j !== 0) {
              newBody.push(this.eliminatingEmptyGrammar.getSign(j))
            }
          }
          const tempProduction = new Production(head, newBody)
          // console.log(tempProduction.getString())
          if (newBody.length !== 0 && !this.existTheProduction(this.eliminatingEmptyGrammar, tempProduction)) {
            this.eliminatingEmptyGrammar.addProduction(head, newBody)
          }
        }
      }
    }
    if (this.nullableNonterminals.includes(this.grammar.getStartSign())) { // 处理开始符号可空的情况
      const head = this.eliminatingEmptyGrammar.getStartSign()
      const body = [this.eliminatingEmptyGrammar.getEmptySign()]
      this.eliminatingEmptyGrammar.addProduction(head, body)
    }
  }
  // 判断grammar中是否已经存在产生式production
  existTheProduction(grammar, production) {
    const productions = grammar.getProductions()
    for (const i of productions) {
      if (i.getString() === production.getString()) {
        return true
      }
    }
    return false
  }
  // 判断产生式体中的符号是不是都不可空
  allBodySymbolNotNullable(body) {
    for (const symbol of body) {
      if (this.nullableNonterminals.includes(symbol)) {
        return false
      }
    }
    return true
  }
  // 消除环
  eliminatingCycles() {
    const EEG = this.eliminatingEmptyGrammar
    this.eliminatingCyclesGrammar.setStartSign(EEG.getSign(this.grammar.getStartSign()))
    let heads = new Set()
    for (const production of EEG.getProductions()) {
      heads.add(production.getHead())
    }
    heads = [...heads]
  }
}
export default function(grammar) {
  const ELR = new EliminateLeftRecursion(grammar)
  return { immedationRecursion: ELR.immedationRecursion, indirectRecursion: ELR.indirectRecursion }
}
