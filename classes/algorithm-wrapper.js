class AlgorithmWrapper {
  constructor(algorithm) {
    this.algorithm = algorithm
    this.context = null
    this.epoch = null
    this.alldone = false
    this.lastvalue = null
  }
  init() {
    this.context = this.algorithm.getInitContext()
    this.epoch = this.algorithm.epoch(this.context)
    this.alldone = false
  }
  isAllDone() {
    return this.alldone
  }
  getContext() {
    return this.context
  }
  getCurResult() {
    return this.algorithm.getCurResult(this.context)
  }
  next() {
    const { value, done } = this.epoch.next()
    if (done) {
      const [alldone, nextContext] = value
      if (alldone) {
        this.alldone = true
        return this.lastvalue
      } else {
        this.context = nextContext
        this.epoch = this.algorithm.epoch(nextContext)
        return this.next()
      }
    } else {
      this.lastvalue = value
      return value
    }
  }
  skip() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { value, done } = this.epoch.next()
      if (done) {
        const [alldone, nextContext] = value
        if (alldone) {
          this.alldone = true
          return this.lastvalue
        } else {
          this.context = nextContext
          this.epoch = this.algorithm.epoch(nextContext)
          return this.lastvalue
        }
      } else {
        this.lastvalue = value
      }
    }
  }
  // run(){
  //   let ret = null
  //   while(this.isAllDone === false){
  //     ret = this.next()
  //   }
  //   return ret
  // }
}
export default AlgorithmWrapper
