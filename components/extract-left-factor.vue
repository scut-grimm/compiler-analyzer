<template>
  <div class="elf">
    <div class="tips">
      <h2>将形如 </h2>
      <h2>A→αβ1|αβ2|…|αβn</h2>
      <h2>的产生式重写为</h2>
      <h2>A→αA’</h2>
      <h2>A’→ β1|β2|…|βn</h2>

    </div>
    <div class="main">
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
      rightProductions: []
    }
  },
  mounted() {
  },
  methods: {
    setGrammar(grammar) {
      this.grammar = grammar
      let elf = new ExtractLeftFactor(grammar)
      let { newGrammar, disjointSet } = elf.run()
      this.disjointSet = disjointSet
      this.leftProductions = grammar.getProductions()
      this.rightProductions = newGrammar.getProductions()
    },
    finish() {
      this.$eventbus.$emit('FinishExtractLeftFactor')
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


