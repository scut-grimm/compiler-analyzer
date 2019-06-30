<template>
  <div class="ppt">
    <div class="algorithm">
      <div class="left">
        <div
          class="step-desc"
          style="text-align:center"
        >
          <span v-if="!started">点击开始按钮计算所有文法的预测分析表</span>
          <template v-else>
            <p
              class="title"
              v-if="notice !== ''"
            >下一步操作</p>
            <HighlightText :text="notice"></HighlightText>
            <p
              class="title"
              v-if="pre_notice !== ''"
            >当前操作</p>
            <HighlightText :text="pre_notice"></HighlightText>

          </template>

        </div>
        <p class="title">算法流程</p>
        <HighlightText
          class="step"
          v-for="(step,index) in algorithmSteps"
          :key="index"
          :class="{'active': curStep===index}"
          :text="(index + 1) + '. ' + step"
        ></HighlightText>
      </div>
      <div class="right">
        <el-table
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column
            label="Non Terminal"
            width="150"
          >
            <template slot-scope="scope">
              <span>{{scope.row.nonterminal}}</span>
            </template>
          </el-table-column>
          <el-table-column label="Input Symbol">
            <el-table-column
              v-for="(terminal,index) in tableTerminals"
              :key="index"
              :label="terminal"
              width="120"
            >
              <template slot-scope="scope">
                <HighlightText :text="'`' + scope.row[terminal] + '`'"></HighlightText>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
        <div style="position: absolute; bottom: -40px;left: 10px;">
          <template v-if="started === false">
            <el-button
              type="primary"
              @click="start"
            >开始</el-button>
          </template>
          <template v-if="started === true && isAllDone === false">
            <el-button
              type="success"
              @click="next"
            >下一步</el-button>
            <el-button
              type="warning"
              @click="runAll"
            >跳过</el-button>
            <el-button
              type="info"
              @click="startAutoPlay"
              v-if="autoTimer === null"
            >自动播放</el-button>
            <el-button
              type="danger"
              @click="stopAutoPlay"
              v-if="autoTimer !== null"
            >停止播放</el-button>
          </template>
          <el-button
            @click="start"
            v-if="started"
            type="primary"
          >重新开始</el-button>
          <!-- <el-button type="primary" @click="finish">完成</el-button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GrammarIndicator from "~/components/grammar-indicator";
import AlgorithmWrapper from "~/classes/algorithm-wrapper";
import PredictiveParsingTable from "~/classes/predictive-parsing-table";
import GeneratePredictiveParsingTable from "~/classes/algorithms/generate-predictive-parsing-table";
import Grammar from "~/classes/grammar";
import MapSet from "~/classes/map-set";
import HighlightText from '~/components/highlight-text'

