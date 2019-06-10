<template>
  <div class="analysis">
    <div class="left">
      <userInput
        :grammar="grammar"
        @getInput="getData"
      ></userInput>
      <el-input
        type="textarea"
        :rows="12"
        placeholder="预测分析表"
      ></el-input>
      <div style="position: relative; bottom: 10px;left: 10px;">
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
          @click="restart"
          v-if="started"
          type="primary"
        >重新开始</el-button>
      </div>
    </div>

    <div class="right">
      <el-table
        :data="stackData"
        style="width: 100%"
      >
        <el-table-column
          prop="matched"
          label="已匹配"
          width="180"
          align="right"
        ></el-table-column>
        <el-table-column
          prop="symbolStack"
          label="符号栈"
          width="180"
          align="right"
        ></el-table-column>
        <el-table-column
          prop="input"
          label="输入"
          align="right"
        ></el-table-column>
        <el-table-column
          prop="action"
          label="动作"
          align="right"
        ></el-table-column>
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
export default {
  components: {
    userInput
  },
  data() {
    const parsingStack = new ParsingStack();
    return {
      grammar: new Grammar(),
      active: 0,
      parsingStack,
      stack: parsingStack,
      PPT: "",
      PPTData: "",
      strToken: "",
      tempInput: [],
      inputData: "",
      Production: "",
      stackData: [],
      wrapper: null,
      pre_notice: "",
      notice: "",
      started: false,
      curStep: -1,
      autoTime: 1000,
      autoTimer: null,
      isAllDone: false,
    };
  },
  methods: {
    getData(val) {
      this.tempInput = val
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
      this.strToken = Result.strToken;
      this.isAllDone = this.wrapper.isAllDone();
      if (this.isAllDone && this.autoTimer !== null) {
        clearTimeout(this.autoTimer);
        this.autoTimer = null;
      }

      if (this.isAllDone) {
        this.pushTable()
        if (this.strToken.length > 1) {
          this.$message("无法继续匹配");
          return;
        } else {
          this.$message("匹配完成");
          return;
        }
      }else{
        this.pushTable(this.notice)
      }


    },
    next() {
      let {Production, notice} = this.wrapper.next();
      // this.pre_notice = this.notice
      this.notice = notice;
      this.Production = Production;
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
      this.grammar = grammar
      this.PPT = grammar.PPT
    },
    pushTable(notice=""){
      this.stackData.push({
        matched: this.Production,
        symbolStack: this.stack.getStringStack(),
        input: this.strTokenData,
        action: notice
      });
    },
    checkInput() {
      let val = this.tempInput
      let result = []
      if (val.length > 0) {
        for (let i of val) {
          if (this.grammar.checkSignsExist([i])) {
            try {
              let temp = this.grammar.getSign(i)
              if (temp.isNonterminal()){
                this.$message("输中存在非终结符，请重新输入")
                return false
              }else {
                result.push(temp)
              }
            } catch (e) {
              console.log(e)
            }
          } else {
            console.log(i)
            this.$message("输入了文法中不存在的符号，请重新修改")
            return false
          }
        }
      }
      if(result.length==0){
        return false
      }
      this.inputData = result
      return true
    }
  },
  computed: {
    strTokenData() {
      let result = "";
      for (let i of this.strToken) {
        result += i.getString();
      }
      return result;
    }
  },
  mounted() {
  }
};
</script>

<style lang="scss" scoped>
.analysis {
  display: flex;
  width: 70%;
  margin: 30px auto;
  .left {
    width: 30%;
    * {
      margin-bottom: 30px;
    }
  }
  .right {
    /*padding-left: 20px;*/
    width: 70%;
    position: relative;
  }
}
</style>
