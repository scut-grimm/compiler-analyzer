import Sign from '../sign'
import assert from 'assert'
import Grammar from '../grammar'
const preDefineSymbolSet=new Set([
    new Sign('(','Terminal'),
    new Sign(')','Terminal'),
    new Sign('+','Terminal'),
    new Sign('-','Terminal'),
    new Sign('*','Terminal'),
    new Sign('\\','Terminal'),
    new Sign('a','Terminal'),
    new Sign('b','Terminal'),
    new Sign('c','Terminal'),
    new Sign('d','Terminal'),
    new Sign('e','Terminal'),
    new Sign('f','Terminal'),
    new Sign('g','Terminal'),
    new Sign('h','Terminal'),
    new Sign('i','Terminal'),
    new Sign('j','Terminal'),
    new Sign('k','Terminal'),
    new Sign('l','Terminal'),
    new Sign('m','Terminal'),
    new Sign('n','Terminal'),
    new Sign('o','Terminal'),
    new Sign('p','Terminal'),
    new Sign('q','Terminal'),
    new Sign('r','Terminal'),
    new Sign('s','Terminal'),
    new Sign('t','Terminal'),
    new Sign('u','Terminal'),
    new Sign('v','Terminal'),
    new Sign('w','Terminal'),
    new Sign('x','Terminal'),
    new Sign('y','Terminal'),
    new Sign('z','Terminal'),
    new Sign('0','Terminal'),
    new Sign('1','Terminal'),
    new Sign('2','Terminal'),
    new Sign('3','Terminal'),
    new Sign('4','Terminal'),
    new Sign('5','Terminal'),
    new Sign('6','Terminal'),
    new Sign('7','Terminal'),
    new Sign('8','Terminal'),
    new Sign('9','Terminal'),
    new Sign('ε','Terminal'),
    new Sign('A','Nonterminal'),
    new Sign('B','Nonterminal'),
    new Sign('C','Nonterminal'),
    new Sign('D','Nonterminal'),
    new Sign('E','Nonterminal'),
    new Sign('F','Nonterminal'),
    new Sign('G','Nonterminal'),
    new Sign('H','Nonterminal'),
    new Sign('I','Nonterminal'),
    new Sign('J','Nonterminal'),
    new Sign('K','Nonterminal'),
    new Sign('L','Nonterminal'),
    new Sign('M','Nonterminal'),
    new Sign('N','Nonterminal'),
    new Sign('O','Nonterminal'),
    new Sign('P','Nonterminal'),
    new Sign('Q','Nonterminal'),
    new Sign('R','Nonterminal'),
    new Sign('S','Nonterminal'),
    new Sign('T','Nonterminal'),
    new Sign('U','Nonterminal'),
    new Sign('V','Nonterminal'),
    new Sign('W','Nonterminal'),
    new Sign('X','Nonterminal'),
    new Sign('Y','Nonterminal'),
    new Sign('Z','Nonterminal')    
])
class GenerateGrammarFromUserInput{
    productions=Array.of()
    userDefineSymbols=Array.of()
    startSymbol
    G=new Grammar()
    
    constructor(productions,userDefineSymbols,startSymbol){
        assert(productions.length,'前端传来的文法规则为空')
        this.productions=[...productions]
        this.userDefineSymbols=[...userDefineSymbols]
        if(startSymbol==undefined){
            let start=this.G.getSign(this.productions[0][0])
            this.startSymbol=start
        }
        else{
            this.startSymbol=this.G.getSign(startSymbol)
        }
        this.setGrammar()
    }

    setGrammar(){
        this.setSigns()  //设置文法符号
        this.setProductions()  //设置产生式
        this.setStartSign()  //设置文法开始符号，默认是第一条产生式的头部
    }

    setSigns(){
        for(let i of this.userDefineSymbols){
            this.G.getSign(i)
        }
    }

    setStartSign(){
        this.G.setStartSign(this.startSymbol)
    }

    setProductions(){
        let head  //保证head通过this.G.getSign()得到
        for(let i=0; i<this.productions.length;i++){
            head=this.G.getSign(this.productions[i][0])
            for(let j=1;j<this.productions[i].length;j++){
                let body=Array.of()  //保证body中的每一项都通过this.G.getSign()得到
                for(let k=0;k<this.productions[i][j].length;k++){
                    body.push(this.G.getSign(this.productions[i][j][k]))
                }
                this.G.addProduction(head,body)
            }
        }
    }

    getGrammar(){
        return this.G
    }
}

export default function(productions,userDefineSymbols,startSign){
    let G=new GenerateGrammarFromUserInput(productions,userDefineSymbols,startSign)
    return G.getGrammar()
}
