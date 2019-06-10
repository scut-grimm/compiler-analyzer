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

    this.eliminatingCycles()
    // console.log('消除环后的文法')
    // console.log('Start symbol: ' + this.eliminatingCyclesGrammar.getStartSign().getString())
    // console.log('Productions')
    // this.eliminatingCyclesGrammar.productions.forEach(e => {
    //   console.log(e.getHeadString() + '->' + e.getBodyString())
    // })
    // let eliminatingCyclesNonterminals = ''
    // this.eliminatingCyclesGrammar.getNonterminals().forEach(e => {
    //   eliminatingCyclesNonterminals += e.getString() + ' '
    // })
    // console.log('Nonterminals: ' + eliminatingCyclesNonterminals)
    // let eliminatingCyclesTerminals = ''
    // this.eliminatingCyclesGrammar.getTerminals().forEach(e => {
    //   eliminatingCyclesTerminals += e.getString() + ' '
    // })
    // console.log('Terminals: ' + eliminatingCyclesTerminals)
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
    console.log('-----------------------------------')
    const temp = solutionSpace.getData()
    for (const i of temp) {
      let tempString = ''
      for (let j = 0; j < i.productions.length; j++) {
        tempString += i.productions[j].getString() + ', '
      }
      console.log(tempString + i.index.toString() + ', ' + i.bodySymbolIndex.toString())
    }
    console.log('************************************')
    const tempDer = derivationStack.getData()
    let tempString = ''
    for (const i of tempDer) {
      if (i !== undefined) {
        tempString += i.getString() + ', '
      } else {
        tempString += 'undefined, '
      }
    }
    tempString = tempString.slice(0, -2)
    console.log(tempString)
    console.log('-----------------------------------')
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
            } else if (current.isEmpty()) { // 这里没有回溯到正确位置
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
  findnullableNonterminals(grammar) {
    let done = false
    const nullableNonterminals = []
    while (!done) {
      done = true
      const nonterminals = grammar.getNonterminals()
      for (const nonterminal of nonterminals) {
        const productions = grammar.getDerivations(nonterminal)
        for (const production of productions) {
          const body = production.getBody()
          for (const symbol of body) {
            if (symbol.isEmpty() || nullableNonterminals.includes(symbol)) {
              if (body.indexOf(symbol) === body.length - 1 && !nullableNonterminals.includes(nonterminal)) {
                nullableNonterminals.push(nonterminal)
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
    return nullableNonterminals
  }
  // 消除ε产生式，形如 A->ε 的产生式称为 ε 产生式
  eliminatingEmptyProduction() { // 保证消除后的文法没有ε产生式（一种情况除外：产生式 S->ε，S为开始符号）
    this.eliminatingEmptyGrammar.setStartSign(this.eliminatingEmptyGrammar.getSign(this.grammar.getStartSign()))
    const nullableNonterminals = this.findnullableNonterminals(this.grammar) // 找到 this.grammar 中所有可空非终止符号
    // console.log('可空非终止符号： ' + nullableNonterminals.map(e => e.getString()).join(', '))
    const productions = this.grammar.getProductions()
    for (const production of productions) {
      // console.log('******************')
      // console.log(production.getString())
      const head = this.eliminatingEmptyGrammar.getSign(production.getHead())
      const body = production.getBody()
      if (body[0].isEmpty()) { // 如果产生式体是ε，直接忽略
        continue
      } else if (this.allBodySymbolNotNullable(this.grammar, body)) { // 如果产生式体中的符号都是不可空的，则将该产生式直接放入新的文法中
        const newBody = []
        for (const symbol of body) {
          newBody.push(this.eliminatingEmptyGrammar.getSign(symbol))
        }
        const tempProduction = new Production(head, newBody)
        if (!this.existTheProduction(this.eliminatingEmptyGrammar, tempProduction) && newBody.length > 0) {
          // console.log(tempProduction.getString())
          this.eliminatingEmptyGrammar.addProduction(head, newBody)
        }
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
        // 最后生成新产生式，并放入this.eliminatingEmptyGrammar中。为了避免产生式重复出现，加入之前先要判断产生式是否存在。
        let turn = 0
        const nullableSymbolIndex = [] // 记录可空符号在body中的下标，数组的长度表示可空符号的个数
        for (let i = 0; i < body.length; i++) {
          if (nullableNonterminals.includes(body[i])) {
            nullableSymbolIndex.push(i)
            turn++
          }
        }
        turn = Math.pow(2, turn)
        // console.log('可空符号的个数' + nullableSymbolIndex.length)
        // console.log('总轮次数' + turn)
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
          let posArrayString = '['
          for (const pos of posArray) {
            const tempString = '{' + pos.position.toString() + ',' + pos.value.toString() + '}'
            posArrayString += tempString + ', '
          }
          posArrayString = posArrayString.slice(0, -2)
          posArrayString += ']'
          // console.log(posArrayString)
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
    if (nullableNonterminals.includes(this.grammar.getStartSign())) { // 处理开始符号可空的情况
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
  allBodySymbolNotNullable(grammar, body) {
    const nullableNonterminals = this.findnullableNonterminals(grammar)
    for (const symbol of body) {
      if (nullableNonterminals.includes(symbol)) {
        return false
      }
    }
    return true
  }
  // 消除环，形如 A (=>)+ A 的推导称为环
  // 算法的实质是在消除ε产生式的基础上消除单产生式
  eliminatingCycles() {
    const EEG = this.eliminatingEmptyGrammar // 基于消除ε产生式后的文法
    this.eliminatingCyclesGrammar.setStartSign(this.eliminatingCyclesGrammar.getSign(EEG.getStartSign()))
    let heads = new Set()
    const EEGProductions = EEG.getProductions() // 获取无ε产生式文法的产生式
    for (const EEGProduction of EEGProductions) {
      heads.add(EEGProduction.getHead())
    }
    heads = [...heads] // 存放所有产生式的头部（无重复）
    const unitProductions = [] // unit-production 形如 A(=>)*B 的产生式，A B都是非终止符号
    for (const head of heads) { // 初始化 unitProductions
      const temp = { head: head, body: [], done: false }
      unitProductions.push(temp)
    }
    for (const item of unitProductions) { // 扩充 unitProductions
      for (const EEGProduction of EEGProductions) { // 将文法EEG中产生式的head与item.head相同且body长度为1且是非终止符的body添加至item.body中
        if (EEGProduction.getHead() === item.head && EEGProduction.getBody().length === 1 && EEGProduction.getBody()[0].isNonterminal()) {
          item.body.push(EEGProduction.getBody()[0])
        }
      }
      if (item.body.length > 0) { // item.body 的长度为零说明没有以 item.head 为头部的 unit-production
        while (!item.done) {
          item.done = true
          for (const symbol of item.body) {
            for (const EEGProduction of EEGProductions) { // 将文法EEG中产生式的head与symbol相同且body长度为一且是非终止符的body添加至item.body中
              if (EEGProduction.getHead() === symbol && EEGProduction.getBody().length === 1 && EEGProduction.getBody()[0].isNonterminal()) {
                if (!item.body.includes(EEGProduction.getBody()[0])) { // 确保不重复添加
                  item.body.push(EEGProduction.getBody()[0])
                  item.done = false
                }
              }
            }
          }
        }
      } else {
        item.done = true
      }
    }
    for (const unitProduction of unitProductions) { // 遍历 unitProductions 为 this.eliminatingCyclesGrammar 添加产生式
      const head = this.eliminatingCyclesGrammar.getSign(unitProduction.head) // 处理 head
      const EEGProductions = EEG.getDerivations(head)
      for (const EEGProduction of EEGProductions) {
        if (EEGProduction.getBody().length > 1 || (EEGProduction.getBody().length === 1 && !EEGProduction.getBody()[0].isNonterminal())) {
          const newBody = []
          for (const symbol of EEGProduction.getBody()) {
            newBody.push(this.eliminatingCyclesGrammar.getSign(symbol))
          }
          const tempProduction = new Production(head, newBody)
          if (!this.existTheProduction(this.eliminatingCyclesGrammar, tempProduction) && newBody.length > 0) { // 确保不重复添加产生式
            this.eliminatingCyclesGrammar.addProduction(head, newBody)
          }
        }
      }
      const body = unitProduction.body // 处理 body
      for (const symbol of body) {
        const head = this.eliminatingCyclesGrammar.getSign(symbol)
        const EEGProductions = EEG.getDerivations(symbol)
        for (const EEGProduction of EEGProductions) {
          if (EEGProduction.getBody().length > 1 || (EEGProduction.getBody().length === 1 && !EEGProduction.getBody()[0].isNonterminal())) {
            const newBody = []
            const oldBody = EEGProduction.getBody()
            for (const oldSymbol of oldBody) {
              newBody.push(this.eliminatingCyclesGrammar.getSign(oldSymbol))
            }
            const tempProduction = new Production(head, newBody)
            if (!this.existTheProduction(this.eliminatingCyclesGrammar, tempProduction) && newBody.length > 0) { // 确保不重复添加产生式
              this.eliminatingCyclesGrammar.addProduction(head, newBody)
            }
          }
        }
      }
    }
  }
}
export default function(grammar) {
  const ELR = new EliminateLeftRecursion(grammar)
  return { immedationRecursion: ELR.immedationRecursion, indirectRecursion: ELR.indirectRecursion }
}
