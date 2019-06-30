<template>
  <div class="isLL1">
    <div class="top">
      <h2 v-if="isLL1===true">当前文法属于LL(1)文法</h2>
      <h2 v-else>当前文法不属于LL(1)文法</h2>
      <div style="color:#99a9bf;margin:4px;font-size:18.72px">当下面两个条件都满足时，一个文法才属于LL(1)文法</div>
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
        <!--prettyhtml-preserve-whitespace-->
        <h3>
          1. 对于每个产生式
          <el-tag class="production">
              A &#8594; α<sub>1</sub> | α<sub>2</sub>...| α<sub>n</sub>
          </el-tag><br />
          设 1&le;i&le;j&le;n，且 i&ne;j，对于所有的 i 和 j，
          <el-tag class="firstSet">
            First(α<sub>i</sub>)&cap;First(α<sub>j</sub>)=&empty;
          </el-tag> 恒成立
        </h3>
        <div class="left-table">
          <el-table :data="productions" :show-header="false" max-height="550">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" class="left-table-expand">
                  <el-form-item v-for="(firstSet,index) in props.row.bodys.firstSets" :key="index">
                    <template slot="label">
                      <span class="left-table-label">{{firstSet.label}} =</span>
                    </template>
                    <el-tag
                      v-for="(symbol,symbolIndex) in firstSet.set"
                      :key="symbolIndex"
                      style="margin:0px 5px 0px 5px"
                    >{{symbol}}</el-tag>
                  </el-form-item>
                  <el-form-item v-if="props.row.bodys.notice.length>0">
                    <template slot="label">
                      <span class="left-table-label">结论</span>
                    </template>
                    {{props.row.bodys.notice}}
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column align="center">
              <template slot-scope="scope">
                <div>
                  {{scope.row.production}}
                  <el-button
                    type="success"
                    icon="el-icon-check"
                    circle
                    v-if="!scope.row.bodys.error"
                    size="mini"
                    style="margin:0px 10px"
                  ></el-button>
                  <el-button
                    type="danger"
                    icon="el-icon-close"
                    circle
                    v-if="scope.row.bodys.error"
                    size="mini"
                    style="margin:0px 10px"
                  ></el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="right">
        <!--prettyhtml-preserve-whitespace-->
        <h3>
          2. 对于每个产生式
          <el-tag class="production">
            A &#8594; α<sub>1</sub> | α<sub>2</sub>...| α<sub>n</sub>
          </el-tag><br />
          如果
          <el-tag class="firstSet">First(A)</el-tag> 包含
          <el-tag class="symbol">ε</el-tag>，则
          <el-tag class="firstSet">First(A)&cap;Follow(A)</el-tag> 必须为 &empty;
        </h3>
        <div class="right-table">
          <el-table :data="productions" :show-header="false" max-height="550">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" class="right-table-expand">
                  <el-form-item>
                    <template slot="label">
                      <span class="right-table-label">{{props.row.head.firstSet.label}} =</span>
                    </template>
                    <el-tag
                      v-for="(symbol,index) in props.row.head.firstSet.set"
                      :key="index"
                      style="margin:0px 5px 0px 5px"
                    >{{symbol}}</el-tag>
                  </el-form-item>
                  <el-form-item>
                    <template slot="label">
                      <span class="right-table-label">{{props.row.head.followSet.label}} =</span>
                    </template>
                    <el-tag
                      v-for="(symbol,index) in props.row.head.followSet.set"
                      :key="index"
                      style="margin:0px 5px 0px 5px"
                    >{{symbol}}</el-tag>
                  </el-form-item>
                  <el-form-item v-if="props.row.head.notice.length>0">
                    <template slot="label">
                      <span class="right-table-label">结论</span>
                    </template>
                    <span>{{props.row.head.notice}}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column align="center">
              <template slot-scope="scope">
                <div>
                  {{scope.row.production}}
                  <el-button
                    type="success"
                    icon="el-icon-check"
                    circle
                    v-if="!scope.row.head.error"
                    size="mini"
                    style="margin:0px 10px"
                  ></el-button>
                  <el-button
                    type="danger"
                    icon="el-icon-close"
                    circle
                    v-if="scope.row.head.error"
                    size="mini"
                    style="margin:0px 10px"
                  ></el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
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
      productions: []
    };
  },
  computed: {},
  created() {},
  methods: {
    run() {
      let judge = new IsLL1(this.grammar);
      this.isLL1 = judge.isLL1;
      this.setProductions(judge.productions);
    },
    setGrammar(grammar) {
      this.grammar = grammar;
      this.run();
    },
    setProductions(message) {
      const rows = [];
      // console.log("mmmmmmmmm");
      // console.log(message);
      for (const item of message) {
        let productionString = item.head.getString() + " \u2192 ";
        for (const production of item.sameHeadProductions) {
          productionString += production.getBodyString() + " | ";
        }
        productionString = productionString.slice(0, -3);
        const bodys = {
          firstSets: [],
          error: false,
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
        if (!item.bodyFirstSetIntersectionIsEmpty) {
          bodys.error = true;
          // console.log("产生式体有问题");
          // console.log(item);
          // console.log(item.bodyFirstSetIntersectionNoEmptyProduction);
          for (const i of item.bodyFirstSetIntersectionNoEmptyProduction) {
            let tempNotice = "";
            for (const production of i) {
              tempNotice += `First(${production.getBodyString()}), `;
            }
            // console.log(tempNotice);
            tempNotice = tempNotice.slice(0, -2);
            tempNotice += " 相交不为空; ";
            bodys.notice += tempNotice;
          }
          bodys.notice = bodys.notice.slice(0, -2);
          // console.log("11111111111");
          // console.log(bodys.notice);
        }
        const head = {
          firstSet: "",
          followSet: "",
          error: false,
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
            head.error = true;
            head.notice = `First(${item.head.getString()}) 中存在 ε 且 First(${item.head.getString()}) 与 Follow(${item.head.getString()}) 相交不为空`;
            // console.log(head.notice);
          }
        }
        rows.push({
          production: productionString,
          bodys: bodys,
          head: head
        });
      }
      this.productions = rows;
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
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    align-items: stretch;
    .left {
      flex: 1 1 auto;
      width: 40%;
      margin: 10px;
      .left-table {
        margin: 10px;
        width: 80%;
        margin-right: auto;
        margin-left: auto;
        text-align: center;
        .left-table-expand {
          font-size: 0;
        }
        .left-table-label {
          width: 90px;
          color: #99a9bf;
        }
      }
    }
    .right {
      flex: 1 1 auto;
      width: 40%;
      margin: 10px;
      .right-table {
        margin: 10px;
        width: 80%;
        margin-right: auto;
        margin-left: auto;
        text-align: center;
        .right-table-expand {
          font-size: 0;
        }
        .right-table-label {
          width: 90px;
          color: #99a9bf;
        }
      }
    }
    .production {
      margin: 2px;
    }
    .symbol {
      margin: 2px;
    }
    .firstSet {
      margin: 2px;
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


