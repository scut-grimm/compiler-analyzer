import assert from 'assert'
class DisjointSet{
  constructor(){
    this.cnt = 0
    this.map = new Map()
  }
  add(obj){
    if(!this.map.has(obj)){
      this.map.set(obj, this.cnt++)
    }
    return this.map.get(obj)
  }
  get(obj){
    assert.strictEqual(this.map.has(obj), true, 'should add before')
    return this.map.get(obj)
  }
  changeId(oldId, newId){
    for(let key of this.map.keys()){
      if(this.map.get(key) === oldId){
        this.map.set(key, newId)
      }
    }
  }
  reSetId(){
    let oldIds = new Set([...this.map.keys()].map(e => this.map.get(e)))
    let tmpCnt = 0
    for(let oldId of oldIds){
      this.changeId(oldId, tmpCnt++)
    }
    this.cnt = tmpCnt
  }
  disjoint(obj1, obj2){
    if(this.map.has(obj1) && this.map.has(obj2)){
      let id = this.get(obj1)
      let toCorrectId = this.get(obj2)
      this.changeId(toCorrectId, id)
      return id
    }
    if(this.map.has(obj1)){
      this.map.set(obj2, this.get(obj1))
      return this.get(obj1)
    }
    if(this.map.has(obj2)){
      this.map.set(obj1, this.get(obj2))
      return this.get(obj2)
    }
    {
      let id = this.add(obj1)
      this.map.set(obj2, id)
      return id
    }
  }
  del(obj){
    this.map.delete(obj)
  }
  print(){
    let tmp = [...this.map.keys()].sort((a,b) => {
      return this.map.get(a) - this.map.get(b)
    })
    for(let key of tmp){
      console.log(key.getString(), this.map.get(key))
    }
  }

}
export default DisjointSet
