<template>
  <div class="analysis">
    <div class="up">
      <div class="user-input">
        <userInput :grammar="grammar" @getInput="getData"></userInput>

        <div >
          <template v-if="started === false">
            <el-button type="primary" @click="start">开始</el-button>
          </template>
          <template v-if="started === true && isAllDone === false">
            <el-button type="success" @click="next">下一步</el-button>
            <el-button type="warning" @click="skip">跳过</el-button>
            <el-button type="info" @click="startAutoPlay" v-if="autoTimer === null">自动播放</el-button>
            <el-button type="danger" @click="stopAutoPlay" v-if="autoTimer !== null">停止播放</el-button>
          </template>
          <el-button @click="restart" v-if="started" type="primary">重新开始</el-button>
        </div>
      </div>

      <div class="PPT">
        <el-table :data="tableData"
                  height="350"
        >
          <el-table-column label="Non Terminal">
            <template slot-scope="scope">
              <span>{{scope.row.nonterminal}}</span>
            </template>
          </el-table-column>
          <el-table-column label="Input Symbol" >
            <el-table-column
              v-for="(terminal,index) in tableTerminals"
              :key="index"
              :label="terminal"
            >
              <template slot-scope="scope" >
                <span v-if="scope.row[terminal] != M || terminal!=p">
                  {{scope.row[terminal]}}
                </span>
                <span class="active" v-else>
                  {{scope.row[terminal]}}
                </span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
      </div>





    <div class="down">
      <el-table :data="stackData"
                height="500"
                style="width: 100%">
        <el-table-column prop="matched" label="已匹配" width="180" align="right"></el-table-column>
        <el-table-column prop="symbolStack" label="符号栈" width="180" align="right"></el-table-column>
        <el-table-column prop="input" label="输入" align="right"></el-table-column>
        <el-table-column prop="action" label="动作" align="right"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import userInput from "~/components/userInput";
import AlgorithmWrapper from "~/classes/algorithm-wrapper";
import PredictiveParsingTable from "~/classes/predictive-parsing-table";
import GeneratePredictiveParsingTable from "~/classes/algorithms/generate-predictive-parsing-table";
import Grammar from "~/classes/grammar";
import MapSet from "~/classes/map-set";
import ParsingStack from "~/classes/parsing-stack";
import GenerateParsingStack from "~/classes/algorithms/generate-parsing-stack";
import sign from "../classes/sign";
import HighlightText from '~/components/highlight-text'

export default {
  components: {
    HighlightText,
    userInput
  },
  data() {
    const parsingStack = new ParsingStack();
    return {
      // todo:  变量命名规范
      grammar: new Grammar(),
      active: 0,
      parsingStack,
      stack: parsingStack,
      PPT: new PredictiveParsingTable(),
      PPTData: "",
      strToken: [],
      tempInput: [],
      inputData: "",
      p:"",
      M:"",
      Production: "",
      stackData: [],
      wrapper: null,
      pre_notice: "",
      notice: "",
      started: false,
      curStep: -1,
      autoTime: 1000,
      autoTimer: null,
      isAllDone: false
    };
  },
  methods: {
    getData(val) {
      this.tempInput = val;
    },
    start() {
      if (this.checkInput()) {
        const algorithm = new GenerateParsingStack(
          this.grammar,
          this.PPT,
          this.inputData
        );
        this.wrapper = new AlgorithmWrapper(algorithm);
        this.wrapper.init();
        this.started = true;
        this.isAllDone = false;
        this.next();
      }
    },
    restart() {
      this.stackData = [];
      this.start();
    },
    sync() {
      let Result = this.wrapper.getCurResult();
      this.stack = Result.stack;
      this.isAllDone = this.wrapper.isAllDone();
      if (this.isAllDone && this.autoTimer !== null) {
        clearTimeout(this.autoTimer);
        this.autoTimer = null;
      }

      if (this.isAllDone) {
        if (this.strToken.length > 1 || this.stack.getStack().length > 1) {
          this.$message("无法继续匹配");
          return;
        } else {
          this.$message("匹配完成");
          return;
        }
      } else {
        this.pushTable(this.notice);
      }
    },
    next() {
      let { p, M, Production, notice, token } = this.wrapper.next();

      if(M) {
        this.M = M.getString()
      }
      if(p){
        this.p = p.getString()
      }
      this.notice = notice;
      this.Production = Production;
      this.strToken = token;
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
    skip() {
      while (!this.isAllDone) {
        this.next();
      }
    },
    setGrammar(grammar) {
      this.grammar = grammar;
      this.PPT = grammar.PPT;
    },
    pushTable(notice = "") {
      this.stackData.push({
        matched: this.Production,
        symbolStack: this.stack.getStringStack(),
        input: this.strTokenData,
        action: notice
      });
    },
    checkInput() {
      let val = this.tempInput;
      let result = [];
      if (val.length > 0) {
        for (let i of val) {
          if (this.grammar.checkSignsExist([i])) {
            try {
              let temp = this.grammar.getSign(i);
              if (temp.isNonterminal()) {
                this.$message("输中存在非终结符，请重新输入");
                return false;
              } else if (
                temp === this.grammar.getEmptySign() ||
                temp === this.grammar.getStackBottomSign()
              ) {
                this.$message("栈底符号$和空符ε不能作为输入");
                return false;
              } else {
                result.push(temp);
              }
            } catch (e) {
              console.log(e);
            }
          } else {
            console.log(i)
            this.$message("输入了文法中不存在的符号，请重新输入");
            return false;
          }
        }
      }
      if (result.length == 0) {
        return false;
      }
      this.inputData = result;
      return true;
    }
  },
  computed: {
    tableTerminals() {
      const { nonterminals, terminals, table } = this.PPT.getTableData();
      return terminals.filter(e => !e.isEmpty()).map(e => e.getString());
    },
    tableData() {
      const { nonterminals, terminals, table } = this.PPT.getTableData();
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
    strTokenData() {
      let result = "";
      for (let i of this.strToken) {
        result += i.getString();
      }
      return result;
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.analysis {
  width: 90%;
  margin: 5px auto;
  .up {
    display: flex;
    width: 100%;
    height:350px;
    .active {
      background-color: rgba(252, 217, 21, 0.603);
    }
    .user-input{
      height: 50%;
      width: 29%;
    }
    .PPT {
      height: 100px;
      width: 70%;
      margin-left: 10px;
    }
    * {
      margin-bottom: 15px;
    }
  }
  .down {
    /*padding-left: 20px;*/
    width: 90%;
    position: relative;
    margin-top: 30px;
  }
}
</style>
