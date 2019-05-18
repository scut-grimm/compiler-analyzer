/* eslint-disable no-unused-vars */
/* eslint-disable no-constant-condition */

import MapSet from '../map-set'

class Follow {
  constructor(grammar) {
    this.gram = grammar
    this.pro = this.gram.getProductions()
    this.followSet = new MapSet()
  }
  putStart(s) {
    if (s === this.gram.getStartSign()) { this.followSet.add(s, this.gram.getSign('$')) }
  }

  putFirst(s, prod) {
    const body = prod.getBody()
    for (var i = 0; i < body.length; ++i) {
      if (body[i] === s && (i + 1) < body.length) {
        var tempS = this.gram.getSignFirstSet(body[i + 1])
        for (let j = 0; j < tempS.length; ++j) {
          if (tempS[j].symbol !== 'ε') { this.followSet.add(s, tempS[j]) }
          // }
          // }
        }
        break
      }
    }
  }

  putFollow(s, prod) {
    var head = prod.getHead()
    var body = prod.getBody()
    var nonter = this.gram.getNonterminals()
    var ter = this.gram.getTerminals()
    const tempS = this.gram.getSignFollowSet(head)
    for (var i = body.length - 1, a = 0; i >= 0; --i, ++a) {
      if (body[i] === s) {
        var t = a
        let bool = false
        while (t) {
          var temp = this.gram.getSignFirstSet(body[i + t])
          for (let i = 0; i < temp.length; ++i) {
            if (temp[i].symbol === 'ε') { bool = true }
          }
          if (!bool) { break } else { --t }
        }
        if (t === 0) {
          for (let j = 0; j < tempS.length; ++j) { this.followSet.add(s, tempS[j]) }
          break
        }
      }
    }
  }

  caculFollow() {
    this.followSet = this.gram.followSet
    var nonter = this.gram.getNonterminals()
    var count = 0
    while (true) {
      var finish = 0
      for (var i = 0; i < nonter.length; ++i) {
        if (count) { var size = this.followSet.get(nonter[i]).size }
        this.putStart(nonter[i])
        for (let j = 0; j < this.pro.length; ++j) {
          var pN = this.pro[j].getNonterminals()
          for (let k = 0; k < pN.length; ++k) {
            if (pN[k] === nonter[i]) {
              this.putFirst(nonter[i], this.pro[j])
              this.putFollow(nonter[i], this.pro[j])
              break
            }
          }
        }
        if (count) {
          if (size === this.followSet.get(nonter[i]).size) { ++finish }
        }
      }
      ++count
      if (finish === nonter.length) { break }
    }
    // console.log(count)
    return this.followSet
  }
}
export default Follow
