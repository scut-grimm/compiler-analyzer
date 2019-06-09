<template>
  <div class="elf">
    <div class="main">
      <HightlightProduction :disjointSet="disjointSet" :productions="leftProductions"></HightlightProduction>
      <HightlightProduction :disjointSet="disjointSet" :productions="rightProductions"></HightlightProduction>
    </div>

  </div>
</template>
<script>
import Grammar from "~/classes/grammar";
import ExtractLeftFactor from "~/classes/algorithms/extract-left-factor";
import HightlightProduction from '~/components/highlight-production'
export default {
  layout: "grammar",
  components: {
    HightlightProduction
  },
  data(){
    return {
      grammar: null,
      disjointSet: '',
      leftProductions: [],
      rightProductions: []
    }
  },
  mounted(){
    let grammar = new Grammar();
    const A = grammar.getSign("A", "Nonterminal");
    const B = grammar.getSign("B", "Nonterminal");
    const C = grammar.getSign("C", "Nonterminal");
    const D = grammar.getSign("D", "Nonterminal");
    const E = grammar.getSign("E", "Nonterminal");

    const Plus = grammar.getSign("+", "Terminal");
    const Multi = grammar.getSign("*", "Terminal");
    const Id = grammar.getSign("id", "Terminal");
    const LeftClose = grammar.getSign("(", "Terminal");
    const RightClose = grammar.getSign(")", "Terminal");
    const a = grammar.getSign("a", "Terminal");
    const b = grammar.getSign("b", "Terminal");
    const c = grammar.getSign("c", "Terminal");
    const d = grammar.getSign("d", "Terminal");
    const e = grammar.getSign("e", "Terminal");

    grammar.addProduction(D, [A, Plus, B, Plus, C]);
    grammar.addProduction(A, [a, b, c]);
    grammar.addProduction(A, [a, b, d]);
    grammar.addProduction(A, [a, b, e]);
    grammar.addProduction(A, [a, c]);
    grammar.addProduction(A, [a, a]);
    grammar.addProduction(A, [b, a]);
    grammar.addProduction(A, [b, c]);

    grammar.addProduction(B, [b, b]);
    grammar.addProduction(B, [b, c, d]);
    grammar.addProduction(B, [b, c, b, d]);

    grammar.addProduction(C, [c ,a, b, a, c, c, c]);
    grammar.addProduction(C, [c, a, b, a, d, d, d]);
    grammar.addProduction(C, [c, a, b, a, e, d, d]);
    grammar.setStartSign(D);
    grammar.printProductions()
    let elf = new ExtractLeftFactor(grammar)
    let {newGrammar,disjointSet} = elf.run()
    console.log(newGrammar)
    newGrammar.printProductions()
    this.disjointSet = disjointSet
    this.leftProductions = grammar.getProductions()
    this.rightProductions = newGrammar.getProductions()
  }
};
</script>
<style lang="scss" scoped>
.elf{
  .main{
    display: flex;

  }
}
</style>


