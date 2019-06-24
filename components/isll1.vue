<template>
  <div class="isLL1">
    <div class="top">
    </div>
    <div class="down">
      <div v-for="production in productions" :key="production.production">
        <el-popover placement="right" width="200" trigger="click">
          <el-table :data="production.notice">
            <el-table-column width="150" property="notice" lable="notice"></el-table-column>
          </el-table>
          <el-button
            slot="reference"
            type="text"
            :class="{errorProduction:production.error,grammar}"
          >{{production.production}}</el-button>
        </el-popover>
      </div>
      <div v-if="isLL1===true">当前文法属于LL(1)文法</div>
      <div v-else>当前文法不属于LL(1)文法</div>
    </div>
  </div>
</template>
<script>
import IsLL1 from "~/classes/algorithms/is-LL1";
import Grammar from "~/classes/grammar";
import MapSet from "~/classes/map-set";
import CurrentGrammar from "~/components/current-grammar";
export default {
  components: {
    CurrentGrammar
  },
  data() {
    return {
      grammar: new Grammar(),
      isLL1: false,
      productions: []
    };
  },
  computed: {},
  created() {},
  methods: {
    run() {
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
      this.grammar = grammar;
      this.run();
    },
    finish() {
      this.$eventbus.$emit("FinishIsLL1");
    }
  }
};
</script>
<style lang="scss" scoped>
.isLL1 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .top {
    width: 100%;
  }
  .down {
    .errorProduction {
      color: red;
    }
    .grammar {
      border-radius: 5px;
      font-size: 24px;
      padding: 5px 10px;
      margin: 2px;
      &:hover {
        background-color: rgb(178, 212, 247);
        cursor: pointer;
      }
      &.active {
        background-color: rgb(102, 174, 247);
      }
    }
  }
}
</style>


