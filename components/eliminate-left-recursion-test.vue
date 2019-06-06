<template></template>
<script>
import ELR from "~/classes/algorithms/eliminate-left-recursion";
import Grammar from "~/classes/grammar";
export default {
  data() {
    return {
      grammar: null
    };
  },
  mounted() {
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
    const Empty = grammar.getEmptySign();
    grammar.addProduction(E, [T]);
    grammar.addProduction(E, [E, Plus, T]);
    grammar.addProduction(T, [F]);
    grammar.addProduction(T, [T, Multi, F]);
    grammar.addProduction(F, [LeftClose, E, RightClose]);
    grammar.addProduction(F, [Id]);
    grammar.setStartSign(E);
    //@test加间接左递归E=>T=>F=>E
    grammar.addProduction(F, [E]);
    //@test加间接左递归T=>F=>T
    grammar.addProduction(F, [T]);
    //@test加间接左递归E=>T=>E
    // grammar.addProduction(T, [E]);
    this.grammar = grammar;

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

    let { immedationRecursion, indirectRecursion } = new ELR(this.grammar);
    console.log(immedationRecursion);
    console.log(indirectRecursion);
  }
};
</script>
<style lang="scss" scoped>
</style>
