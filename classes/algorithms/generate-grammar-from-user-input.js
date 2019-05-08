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
    userSymbols=new Set()
    legalSymbols=preDefineSymbolSet
    G=new Grammar()
    
    constructor(productions,userDefineSymbols){
        assert(productions.length,'前端传来的文法规则为空')
        this.productions=[...productions]
        this.userDefineSymbols=[...userDefineSymbols]
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
        for(let i of preDefineSymbolSet){
            this.G.getSign(i)
        }
    }

    setStartSign(){
        this.G.setStartSign(this.startSymbol)
    }

    setProductions(){
        for(let i=0; i<this.productions.length;i++){
            //对第一条产生式特殊处理，将产生式的头部作为文法的开始符号
            if(i==0){
                let {head,bodys}=this.genHeadAndBodys(this.productions[i])
                this.startSymbol=this.G.getSign(head)
                for(let body of bodys){
                    this.G.addProduction(head,body)
                }
            }
            let {head, bodys}=this.genHeadAndBodys(this.productions[i])
            for(let body of bodys){
                this.G.addProduction(head,body)
            }
        }
    }

    genHeadAndBodys(production){
        let head
        const bodys=new Set()
        //保证 head 和 bodys 用到的 sign 都是通过 this.G.getSign(Sign) 得到的
        production=production.replace(/\s+/g,'')  //去除产生式中的空格
        items=production.split(/->|\|/)  //将产生式按照 -> 和 | 分开 
        head=this.G.getSign(items[0])  //items 数组的第一个元素是产生式的头部
        for(let i=1;i<items.length;i++){
            bodys.add(stringToSigns(items[i]));
        }
        return {
            head: head,
            bodys: [...bodys],
        }
    }

    stringToSigns(string){
        string=string.split('')
        const signs=Array.of()
        for(let i of string){
            signs.push(this.G.getSign(i))
        }
        return signs
    }

    getGrammar(){
        return this.G
    }
}

export default GenerateGrammarFromUserInput