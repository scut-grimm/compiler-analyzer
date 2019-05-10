<template>
    
</template>
<script>
import IsLL1 from '~/classes/algorithms/is-LL1'
import Grammar from '~/classes/grammar'
import MapSet from '~/classes/map-set'
export default {
    mounted(){
        let grammar=new Grammar()
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
        grammar.addProduction(E, [T, E1])
        grammar.addProduction(E1, [Plus, T, E1])
        grammar.addProduction(E1, [Empty])
        grammar.addProduction(T, [F, T1])
        grammar.addProduction(T1, [Multi, F, T1])
        grammar.addProduction(T1, [Empty])
        grammar.addProduction(F, [LeftClose, E, RightClose])
        grammar.addProduction(F, [Id])

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
    }
}
</script>
<style>

</style>

