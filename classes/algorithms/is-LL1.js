class IsLL1{
    _errorProductions=Array.of()
    constructor(grammer){
        this.grammer=grammer
    }

    getInitContext(){
        return null
    }
    
    isLL1(){
        let nonterminals=this.grammer.getNonterminals()  
        for(let item of nonterminals){
            let nonFirstSet=this.grammer.getSignFirstSet(item)
            let nonFollowSet=this.grammer.getSignFollowSet(item)
            let intersection=new Set([...nonFirstSet,...nonFollowSet])
            if(!(nonFirstSet.includes('ε')&&intersection.length!=0)){
                let productions=this.grammer.getDerivations(item)
                let bodyFirstSets=productions.map(x=>this.grammer.getGrammarItemRightFirstSet(x))
                let flatBodyFirstSet=bodyFirstSets.flat()  //将产生式体的First集合的所有元素放在一个数组中
                let duplexItems=this._duplexItem(flatBodyFirstSet.map(x=>x.getStr()))
                if(duplexItems.length!=0){
                    let noticeArr=Array.of()
                    for(let dItem of duplexItems){
                        let index=new Set()
                        for(let i=0;i<productions.length;++i){
                            let bodyFirstSetSymbols=bodyFirstSets[i].map(x=>x.getStr())
                            if(bodyFirstSetSymbols.includes(dItem)){
                                index.add(i)
                            }
                        }
                        noticeArr.push(`${this._genErrorNotice(productions,index)}相交不为空`)
                    }
                    let errorProduction={
                        production: item,
                        notice: noticeArr,
                    }
                    this._errorProductions.push(errorProduction)
                }
            }
            else{
                let noticeArr=Array.of(`First(${production.symbol}) 中存在 ε 且 First(${production.symbol}) 与 Follow(${production.symbol}) 相交不为空`)
                let errorProduction={
                    production: item,
                    notice: noticeArr,
                }
                this._errorProductions.push(errorProduction)
            }
        }
        if(this._errorProduction.length==0){
            return {
                isLL1:True,
                errorProductions:this._errorProductions,
            }
        }
        else{
            return{
                isLL1:False,
                errorProductions:this._errorProductions,
            }
        }
    }

    _duplexItem(arr){  //返回 arr 中所有重复元素
        let temp=arr.join()+","
        const result=new Set()
        for(let i=0;i<arr.length;i++){
            if(temp.replace(arr[i]+",","").indexOf(arr[i]+",")>-1){
                result.add(arr[i])
            }
        }
        return [...result]
    }

    _genErrorNotice(production,index){  //生成错误提示信息
        let temp=new String('')
        for(let i=0; i<index.length;i++){
            temp+='First('+production[index[i]].getRightStr()+') '
        }
        return temp
    }

}
export default isLL1