<template>

</template>

<script>
import GenerateGrammarFromUserInput from '~/classes/algorithms/generate-grammar-from-user-input'
import Sign from '~/classes/sign'
export default {
    mounted(){
        let userDefineSigns
        let productions
        let alpha=new Sign('α','Terminal')
        let beta=new Sign('β','Terminal')
        let add=new Sign('+','Terminal')
        let multiply=new Sign('*','Terminal')
        let a=new Sign('a','Terminal')
        let empty=new Sign('ε','Terminal')
        let i=new Sign('i','Terminal')
        let d=new Sign('d','Terminal')
        let id=new Sign('id','Terminal')
        let E=new Sign('E','Nonterminal')
        let T=new Sign('T','Nonterminal')
        let A=new Sign('A','Nonterminal')
        let F=new Sign('F','Nonterminal')
        let B=new Sign('B','Nonterminal')
        let pd1
        let pd2
        let pd3
        let pd4
        let pd5
        let body11=Array.of()
        let body21=Array.of()
        let body22=Array.of()
        let body31=Array.of()
        let body41=Array.of()
        let body42=Array.of()
        let body51=Array.of()
        let body52=Array.of()
        let body53=Array.of()
        let body54=Array.of()

        body11.push(T)
        body11.push(A)
        pd1=[E,body11]
        body21.push(add)
        body21.push(T)
        body21.push(A)
        body22.push(empty)
        pd2=[A,body21,body22]
        body31.push(F)
        body31.push(B)
        pd3=[T,body31]
        body41.push(multiply)
        body41.push(F)
        body41.push(B)
        body42.push(empty)
        pd4=[B,body41,body42]
        body51.push(beta)
        body51.push(E)
        body51.push(alpha)
        body52.push(a)
        body53.push(E)
        body53.push(i)
        body53.push(d)
        body54.push(A)
        body54.push(id)
        pd5=[F,body51,body52,body53,body54]

        productions=[pd1,pd2,pd3,pd4,pd5]
        userDefineSigns=[alpha,beta]

        //测试用例1
        let G1=new GenerateGrammarFromUserInput(productions,userDefineSigns)
        console.log('Start symbol: ' + G1.getStartSign().getString())
        console.log('Productions')
        G1.productions.forEach(e=>{
            console.log(e.getHeadString()+'->'+e.getBodyString())
        })
        let nonterminals1=''
        G1.getNonterminals().forEach(e=>{
            nonterminals1+=e.getString()+' '
        })
        console.log('Nonterminals: '+nonterminals1)
        let terminals1=''
        G1.getTerminals().forEach(e=>{
            terminals1+=e.getString()+' '
        })
        console.log('Terminals: '+terminals1)
        //测试用例2
        let G2=new GenerateGrammarFromUserInput(productions,userDefineSigns,F)
        console.log('Start symbol: ' + G2.getStartSign().getString())
        console.log('Productions')
        G2.productions.forEach(e=>{
            console.log(e.getHeadString()+'->'+e.getBodyString())
        })
        let nonterminals2=''
        G2.getNonterminals().forEach(e=>{
            nonterminals2+=e.getString()+' '
        })
        console.log('Nonterminals: '+nonterminals2)
        let terminals2=''
        G2.getTerminals().forEach(e=>{
            terminals2+=e.getString()+' '
        })
        console.log('Terminals: '+terminals2)
    }
}
</script>

<style>

</style>