export default {
  components: {
    GrammarIndicator,
    HighlightText
  },
  data() {
    const PPT = new PredictiveParsingTable();
    return {
      grammar: new Grammar(),
      active: 0,
      PPT,
      PPTData: PPT.getTableData(),
      wrapper: null,
      pre_notice: "",
      notice: "",
      started: false,
      curStep: -1,
      curHighlightSymbols: [],
      autoTime: 1000,
      autoTimer: null,
      isAllDone: false
    };
  },
  methods: {
    onChagneProduction(index) {
      this.active = index;
    },
    start() {
      const algorithm = new GeneratePredictiveParsingTable(this.grammar);
      this.wrapper = new AlgorithmWrapper(algorithm);
      this.wrapper.init();
      this.started = true;
      this.isAllDone = false;
      this.curHighlightSymbols = [];
      this.sync();
    },
    sync() {
      this.active = this.wrapper.getContext().cur_g_index;
      this.PPTData = this.wrapper.getCurResult();
      this.isAllDone = this.wrapper.isAllDone();
      if (this.isAllDone && this.autoTimer !== null) {
        clearTimeout(this.autoTimer);
        this.autoTimer = null;
      }
    },
    next() {
      let {
        notice,
        curProduction,
        step,
        highlightSymbols
      } = this.wrapper.next();
      this.curStep = step;
      this.pre_notice = this.notice;
      this.notice = notice;
      this.curHighlightSymbols = highlightSymbols;
      this.sync();
    },
    skip() {
      let {
        notice,
        curProduction,
        step,
        highlightSymbols
      } = this.wrapper.skip();
      this.curStep = step;
      this.pre_notice = this.notice;
      this.notice = notice;
      this.curHighlightSymbols = highlightSymbols;
      this.sync();
    },
    oldnext() {
      let curFirstSet = new Set(this.curFirstSet);
      let curFollowSet = new Set(this.curFollowSet);
      const Empty = this.grammar.getEmptySign();
      const End = this.grammar.getStackBottomSign();
      for (let symbol of curFirstSet) {
        this.PPT.set(this.curProduction.head, symbol, this.curProduction);
      }
      if (curFirstSet.has(Empty)) {
        this.curFollowSet
          .filter(e => e.isTerminal())
          .forEach(e => {
            this.PPT.set(this.curProduction.head, e, this.curProduction);
          });
        if (curFollowSet.has(End)) {
          this.PPT.set(this.curProduction.head, End, this.curProduction);
        }
      }

      this.active++;
      this.PPTData = this.PPT.getTableData();
    },
    startAutoPlay() {
      this.autoTimer = setTimeout(() => {
        this.autoloop();
      }, this.autoTime);
    },
    stopAutoPlay() {
      clearTimeout(this.autoTimer);
      this.autoTimer = null;
    },
    runAll(restart = true) {
      if (restart) {
        this.start()
      }
      if (this.isAllDone === false) {
        this.skip()
        this.$nextTick(() => {
          this.runAll(false)
        })
      }
    },
    autoloop() {
      this.next();
      if (this.isAllDone) {
        this.autoTimer = null;
        return;
      }
      this.autoTimer = setTimeout(() => {
        this.autoloop();
      }, this.autoTime);
    },
    finish() {
      this.$eventbus.$emit('FinishPPT')
    },
    setGrammar(grammar) {
      this.grammar = grammar
      this.PPT = new GeneratePredictiveParsingTable(grammar).run();
      //this.runAll()
    }
  },
  computed: {
    curProduction() {
      const productions = this.grammar.getProductions();
      if (productions.length > this.active) {
        return productions[this.active];
      } else {
        return null;
      }
    },
    curFirstSet() {
      let grammar = this.curProduction;
      if (grammar === null) {
        return [];
      }
      return this.grammar.getProductionBodyFirstSet(grammar);
    },
    curFollowSet() {
      let grammar = this.curProduction;
      if (grammar === null) {
        return [];
      }
      return this.grammar.getSignFollowSet(grammar.head);
    },
    tableTerminals() {
      const { nonterminals, terminals, table } = this.PPTData;
      return terminals.filter(e => !e.isEmpty()).map(e => e.getString());
    },
    tableData() {
      const { nonterminals, terminals, table } = this.PPTData;
      let ret = [];
      let i = 0;
      for (let nonterminal of nonterminals) {
        let tmp = {
          nonterminal: nonterminal.getString()
        };
        for (let j in table[i]) {
          let terminal = terminals[j];
          if (table[i][j] === null) {
            tmp[terminal.getString()] = "";
          } else {
            tmp[terminal.getString()] = table[i][j].getString();
          }
        }
        ret.push(tmp);
        i++;
      }
      return ret;
    },
    algorithmSteps() {
      return [
        "对于产生式`A->α`，对于`First(α)`每个终结符号`a`，将`A->α`加入到分析表`M[A,a]`中",
        "若`First(α)`中存在`ε`, 将`Follow(A)`中的每个终结符号`b`，将`A->α`加入到分析表`M[A,b]`中",
        "若`First(α)`中存在`ε` 且 `Follow(A)`中存在`$`，将`A->α`加入到`M[A,$]`中"
      ];
    }
  },
  mounted() {

  }
};
</script>
<style lang="scss" scoped>
.ppt {
  .algorithm {
    display: flex;
    font-weight: bold;
    .left {
      width: 50%;
      max-width: 50%;
      .step-desc {
        font-size: 30px;
        min-height: 200px;
      }
    }
    .right {
      width: 50%;
      max-width: 50%;
      position: relative;
    }
    .title {
      font-size: 30px;
      text-align: center;
    }
    .step {
      &.active {
        background-color: rgba(252, 217, 21, 0.603);
      }
    }
  }
}
</style>
