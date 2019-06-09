<template>
  <div class="grammar-step">
    <el-steps direction="vertical" :active="active">
      <el-step title="拟定文法"></el-step>
      <el-step title="First集"></el-step>
      <el-step title="Follow集"></el-step>
      <el-step title="判断符合LL(1)文法"></el-step>
      <el-step title="分析预测表"></el-step>
      <el-step title="分析栈"></el-step>
    </el-steps>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed:{
    ...mapState('global',['curStep']),
    active(){
      switch(this.curStep){
        case 'GrammarInput':
          return 0
        case 'FirstSet':
          return 1
        case 'FollowSet':
          return 2
        case 'IsLL1':
          return 3
        case 'PredictiveParsingTable':
          return 4
        case 'ParsingStack':
          return 5
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.grammar-step{
  height: 90%;
  padding-top: 40px;
  padding-left:40px;
}
</style>
