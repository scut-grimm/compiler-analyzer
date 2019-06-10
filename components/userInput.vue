<template>
  <div>
  <el-input
    v-model="input"
    type="textarea"
    :rows="12"
    placeholder="请输入要分析的语句,空格键隔开每个Sign"
    >
  </el-input>
  </div>
</template>

<script>
  import grammar from '~/classes/grammar'
    export default {
      props: ['grammar'],
      name: "userInput",
      data(){
          return{
            input:''
          }
      },
      watch:{
          input(val){

              if(val!=='') {
                // const grammar = this.grammar
                // let result = []
                const arr = val.split(' ')
                // for(let i of arr){
                //   result.push(grammar.getSign(i))
                // }
                if (arr.length > 0) {
                  this.$emit('getInput', arr)
                }


          }
      }
      }
    }
</script>

<style scoped>

</style>
