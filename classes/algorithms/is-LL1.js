import assert from 'assert'
class IsLL1{
    errorProductions=Array.of()
    constructor(grammar){
        this.grammar=grammar
    }

    getInitContext(){
        return null
    }
    
    isLL1(){
        let nonterminals=this.grammar.getNonterminals() 
        assert(nonterminals.length,'文法没有非终止符号') 
        for(let item of nonterminals){
            let nonFirstSet=this.grammar.getSignFirstSet(item)
            assert(nonFirstSet.length,`First(${item.symbol})为空`)
            let nonFollowSet=this.grammar.getSignFollowSet(item)
            assert(nonFollowSet.length,`Follow(${item.symbol})为空`)
            let intersection=new Set([...nonFirstSet,...nonFollowSet])
            if(!(nonFirstSet.includes('ε')&&intersection.length!=0)){
                let productions=this.grammar.getDerivations(item)
                let bodyFirstSets=productions.map(x=>this.grammar.getProductionBodyFirstSet(x))
                let flatBodyFirstSet=bodyFirstSets.flat()  //将产生式体的First集合的所有元素放在一个数组中
                let duplexItems=this.duplexItem(flatBodyFirstSet.map(x=>x.getString()))
                if(duplexItems.length!=0){
                    let noticeArr=Array.of()
                    for(let dItem of duplexItems){
                        let index=new Set()
                        for(let i=0;i<productions.length;++i){
                            let bodyFirstSetSymbols=bodyFirstSets[i].map(x=>x.getString())
                            if(bodyFirstSetSymbols.includes(dItem)){
                                index.add(i)
                            }
                        }
                        noticeArr.push(`${this.genErrorNotice(productions,index)}相交不为空`)
                    }
                    let errorProduction={
                        production: item,
                        notice: noticeArr,
                    }
                    this.errorProductions.push(errorProduction)
                }
            }
            else{
                let noticeArr=Array.of(`First(${item.symbol}) 中存在 ε 且 First(${item.symbol}) 与 Follow(${item.symbol}) 相交不为空`)
                let errorProduction={
                    production: item,
                    notice: noticeArr,
                }
                this.errorProductions.push(errorProduction)
            }
        }
        if(this.errorProduction.length==0){
            return {
                isLL1:True,
                errorProductions:this.errorProductions,
            }
        }
        else{
            return{
                isLL1:False,
                errorProductions:this.errorProductions,
            }
        }
    }

    duplexItem(arr){  //返回 arr 中所有重复元素
        let temp=arr.join()+","
        const result=new Set()
        for(let i=0;i<arr.length;i++){
            if(temp.replace(arr[i]+",","").indexOf(arr[i]+",")>-1){
                result.add(arr[i])
            }
        }
        return [...result]
    }

    genErrorNotice(production,index){  //生成错误提示信息
        let temp=new String('')
        for(let i=0; i<index.length;i++){
            temp+='First('+production[index[i]].getBodyString()+') '
        }
        return temp
    }

}
export default function(grammar){
    let temp=new IsLL1(grammar)
    return temp.isLL1()
}