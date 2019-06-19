<template>
  <div class="first-set">
    <div class="left">
      <GrammarIndicator
        style="width: 200px;"
        :grammar="grammar"
        :active="activeProductionIndex"
        @changeProduction="onChagneProduction"
      ></GrammarIndicator>
    </div>
    <div class="center">
      <p class="up">当前步骤</p>
      <p class="notice">{{notice}}</p>
      <template v-if="dependSymbolIndex!==null">
        <el-button class="down">{{dependSymbolFirstSet}}</el-button>
      </template>
    </div>
    <div class="right">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="文法符号" style="font-size:20px">
          <template slot-scope="scope">
            <span style="font-size:20px">{{scope.row.symbol}}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(pass,index) in tableColumnIndex"
          :key="index"
          :label="pass.toString()"
          style="font-size:20px"
        >
          <template slot-scope="scope">
            <HighlightTableCell
              :string="getCell(scope.row,pass)"
              :highlightSymbol="getHighlightSymbol(scope.row,pass)"
            ></HighlightTableCell>
          </template>
        </el-table-column>
      </el-table>
      <div class="button">
        <template v-if="started === false">
          <el-button type="primary" @click="start">开始</el-button>
        </template>
        <template v-if="started === true && allDone === false">
          <el-button type="success" @click="next">下一步</el-button>
          <el-button type="warning" @click="skip">跳过</el-button>
          <el-button type="info" @click="startAutorun" v-if="autoTimer === null">自动播放</el-button>
          <el-button type="danger" @click="stopAutorun" v-if="autoTimer !== null">停止播放</el-button>
        </template>
        <el-button @click="start" v-if="started" type="primary">重新开始</el-button>
        <!-- <el-button type="primary" @click="finish">完成</el-button> -->
      </div>
    </div>
  </div>
