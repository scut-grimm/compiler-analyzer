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
    _productions=Array.of()
    _userDefineSymbols=Array.of()
    _startSymbol
    _userSymbols=new Set()
    _legalSymbols=preDefineSymbolSet
    _G=new Grammar()
    constructor(productions,userDefineSymbols){
        assert(productions.length,'前端传来的文法规则为空')
        this._productions=[...productions]
        this._userDefineSymbols=[...userDefineSymbols]
        this._genGrammar()
    }
    _preHandle(){

    }
    _genHeadAndBodys(production){
        let head
        const bodys=new Set()
        //先将产生式的体'|'处分割开，得到多个体
        //再将体中字符转换为 Sign 对象的实例
        //保证 head 和 bodys 用到的 sign 都是通过 this._G.getSign(Sign) 得到的
        //调用 this._G.getSign(Sign) 的同时，会将参数 Sign 添加到 this._G 的 signs 属性中 
        return {
            head: head,
            bodys: [...bodys],
        }
    }

    _genGrammarItems(productions){
        for(let production of productions){
            let {head, bodys}=this._genHeadAndBodys(production)
            for(let body of bodys){
                this._G.addGrammarItem(head,body)
            }
        }
    }

    _getSymbolsFormBody(body){
        const symbols=new Set()
        
        return [...symbols]
    }
    

    _genGrammar(){
        this._G.setStartSign(this._startSymbol)
        this._genGrammarItems()
    }

    getGrammar(){
        return this._G
    }

}

export default GenerateGrammarFromUserInput