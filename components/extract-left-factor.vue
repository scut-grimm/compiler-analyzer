<template>
  <div class="elf">
    <div class="tips">
      <h2>将形如 </h2>
      <h2>A→αβ1|αβ2|…|αβn</h2>
      <h2>的产生式重写为</h2>
      <h2>A→αA’</h2>
      <h2>A’→ β1|β2|…|βn</h2>

    </div>
    <div style="text-align:center;margin: 20px;">
    <el-button type="success" @click="doAlgorithm" >{{buttonText}}</el-button>
    </div>
    <div class="main">

      <template v-if="show_result">
      <HightlightProduction
        :disjointSet="disjointSet"
        :productions="leftProductions"
        title="当前文法"
      ></HightlightProduction>
      <HightlightProduction
        :disjointSet="disjointSet"
        :productions="rightProductions"
        title="提取左因子后的文法"
      ></HightlightProduction>
      </template>

    </div>
    <!-- <el-button
      type="primary"
      @click="finish"
    >完成</el-button> -->

  </div>
</template>
<script>
import Grammar from "~/classes/grammar";
import ExtractLeftFactor from "~/classes/algorithms/extract-left-factor";
import HightlightProduction from '~/components/highlight-production'
export default {
  layout: "grammar",
  components: {
    HightlightProduction
  },
  data() {
    return {
      grammar: null,
      disjointSet: '',
      leftProductions: [],
      rightProductions: [],
      show_result: false
    }
  },
  mounted() {
  },
  methods: {
    setGrammar(grammar) {
      this.grammar = grammar

    },
    finish() {
      this.$eventbus.$emit('FinishExtractLeftFactor')
    },
    doAlgorithm(){
      let grammar = this.grammar
      let elf = new ExtractLeftFactor(grammar)
      let { newGrammar, disjointSet } = elf.run()
      this.disjointSet = disjointSet
      this.leftProductions = grammar.getProductions()
      this.rightProductions = newGrammar.getProductions()
      this.show_result =true
    }
  },
  computed:{
    buttonText(){
      if(this.show_result){
        if(this.leftEqualToRight){
          return '当前文法无需提取左因子'
        }else{
          return '提取左因子结果如下'
        }
      }else{
        return '提取左因子'
      }
    },
    leftEqualToRight(){
      return this.leftProductions.length === this.rightProductions.length
    }
  }
};
</script>
<style lang="scss" scoped>
.elf {
  .tips {
    h2 {
      text-align: center;
    }
  }
  .main {
    display: flex;
  }
}
</style>


