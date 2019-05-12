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
            let nonFirstSet=this.grammar.getSignFirstSet(item).map(e=>e.getString())
            assert(nonFirstSet.length,`First(${item.symbol})为空`)
            let nonFollowSet=this.grammar.getSignFollowSet(item).map(e=>e.getString())
            assert(nonFollowSet.length,`Follow(${item.symbol})为空`)
            let intersection=new Set([...nonFirstSet,...nonFollowSet])
            if(!(nonFirstSet.includes('ε')&&intersection.size<(nonFirstSet.length+nonFollowSet.length))){
                let productions=this.grammar.getDerivations(item)
                let bodyFirstSets=productions.map(x=>this.grammar.getProductionBodyFirstSet(x))
                let errorBodyIndex=this.findProductionBodyFirstSetIntersectionNotEmpty(bodyFirstSets)
                if(errorBodyIndex.length!=0){
                    let noticeArr=Array.of()
                    for(let i of errorBodyIndex){
                        noticeArr.push(`${this.genErrorNotice(productions,i)}相交不为空`)
                    }
                    let errorProductionArray=this.grammar.getDerivations(item)
                    let errorProductionString=errorProductionArray[0].getHeadString()+'->'
                    for(let i=0;i<errorProductionArray.length;i++){
                        errorProductionString+=errorProductionArray[i].getBodyString()+'|'
                    }
                    errorProductionString=errorProductionString.slice(0,-1)
                    
                    let errorProduction={
                        production: errorProductionString,
                        notice: noticeArr,
                    }
                    this.errorProductions.push(errorProduction)
                }
            }
            else{
                let noticeArr=Array.of(`First(${item.symbol}) 中存在 ε 且 First(${item.symbol}) 与 Follow(${item.symbol}) 相交不为空`)
                let errorProductionArray=this.grammar.getDerivations(item)
                let errorProductionString=errorProductionArray[0].getHeadString()+'->'
                for(let i=0;i<errorProductionArray.length;i++){
                    errorProductionString+=errorProductionArray[i].getBodyString()+'|'
                }
                errorProductionString=errorProductionString.slice(0,-1)
                let errorProduction={
                    production: errorProductionString,
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
        let temp=''
        for(let i of index){
            temp+='First('+production[i].getBodyString()+') '
        }
        return temp
    }

}
export default function(grammar){
    let temp=new IsLL1(grammar)
    return temp.isLL1()
}