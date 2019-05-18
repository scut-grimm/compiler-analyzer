class ParsingStack {
  constructor() {
    this.stack = []
    this.top = 0
  }
  push(element) {
    if (element instanceof Array) {
      for (let i = element.length - 1; i >= 0; i--) {
        this.stack[this.top++] = element[i]
      }
    } else {
      this.stack[this.top++] = element
    }
    return this
  }
  pop() {
    if (this.top > 0) {
      --this.top
      return this.stack.pop()
    } else { return null }
  }
  getStack() {
    return this.stack
  }
  getStringStack() {
    let result = ''
    for (const i of this.stack) {
      result = i.getString() + result
    }
    return result
  }
  peek() {
    if (this.top > 0) return this.stack[this.top - 1]
    else return null
  }
}

export default ParsingStack
