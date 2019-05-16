import assert from 'assert'
class IsLL1{
    errorProductions=Array.of()
    constructor(grammar){
        this.grammar=grammar
    }
    
    isLL1(){
        let nonterminals=this.grammar.getNonterminals() 
        assert(nonterminals.length,'文法没有非终止符号') 
        for(let item of nonterminals){
            let nonFirstSet=new Set(this.grammar.getSignFirstSet(item)) //不要使用字符串
            assert(nonFirstSet.size,`First(${item.symbol})为空`)
            let nonFollowSet=new Set(this.grammar.getSignFollowSet(item))  //不要使用字符串
            assert(nonFollowSet.size,`Follow(${item.symbol})为空`)
            let intersection=this.intersection(nonFirstSet,nonFollowSet)
            //不要使用字符串判断是否有 ε 直接用 set.has(Sign)
            if(!(nonFirstSet.has(this.grammar.getEmptySign())&&intersection.size>0)){
                let productions=this.grammar.getDerivations(item)
                let bodyFirstSets=productions.map(x=>this.grammar.getProductionBodyFirstSet(x))
                let errorBodyIndex=this.findProductionBodyFirstSetIntersectionNotEmpty(bodyFirstSets)
                if(errorBodyIndex.length!=0){
                    let noticeArr=Array.of()
                    for(let i of errorBodyIndex){
                        noticeArr.push(`${this.genErrorNotice(productions,i)}相交不为空`)
                    }
                    let errorProductionArray=this.grammar.getDerivations(item)
                    let errorProduction={
                        production: errorProductionArray,  //这里放原始的产生式对象，不要放字符串
                        notice: noticeArr,
                    }
                    this.errorProductions.push(errorProduction)
                }
            }
            else{
                let noticeArr=Array.of(`First(${item.symbol}) 中存在 ε 且 First(${item.symbol}) 与 Follow(${item.symbol}) 相交不为空`)
                let errorProductionArray=this.grammar.getDerivations(item)
                let errorProduction={
                    production: errorProductionArray,  //这里放原始的产生式对象，不要放字符串
                    notice: noticeArr,
                }
                this.errorProductions.push(errorProduction)
            }
        }
        if(this.errorProductions.length==0){
            return {
                isLL1:true,
                errorProductions:this.errorProductions, 
            }
        }
        else{
            return{
                isLL1:false,
                errorProductions:this.errorProductions,
            }
        }
    }
    
    findProductionBodyFirstSetIntersectionNotEmpty(bodyFirstSets){
        const errorBodyIndex=Array.of()
        for(let i=0;i<bodyFirstSets.length;i++){
            let tempIndex=new Set()
            for(let j=0;j<bodyFirstSets[i].length;j++){
                let interIndex=i+1
                for(;interIndex<bodyFirstSets.length;interIndex++){
                    for(let k=0;k<bodyFirstSets[interIndex].length;k++){
                        if(bodyFirstSets[i][j]===bodyFirstSets[interIndex][k]){
                            tempIndex.add(i)
                            tempIndex.add(interIndex)
                        }
                    }
                }
            }
            if(tempIndex.size!==0){
                errorBodyIndex.push(tempIndex)
            }
        }
        return errorBodyIndex
    }

    intersection(setA,setB){  //求交集
        let _intersection = new Set();
        for (let elem of setB) {
            if (setA.has(elem)) {
                _intersection.add(elem);
            }
        }
        return _intersection;
    }

    genErrorNotice(production,index){  //生成错误提示信息
        let temp=''
        for(let i of index){
            temp+='First('+production[i].getBodyString()+') '
        }
        return temp
    }

}
export default function(grammar){
    let temp=new IsLL1(grammar)
    let result=temp.isLL1()
    if(result.isLL1===true){
        return result
    }
    else{
        result.errorProductions.forEach(e=>{
            let errorProductionString=e.production[0].getHeadString()+'->'
            for(let i of e.production){
                errorProductionString+=i.getBodyString()+'|'
            }
            errorProductionString=errorProductionString.slice(0,-1)
            e.production=errorProductionString
        })
        return result
    }
}