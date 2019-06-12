<template>
  <div class="all">
    <div class="first">
      <div class="left">
        <HighlightProduction :productions="grammarProductions" title="当前文法"></HighlightProduction>
        <el-button @click="changeButton" class="button">{{buttonMessage}}</el-button>
      </div>
      <div class="right">
        <div class="top">
          <HighlightProduction :productions="immedationRecursionProductions" title="当前文法中的立即左递归"></HighlightProduction>
          <h3 v-if="!hasImmedationRecursionProduction">无</h3>
        </div>
        <div class="bottom">
          <HighlightProduction
            :disjointSet="indirectRecursionDisjointSet"
            :productions="indirectRecursionProductions"
            title="当前文法中的间接左递归"
          ></HighlightProduction>
          <h3 v-if="!hasIndirectRecursionProduction">无</h3>
        </div>
      </div>
    </div>
    <div class="second" v-show="second">
      <!-- <div class="tipes">
        <h3>形如A->ε的产生式称为ε产生式</h3>
      </div>-->
      <HighlightProduction :productions="EEGProductions" title="消除ε产生式"></HighlightProduction>
    </div>
    <div class="thrid" v-show="thrid">
      <!-- <div class="tipes">
        <h3>形如A(=>)*A的推导称为环</h3>
      </div>-->
      <HighlightProduction :productions="ECGProductions" title="消除环"></HighlightProduction>
    </div>
    <div class="fourth" v-show="fourth">
      <!-- <div class="tipes">
        <h3>在消除ε产生式和环的基础上消除左递归</h3>
      </div>-->
      <HighlightProduction :productions="ELRGProductions" title="消除左递归"></HighlightProduction>
    </div>
  </div>
