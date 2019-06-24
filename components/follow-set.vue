<template>
  <div class="ppt">
    <div class="algorithm">
      <div class="left">
        <p class="title">算法流程：</p>
        <p
          class="step"
          v-for="(step,index) in algorithmSteps"
          :key="index"
          :class="{'active': curStep===index}"
        >{{step}}</p>
      </div>
      <div class="right">
        <p class="title">当前操作：</p>
        <p class="step">{{pre_notice}}</p>
        <p class="title">下一步操作：</p>
        <p class="step">{{notice}}</p>
      </div>
    </div>
    <div class="grammar-content">
      <div class="left">
        <GrammarIndicator
          style="width: 200px;"
          :grammar="grammar"
          :active="active"
          @changeProduction="onChagneProduction"
        ></GrammarIndicator>
      </div>
      <div class="center">
        <div class="up">
          <template v-if="gettingFirst.length > 0">
            <span class="title">First({{gettingFirst.map(e => e.getString()).join('')}})</span>
            <div class="set-div">
              <span
                v-for="(sign,index) in curFirstSet"
                :key="index"
                :class="{'active': curHighlightSymbols.indexOf(sign) !== -1}"
              >{{sign.getString()}}</span>
            </div>
          </template>
        </div>
        <div class="down">
        </div>
      </div>
      <div class="right">
        <el-table
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column
            label="NonTerminal"
            width="150"
          >
            <template slot-scope="scope">
              <span>{{scope.row.nonterminal}}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-for="index in passCount"
            :key="index"
            :label="'Pass ' + String(index)"
            width="120"
          >
            <template slot-scope="scope">
              <span>{{scope.row['pass' + String(index - 1)]}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div style="position: absolute; bottom: 10px;left: 10px;">
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
              @click="skip"
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
export default {
  components: {
    GrammarIndicator
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
      curHighlightSymbols: [],
      autoTime: 1000,
      autoTimer: null,
      isAllDone: false,
      gettingFirst: [],
      followset: null,
      pass_results: [],
      tableTerminals: [],
      tableNonterminals: [],
      processedSigns: []
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
        processedSigns
      } = this.wrapper.next();
      this.processedSigns = processedSigns
      this.gettingFirst = gettingFirst
      this.curStep = step;
      this.pre_notice = this.notice;
      this.notice = notice;
      this.curHighlightSymbols = highlightSymbols;
      this.active = active
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
        processedSigns
      } = this.wrapper.skip();
      this.processedSigns = processedSigns
      this.gettingFirst = gettingFirst
      this.curStep = step;
      this.pre_notice = this.notice;
      this.notice = notice;
      this.curHighlightSymbols = highlightSymbols;
      this.active = active
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
    runAll(restart = true){
      if(restart){
        this.start()
      }
      if(this.isAllDone === false){
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
    finish(){
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
        "在开始符号S的FOLLOW(S)中，加入$",
        "如果存在产生式A->αBβ，则将FIRST(β)中除ε以外的符号都放入FOLLOW(B)中",
        "如果存在产生式A->αB，或A->αBβ，其中FIRST(β)中包含ε，则将FOLLOW(A)中的所有符号放入FOLLOW(B)中"
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
          cur['pass' + pass] = values.map(e => e.getString()).join('')
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
    .left {
      width: 50%;
      max-width: 50%;
    }
    .right {
      width: 50%;
      max-width: 50%;
    }
    .title {
      font-size: 30px;
    }
    .step {
      font-size: 20px;
      padding: 5px;
      border: black solid 1px;
      &.active {
        background-color: yellow;
      }
    }
  }
  .grammar-content {
    display: flex;
    margin-top: 30px;
    height: 500px;
    > div {
      border: black solid 1px;
      border-right: none;
    }
    .left {
      width: 20%;
    }
    .center {
      width: 20%;
      height: 100%;
      .title {
        font-size: 26px;
      }
      .up {
        height: 50%;
      }
      .down {
        height: 50%;
      }
    }
    .right {
      width: 60%;
      position: relative;
    }
    .set-div {
      font-size: 22px;
      span {
        margin: 2px;
        padding: 2px;
      }
      .active {
        background-color: burlywood;
      }
    }
  }
}
</style>
