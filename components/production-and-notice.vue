<template>
  <div>
    <div v-for="production in productions" :key="production.production">
      <el-popover placement="right" width="200" trigger="click">
        <el-table :data="production.notice">
          <el-table-column width="150" property="notice" lable="notice"></el-table-column>
        </el-table>
        <el-button
          slot="reference"
          type="text"
          :class="{errorProduction:production.error}"
        >{{production.production}}</el-button>
      </el-popover>
    </div>
    <div v-if="productions.isLL1===true">当前文法属于LL(1)文法</div>
    <div v-else>当前文法不属于LL(1)文法</div>
  </div>
</template>
<script>
import IsLL1 from "~/classes/algorithms/is-ll1";
import Grammar from "~/classes/grammar";
import MapSet from "~/classes/map-set";
export default {
  data() {
    return {
      grammar: new Grammar()
    };
  },
  computed: {
    productions() {
      let judge = new IsLL1(this.grammar);
      for (let i of judge.productions) {
        let temp = Array.of();
        for (let j of i.notice) {
          temp.push({ notice: j });
        }
        i.notice = temp;
      }
      return judge.productions;
    }
  },
  created() {
    let grammar = new Grammar();
    const E = grammar.getSign("E", "Nonterminal");
    const E1 = grammar.getSign("E'", "Nonterminal");
    const T = grammar.getSign("T", "Nonterminal");
    const T1 = grammar.getSign("T'", "Nonterminal");
    const F = grammar.getSign("F", "Nonterminal");
    const G = grammar.getSign("G", "Nonterminal");
    const Plus = grammar.getSign("+", "Terminal");
    const Multi = grammar.getSign("*", "Terminal");
    const Id = grammar.getSign("id", "Terminal");
    const LeftClose = grammar.getSign("(", "Terminal");
    const RightClose = grammar.getSign(")", "Terminal");
    const Empty = grammar.getEmptySign();
    const End = grammar.getStackBottomSign();
    grammar.addProduction(E, [T, E1]);
    grammar.addProduction(E1, [Plus, T, E1, G]);
    grammar.addProduction(E1, [Empty]);
    grammar.addProduction(T, [F, T1]);
    grammar.addProduction(T1, [Multi, F, T1]);
    grammar.addProduction(T1, [Empty]);
    grammar.addProduction(F, [LeftClose, E, RightClose]);
    grammar.addProduction(F, [Id]);
    //@test 使得first(+TE')、first(+F)和first(E')相交不为空
    grammar.addProduction(E1, [Plus, F]);
    grammar.addProduction(E1, [E1]);
    const firstSet = new MapSet();
    const followSet = new MapSet();
    firstSet.add(E, LeftClose);
    firstSet.add(E, Id);
    firstSet.add(T, LeftClose);
    firstSet.add(T, Id);
    firstSet.add(F, LeftClose);
    firstSet.add(F, Id);
    firstSet.add(E1, Plus);
    firstSet.add(E1, Empty);
    firstSet.add(T1, Multi);
    firstSet.add(T1, Empty);
    followSet.add(E, RightClose);
    followSet.add(E, End);
    followSet.add(E1, RightClose);
    followSet.add(E1, End);
    //@test first(E')包含ε并且与follow(E')相交不为空
    // followSet.add(E1, Plus)
    followSet.add(T, Plus);
    followSet.add(T, RightClose);
    followSet.add(T, End);
    followSet.add(T1, Plus);
    followSet.add(T1, RightClose);
    followSet.add(T1, End);
    //@test first(T')包含ε并且与follow(T')相交不为空
    followSet.add(T1, Multi);
    followSet.add(F, Plus);
    followSet.add(F, Multi);
    followSet.add(F, RightClose);
    followSet.add(F, End);
    grammar.firstSet = firstSet;
    grammar.followSet = followSet;
    this.grammar = grammar;
  }
};
</script>
<style>
.errorProduction {
  color: red;
}
</style>