</template>
<script>
import GrammarIndicator from "~/components/grammar-indicator";
import FirstSet from "~/classes/algorithms/generate-first-set";
import Grammar from "~/classes/grammar";
import AlgorithmWrapper from "~/classes/algorithm-wrapper";
import MapSet from "~/classes/map-set";
import HighlightTableCell from "~/components/highlight-table-cell";
export default {
  components: {
    GrammarIndicator,
    HighlightTableCell
  },
  data() {
    return {
      grammar: new Grammar(),
      activeProductionIndex: 0,
      wrapperReturn: null,
      wrapperSkipReturn: null,
      allFirstSet: null, //一个三维数组，存储了所有文法符号的和对应的first集合
      dependSymbolIndex: null, //当前正在计算first集合的文法符号所依赖的文法符号在allFirstSet中的下标
      isTerminal: null, //当前正在计算first集合的文法符号是否为终止符号
      newlyIncreasedSymbol: "", //当前正在计算first集合的文法符号的first集合中新增的文法符号
      notice: "", //对当前计算步骤的描述
      production: null, //计算当前文法符号的first集合所依赖的产生式
      productionIndex: null, //计算当前文法符号的first集合所依赖的产生式在grammar.productions中的下标
      firstSetSymbol: null, //当前正在计算first集合的文法符号
      firstSetSymbolIndex: null, //当前正在计算first集合的文法符号在allFirstSet中的下标
      newTurn: null,
      oldTableData: null,
      oldTableColumnIndex: [],
      wrapper: null,
      started: false,
      allDone: false,
      autoTimer: null,
      autoTime: 1000,
      firstSet: null,
      currentTurn: 1
    };
  },
  computed: {
    dependSymbolFirstSet() {
      let firstSetString = " ";
      if (this.allFirstSet[this.dependSymbolIndex][2].length > 0) {
        firstSetString = this.allFirstSet[this.dependSymbolIndex][2]
          .map(e => e.getString())
          .join(", ");
        firstSetString =
          "first(" +
          this.allFirstSet[this.dependSymbolIndex][0].getString() +
          ")={" +
          firstSetString +
          "}";
        return firstSetString;
      } else {
        firstSetString =
          "first(" +
          this.allFirstSet[this.dependSymbolIndex][0].getString() +
          ")={" +
          firstSetString +
          "}";
        return firstSetString;
      }
    },
    tableData() {
      if (this.started) {
        let firstSet = "";
        this.allFirstSet[this.firstSetSymbolIndex][2].forEach(e => {
          firstSet += e.getString() + "  ";
        });
        firstSet = firstSet.slice(0, -2);
        if (this.newTurn !== this.currentTurn) {
          // 如果轮次更新了，就先把上一轮的结果复制到本轮
          for (let i = 0; i < this.oldTableData.length; i++) {
            if (i !== this.firstSetSymbolIndex) {
              this.$set(
                this.oldTableData[i],
                [this.newTurn],
                this.oldTableData[i][this.newTurn - 1]
              ); //Vue教程的深入响应式原理有详解
            }
          }
          this.currentTurn = this.newTurn;
        }
        for (let i = 0; i < this.oldTableData.length; i++) {
          if (i === this.firstSetSymbolIndex) {
            this.$set(this.oldTableData[i], [this.newTurn], firstSet); //Vue教程的深入响应式原理有详解
          }
        }
      }
      return this.oldTableData;
    },
    tableColumnIndex() {
      if (this.started) {
        let currentTurn = this.newTurn;
        if (
          currentTurn !==
          this.oldTableColumnIndex[this.oldTableColumnIndex.length - 1]
        ) {
          this.oldTableColumnIndex.push(currentTurn);
        }
      }
      return this.oldTableColumnIndex;
    }
  },
  methods: {
    getHighlightSymbol(row, pass) {
      if (
        pass === this.currentTurn &&
        row["symbol"] === this.firstSetSymbol.getString()
      ) {
        return this.newlyIncreasedSymbol;
      } else {
        return "";
      }
    },
    getCell(row, pass) {
      if (row[pass] === undefined) {
        return "";
      }
      return row[pass];
    },
    initTableData() {
      let initData = Array.of();
      for (let i of this.allFirstSet) {
        let row = {
          symbol: i[0].getString()
        };
        initData.push(row);
      }
      this.oldTableData = initData;
    },
    start() {
      const algorithm = new FirstSet(this.grammar);
      this.wrapper = new AlgorithmWrapper(algorithm);
      this.wrapper.init();
      this.started = true;
      this.allDone = false;
      this.oldTableData = null;
      this.oldTableColumnIndex = [];
      this.next();
      this.sync();
      this.initTableData();
    },
    sync() {
      if (!this.allDone) {
        this.allFirstSet = this.wrapperReturn.allFirstSet;
        this.dependSymbolIndex = this.wrapperReturn.dependSymbolIndex;
        this.isTerminal = this.wrapperReturn.isTerminal;
        if (this.wrapperReturn.newlyIncreasedSymbol !== null) {
          this.newlyIncreasedSymbol = this.wrapperReturn.newlyIncreasedSymbol.getString();
        } else {
          this.newlyIncreasedSymbol = "";
        }

        this.notice = this.wrapperReturn.notice;
        this.production = this.wrapperReturn.production;
        this.firstSetSymbolIndex = this.wrapperReturn.symbolIndex;
        this.firstSetSymbol = this.wrapperReturn.symbol;
        this.newTurn = this.wrapperReturn.turn;
        this.activeProductionIndex = this.wrapperReturn.productionIndex;
      } else {
        this.notice = "first集合计算完成";
        this.dependSymbolIndex = null;
      }
      if (this.autoTimer !== null) {
        clearTimeout(this.autoTimer);
        this.autoTimer = null;
      }
    },
    next() {
      this.wrapperReturn = this.wrapper.next();
      this.allDone = this.wrapper.isAllDone();
      this.sync();
    },
    skip() {
      while (true) {
        let firstSetSymbolIndex = this.wrapper.getContext().symbolIndex; //当前正在计算first集合的文法符号在this.allFirstSet中的下标
        this.allDone = this.wrapper.isAllDone();
        if (!this.allDone) {
          let wrapperSkipReturn = this.wrapper.skip(); //this.wrapper.skip()的返回值
          if (firstSetSymbolIndex === wrapperSkipReturn.symbolIndex) {
            //如果两者相等，则说明first集合有变化，正在计算的文法符号的first集合中添加了新的元素
            this.wrapperReturn = wrapperSkipReturn; //更新组件的this.wrapperReturn
            this.allDone = this.wrapper.isAllDone();
            this.sync();
            break;
          }
        } else {
          this.sync();
          break;
        }
      }
    },
    runAll(restart = true) {
      if (restart) {
        this.start();
      }
      if (this.allDone === false) {
        this.skip();
        this.$nextTick(() => {
          this.runAll(false);
        });
      }
    },
    startAutorun() {
      this.autoTimer = setTimeout(() => {
        this.autorun();
      }, this.autoTime);
    },
    autorun() {
      this.next();
      if (this.allDone) {
        this.autoTimer = null;
        return;
      }
      this.autoTimer = setTimeout(() => {
        this.autorun();
      }, this.autoTime);
    },
    stopAutorun() {
      clearTimeout(this.autoTimer);
      this.autoTimer = null;
    },
    onChagneProduction(index) {
      this.activeProductionIndex = index;
    },
    setGrammar(grammar) {
      this.grammar = grammar;
      this.runAll();
    },
    finish() {
      this.$eventbus.$emit("FinishFirstSet");
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.first-set {
  display: flex;
  justify-content: space-around;
  margin-top: 30px;
  height: 500px;
  .left {
    width: 10%;
  }
  .center {
    width: 20%;
    height: 100%;
    .up {
      font-size: 30px;
      height: 10%;
    }
    .notice {
      margin-top: 20px;
      font-size: 25px;
      margin-bottom: 20px;
      height: 80%;
    }
    .down {
      font-size: 30px;
      height: 10%;
    }
  }
  .right {
    width: 50%;
    position: relative;
    .button {
      margin-top: 10px;
    }
  }
}
</style>
