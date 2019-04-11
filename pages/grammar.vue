<template>
<div class="grammar">
  <div class="left">
    <GrammarIndicator style="width: 200px;" :grammar="grammar" :active="active" @changeGrammarItem="onChagneGrammarItem"></GrammarIndicator>
  </div>
  <div class="center">
    <div class="up">
      <template v-if="curGrammarItem!==null">
        <span>First({{curGrammarItem.rightSigns.map(e => e.getStr()).join('')}})</span>
        <div class="set-div">
          <span v-for="(sign,index) in curFirstSet" :key="index" :class="{'active': sign.isTerminal()}">{{sign.getStr()}}</span>
        </div>
      </template>
    </div>
    <div class="down">
      <template v-if="curGrammarItem!==null">
        <span>Follow({{curGrammarItem.leftSign.getStr()}})</span>
        <div class="set-div">
          <span v-for="(sign,index) in curFollowSet" :key="index" :class="{'active': sign.isTerminal()}">{{sign.getStr()}}</span>
        </div>
      </template>
    </div>
  </div>
  <div class="right">
    <el-table
    :data="tableData"
    style="width: 100%">
    <el-table-column
      label="Non Terminal"
      width="150">
      <template slot-scope="scope">
        <span>{{scope.row.nonterminal}}</span>
      </template>
    </el-table-column>
    <el-table-column label="Input Symbol">
      <el-table-column
        v-for="(terminal,index) in tableTerminals"
        :key="index"
        :label="terminal"
        width="120">
        <template slot-scope="scope">
          <span>{{scope.row[terminal]}}</span>
        </template>
      </el-table-column>
    </el-table-column>
  </el-table>
  <el-button @click="next">next</el-button>
  </div>

</div>
</template>

<script>
import GrammarIndicator from '~/components/grammar-indicator'
import PredictiveParsingTable from '~/classes/predictive-parsing-table'
import Grammar from '~/classes/grammar'
import MapSet from '~/classes/map-set'
export default {
  layout: 'grammar',
  components: {
    GrammarIndicator
  },
  data(){
    const PPT = new PredictiveParsingTable()
    return {
      grammar: new Grammar(),
      active: 0,
      PPT,
      PPTData: PPT.getTableData()
    }
  },
  methods:{
    onChagneGrammarItem(index){
      this.active=index
    },
    next(){
      let curFirstSet = new Set(this.curFirstSet)
      let curFollowSet = new Set(this.curFollowSet)
      const Empty = this.grammar.getSign('ε','Terminal')
      const End = this.grammar.getSign('$','Terminal')
      for(let symbol of curFirstSet){
        this.PPT.set(this.curGrammarItem.leftSign, symbol, this.curGrammarItem)
      }
      if(curFirstSet.has(Empty)){
        this.curFollowSet.filter(e => e.isTerminal()).forEach(e => {
          this.PPT.set(this.curGrammarItem.leftSign, e, this.curGrammarItem)
        })
        if(curFollowSet.has(End)){
          this.PPT.set(this.curGrammarItem.leftSign, End, this.curGrammarItem)
        }
      }

      this.active++
      this.PPTData = this.PPT.getTableData()
    }
  },
  computed:{
    curGrammarItem(){
      const grammars = this.grammar.getGrammarItems()
      if(grammars.length > this.active){
        return grammars[this.active]
      }else{
        return null
      }
    },
    curFirstSet(){
      let grammar = this.curGrammarItem
      if(grammar === null){
        return []
      }
      return this.grammar.getGrammarItemRightFirstSet(grammar)
    },
    curFollowSet(){
      let grammar = this.curGrammarItem
      if(grammar === null){
        return []
      }
      return this.grammar.getSignFollowSet(grammar.leftSign)
    },
    tableTerminals(){
      const {nonterminals, terminals, table} = this.PPTData
      return terminals.filter(e => !e.isEmpty()).map(e => e.getStr())
    },
    tableData(){
      const {nonterminals, terminals, table} = this.PPTData
      let ret = []
      let i=0
      for(let nonterminal of nonterminals){
        let tmp = {
          nonterminal: nonterminal.getStr()
        }
        for(let j in table[i]){
          let terminal = terminals[j]
          if(table[i][j] === null){
            tmp[terminal.getStr()] = ''
          }else{
            tmp[terminal.getStr()] = table[i][j].getStr()
          }
        }
        ret.push(tmp)
        i++
      }
      return ret
    }
  },
  mounted() {
    const grammar = this.grammar
    const E = grammar.getSign('E', 'Nonterminal')
    const E1 = grammar.getSign('E\'', 'Nonterminal')
    const T = grammar.getSign('T', 'Nonterminal')
    const T1 = grammar.getSign('T\'', 'Nonterminal')
    const F = grammar.getSign('F', 'Nonterminal')
    const Plus = grammar.getSign('+', 'Terminal')
    const Multi = grammar.getSign('*', 'Terminal')
    const Id = grammar.getSign('id', 'Terminal')
    const LeftClose = grammar.getSign('(', 'Terminal')
    const RightClose = grammar.getSign(')', 'Terminal')
    const Empty = grammar.getSign('ε', 'Terminal')
    const End = grammar.getSign('$', 'Terminal')
    grammar.addGrammarItem(E, [T, E1])
    grammar.addGrammarItem(E1, [Plus, T, E1])
    grammar.addGrammarItem(E1, [Empty])
    grammar.addGrammarItem(T, [F, T1])
    grammar.addGrammarItem(T1, [Multi, F, T1])
    grammar.addGrammarItem(T1, [Empty])
    grammar.addGrammarItem(F, [LeftClose, E, RightClose])
    grammar.addGrammarItem(F, [Id])

    const firstSet = new MapSet()
    const followSet = new MapSet()
    firstSet.add(E, LeftClose)
    firstSet.add(E, Id)

    firstSet.add(T, LeftClose)
    firstSet.add(T, Id)

    firstSet.add(F, LeftClose)
    firstSet.add(F, Id)

    firstSet.add(E1, Plus)
    firstSet.add(E1, Empty)

    firstSet.add(T1, Multi)
    firstSet.add(T1, Empty)

    followSet.add(E, RightClose)
    followSet.add(E, End)

    followSet.add(E1, RightClose)
    followSet.add(E1, End)

    followSet.add(T, Plus)
    followSet.add(T, RightClose)
    followSet.add(T, End)

    followSet.add(T1, Plus)
    followSet.add(T1, RightClose)
    followSet.add(T1, End)

    followSet.add(F, Plus)
    followSet.add(F, Multi)
    followSet.add(F, RightClose)
    followSet.add(F, End)


    grammar.firstSet = firstSet
    grammar.followSet = followSet

    grammar.getNonterminals().forEach(e => {
      console.log('First(' + e.getStr() +'): {', grammar.getSignFirstSet(e).map(e => e.getStr()).join(','),'}')
      console.log('Follow(' + e.getStr() +'): {', grammar.getSignFollowSet(e).map(e => e.getStr()).join(','),'}')
    })
  }
}
</script>
<style lang="scss" scoped>
.grammar{
  display: flex;
  margin-top: 30px;
  height: 100%;
  .left{
    width:200px;
  }
  .center {
    width: 200px;
    height: 100%;
    .up{
      height: 50%;
    }
    .down{
      height: 50%;
    }
  }
  .right{
    flex-grow: 1;
  }
  .set-div{
    font-size: 22px;
    span{
      margin: 2px;
      padding: 2px;
    }
    .active{
      background-color: burlywood;
    }
  }
}
</style>
