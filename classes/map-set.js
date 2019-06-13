import assert from 'assert'
class MapSet {
  constructor() {
    this.map = new Map()
    this.dirty = false
  }
  get(key) {
    if(this.map.has(key) === false){
      console.log(key)
      console.log(this)
      debugger;
    }

    assert.strictEqual(this.map.has(key), true)
    return this.map.get(key)
  }
  add(key, value) {
    if (!this.map.has(key)) {
      this.map.set(key, new Set())
    }
    if(!this.map.get(key).has(value)){
      this.map.get(key).add(value)
      this.setDirty()
    }
  }
  has(key) {
    return this.map.has(key)
  }
  setDirty(){
    this.dirty = true
  }
  clearDirty(){
    this.dirty = false
  }
  isDirty(){
    return this.dirty
  }
  print(){
    for(let key of this.map.keys()){
      console.log(key.getString(), '->', [...this.map.get(key)].map(e => e.getString()).join(' '))
    }
  }
  clone(){
    let other = new MapSet()
    for(let key of this.map.keys()){
      for(let value of this.get(key)){
        other.add(key, value)
      }
    }
    return other
  }
}
export default MapSet
