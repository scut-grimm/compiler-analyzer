import assert from 'assert'
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
  getData() {
    return this.data
  }
}
class EliminateLeftRecursion {
  immedationRecursion = Array.of() // 记录立即左递归的产生式在this.grammar.productions数组中的下标
  indirectRecursion = Array.of() // 二维数组，记录间接左递归的产生式在this.grammar.productions数组中的下标
  nollableNonterminal = Array.of()
  solutionSpace = new Stack()
  constructor(grammar) {
    this.grammar = grammar
    this.scanImmedationLeftRecursion()
    const productions = this.grammar.getProductions()
    const frame = {
      productions: Array.of(),
      index: 0,
      bodySymbolIndex: 0
    }
    for (let i = 0; i < productions.length; i++) { // 检测产生式是否是立即左递归的
      if (!this.immedationRecursion.includes(i)) {
        frame.productions.push(productions[i])
      }
    }
    this.solutionSpace.push(frame)
    this.scanIndirectLeftRecursion(this.solutionSpace)
  }
  // 扫描立即左递归
  scanImmedationLeftRecursion() {
    const productions = this.grammar.getProductions()
    for (let i = 0; i < productions.length; i++) {
      if (productions[i].getHead() === productions[i].getBody()[0]) {
        this.immedationRecursion.push(i)
      }
    }
  }
  // 递归实现的回溯法扫描间接左递归
  scanIndirectLeftRecursion(solutionSpace) {
    console.log('-----------------------------------')
    const temp = solutionSpace.getData()
    for (const i of temp) {
      let tempString = ''
      for (let j = 0; j < i.productions.length; j++) {
        tempString += i.productions[j].getString() + ', '
      }
      console.log(tempString + i.index.toString() + ', ' + i.bodySymbolIndex.toString())
    }
    const bottom = solutionSpace.bottom()
    if (bottom.index === bottom.productions.length) { // 已经处理到栈底产生式数组的最后一个产生式，算法结束
      return
    } else {
      const aim = bottom.productions[bottom.index].getHead() // 左递归的开始符号
      const top = solutionSpace.pop()
      if (top.index === top.productions.length) { // 已经处理到栈顶产生式数组的最后一个产生式，将下一层的记录位加一
        const former = solutionSpace.pop()
        former.index++
        former.bodySymbolIndex = 0
        solutionSpace.push(former)
        this.scanIndirectLeftRecursion(solutionSpace)
      } else {
        const handleProduction = top.productions[top.index]
        if (top.bodySymbolIndex === handleProduction.getBody().length) { // 已经扫描到产生式体的最后一个符号
          top.index++
          top.bodySymbolIndex = 0
          solutionSpace.push(top)
          this.scanIndirectLeftRecursion(solutionSpace)
        } else {
          const current = handleProduction.getBody()[top.bodySymbolIndex]
          if (current === aim) { // 当前符号与目标相同，找到一个左递归，current 和 aim 都是从 this.grammar 中取的，可以直接用 ===
            solutionSpace.push(top)
            this.getIndirectLeftRecursion(solutionSpace)
            solutionSpace.pop()
            top.index++
            top.bodySymbolIndex = 0
            solutionSpace.push(top)
            this.scanIndirectLeftRecursion(solutionSpace)
          } else {
            if (current.isTerminal()) { // 当前符号是终止符号，不可能是左递归
              top.index++
              top.bodySymbolIndex = 0
              solutionSpace.push(top)
              this.scanIndirectLeftRecursion(solutionSpace)
            } else if (current.isNonterminal()) {
              const frame = {
                productions: Array.of(),
                index: 0,
                bodySymbolIndex: 0
              }
              const tempProductions = this.grammar.getDerivations(current)
              for (let i = 0; i < tempProductions.length; i++) { // 检测产生式是否是立即左递归的
                const index = this.grammar.getProductions().indexOf(tempProductions[i])
                if (!this.immedationRecursion.includes(index)) {
                  frame.productions.push(tempProductions[i])
                }
              }
              if (frame.productions.length === 0) { // 没有以当前符号为头部的产生式
                top.index++
                top.bodySymbolIndex = 0
                solutionSpace.push(top)
                this.scanIndirectLeftRecursion(solutionSpace)
              } else {
                solutionSpace.push(top)
                solutionSpace.push(frame)
                this.scanIndirectLeftRecursion(solutionSpace)
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
                this.scanIndirectLeftRecursion(solutionSpace)
              } else {
                const tempSymbol = former.productions[former.index].getBody()[former.bodySymbolIndex]
                const tempProductions = this.grammar.getDerivations(tempSymbol)
                if (tempProductions.length === 0) {
                  top.index++
                  top.bodySymbolIndex = 0
                  former.bodySymbolIndex--
                  solutionSpace.push(former)
                  solutionSpace.push(top)
                  this.scanIndirectLeftRecursion(solutionSpace)
                } else {
                  const newFormer = {
                    productions: tempProductions,
                    index: 0,
                    bodySymbolIndex: 0
                  }
                  solutionSpace.push(former)
                  solutionSpace.push(top)
                  solutionSpace.push(newFormer)
                  this.scanIndirectLeftRecursion(solutionSpace)
                }
              }
            }
          }
        }
      }
    }
  }

  getIndirectLeftRecursion(solutionSpace) {
    const productions = this.grammar.getProductions()
    const data = solutionSpace.getData()
    const temp = Array.of() // 该数组记录了间接左递归涉及到的产生式在 this.grammar.productions 数组中的下标
    for (const i of data) {
      const involeProduction = i.productions[i.index]
      temp.push(productions.indexOf(involeProduction))
    }
    this.indirectRecursion.push(temp)
  }
}
export default function(grammar) {
  const ELR = new EliminateLeftRecursion(grammar)
  return { immedationRecursion: ELR.immedationRecursion, indirectRecursion: ELR.indirectRecursion }
}
