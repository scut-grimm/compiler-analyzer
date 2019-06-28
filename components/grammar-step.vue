<template>
  <div class="grammar-step">
    <el-steps direction="vertical" :active="active">
      <el-step
        class="step"
        title="拟定上下文无关文法"
        description="输入文法规则"
        @click.native="goTo('GrammarInput')"
      ></el-step>
      <el-step
        class="step"
        title="消除左递归"
        description="消除左递归"
        @click.native="goTo('EliminateLeftRecursion')"
      ></el-step>
      <el-step
        class="step"
        title="提取左因子"
        description="提取左公因子"
        @click.native="goTo('ExtractLeftFactor')"
      ></el-step>
      <el-step
        class="step"
        title="First集"
        description="计算文法的First集合"
        @click.native="goTo('FirstSet')"
      ></el-step>
      <el-step
        class="step"
        title="Follow集"
        description="计算文法的follow集"
        @click.native="goTo('FollowSet')"
      ></el-step>
      <el-step
        class="step"
        title="判断是否符合LL(1)文法"
        description="判断文法是否符合LL(1)文法"
        @click.native="goTo('IsLL1')"
      ></el-step>
      <el-step
        class="step"
        title="预测分析表"
        description="生成预测分析表"
        @click.native="goTo('PredictiveParsingTable')"
      ></el-step>
      <el-step
        class="step"
        title="分析栈"
        description="根据拟定文法分析输入串"
        @click.native="goTo('ParsingStack')"
      ></el-step>
    </el-steps>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState("global", ["curStep"]),
    active() {
      switch (this.curStep) {
        case "GrammarInput":
          return 0;
        case "EliminateLeftRecursion":
          return 1;
        case "ExtractLeftFactor":
          return 2;
        case "FirstSet":
          return 3;
        case "FollowSet":
          return 4;
        case "IsLL1":
          return 5;
        case "PredictiveParsingTable":
          return 6;
        case "ParsingStack":
          return 7;
      }
    }
  },
  methods: {
    goTo(step) {
      this.$eventbus.$emit("goto", step);
    }
  }
};
</script>
<style lang="scss" scoped>
.grammar-step {
  height: 90%;
  max-height: 100vh;
  padding-top: 40px;
  padding-left: 40px;
  .step {
    cursor: pointer;
  }
}
</style>
