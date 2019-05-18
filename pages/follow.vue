<template>
  <div></div>
</template>

<script>
import Grammar from "../classes/grammar";
import MapSet from "../classes/map-set";
import Follow from "../classes/algorithms/follow";

export default {
  name: "follow",
  data() {
    //const PPT = new PredictiveParsingTable()
    return {
      grammar: new Grammar(),
      firstSet: new MapSet()
    };
  },

  mounted() {
    const grammar = this.grammar;

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
    const Empty = grammar.getSign("ε", "Terminal");
    const End = grammar.getSign("$", "Terminal");
    grammar.addProduction(E, [T, E1]);
    grammar.addProduction(E1, [Plus, T, E1]);
    grammar.addProduction(E1, [Empty]);
    grammar.addProduction(T, [F, T1]);
    grammar.addProduction(T1, [Multi, F, T1]);
    grammar.addProduction(T1, [Empty]);
    grammar.addProduction(F, [LeftClose, E, RightClose]);
    grammar.addProduction(F, [Id]);

    const firstSet = this.firstSet;
    let followSet = new MapSet();

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

    //followSet.add(E, RightClose)
    //followSet.add(E, End)
    /*
      const firstSet = this.firstSet
      const S = grammar.getSign('S', 'Nonterminal')
      const A = grammar.getSign('A', 'Nonterminal')
      const B = grammar.getSign('B', 'Nonterminal')
      const C = grammar.getSign('C', 'Nonterminal')
      const D = grammar.getSign('D', 'Nonterminal')
      const a = grammar.getSign('a', 'Terminal')
      const b = grammar.getSign('b', 'Terminal')
      const c = grammar.getSign('c', 'Terminal')
      const Empty = grammar.getSign('ε', 'Terminal')
      const End = grammar.getSign('$', 'Terminal')
      grammar.addProduction(S, [A, B])
      grammar.addProduction(S, [b, C])
      grammar.addProduction(A, [b])
      grammar.addProduction(A, [Empty])
      grammar.addProduction(B, [a, D])
      grammar.addProduction(B, [Empty])
      grammar.addProduction(C, [A, D])
      grammar.addProduction(C, [b])
      grammar.addProduction(D, [a, S])
      grammar.addProduction(D, [c])
      firstSet.add(S, a)
      firstSet.add(S, b)
      firstSet.add(S, Empty)

      firstSet.add(A, b)
      firstSet.add(A, Empty)

      firstSet.add(B, a)
      firstSet.add(B, Empty)

      firstSet.add(C, a)
      firstSet.add(C, b)
      firstSet.add(C, c)

      firstSet.add(D, a)
      firstSet.add(D, c)
      */

    grammar.firstSet = firstSet;
    grammar.startSign = E;

    let f = new Follow(grammar);
    //console.log(grammar.getProductions()[0].getBodyString())
    //console.log(grammar.getDerivations(E1)[1].getBodyString())

    //console.log(followSet)
    //grammar.followSet = followSet

    //a.putNo()
    grammar.followSet = f.caculFollow();
    //a.putFollow(T,grammar.getProductions()[0])
    //const gram = new Grammar(this.grammar, this.firstSet);
    //console.log(grammar.getProductions()[0])
    //console.log(followSet)
    grammar.getNonterminals().forEach(e => {
      //console.log('First(' + e.getString() +'): {',grammar.getSignFirstSet(e).map(e => e.getString()).join(','),'}')
      console.log(
        "Follow(" + e.getString() + "): {",
        grammar
          .getSignFollowSet(e)
          .map(e => e.getString())
          .join(","),
        "}"
      );
    });
  }
};
</script>
<style scoped>
</style>
