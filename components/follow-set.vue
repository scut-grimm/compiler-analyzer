<template>
  <div class="ppt">
    <div class="algorithm">
      <div class="left">
        <div
          class="step-desc"
          style="text-align:center"
        >
          <span v-if="!started" class="h2">点击开始按钮计算所有非终止符号的Follow集合</span>
          <template v-else>
            <!-- <p
              class="title"
              v-if="notice !== ''"
            >下一步操作</p>
            <HighlightText :text="notice"></HighlightText>
            <p
              class="title"
              v-if="pre_notice !== ''"
            >当前操作</p> -->
            <HighlightText class="h2" :text="notice"></HighlightText>

          </template>

        </div>
        <p class="title h3">算法流程</p>
        <HighlightText
          class="step h3"
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
          max-height="550"
        >
          <el-table-column
            label="非终止符号"
            width="150"
          >
            <template slot-scope="scope">
              <HighlightText :text="'`' + scope.row.nonterminal + '`'"></HighlightText>
            </template>
          </el-table-column>
          <el-table-column
            v-for="index in passCount"
            :key="index"
            :label="'Pass ' + String(index)"
            width="120"
          >
            <template slot-scope="scope">
              <HighlightText :highlight="index===passCount && scope.row.nonterminal === curSignText" :text="'`' + scope.row['pass' + String(index - 1)] + '`'"></HighlightText>
            </template>
          </el-table-column>
        </el-table>
        <div style="position: absolute; bottom: -60px;left: 10px;">
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
import GenerateFollowSet from "~/classes/algorithms/generate-follow-set";
import Grammar from "~/classes/grammar";
import MapSet from "~/classes/map-set";
import HighlightText from '~/components/highlight-text'
export default {
  components: {
    GrammarIndicator,
    HighlightText
  },
  data() {
    return {
      grammar: new Grammar(),
      active: 0,
      wrapper: null,
      pre_notice: "",
      notice: "",
      started: false,
      curStep: -1,
      preStep: -1,
      curHighlightSymbols: [],
      autoTime: 1000,
      autoTimer: null,
      isAllDone: false,
      gettingFirst: [],
      followset: null,
      pass_results: [],
      tableTerminals: [],
      tableNonterminals: [],
      processedSigns: [],
      curSign: ''
    };
  },
  methods: {
    onChagneProduction(index) {
      this.active = index;
    },
    start() {
      const algorithm = new GenerateFollowSet(this.grammar);
      this.wrapper = new AlgorithmWrapper(algorithm);
      this.wrapper.init();
      this.started = true;
      this.isAllDone = false;
      this.curHighlightSymbols = [];
      this.active = 0
      this.curStep = this.preStep = -1;
      this.notice = this.pre_notice = ''
      this.sync();
    },
    sync() {
      this.followset = this.wrapper.getCurResult().followset
      this.pass_results = this.wrapper.getCurResult().pass_results
      this.tableTerminals = this.grammar.getTerminals()
      this.tableNonterminals = this.grammar.getNonterminals()
      this.isAllDone = this.wrapper.isAllDone();
      if (this.isAllDone && this.autoTimer !== null) {
        clearTimeout(this.autoTimer);
        this.autoTimer = null;
      }
    },
    next() {
      let {
        notice,
        production,
        step,
        highlightSymbols,
        active,
        gettingFirst,
        processedSigns,
        curSign
      } = this.wrapper.next();
      this.processedSigns = processedSigns
      this.gettingFirst = gettingFirst
      this.preStep = this.curStep
      this.curStep = step;
      this.pre_notice = this.notice;
      this.notice = notice;
      this.curHighlightSymbols = highlightSymbols;
      this.active = active
      this.curSign = curSign
      this.sync();
    },
    skip() {
      let {
        notice,
        production,
        step,
        highlightSymbols,
        active,
        gettingFirst,
        processedSigns,
        curSign
      } = this.wrapper.skip();
      this.processedSigns = processedSigns
      this.gettingFirst = gettingFirst
      this.preStep = this.curStep
      this.curStep = step;
      this.pre_notice = this.notice;
      this.notice = notice;
      this.curHighlightSymbols = highlightSymbols;
      this.active = active
      this.curSign = curSign
      this.sync();
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
    setGrammar(grammar) {
      this.grammar = grammar
      //this.runAll()
    },
    finish() {
      this.$eventbus.$emit('FinishFollowSet')
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
      return this.grammar.getSignsFirstSet(this.gettingFirst);
    },

    algorithmSteps() {
      return [
        "在开始符号`S`的`FOLLOW(S)`中，加入`$`",
        "如果存在产生式`A→αBβ`，则将`FIRST(β)`中除`ε`以外的符号都放入`FOLLOW(B)`中",
        "如果存在产生式`A→αB`，或`A→αBβ`，其中`FIRST(β)`中包含`ε`，则将`FOLLOW(A)`中的所有符号放入`FOLLOW(B)`中"
      ];
    },
    passCount() {
      if (this.followset === null) {
        return 0
      }
      return this.pass_results.length + 1
    },
    tableData() {
      if (this.followset === null) {
        return []
      }
      let tableData = this.tableNonterminals.map(e => {
        let obj = {
          nonterminal: e.getString()
        }
        for (let i = 0; i < this.pass_results.length + 1; i++) {
          obj['pass' + i] = ''
        }
        return obj
      })
      let pass = 0
      for (let map of this.pass_results) {
        for (let i = 0; i < this.tableNonterminals.length; i++) {
          let key = this.tableNonterminals[i]
          let cur = tableData[i]
          let values = []
          if (map.has(key)) {
            values = [...map.get(key)]
          }
          cur['pass' + pass] = values.map(e => e.getString()).join(' ')
        }
        pass++
      }
      let followset = this.followset
      if (followset !== null) {
        for (let i = 0; i < this.tableNonterminals.length; i++) {
          let key = this.tableNonterminals[i]
          let cur = tableData[i]
          let values = []
          if (followset.has(key) /*&& this.processedSigns.indexOf(key) !== -1*/) {
            values = [...followset.get(key)]
          }
          cur['pass' + pass] = values.map(e => e.getString()).join('')
        }
      }
      return tableData
    },
    curSignText(){
      if(typeof this.curSign.getString === 'function'){
        return this.curSign.getString()
      }
      return ''
    }
  },
  mounted() {
  }
};
</script>
<style lang="scss" scoped>
.ppt {
  .h3{
    display: block;
    font-size: 1.17em;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
  }
  .h2{
    display: block;
    font-size: 1.5em;
    margin-block-start: 0.83em;
    margin-block-end: 0.83em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
  }
  .algorithm {
    display: flex;
    font-weight: bold;
    .left {
      width: 50%;
      max-width: 50%;
      .step-desc {
        //font-size: 30px;
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
