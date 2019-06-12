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
    const G = grammar.getSign("G", "Nonterminal");
    const A = grammar.getSign("A", "Nonterminal");
    const B = grammar.getSign("B", "Nonterminal");
    const C = grammar.getSign("C", "Nonterminal");
    const D = grammar.getSign("D", "Nonterminal");
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
    // grammar.addProduction(F, [E]);
    //@test加间接左递归T=>F=>T
    // grammar.addProduction(F, [T]);
    //@test加间接左递归E=>T=>E
    // grammar.addProduction(T, [E]);
    //@test加包含ε的间接左递归T=>GE=>E G=>ε
    // grammar.addProduction(T, [G, E]);
    // grammar.addProduction(G, [Id]);
    // grammar.addProduction(G, [Empty]);
    //@test加包含ε的间接左递归T=>GF=>E G=>ε
    grammar.addProduction(T, [G, F]);
    grammar.addProduction(G, [Empty]);
    grammar.addProduction(F, [E]);
    //@test加包含ε的产生式T=>G G=>ε
    // grammar.addProduction(T, [G]);
    // @test加包含ε的间接左递归T=>GGGGE=>E G=>ε
    grammar.addProduction(T, [G, G, G, G, E]);
    {
      // @test加包含ε的间接左递归T=>ABCDE=>E A=>ε B=>ε C=>ε D=>ε
      grammar.addProduction(T, [A, B, C, D, E]);
      grammar.addProduction(A, [Empty]);
      grammar.addProduction(B, [Empty]);
      grammar.addProduction(C, [Empty]);
      grammar.addProduction(D, [Empty]);
      // @test加包含ε的间接左递归T=>ABCDE A=>ε B=>ε C=>E
      grammar.addProduction(C, [E]);
    }

    {
      console.log("用户输入的文法");
      const tempGrammar = grammar;
      console.log("Start symbol: " + tempGrammar.getStartSign().getString());
      console.log("Productions");
      tempGrammar.productions.forEach(e => {
        console.log(e.getHeadString() + "->" + e.getBodyString());
      });
      let Nonterminals = "";
      tempGrammar.getNonterminals().forEach(e => {
        Nonterminals += e.getString() + " ";
      });
      console.log("Nonterminals: " + Nonterminals);
      let Terminals = "";
      tempGrammar.getTerminals().forEach(e => {
        Terminals += e.getString() + " ";
      });
      console.log("Terminals: " + Terminals);
    }
    this.grammar = grammar;
    let {
      immedationRecursion,
      indirectRecursion,
      eliminatingEmptyGrammar,
      eliminatingCyclesGrammar,
      eliminateLeftRecursionGrammar
    } = new ELR(this.grammar);
    const productions = this.grammar.getProductions();
    console.log("Indirect left recursion");
    for (const i of indirectRecursion) {
      let tempString = "";
      for (const j of i) {
        tempString += j.getString() + ", ";
      }
      tempString = tempString.slice(0, -2);
      console.log(tempString);
    }
    console.log("Immedation left recursion");
    for (const i of immedationRecursion) {
      console.log(i.getString());
    }
    // {
    //   console.log("消除ε产生式后的文法");
    //   const tempGrammar = eliminatingEmptyGrammar;
    //   console.log("Start symbol: " + tempGrammar.getStartSign().getString());
    //   console.log("Productions");
    //   tempGrammar.productions.forEach(e => {
    //     console.log(e.getHeadString() + "->" + e.getBodyString());
    //   });
    //   let Nonterminals = "";
    //   tempGrammar.getNonterminals().forEach(e => {
    //     Nonterminals += e.getString() + " ";
    //   });
    //   console.log("Nonterminals: " + Nonterminals);
    //   let Terminals = "";
    //   tempGrammar.getTerminals().forEach(e => {
    //     Terminals += e.getString() + " ";
    //   });
    //   console.log("Terminals: " + Terminals);
    // }
    // {
    //   console.log("消除环后的文法");
    //   const tempGrammar = eliminatingCyclesGrammar;
    //   console.log("Start symbol: " + tempGrammar.getStartSign().getString());
    //   console.log("Productions");
    //   tempGrammar.productions.forEach(e => {
    //     console.log(e.getHeadString() + "->" + e.getBodyString());
    //   });
    //   let Nonterminals = "";
    //   tempGrammar.getNonterminals().forEach(e => {
    //     Nonterminals += e.getString() + " ";
    //   });
    //   console.log("Nonterminals: " + Nonterminals);
    //   let Terminals = "";
    //   tempGrammar.getTerminals().forEach(e => {
    //     Terminals += e.getString() + " ";
    //   });
    //   console.log("Terminals: " + Terminals);
    // }
    // {
    //   console.log("消除左递归后的文法");
    //   const tempGrammar = eliminateLeftRecursionGrammar;
    //   console.log("Start symbol: " + tempGrammar.getStartSign().getString());
    //   console.log("Productions");
    //   tempGrammar.productions.forEach(e => {
    //     console.log(e.getHeadString() + "->" + e.getBodyString());
    //   });
    //   let Nonterminals = "";
    //   tempGrammar.getNonterminals().forEach(e => {
    //     Nonterminals += e.getString() + " ";
    //   });
    //   console.log("Nonterminals: " + Nonterminals);
    //   let Terminals = "";
    //   tempGrammar.getTerminals().forEach(e => {
    //     Terminals += e.getString() + " ";
    //   });
    //   console.log("Terminals: " + Terminals);
    // }
  }
};
</script>
<style lang="scss" scoped>
</style>
