class AlgorithmWrapper{
  constructor(algorithm){
    this.algorithm = algorithm
    this.context = null
    this.epoll = null
    this.alldone = false
    this.lastvalue = null
  }
  init(){
    this.context = this.algorithm.getInitContext()
    this.epoll = this.algorithm.epoll(this.context)
    this.alldone = false
  }
  isAllDone(){
    return this.alldone
  }
  getContext(){
    return this.context
  }
  getCurResult(){
    return this.algorithm.getCurResult(this.context)
  }
  next(){
    let {value, done} = this.epoll.next()
    if(done){
      let [alldone, nextContext] = value
      if(alldone){
        this.alldone = true
        return false
      }else{
        this.context = nextContext
        this.epoll = this.algorithm.epoll(nextContext)
        return this.next()
      }
    }else{
      this.lastvalue = value
      return value
    }
  }
  skip(){
    while(true){
      let {value, done} = this.epoll.next()
      if(done){
        let [alldone, nextContext] = value
        if(alldone){
          this.alldone = true
          return this.lastvalue
        }else{
          this.context = nextContext
          this.epoll = this.algorithm.epoll(nextContext)
          return this.lastvalue
        }
      }else{
        this.lastvalue = value
      }
    }

  }
}
export default AlgorithmWrapper
