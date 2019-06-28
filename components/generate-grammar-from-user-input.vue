<template>
  <div class="userinput">
    <div class="top">
      <el-collapse v-model="activeCollapse">
        <el-collapse-item name="1">
          <template slot="title">
            <h3>提示</h3>
          </template>
          <div class="notice">
            <div class="left">
              拟定的文法应属于上下文无关文法
              <br>文法符号使用前必须先添加至下方符号表中
              <br>第一条产生式的头部默认为文法的开始符号
              <br>开始符号将在符号表中高亮为红色
            </div>
            <div class="center">
              产生式格式：产生式头 -> 产生式体
              <br>产生式头是单个非终止符号
              <br>产生式体是由终止符号和非终止符号组成的串或空串
              <br>产生式体中不同文法符号之间用空格隔开
            </div>
            <div class="right">
              例如：
              <br>E -> A a | B b
              <br>A -> a id | ε
              <br>B -> b | ε
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="medium">
      <el-collapse v-model="activeCollapse">
        <el-collapse-item name="2">
          <template slot="title">
            <h3>符号表</h3>
          </template>
          <el-table
            :data="symbolTable"
            class="table"
            border
            :header-cell-style="combineHeadCells"
            :span-method="symbolTableRowSpan"
            max-height="202"
          >
            <el-table-column label="终止符号" align="center">
              <el-table-column class="terminalColumn" label="hide" align="center">
                <template slot-scope="scope">
                  <el-tag
                    closable
                    type
                    effect="dark"
                    size="medium"
                    style="font-size:15px"
                    v-if="scope.row.terminal0"
                    :disable-transitions="false"
                    class="tag"
                    @close="delectSymbol(scope.row.terminal0)"
                    @click="inputSymbolByClick(scope.row.terminal0)"
                  >{{scope.row.terminal0}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column class="terminalColumn" label="hide" align="center">
                <template slot-scope="scope">
                  <el-tag
                    closable
                    type
                    effect="dark"
                    size="medium"
                    style="font-size:15px"
                    class="tag"
                    v-if="scope.row.terminal1"
                    :disable-transitions="false"
                    @close="delectSymbol(scope.row.terminal1)"
                    @click="inputSymbolByClick(scope.row.terminal1)"
                  >{{scope.row.terminal1}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column class="terminalColumn" label="hide" align="center">
                <template slot-scope="scope">
                  <el-tag
                    closable
                    type
                    effect="dark"
                    size="medium"
                    style="font-size:15px"
                    class="tag"
                    v-if="scope.row.terminal2"
                    @close="delectSymbol(scope.row.terminal2)"
                    @click="inputSymbolByClick(scope.row.terminal2)"
                  >{{scope.row.terminal2}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column class="terminalColumn" label="hide" align="center">
                <template slot-scope="scope">
                  <el-tag
                    closable
                    type
                    effect="dark"
                    size="medium"
                    style="font-size:15px"
                    class="tag"
                    v-if="scope.row.terminal3"
                    @close="delectSymbol(scope.row.terminal3)"
                    @click="inputSymbolByClick(scope.row.terminal3)"
                  >{{scope.row.terminal3}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column class="terminalColumn" label="hide" align="center">
                <template slot-scope="scope">
                  <el-tag
                    closable
                    type
                    effect="dark"
                    size="medium"
                    style="font-size:15px"
                    class="tag"
                    v-if="scope.row.terminal4"
                    @close="delectSymbol(scope.row.terminal4)"
                    @click="inputSymbolByClick(scope.row.terminal4)"
                  >{{scope.row.terminal4}}</el-tag>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="非终止符号" align="center">
              <el-table-column class="nonterminalColumn" label="hide" align="center">
                <template slot-scope="scope">
                  <el-tag
                    closable
                    :type="isStartSymbol(scope.row.nonterminal0)"
                    effect="dark"
                    size="medium"
                    style="font-size:15px"
                    class="tag"
                    v-if="scope.row.nonterminal0"
                    @close="delectSymbol(scope.row.nonterminal0)"
                    @click="inputSymbolByClick(scope.row.nonterminal0)"
                  >{{scope.row.nonterminal0}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column class="nonterminalColumn" label="hide" align="center">
                <template slot-scope="scope">
                  <el-tag
                    closable
                    :type="isStartSymbol(scope.row.nonterminal1)"
                    effect="dark"
                    size="medium"
                    style="font-size:15px"
                    class="tag"
                    v-if="scope.row.nonterminal1"
                    @close="delectSymbol(scope.row.nonterminal1)"
                    @click="inputSymbolByClick(scope.row.nonterminal1)"
                  >{{scope.row.nonterminal1}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column class="nonterminalColumn" label="hide" align="center">
                <template slot-scope="scope">
                  <el-tag
                    closable
                    :type="isStartSymbol(scope.row.nonterminal2)"
                    effect="dark"
                    size="medium"
                    style="font-size:15px"
                    class="tag"
                    v-if="scope.row.nonterminal2"
                    @close="delectSymbol(scope.row.nonterminal2)"
                    @click="inputSymbolByClick(scope.row.nonterminal2)"
                  >{{scope.row.nonterminal2}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column class="nonterminalColumn" label="hide" align="center">
                <template slot-scope="scope">
                  <el-tag
                    closable
                    :type="isStartSymbol(scope.row.nonterminal3)"
                    effect="dark"
                    size="medium"
                    style="font-size:15px"
                    class="tag"
                    v-if="scope.row.nonterminal3"
                    @close="delectSymbol(scope.row.nonterminal3)"
                    @click="inputSymbolByClick(scope.row.nonterminal3)"
                  >{{scope.row.nonterminal3}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column class="nonterminalColumn" label="hide" align="center">
                <template slot-scope="scope">
                  <el-tag
                    closable
                    :type="isStartSymbol(scope.row.nonterminal4)"
                    effect="dark"
                    size="medium"
                    style="font-size:15px"
                    class="tag"
                    v-if="scope.row.nonterminal4"
                    @close="delectSymbol(scope.row.nonterminal4)"
                    @click="inputSymbolByClick(scope.row.nonterminal4)"
                  >{{scope.row.nonterminal4}}</el-tag>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="特殊符号" align="center">
              <el-table-column label="hide" align="center">
                <el-tag
                  type="info"
                  effect="dark"
                  size="medium"
                  style="font-size:20px"
                  class="tag"
                  @click="inputSymbolByClick('ε')"
                >ε</el-tag>
                <el-tag
                  type="info"
                  effect="dark"
                  size="medium"
                  style="font-size:20px"
                  class="tag"
                  @click="inputSymbolByClick('->')"
                >-></el-tag>
                <el-tag
                  type="info"
                  effect="dark"
                  size="medium"
                  style="font-size:20px"
                  class="tag"
                  @click="inputSymbolByClick('|')"
                >|</el-tag>
              </el-table-column>
            </el-table-column>
          </el-table>
          <el-row class="bottom">
            <el-input
              placeholder="请输入自定义文法符号"
              v-model="symbol"
              clearable
              class="symbol"
              spellcheck="false"
            ></el-input>
            <el-button round size="medium" @click="addTerminal" class="addSymbolButton">添加终止符号</el-button>
            <el-button round size="medium" @click="addNonterminal" class="addSymbolButton">添加非终止符号</el-button>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="down">
      <el-form ref="ruleForm" :rules="rulesCFG" :model="ruleForm" label-width="0px" class="input">
        <el-form-item prop="CFG">
          <el-input
            type="textarea"
            rows="4"
            placeholder="请输入产生式"
            v-model="ruleForm.CFG"
            spellcheck="false"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="button">
        <el-button round size="medium" @click="generateGrammar(true)">开始分析</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import GGFUI from "~/classes/algorithms/generate-grammar-from-user-input";
import Grammar from "~/classes/grammar";
export default {
  data() {
    var validateCFG = (rule, value, callback) => {
      let productions = value.split(/\n/);
      let empty = true;
      // 设置开始符号的 for 循环
      for (let i = 0; i < productions.length; i++) {
        if (
          productions[i] !== "" &&
          productions[i].match(/->/g) !== null &&
          productions[i].match(/->/g).length === 1
        ) {
          let prodution = productions[i].split(/->/);
          this.startSymbol = prodution[0].match(/\S+/)[0];
          break;
        }
      }
      for (let i = 0; i < productions.length; i++) {
        if (productions[i] !== "") {
          empty = false;
          // let production = productions[i].replace(/\s+/g, ""); // 忽略一条产生式中的空白字符
          let production = productions[i];
          try {
            //首先检测产生式中是否有且仅有一个 -> 字符
            const arrow = /->/g;
            if (
              production.match(arrow) === null ||
              production.match(arrow).length !== 1
            ) {
              callback(
                new Error(
                  "第" + (i + 1).toString() + "条产生式格式错误,请按格式输入"
                )
              );
            }
            production = production.split(/->/); // 把产生式以箭头符号为界限分为两部分，前为head后为body
            let head = production[0]; // head是一个完整的字符
            head = head.replace(/\s+/, ""); // 忽略head中的空格
            let bodys = production[1].split(/\|/); // 把body按照 | 符号分开
            if (!this.headIsNonterminal(head)) {
              callback(
                new Error(
                  "符号" + head + "不是非终止字符，不可以放在产生式头部"
                )
              );
            }
            for (let body of bodys) {
              let symbols = body.match(/\S+/g);
              if (symbols === null || symbols.lenght === 0) {
                callback(new Error("产生式体不能为空"));
              }
              for (let symbol of symbols) {
                if (!this.currentInputIslegal(symbol)) {
                  callback(new Error(`符号 ${symbol} 未定义`));
                }
                if (symbol === "ε" && symbols.length > 1) {
                  callback(
                    new Error(`产生式格式错误，不可以同时包含 ε 和其他符号`)
                  );
                }
              }
            }
          } catch (e) {
            console.log(e.message);
            callback(
              new Error(
                "第" + (i + 1).toString() + "条产生式不合法，请重新输入"
              )
            );
          }
        }
      }
      if (empty === true) {
        callback(new Error("输入不能为空"));
      } else {
        callback();
      }
    };
    return {
      terminals: ["(", ")", "+", "-", "*", "a", "b", "c", "id"],
      nonterminals: ["A", "B", "C", "D", "E", "F", "T", "E'", "T'", "F'"],
      // terminals: [],
      // nonterminals: [],
      symbol: "",
      tagInputSymbol: "",
      formalProductions: Array.of(),
      grammar: new Grammar(),
      startSymbol: null, // 当前文法的开始符号
      tip: "",
      rulesCFG: {
        CFG: [
          { max: 1200, message: "不能超过1200个字符", tirgger: "change" },
          { validator: validateCFG, trigger: "change" }
        ]
      },
      ruleForm: {
        CFG: ""
      },
      symbolInputVisible: {
        terminal0: false,
        terminal1: false,
        terminal2: false,
        terminal3: false,
        terminal4: false,
        nonterminal0: false,
        nonterminal1: false,
        nonterminal2: false,
        nonterminal3: false,
        nonterminal4: false
      },
      activeCollapse: ["1", "2"]
    };
  },
  methods: {
    isStartSymbol(symbol) {
      if (symbol === this.startSymbol) {
        return "danger";
      } else {
        return "";
      }
    },
    hasInput() {
      if (this.ruleForm.CFG.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    inputSymbolByClick(symbol) {
      this.ruleForm.CFG += symbol + " ";
      this.focusInputArea();
    },
    focusInputArea() {
      this.$refs.ruleForm.$children[0].$children[1].$refs.textarea.focus();
    },
    symbolTableRowSpan({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 10) {
        if (rowIndex === 0) {
          return {
            rowspan: this.symbolTable.length,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    showInput(val) {
      this.symbolInputVisible[val] = true;
      this.$nextTick(() => {
        this.$refs[val].$refs.input.focus();
      });
    },
    combineHeadCells({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 1) {
        return { display: "none" };
      }
    },
    addTerminal(val) {
      if (this.newSymbolLegal(this.symbol)) {
        this.terminals.push(this.symbol);
        this.symbol = "";
      } else if (this.newSymbolLegal(this.tagInputSymbol)) {
        this.terminals.push(this.tagInputSymbol);
        this.symbolInputVisible[val] = false;
        this.tagInputSymbol = "";
      } else {
        this.symbolInputVisible[val] = false;
        this.tagInputSymbol = "";
      }
      return;
    },
    addNonterminal(val) {
      if (this.newSymbolLegal(this.symbol)) {
        this.nonterminals.push(this.symbol);
        this.symbol = "";
      } else if (this.newSymbolLegal(this.tagInputSymbol)) {
        this.nonterminals.push(this.tagInputSymbol);
        this.symbolInputVisible[val] = false;
        this.tagInputSymbol = "";
      } else {
        this.symbolInputVisible[val] = false;
        this.tagInputSymbol = "";
      }
      return;
    },
    newSymbolLegal(newSymbol) {
      // 判断新添加的文法符号是否合法
      let symbol = newSymbol;
      symbol = symbol.replace(/\s+/g, ""); // 忽略符号中的空白字符
      if (symbol.length === 0) {
        return false;
      }
      const illegalSymbol = /(-|>|\||\$|ε)+/;
      if (illegalSymbol.test(symbol)) {
        this.$message(`符号 ${symbol} 不可定义为文法符号`);
        return false;
      }
      for (let i of this.nonterminals) {
        if (i === symbol) {
          this.$message("该符号是一个已存在的非终止符号");
          return false;
        }
      }
      for (let i of this.terminals) {
        if (i === symbol) {
          this.$message("该符号是一个已存在的终止符号");
          return false;
        }
      }
      return true;
    },
    getProductions() {
      if (this.ruleForm.CFG.length === 0) {
        this.$message("请输入产生式");
        return false;
      }
      let productions = Array.of();
      productions = this.ruleForm.CFG.split(/\n/);
      // console.log(productions);
      if (this.productionsIsLegal(productions)) {
        const formalPros = [];
        for (const production of productions) {
          if (production !== "") {
            let tempPro = production.split(/->/);
            let head = tempPro[0].replace(/\s+/g, "");
            let bodys = tempPro[1].split(/\|/);
            for (let body of bodys) {
              const formalPro = [];
              formalPro.push(this.charToSign(head));
              const formalBody = [];
              let symbols = body.match(/\S+/g);
              for (let symbol of symbols) {
                formalBody.push(this.charToSign(symbol));
              }
              formalPro.push(formalBody);
              formalPros.push(formalPro);
            }
          }
        }
        this.formalProductions = formalPros;
        return true;
        // console.log(this.formalProductions);
      } else {
        this.$message("产生式中存在问题，请修改产生式");
        return false;
      }
    },
    productionsIsLegal(productions) {
      let emptyLine = 0; // 空行
      for (let production of productions) {
        if (production !== "") {
          if (
            production.match(/->/g) === null ||
            production.match(/->/g).length !== 1
          ) {
            return false;
          }
          let headAndBodys = production.split(/->/);
          let head = headAndBodys[0].replace(/\s+/g, "");
          let bodys = headAndBodys[1].split(/\|/);
          if (!this.headIsNonterminal(head)) {
            return false;
          }
          for (let body of bodys) {
            let symbols = body.match(/\S+/g);
            if (symbols === null) {
              return false;
            }
            for (let symbol of symbols) {
              if (!this.currentInputIslegal(symbol)) {
                return false;
              }
              if (symbol === "ε" && symbols.length > 1) {
                return false;
              }
            }
          }
        } else {
          emptyLine++;
        }
      }
      if (emptyLine === productions.length) {
        // 空行的个数等于产生式的个数
        this.$message("请输入产生式");
        return false;
      }
      return true;
    },
    charToSign(val) {
      for (let i of this.terminals) {
        if (val === i) {
          return { symbol: i, type: "Terminal" };
        }
      }
      for (let i of this.nonterminals) {
        if (val === i) {
          return { symbol: i, type: "Nonterminal" };
        }
      }
      if (val === "ε") {
        return { symbol: "ε", type: "Empty" };
      }
      this.$message("不存在符号 " + val + " ，请将符号添加至符号表或重新输入");
    },
    currentInputIslegal(val) {
      if (val === "ε") {
        return true;
      } else if (val === "") {
        return true;
      }
      for (let i of this.terminals) {
        if (val === i) {
          return true;
        }
      }
      for (let i of this.nonterminals) {
        if (val === i) {
          return true;
        }
      }
      return false;
    },
    headIsNonterminal(val) {
      if (val === "") {
        return false;
      }
      for (let i of this.nonterminals) {
        if (val === i) {
          return true;
        }
      }
      return false;
    },
    delectSymbol(val) {
      this.terminals = this.terminals.filter(e => e !== val);
      this.nonterminals = this.nonterminals.filter(e => e !== val);
    },
    generateGrammar(jump = false) {
      if (this.getProductions()) {
        let grammar = new GGFUI(this.formalProductions);
        {
          console.log("Start symbol: " + grammar.getStartSign().getString());
          console.log("Productions");
          grammar.productions.forEach(e => {
            console.log(e.getHeadString() + "->" + e.getBodyString());
          });
          let nonterminals2 = "";
          grammar.getNonterminals().forEach(e => {
            nonterminals2 += e.getString() + " ";
          });
          console.log("Nonterminals: " + nonterminals2);
          let terminals2 = "";
          grammar.getTerminals().forEach(e => {
            terminals2 += e.getString() + " ";
          });
          console.log("Terminals: " + terminals2);
        }
        let result = this.grammarIsLegal(grammar);
        if (result) {
          if (jump) {
            this.$eventbus.$emit("FinishInputGrammar", grammar);
          }
          this.startSymbol = grammar.getStartSign().getString();
          return grammar;
        } else {
          return false;
        }
      }
    },
    grammarIsLegal(grammar) {
      if (grammar.getTerminals().length === 0) {
        this.$message(
          "当前文法没有终止符号，不是合法的上下文无关文法，请重新输入"
        );
        return false;
      }
      if (grammar.getNonterminals().length === 0) {
        this.$message(
          "当前文法没有非终止符号，不是合法的上下文无关文法，请重新输入"
        );
        return false;
      }
      if (grammar.getProductions().length === 0) {
        this.$message(
          "当前文法没有产生式，不是合法的上下文无关文法，请重新输入"
        );
        return false;
      }
      return true;
    },
    querySearch(queryString, cb) {
      let signs = [...this.terminals, ...this.nonterminals];
      signs = signs.map(e => {
        let temp = {};
        temp.symbol = e;
        return temp;
      });
      let results = queryString
        ? signs.filter(this.createFilter(queryString))
        : signs;
      cb(results);
    },
    createFilter(val) {
      return sign => {
        val = val.slice(-1);
        return sign.symbol.indexOf(val) === 0;
      };
    }
  },
  computed: {
    symbolTable() {
      let terminals = [...this.terminals];
      let nonterminals = [...this.nonterminals];
      let temp = Array.of();
      let terminalIndex = 0;
      let nonterminalIndex = 0;
      while (
        terminalIndex < terminals.length ||
        nonterminalIndex < nonterminals.length
      ) {
        let row = {};
        for (let i = 0; i < 5; i++) {
          if (terminalIndex < terminals.length) {
            row["terminal" + i] = terminals[terminalIndex];
            terminalIndex++;
          }
          if (nonterminalIndex < nonterminals.length) {
            row["nonterminal" + i] = nonterminals[nonterminalIndex];
            nonterminalIndex++;
          }
        }
        temp.push(row);
      }
      if (terminalIndex === 0 && nonterminalIndex === 0) {
        temp.push({ empty: 0 });
      }
      return temp;
    }
  },
  watch: {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
.userinput {
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  justify-content: space-around;
  .top {
    width: 90%;
    .notice {
      font-size: 15px;
      font-family: Arial;
      color: #b4b7b9;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
    }
  }
  .medium {
    width: 90%;
    .table {
      .tag {
        margin-top: 2px;
        margin-bottom: 2px;
        width: 60px;
        overflow-x: auto;
        overflow-y: hidden;
        &:hover {
          cursor: pointer;
        }
      }
      .tag::-webkit-scrollbar {
        height: 4px;
      }
      .tag::-webkit-scrollbar-track {
        background-color: rgba(64, 158, 255, 0.1);
        border-radius: 0;
      }
      .tag::-webkit-scrollbar-thumb {
        background-color: #409eff;
        border-radius: 2px;
      }
    }
    .bottom {
      margin-top: 10px;
      .symbol {
        width: 30%;
      }
      .addSymbolButton {
        width: 20%;
      }
    }
  }
  .down {
    margin-top: 10px;
    width: 90%;
    .input {
      width: 100%;
    }
  }
}
</style>
