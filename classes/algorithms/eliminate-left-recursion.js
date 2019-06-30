/* eslint-disable no-lone-blocks */
/* eslint-env es6*/
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
  getDataViaIndex(index) {
    return this.data[index]
  }
}
class EliminateLeftRecursion {
  immedationRecursion = Array.of() // 记录立即左递归的产生式
  indirectRecursion = Array.of() // 二维数组，记录间接左递归的产生式和环
  nollableNonterminal = Array.of()
  solutionSpace = new Stack()
  derivationStack = new Stack() // 推导栈，记录当前推导链上的产生式，压栈之前先检测栈中是否存在左递归
  eliminatingEmptyGrammar = new Grammar() // 消除ε-production以后的新文法
  eliminatingCyclesGrammar = new Grammar() // 消除环以后的新文法
  eliminateLeftRecursionGrammar = new Grammar() // 消除左递归后的新文法
  constructor(grammar) {
    // 深拷贝 grammar
    this.grammar = grammar.clone()
    this.immedationRecursion = this.scanImmedationLeftRecursion(this.grammar.getProductions())
    const frame = {
      productions: Array.of(),
      index: 0,
      bodySymbolIndex: 0
    }
    for (const production of this.grammar.getProductions()) { // 初始化 frame 压入所有非立即左递归的产生式和非一步环
      if (this.productionIsCycle(production)) {
        this.indirectRecursion.push([production])
      } else if (!this.productionIsImmedationLeftRecursion(production)) {
        frame.productions.push(production)
      }
    }
    this.solutionSpace.push(frame) // 解空间初始化
    this.derivationStack.push(frame.productions[frame.index]) // 推导栈初始化
    this.scanIndirectLeftRecursion(this.solutionSpace, this.derivationStack)
    // 先检查当前文法有没有间接左递归
    if (this.indirectRecursion.length !== 0) { // 当前文法有间接左递归
      this.indirectRecursionDeDuplex()
      this.eliminatingEmptyGrammar = this.eliminatingEmptyProduction(this.grammar)
      this.eliminatingCyclesGrammar = this.eliminatingCycles(this.eliminatingEmptyGrammar)
      this.eliminateLeftRecursionGrammar = this.eliminatingLeftRecursion(this.eliminatingCyclesGrammar)
    } else { // 当前文法没有间接左递归，则检测当前文法有没有直接左递归
      if (this.immedationRecursion.length !== 0) { // 当前文法有直接左递归
        this.eliminateLeftRecursionGrammar = this.eliminatingImmedationRecursion(this.grammar)
        // {
        //   console.log('消除左递归后的文法')
        //   const tempGrammar = this.eliminateLeftRecursionGrammar
        //   console.log('Start symbol: ' + tempGrammar.getStartSign().getString())
        //   console.log('Productions')
        //   tempGrammar.productions.forEach(e => {
        //     console.log(e.getHeadString() + '->' + e.getBodyString())
        //   })
        //   let Nonterminals = ''
        //   tempGrammar.getNonterminals().forEach(e => {
        //     Nonterminals += e.getString() + ' '
        //   })
        //   console.log('Nonterminals: ' + Nonterminals)
        //   let Terminals = ''
        //   tempGrammar.getTerminals().forEach(e => {
        //     Terminals += e.getString() + ' '
        //   })
        //   console.log('Terminals: ' + Terminals)
        // }
      } else { // 当前文法没有直接左递归
        this.eliminateLeftRecursionGrammar = this.grammar.clone()
      }
    }
  }
  // 扫描立即左递归
  // 形如 E->Eα 的产生式称为立即左递归
  // 其中 E 是非终止符号，α 是由终止符号与非终止符号组成的串且 α 不为空串
  scanImmedationLeftRecursion(productions) {
    const immedationRecursion = []
    for (let i = 0; i < productions.length; i++) {
      if (this.productionIsImmedationLeftRecursion(productions[i])) {
        immedationRecursion.push(productions[i])
      }
    }
    return immedationRecursion
  }
  // 检测一条产生式是不是立即左递归的
  // 形如 E->Eα 的产生式称为立即左递归
  // 其中 E 是非终止符号，α 是由终止符号与非终止符号组成的串且 α 不为空串
  productionIsImmedationLeftRecursion(production) {
    if (production.getHead() === production.getBody()[0] && production.getBody().length > 1) {
      return true
    } else {
      return false
    }
  }
  // 检测一条产生式是否是形如 A->A 的环
  // A 是非终止符号
  productionIsCycle(production) {
    if (production.getHead() === production.getBody()[0] && production.getBody().length === 1) {
      return true
    } else {
      return false
    }
  }
  // 扫描间接左递归
  // 递归实现的回溯法
  scanIndirectLeftRecursion(solutionSpace, derivationStack) {
    // {
    //   console.log('-----------------------------------')
    //   const temp = solutionSpace.getData()
    //   for (const i of temp) {
    //     let tempString = ''
    //     for (let j = 0; j < i.productions.length; j++) {
    //       tempString += i.productions[j].getString() + ', '
    //     }
    //     console.log(tempString + i.index.toString() + ', ' + i.bodySymbolIndex.toString())
    //   }
    //   console.log('************************************')
    //   const tempDer = derivationStack.getData()
    //   let tempString = ''
    //   for (const i of tempDer) {
    //     if (i !== undefined) {
    //       tempString += i.getString() + ', '
    //     } else {
    //       tempString += 'undefined, '
    //     }
    //   }
    //   tempString = tempString.slice(0, -2)
    //   console.log(tempString)
    //   console.log('-----------------------------------')
    // }
    const bottom = solutionSpace.bottom()
    if (bottom.index === bottom.productions.length) { // 已经处理完解空间栈栈底产生式数组的最后一个产生式，算法结束
      return
    } else {
      const top = solutionSpace.pop()
      if (top.index >= top.productions.length) { // 已经处理完解空间栈栈顶产生式数组的最后一个产生式，将下一层的记录位加一，更新推导栈
        const former = solutionSpace.pop()
        former.index++
        former.bodySymbolIndex = 0
        derivationStack.pop()
        derivationStack.pop()
        derivationStack.push(former.productions[former.index])
        solutionSpace.push(former)
        return this.scanIndirectLeftRecursion(solutionSpace, derivationStack)
      } else {
        // 检测推导栈中是否含有左递归
        if (this.hasLeftRecursionInDerivationStack(derivationStack)) {
          if (!derivationStack.top().getBody()[0].isEmpty()) { // 如果推导栈的栈顶不是一个ε产生式，则回溯
            top.index++
            derivationStack.pop()
            derivationStack.push(top.productions[top.index])
            solutionSpace.push(top)
            return this.scanIndirectLeftRecursion(solutionSpace, derivationStack)
          }
        }
        const handleProduction = top.productions[top.index]
        // console.log('当前产生式' + handleProduction.getString())
        if (top.bodySymbolIndex === handleProduction.getBody().length) { // 已经扫描到产生式体的最后一个符号，回溯
          top.index++
          top.bodySymbolIndex = 0
          derivationStack.pop()
          derivationStack.push(top.productions[top.index])
          solutionSpace.push(top)
          return this.scanIndirectLeftRecursion(solutionSpace, derivationStack)
        } else {
          const current = handleProduction.getBody()[top.bodySymbolIndex]
          if (current.isTerminal()) { // 当前符号是终止符号，不可能是左递归，回溯
            top.index++
            top.bodySymbolIndex = 0
            derivationStack.pop()
            derivationStack.push(top.productions[top.index])
            solutionSpace.push(top)
            return this.scanIndirectLeftRecursion(solutionSpace, derivationStack)
          } else if (current.isNonterminal()) { // 当前符号是非终止符号
            const frame = {
              productions: Array.of(),
              index: 0,
              bodySymbolIndex: 0
            }
            const tempProductions = this.grammar.getDerivations(current)
            for (let i = 0; i < tempProductions.length; i++) { // 把不是立即左递归和一步环的产生式放入 frame.productions 中
              if (!this.immedationRecursion.includes(tempProductions[i]) && !this.productionIsCycle(tempProductions[i])) { // 排除立即左递归和一步环
                frame.productions.push(tempProductions[i])
              }
            }
            if (frame.productions.length === 0) { // 没有以当前符号为头部的产生式或以当前符号为头部的产生式都是立即左递归或都是一步环
              top.index++
              top.bodySymbolIndex = 0
              derivationStack.pop()
              derivationStack.push(top.productions[top.index])
              solutionSpace.push(top)
              return this.scanIndirectLeftRecursion(solutionSpace, derivationStack)
            } else {
              solutionSpace.push(top)
              solutionSpace.push(frame)
              derivationStack.push(frame.productions[frame.index])
              return this.scanIndirectLeftRecursion(solutionSpace, derivationStack)
            }
          } else if (current.isEmpty()) { // 处理涉及到ε产生式的间接左递归
            // 先检查上一层处理的产生式是不是一个ε产生式
            // 是的话，继续向上推，直到找到不是的那个栈帧
            // 直接操作solutionSpace的data属性。说实话，这里已经不把solutionSpace当作栈来看待了，失败失败
            const data = solutionSpace.getData()
            let emptyDerivationNum = 1 // 记录ε推导的个数，当前情况就是一次ε推导
            for (let i = data.length - 1; i >= 0; i--) { // 从后往前扫描data
              const item = data[i] // item 是 data[i] 的引用
              const production = item.productions[item.index] // 获取正在处理的产生式
              const body = production.getBody()
              const symbol = body[item.bodySymbolIndex] // 获取正在处理的符号
              if (!symbol.isEmpty()) { // symbol 不是 ε，则说明找到目标产生式了
                item.bodySymbolIndex++
                if (item.bodySymbolIndex === body.length) { // 目标产生式处理完最后一个字符了，回溯
                  // 这里solutionSpace和derivationStack都要弹栈，弹栈方式比较特殊
                  // solutionSpace 需要弹出当前栈帧之上的所有栈帧
                  // derivationStack 需要和 solutionSpace 同步弹栈
                  for (let i = 1; i < emptyDerivationNum; i++) {
                    solutionSpace.pop()
                  }
                  for (let i = 0; i < emptyDerivationNum; i++) {
                    derivationStack.pop()
                  }
                  const newTop = solutionSpace.pop() // 更新 top
                  newTop.index++
                  newTop.bodySymbolIndex = 0
                  derivationStack.pop()
                  derivationStack.push(newTop.productions[newTop.index])
                  solutionSpace.push(newTop)
                  return this.scanIndirectLeftRecursion(solutionSpace, derivationStack)
                } else { // 向solutionSpace中压栈
                  const tempSymbol = body[item.bodySymbolIndex]
                  const tempProductions = this.grammar.getDerivations(tempSymbol)
                  if (tempProductions.length === 0) { // 这里说明 tempSymbol 是一个终止符号，不可能有左递归产生
                    // 这里solutionSpace和derivationStack都要弹栈，弹栈方式比较特殊
                    // solutionSpace 需要弹出当前栈帧之上的所有栈帧
                    // derivationStack 需要和 solutionSpace 同步弹栈
                    for (let i = 1; i < emptyDerivationNum; i++) {
                      solutionSpace.pop()
                    }
                    for (let i = 0; i < emptyDerivationNum; i++) {
                      derivationStack.pop()
                    }
                    const newTop = solutionSpace.pop() // 更新 top
                    newTop.index++
                    newTop.bodySymbolIndex = 0
                    derivationStack.pop()
                    derivationStack.push(newTop.productions[newTop.index])
                    solutionSpace.push(newTop)
                    return this.scanIndirectLeftRecursion(solutionSpace, derivationStack)
                  } else {
                    const newFrame = {
                      productions: Array.of(),
                      index: 0,
                      bodySymbolIndex: 0
                    }
                    for (const i of tempProductions) { // 排除所有立即左递归和一步环的产生式
                      if (!this.immedationRecursion.includes(i) && !this.productionIsCycle(i)) {
                        newFrame.productions.push(i)
                      }
                    }
                    if (newFrame.productions.length === 0) { // 说明以 tempSymbol 为头部的产生式都是立即左递归或一步环
                      // 这里solutionSpace和derivationStack都要弹栈，弹栈方式比较特殊
                      // solutionSpace 需要弹出当前栈帧之上的所有栈帧
                      // derivationStack 需要和 solutionSpace 同步弹栈
                      for (let i = 1; i < emptyDerivationNum; i++) {
                        solutionSpace.pop()
                      }
                      for (let i = 0; i < emptyDerivationNum; i++) {
                        derivationStack.pop()
                      }
                      const newTop = solutionSpace.pop() // 更新 top
                      newTop.index++
                      newTop.bodySymbolIndex = 0
                      derivationStack.pop()
                      derivationStack.push(newTop.productions[newTop.index])
                      solutionSpace.push(newTop)
                      return this.scanIndirectLeftRecursion(solutionSpace, derivationStack)
                    } else {
                      solutionSpace.push(top)
                      solutionSpace.push(newFrame)
                      derivationStack.push(newFrame.productions[newFrame.index])
                      return this.scanIndirectLeftRecursion(solutionSpace, derivationStack)
                    }
                  }
                }
                // 这里不用 break 了，因为前面 return 了
              }
              emptyDerivationNum++ // 是ε推导，计数器加一
            }
          }
        }
      }
    }
  }
  // 判断当前推导链中是否有左递归
  hasLeftRecursionInDerivationStack(derivationStack) {
    const data = derivationStack.getData()
    let aim = derivationStack.top().getBody()[0]
    if (aim.isEmpty()) { // 目标符号是ε
      // 在 derivationStack 中从后向前扫描，找到不是ε产生式的那个产生式
      let nonemptyProductionIndex = data.length - 1
      let emptyDerivationNum = 0 // ε推导的个数
      for (; nonemptyProductionIndex >= 0; nonemptyProductionIndex--) {
        if (!data[nonemptyProductionIndex].getBody()[0].isEmpty()) {
          break
        }
        emptyDerivationNum++
      }
      if (nonemptyProductionIndex < 0) { // 说明推导链前面的产生式全是ε产生式，这一定不是左递归
        return false
      }
      const nonemptyProduction = data[nonemptyProductionIndex]
      if (emptyDerivationNum === nonemptyProduction.getBody().length) { // ε推导的个数等于非空产生式体的长度，说明这不是左递归
        return false
      } else { // 否则，更新目标符号
        aim = nonemptyProduction.getBody()[emptyDerivationNum]
        for (let i = nonemptyProductionIndex; i >= 0; i--) {
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
    } else { // 目标符号是非终止符号
      for (let i = data.length - 1; i >= 0; i--) {
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
  // 消除ε产生式
  // 形如 A->ε 的产生式称为 ε 产生式
  eliminatingEmptyProduction(grammar) { // 保证消除后的文法没有ε产生式（一种情况除外：产生式 S->ε，S为开始符号）
    const EEG = new Grammar()
    EEG.setStartSign(EEG.getSign(grammar.getStartSign()))
    const nullableNonterminals = this.findnullableNonterminals(grammar) // 找到 grammar 中所有可空非终止符号
    // console.log('可空非终止符号： ' + nullableNonterminals.map(e => e.getString()).join(', '))
    const productions = grammar.getProductions()
    for (const production of productions) {
      // console.log('******************')
      // console.log(production.getString())
      const head = EEG.getSign(production.getHead())
      const body = production.getBody()
      if (body[0].isEmpty()) { // 如果产生式体是ε，直接忽略
        continue
      } else if (this.allBodySymbolNotNullable(grammar, body)) { // 如果产生式体中的符号都是不可空的，则将该产生式直接放入新的文法中
        const newBody = []
        for (const symbol of body) {
          newBody.push(EEG.getSign(symbol))
        }
        const tempProduction = new Production(head, newBody)
        if (!this.existTheProduction(EEG, tempProduction) && newBody.length > 0) {
          // console.log(tempProduction.getString())
          EEG.addProduction(head, newBody)
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
        // 最后生成新产生式，并放入EEG中。为了避免产生式重复出现，加入之前先要判断产生式是否存在。
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
            tempBody.push(EEG.getSign(j))
          }
          for (const pos of posArray) {
            if (pos.value === 0) {
              tempBody.splice(pos.position, 1, 0)
            }
          }
          const newBody = [] // 新的body
          for (const j of tempBody) {
            if (j !== 0) {
              newBody.push(EEG.getSign(j))
            }
          }
          const tempProduction = new Production(head, newBody)
          // console.log(tempProduction.getString())
          if (newBody.length !== 0 && !this.existTheProduction(EEG, tempProduction)) {
            EEG.addProduction(head, newBody)
          }
        }
      }
    }
    if (nullableNonterminals.includes(grammar.getStartSign())) { // 处理开始符号可空的情况
      const head = EEG.getStartSign()
      const body = [EEG.getEmptySign()]
      EEG.addProduction(head, body)
    }
    return EEG
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
  // 消除环
  // 形如 A (=>)+ A 的推导称为环
  // 算法的实质是在消除ε产生式的基础上消除单产生式
  eliminatingCycles(grammar) {
    const ECG = new Grammar()
    const EEG = grammar // 基于消除ε产生式后的文法
    ECG.setStartSign(ECG.getSign(EEG.getStartSign()))
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
    // console.log(unitProductions)
    for (const unitProduction of unitProductions) { // 遍历 unitProductions 为 ECG 添加产生式
      const head = ECG.getSign(unitProduction.head) // 处理 head
      const EEGProductions = EEG.getDerivations(head)
      for (const EEGProduction of EEGProductions) {
        if (EEGProduction.getBody().length > 1 || (EEGProduction.getBody().length === 1 && !EEGProduction.getBody()[0].isNonterminal())) {
          const newBody = []
          for (const symbol of EEGProduction.getBody()) {
            newBody.push(ECG.getSign(symbol))
          }
          const tempProduction = new Production(head, newBody)
          if (!this.existTheProduction(ECG, tempProduction) && newBody.length > 0) { // 确保不重复添加产生式
            ECG.addProduction(head, newBody)
          }
        }
      }
      const body = unitProduction.body // 处理 body
      for (const symbol of body) {
        const EEGProductions = EEG.getDerivations(symbol)
        for (const EEGProduction of EEGProductions) {
          if (EEGProduction.getBody().length > 1 || (EEGProduction.getBody().length === 1 && !EEGProduction.getBody()[0].isNonterminal())) {
            const newBody = []
            const oldBody = EEGProduction.getBody()
            for (const oldSymbol of oldBody) {
              newBody.push(ECG.getSign(oldSymbol))
            }
            const tempProduction = new Production(head, newBody)
            if (!this.existTheProduction(ECG, tempProduction) && newBody.length > 0) { // 确保不重复添加产生式
              ECG.addProduction(head, newBody)
            }
          }
        }
      }
    }
    return ECG
  }
  // 消除左递归（包括间接左递归和立即左递归）
  // 输入：无 ε 产生式并且无环的文法
  // 输出：一个等价的无左递归文法
  eliminatingLeftRecursion(grammar) {
    const EFRGrammar = new Grammar()
    // 消除左递归之前先判断有没有左递归
    if (this.immedationRecursion.length === 0 && this.indirectRecursion.length === 0) {
      EFRGrammar.setStartSign(EFRGrammar.getSign(grammar.getStartSign()))
      for (const production of grammar.getProductions()) {
        const head = EFRGrammar.getSign(production.getHead())
        const body = production.getBody().map(e => EFRGrammar.getSign(e))
        EFRGrammar.addProduction(head, body)
      }
    } else {
      EFRGrammar.setStartSign(EFRGrammar.getSign(grammar.getStartSign()))
      for (const terminal of grammar.getTerminals()) {
        EFRGrammar.getSign(terminal)
      }
      for (const nonterminal of grammar.getNonterminals()) {
        EFRGrammar.getSign(nonterminal)
      }
      const nonterminals = grammar.getNonterminals()
      for (let i = 0; i < nonterminals.length; i++) {
        const iProductions = grammar.getDerivations(nonterminals[i])
        const newProductions = []
        if (i === 0) {
          for (const production of iProductions) {
            newProductions.push(production)
          }
        } else {
          for (const iProduction of iProductions) {
            let change = false // 记录当前产生式是否被改变了
            for (let j = 0; j < i; j++) {
              if (iProduction.getBody()[0] === nonterminals[j]) {
                change = true
                const head = nonterminals[i]
                const jProductions = grammar.getDerivations(nonterminals[j])
                for (const jProduction of jProductions) {
                  const newBody = []
                  for (const symbol of jProduction.getBody()) {
                    newBody.push(symbol)
                  }
                  for (let k = 1; k < iProduction.getBody().length; k++) {
                    newBody.push(iProduction.getBody()[k])
                  }
                  const newProduction = new Production(head, newBody)
                  newProductions.push(newProduction)
                }
                break
              }
            }
            if (!change) {
              newProductions.push(iProduction)
            }
          }
        }
        // 消除 newProductions 中的立即左递归
        // newProductions 中的产生式的 head 都是 nonterminals[i]
        const immedationRecursion = this.scanImmedationLeftRecursion(newProductions)
        if (immedationRecursion.length > 0) { // 如果 newProductions 中有左递归
          const newNonterminal = EFRGrammar.getSignUnusedAlias(nonterminals[i]) // 一个新的，右上角带单引号的非终止符号
          if (newProductions.length === immedationRecursion.length) { // 产生式都是左递归的，则应该添加产生式 A->A'
            const head = EFRGrammar.getSign(nonterminals[i].getString())

            const body = [newNonterminal]
            const tempProduction = new Production(head, body)
            if (!this.existTheProduction(EFRGrammar, tempProduction) && body.length > 0) {
              EFRGrammar.addProduction(head, body)
            }
          }
          for (const production of newProductions) {
            if (immedationRecursion.includes(production)) {
              const head = newNonterminal
              const body = []
              if (!production.getBody()[0].isEmpty()) {
                for (let i = 1; i < production.getBody().length; i++) {
                  body.push(EFRGrammar.getSign(production.getBody()[i]))
                }
                body.push(newNonterminal)
              } else {
                body.push(production.getBody()[0])
              }
              const tempProduction = new Production(head, body)
              if (!this.existTheProduction(EFRGrammar, tempProduction) && body.length > 0) {
                EFRGrammar.addProduction(head, body)
              }
            } else {
              const head = EFRGrammar.getSign(production.getHead())
              const body = []
              for (const symbol of production.getBody()) {
                body.push(EFRGrammar.getSign(symbol))
              }
              body.push(newNonterminal)
              const tempProduction = new Production(head, body)
              if (!this.existTheProduction(EFRGrammar, tempProduction) && body.length > 0) {
                EFRGrammar.addProduction(head, body)
              }
            }
          }
          const head = newNonterminal
          const body = [EFRGrammar.getEmptySign()]
          const tempProduction = new Production(head, body)
          if (!this.existTheProduction(EFRGrammar, tempProduction) && body.length > 0) {
            EFRGrammar.addProduction(head, body)
          }
        } else {
          for (const production of newProductions) {
            const head = EFRGrammar.getSign(production.getHead())
            const body = []
            for (const symbol of production.getBody()) {
              body.push(EFRGrammar.getSign(symbol))
            }
            const tempProduction = new Production(head, body)
            if (!this.existTheProduction(EFRGrammar, tempProduction) && body.length > 0) {
              EFRGrammar.addProduction(head, body)
            }
          }
        }
      }
    }
    return EFRGrammar
  }
  // 消除立即左递归
  // 输入：一个有立即左递归，无间接左递归的文法
  // 输出：一个等价的无左递归的文法
  eliminatingImmedationRecursion(grammar) {
    const newG = new Grammar()
    newG.setStartSign(newG.getSign(grammar.getStartSign()))
    for (const terminal of grammar.getTerminals()) {
      newG.getSign(terminal)
    }
    for (const nonterminal of grammar.getNonterminals()) {
      newG.getSign(nonterminal)
    }
    for (const nonterminal of grammar.getNonterminals()) {
      const productions = grammar.getDerivations(nonterminal)
      if (productions.length !== 0) {
        const immedationRecursion = this.scanImmedationLeftRecursion(productions)
        if (immedationRecursion.length > 0) {
          const newNonterminal = newG.getSignUnusedAlias(nonterminal)
          if (immedationRecursion.length === productions.length) {
            const head = newG.getSign(nonterminal)
            const body = [newNonterminal]
            const tempProduction = new Production(head, body)
            if (!this.existTheProduction(newG, tempProduction) && body.length > 0) {
              newG.addProduction(head, body)
            }
          }
          for (const production of productions) {
            if (immedationRecursion.includes(production)) {
              const head = newNonterminal
              const body = []
              for (let i = 1; i < production.getBody().length; i++) {
                body.push(newG.getSign(production.getBody()[i]))
              }
              body.push(newNonterminal)
              const tempProduction = new Production(head, body)
              if (!this.existTheProduction(newG, tempProduction) && body.length > 0) {
                newG.addProduction(head, body)
              }
            } else {
              const head = newG.getSign(production.getHead())
              const body = []
              if (!production.getBody()[0].isEmpty()) {
                for (const symbol of production.getBody()) {
                  body.push(newG.getSign(symbol))
                }
                body.push(newNonterminal)
              } else {
                body.push(production.getBody()[0])
              }
              const tempProduction = new Production(head, body)
              if (!this.existTheProduction(newG, tempProduction) && body.length > 0) {
                newG.addProduction(head, body)
              }
            }
          }
          const head = newNonterminal
          const body = [newG.getEmptySign()]
          const tempProduction = new Production(head, body)
          if (!this.existTheProduction(newG, tempProduction) && body.length > 0) {
            newG.addProduction(head, body)
          }
        } else {
          for (const production of productions) {
            const head = newG.getSign(production.getHead())
            const body = []
            for (const symbol of production.getBody()) {
              body.push(newG.getSign(symbol))
            }
            const tempProduction = new Production(head, body)
            if (!this.existTheProduction(newG, tempProduction) && body.length > 0) {
              newG.addProduction(head, body)
            }
          }
        }
      }
    }
    return newG
  }
  // 对记录间接左递归和环的二维数组去重
  // 因为一个间接左递归或环可能会在不同的回溯阶段被重复检测出来
  // 重复的间接左递归或环的特点：涉及到的产生式的个数相同，顺序一致
  // 对于重复的间接左递归只保留第一个
  indirectRecursionDeDuplex() {
    const recursionArray = this.indirectRecursion
    for (let i = 0; i < recursionArray.length; i++) {
      for (let j = i + 1; j < recursionArray.length; j++) {
        if (recursionArray[i].length === recursionArray[j].length) {
          let k = 0
          for (; k < recursionArray[i].length; k++) {
            if (recursionArray[i][k] !== recursionArray[j][k]) {
              break
            }
          }
          if (k === recursionArray[i].length) {
            recursionArray.splice(j, 1, [])
          }
        }
      }
    }
    const newIndirectRecursion = []
    for (const item of recursionArray) {
      if (item.length !== 0) {
        newIndirectRecursion.push(item)
      }
    }
    this.indirectRecursion = newIndirectRecursion
  }
}
export default function(grammar) {
  const ELR = new EliminateLeftRecursion(grammar)
  return {
    immedationRecursion: ELR.immedationRecursion, // 导致立即左递归的产生式
    indirectRecursion: ELR.indirectRecursion, // 导致间接左递归的产生式
    eliminatingEmptyGrammar: ELR.eliminatingEmptyGrammar, // 消除 ε 产生式后的文法
    eliminatingCyclesGrammar: ELR.eliminatingCyclesGrammar, // 消除环后的文法
    eliminateLeftRecursionGrammar: ELR.eliminateLeftRecursionGrammar // 消除左递归后的文法
  }
}
