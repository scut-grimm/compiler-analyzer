<template>
  <div>
    <el-button @click="next">下一步</el-button>
    <el-button @click="skip">跳过</el-button>
    <el-button @click="run">run</el-button>
  </div>
</template>
<script>
import FirstSet from "~/classes/algorithms/firstSet";
import Grammar from "~/classes/grammar";
import AlgorithmWrapper from "~/classes/algorithm-wrapper";
export default {
  data() {
    return {
      grammar: new Grammar(),
      epoch: "",
      firstSet: ""
    };
  },
  methods: {
    next() {
      let temp = this.epoch.next();
      console.log(temp);
    },
    skip() {
      console.log(this.epoch.getContext().symbolIndex);
      let temp = this.epoch.skip();
      console.log(temp.symbolIndex);
    },
    run() {
      this.firstSet.run();
    }
  },
  mounted() {
    let grammar = new Grammar();
    const E = grammar.getSign("E", "Nonterminal");
    const E1 = grammar.getSign("E'", "Nonterminal");
    const T = grammar.getSign("T", "Nonterminal");
    const T1 = grammar.getSign("T'", "Nonterminal");
    const F = grammar.getSign("F", "Nonterminal");
    const Plus = grammar.getSign("+", "Terminal");
    const Multi = grammar.getSign("*", "Terminal");
    const Id = grammar.getSign("id", "Terminal");
    const LeftClose = grammar.getSign("(", "Terminal");
    const RightClose = grammar.getSign(")", "Terminal");
    const Empty = grammar.getEmptySign();
    const End = grammar.getStackBottomSign();
    grammar.addProduction(E, [T, E1]);
    grammar.addProduction(E1, [Plus, T, E1]);
    grammar.addProduction(E1, [Empty]);
    grammar.addProduction(T, [F, T1]);
    grammar.addProduction(T1, [Multi, F, T1]);
    grammar.addProduction(T1, [Empty]);
    grammar.addProduction(F, [LeftClose, E, RightClose]);
    grammar.addProduction(F, [Id]);
    grammar.setStartSign(E);
    this.grammar = grammar;
    this.firstSet = new FirstSet(grammar);
    this.epoch = new AlgorithmWrapper(this.firstSet);
    this.epoch.init();

    console.log("Start symbol: " + this.grammar.getStartSign().getString());
    console.log("Productions");
    this.grammar.productions.forEach(e => {
      console.log(e.getHeadString() + "->" + e.getBodyString());
    });
    let nonterminals = "";
    this.grammar.getNonterminals().forEach(e => {
      nonterminals += e.getString() + " ";
    });
    console.log("Nonterminals: " + nonterminals);
    let terminals = "";
    this.grammar.getTerminals().forEach(e => {
      terminals += e.getString() + " ";
    });
    console.log("Terminals: " + terminals);
  }
};
</script>
<style>
</style>
