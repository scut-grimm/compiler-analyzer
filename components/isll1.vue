<template>
  <div class="isLL1">
    <div
      v-for="production in productions"
      :key="production.production"
    >
      <el-popover
        placement="right"
        width="200"
        trigger="click"
      >
        <el-table :data="production.notice">
          <el-table-column
            width="150"
            property="notice"
            lable="notice"
          ></el-table-column>
        </el-table>
        <el-button
          slot="reference"
          type="text"
          :class="{errorProduction:production.error}"
        >{{production.production}}</el-button>
      </el-popover>
    </div>
    <div v-if="isLL1===true">当前文法属于LL(1)文法</div>
    <div v-else>当前文法不属于LL(1)文法</div>
    <el-button type="primary" @click="finish">完成</el-button>
  </div>
</template>
<script>
import IsLL1 from "~/classes/algorithms/is-ll1";
import Grammar from "~/classes/grammar";
import MapSet from "~/classes/map-set";
export default {
  data() {
    return {
      grammar: new Grammar(),
      isLL1: false,
      productions: []
    };
  },
  computed: {
  },
  created() {

  },
  methods: {
    run(){
      let judge = new IsLL1(this.grammar);
      for (let i of judge.productions) {
        let temp = Array.of();
        for (let j of i.notice) {
          temp.push({ notice: j });
        }
        i.notice = temp;
      }
      this.isLL1 = judge.isLL1;
      this.productions = judge.productions;
    },
    setGrammar(grammar) {
      this.grammar = grammar
      this.run()
    },
    finish(){
      this.$eventbus.$emit('FinishIsLL1')
    }
  }
};
</script>
<style>
.errorProduction {
  color: red;
}
.isLL1 {
  justify-content: center;
  align-items: center;
}
</style>


