import assert from 'assert'
class MapSet{
  constructor(){
    this.map = new Map()
  }
  get(key){
    assert.strictEqual(this.map.has(key),true)
    return this.map.get(key)
  }
  add(key, value){
    if(!this.map.has(key)){
      this.map.set(key, new Set())
    }
    this.map.get(key).add(value)
  }
  has(key){
    return this.map.has(key)
  }
}
export default MapSet