</template>
<script>
import ELR from "~/classes/algorithms/eliminate-left-recursion";
import HighlightProduction from "~/components/highlight-production";
import Grammar from "~/classes/grammar";
import DisjointSet from "~/classes/disjoint-set";
import Production from "~/classes/production";
export default {
  layout: "grammar",
  components: {
    HighlightProduction
  },
  data() {
    return {
      grammar: new Grammar(),
      ELR: null,
      immedationRecursionProductions: null,
      hasImmedationRecursionProduction: false,
      indirectRecursionProductions: [],
      indirectRecursionDisjointSet: "",
      hasIndirectRecursionProduction: false,
      grammarProductions: null,
      EEGProductions: null,
      ECGProductions: null,
      ELRGProductions: null,
      buttonMessage: "消除ε产生式",
      second: false,
      thrid: false,
      fourth: false
    };
  },
  methods: {
    changeButton() {
      if (this.buttonMessage === "消除ε产生式") {
        this.buttonMessage = "消除环";
        this.second = true;
        return;
      }
      if (this.buttonMessage === "消除环") {
        this.buttonMessage = "消除左递归";
        this.thrid = true;
        return;
      }
      if (this.buttonMessage === "消除左递归") {
        this.buttonMessage = "完成";
        this.fourth = true;
        return;
      }
      if(this.buttonMessage === '完成'){
        this.$eventbus.$emit('FinishEliminateLeftRecursion')
        return
      }
    },
    setGrammar(grammar){
    this.grammar = grammar;
    this.ELR = new ELR(this.grammar);

    this.immedationRecursionProductions = this.ELR.immedationRecursion;
    this.grammarProductions = this.grammar.getProductions();
    this.EEGProductions = this.ELR.eliminatingEmptyGrammar.getProductions();
    this.ECGProductions = this.ELR.eliminatingCyclesGrammar.getProductions();
    this.ELRGProductions = this.ELR.eliminateLeftRecursionGrammar.getProductions();
    const disjointSet = new DisjointSet();
    for (const item of this.ELR.indirectRecursion) {
      const tempProduction0 = new Production(
        item[0].getHead(),
        item[0].getBody()
      );
      this.indirectRecursionProductions.push(tempProduction0);
      disjointSet.add(tempProduction0);
      for (let i = 1; i < item.length; i++) {
        const tempProduction = new Production(
          item[i].getHead(),
          item[i].getBody()
        );
        this.indirectRecursionProductions.push(tempProduction);
        disjointSet.disjoint(tempProduction0, tempProduction);
      }
    }
    this.indirectRecursionDisjointSet = disjointSet;
    if (this.immedationRecursionProductions.length > 0) {
      this.hasImmedationRecursionProduction = true;
    }
    if (this.indirectRecursionProductions.length > 0) {
      this.hasIndirectRecursionProduction = true;
    }
  },
  },
  // computed: {
  //   ELR() {
  //     return new ELR(this.grammar);
  //   },
  //   immedationRecursionProductions() {
  //     if (this.ELR.immedationRecursion.length !== 0) {
  //       this.hasImmedationRecursionProduction = true;
  //     }
  //     return this.ELR.immedationRecursion;
  //   },
  //   indirectRecursionProductions() {
  //     const disjointSet = new DisjointSet();
  //     const indirectRecursionProductions = [];
  //     for (const item of this.ELR.indirectRecursion) {
  //       const tempProduction0 = new Production(
  //         item[0].getHead(),
  //         item[0].getBody()
  //       );
  //       indirectRecursionProductions.push(tempProduction0);
  //       disjointSet.add(tempProduction0);
  //       for (let i = 1; i < item.length; i++) {
  //         const tempProduction = new Production(
  //           item[i].getHead(),
  //           item[i].getBody()
  //         );
  //         indirectRecursionProductions.push(tempProduction);
  //         disjointSet.disjoint(tempProduction0, tempProduction);
  //       }
  //     }
  //     this.indirectRecursionDisjointSet = disjointSet;
  //     if (indirectRecursionProductions.length !== 0) {
  //       this.hasIndirectRecursionProduction = true;
  //     }
  //     return indirectRecursionProductions;
  //   },
  //   indirectRecursionDisjointSet: {
  //     disjointSet: "",
  //     set: function(val) {
  //       disjointSet = val;
  //     },
  //     get: function() {
  //       return disjointSet;
  //     }
  //   },
  //   grammarProductions() {
  //     return this.grammar.getProductions();
  //   },
  //   EEGProductions() {
  //     this.ELR.eliminatingEmptyGrammar.getProductions();
  //   },
  //   ECGProductions() {
  //     this.ELR.eliminatingCyclesGrammar.getProductions();
  //   },
  //   ELRGProductions() {
  //     this.ELR.eliminateLeftRecursionGrammar.getProductions();
  //   }
  // },

  _test() {
    let grammar = new Grammar();
    const E = grammar.getSign("E", "Nonterminal");
    // const E1 = grammar.getSign("E'", "Nonterminal");
    const T = grammar.getSign("T", "Nonterminal");
    // const T1 = grammar.getSign("T'", "Nonterminal");
    const F = grammar.getSign("F", "Nonterminal");
    const Plus = grammar.getSign("+", "Terminal");
    const Multi = grammar.getSign("*", "Terminal");
    const Id = grammar.getSign("id", "Terminal");
    const LeftClose = grammar.getSign("(", "Terminal");
    const RightClose = grammar.getSign(")", "Terminal");
    const G = grammar.getSign("G", "Nonterminal");
    const Empty = grammar.getEmptySign();
    grammar.setStartSign(E);
    //@test只有立即左递归的文法
    grammar.addProduction(E, [T]);
    grammar.addProduction(E, [E, Plus, T]);
    grammar.addProduction(T, [F]);
    grammar.addProduction(T, [T, Multi, F]);
    grammar.addProduction(F, [LeftClose, E, RightClose]);
    grammar.addProduction(F, [Id]);
    //@test间接左递归文法
    // grammar.addProduction(E, [T, Plus]);
    // grammar.addProduction(E, [Multi]);
    // grammar.addProduction(T, [T, Plus]);
    // grammar.addProduction(T, [E, Multi]);
    // grammar.addProduction(T, [Empty]);
    //@test加间接左递归E=>T=>F=>E
    grammar.addProduction(F, [E]);
    //@test加间接左递归T=>F=>T
    // grammar.addProduction(F, [T]);
    //@test加间接左递归E=>T=>E
    // grammar.addProduction(T, [E]);
    //@test加包含ε的间接左递归T=>GE=>E G=>ε
    grammar.addProduction(T, [G, E]);
    grammar.addProduction(G, [Id]);
    grammar.addProduction(G, [Empty]);
    //@test加包含ε的间接左递归T=>GF=>E G=>ε
    // grammar.addProduction(T, [G, F]);
    // grammar.addProduction(G, [Empty]);
    // grammar.addProduction(F, [E]);
    //@test加包含ε的产生式T=>G G=>ε
    // grammar.addProduction(T, [G]);
    //@test加包含ε的间接左递归T=>GGGGE=>E G=>ε
    // grammar.addProduction(T, [G, G, G, G, E]);
    this.grammar = grammar;
    this.ELR = new ELR(this.grammar);

    this.immedationRecursionProductions = this.ELR.immedationRecursion;
    this.grammarProductions = this.grammar.getProductions();
    this.EEGProductions = this.ELR.eliminatingEmptyGrammar.getProductions();
    this.ECGProductions = this.ELR.eliminatingCyclesGrammar.getProductions();
    this.ELRGProductions = this.ELR.eliminateLeftRecursionGrammar.getProductions();
    const disjointSet = new DisjointSet();
    for (const item of this.ELR.indirectRecursion) {
      const tempProduction0 = new Production(
        item[0].getHead(),
        item[0].getBody()
      );
      this.indirectRecursionProductions.push(tempProduction0);
      disjointSet.add(tempProduction0);
      for (let i = 1; i < item.length; i++) {
        const tempProduction = new Production(
          item[i].getHead(),
          item[i].getBody()
        );
        this.indirectRecursionProductions.push(tempProduction);
        disjointSet.disjoint(tempProduction0, tempProduction);
      }
    }
    this.indirectRecursionDisjointSet = disjointSet;
    if (this.immedationRecursionProductions.length > 0) {
      this.hasImmedationRecursionProduction = true;
    }
    if (this.indirectRecursionProductions.length > 0) {
      this.hasIndirectRecursionProduction = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.all {
  display: flex;
  flex-direction: row;
  .first {
    flex: 1 1 auto;
    .left {
      .button {
      }
    }
    .right {
      .top {
        h3 {
          text-align: center;
        }
      }
      .bottom {
        text-align: center;
        h3 {
          text-align: center;
        }
      }
    }
  }
  .second {
    flex: 1 1 auto;
  }
  .thrid {
    flex: 1 1 auto;
  }
  .fourth {
    flex: 1 1 auto;
  }
}
</style>

