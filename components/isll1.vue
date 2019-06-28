<template>
  <div class="isLL1">
    <div class="top">
      <h3 v-if="isLL1===true">当前文法属于LL(1)文法</h3>
      <h3 v-else>当前文法不属于LL(1)文法</h3>
      <h3>当下面两个条件都满足时，一个文法才属于LL(1)文法</h3>
    </div>
    <div class="down">
      <!-- <div v-for="production in productions" :key="production.production">
        <el-popover placement="right" width="200" trigger="click">
          <div>{{production.notice[0].notice}}</div>
          <el-button
            slot="reference"
            type="text"
            :class="{errorProduction:production.error,grammar}"
          >{{production.production}}</el-button>
        </el-popover>
      </div>-->
      <div class="left">
        <h3>
          1. 对于每个产生式
          <span class="production">
            A &#8594; α
            <sub>1</sub> | α
            <sub>2</sub>...| α
            <sub>n</sub>
          </span>，设 1&le;i&le;j&le;n，且 i&ne;j，对于所有的 i 和 j，
          <span class="firstSet">
            First(α
            <sub>i</sub>)&cap;First(α
            <sub>j</sub>)=&empty;
          </span>恒成立
        </h3>
        <el-table :data="productions" :show-header="false">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline>
                <el-form-item
                  v-for="(firstSet,index) in props.row.bodys.firstSets"
                  :key="index"
                  :label="firstSet.label"
                >
                  <span>
                    <el-tag
                      v-for="(symbol,symbolIndex) in firstSet.set"
                      :key="symbolIndex"
                      style="margin:10px"
                    >{{symbol}}</el-tag>
                  </span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template slot-scope="scope">{{scope.row.production}}</template>
          </el-table-column>
        </el-table>
      </div>
      <div class="right">
        <h3>
          2. 对于每个产生式
          <span class="production">
            A &#8594; α
            <sub>1</sub> | α
            <sub>2</sub>...| α
            <sub>n</sub>
          </span>，如果
          <span class="firstSet">First(A)</span>包含
          <span class="symbol">ε</span>，则
          <span class="firstSet">First(A)&cap;Follow(A)</span>必须为&empty;
        </h3>
        <el-table :data="productions" :show-header="false">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline>
                <el-form-item :label="props.row.head.firstSet.label">
                  <span>
                    <el-tag
                      v-for="(symbol,index) in props.row.head.firstSet.set"
                      :key="index"
                      style="margin:10px"
                    >{{symbol}}</el-tag>
                  </span>
                </el-form-item>
                <el-form-item :label="props.row.head.followSet.label">
                  <span>
                    <el-tag
                      v-for="(symbol,index) in props.row.head.followSet.set"
                      :key="index"
                      style="margin:10px"
                    >{{symbol}}</el-tag>
                  </span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template slot-scope="scope">{{scope.row.production}}</template>
          </el-table-column>
        </el-table>
      </div>
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
      message: []
    };
  },
  computed: {
    productions() {
      const rows = [];
      for (const item of this.message) {
        let productionString = item.head.getString() + " \u2192 ";
        for (const production of item.sameHeadProductions) {
          productionString += production.getBodyString() + " | ";
        }
        productionString = productionString.slice(0, -3);
        const bodys = {
          firstSets: [],
          notice: ""
        };
        for (const firstSet of item.productionBodyFirstSets) {
          let label = `First(${firstSet.production.getBodyString()})`;
          let set = firstSet.bodyFirstSet.map(e => e.getString());
          bodys.firstSets.push({
            label: label,
            set: set
          });
        }
        if (!item.firstFollowIntersectionIsEmpty) {
          let tempNotice = "";
          for (const production of item.bodyFirstSetIntersectionNoEmptyProduction) {
            tempNotice += `First(${production.getBodyString()}), `;
          }
          tempNotice = tempNotice.slice(0, -2);
          tempNotice += " 相交不为空";
          bodys.notice = tempNotice;
        }
        const head = {
          firstSet: "",
          followSet: "",
          notice: ""
        };
        let fiLabel = `First(${item.head.getString()})`;
        let fiSet = item.headFirstSet.map(e => e.getString());
        let foLabel = `Follow(${item.head.getString()})`;
        let foSet = item.headFollowSet.map(e => e.getString());
        head.firstSet = {
          label: fiLabel,
          set: fiSet
        };
        head.followSet = {
          label: foLabel,
          set: foSet
        };
        if (item.headFirstSetHasEmpty) {
          if (!item.firstFollowIntersectionIsEmpty) {
            head.notice = `First(${item.symbol}) 中存在 ε 且 First(${
              item.symbol
            }) 与 Follow(${item.symbol}) 相交不为空`;
          }
        }
        rows.push({
          production: productionString,
          bodys: bodys,
          head: head
        });
      }
      return rows;
    }
  },
  created() {},
  methods: {
    run() {
      let judge = new IsLL1(this.grammar);
      this.isLL1 = judge.isLL1;
      this.message = judge.productions;
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
  justify-content: space-around;
  align-items: center;
  .top {
    text-align: center;
    margin: 20px;
    width: 100%;
  }
  .down {
    text-align: center;
    margin-top: 20px;
    display: flex;
    flex-flow: row nowrap;
    align-items: stretch;
    .left {
      flex: 1 1 auto;
      width: 50%;
    }
    .right {
      flex: 1 1 auto;
      width: 50%;
    }
    .errorProduction {
      color: red;
    }
    .grammar {
      border-radius: 5px;
      font-size: 30px;
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


