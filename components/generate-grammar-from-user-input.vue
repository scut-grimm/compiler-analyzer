<template>
  <div class="inputAndGrammar">
    <div class="userinput">
      <div class="left">
        <el-table
          :data="tableData"
          class="table"
          border
          :header-cell-style="combineHeadCells"
          :span-method="symbolTableRowSpan"
        >
          <el-table-column label="终止符号" class="terminal" align="center">
            <el-table-column class="terminalColumn" label="hide" align="center">
              <template slot-scope="scope">
                <el-tag
                  closable
                  type="danger"
                  effect="dark"
                  size="medium"
                  style="font-size:15px"
                  v-if="scope.row.terminal0"
                  :disable-transitions="false"
                  @close="delectSymbol(scope.row.terminal0)"
                  @click="inputSymbolByClick(scope.row.terminal0)"
                >{{scope.row.terminal0}}</el-tag>
                <el-input
                  class="input-new-symbol"
                  v-else-if="symbolInputVisible.terminal0"
                  v-model="tagInputSymbol"
                  ref="terminal0"
                  size="medium"
                  @keyup.enter.native="addTerminal('terminal0')"
                  @blur="addTerminal('terminal0')"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="mini"
                  @click="showInput('terminal0')"
                >+New</el-button>
              </template>
            </el-table-column>
            <el-table-column class="terminalColumn" label="hide" align="center">
              <template slot-scope="scope">
                <el-tag
                  closable
                  type="danger"
                  effect="dark"
                  size="medium"
                  style="font-size:15px"
                  v-if="scope.row.terminal1"
                  :disable-transitions="false"
                  @close="delectSymbol(scope.row.terminal1)"
                  @click="inputSymbolByClick(scope.row.terminal1)"
                >{{scope.row.terminal1}}</el-tag>
                <el-input
                  class="input-new-symbol"
                  v-else-if="symbolInputVisible.terminal1"
                  v-model="tagInputSymbol"
                  ref="terminal1"
                  size="medium"
                  @keyup.enter.native="addTerminal('terminal1')"
                  @blur="addTerminal('terminal1')"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="mini"
                  @click="showInput('terminal1')"
                >+New</el-button>
              </template>
            </el-table-column>
            <el-table-column class="terminalColumn" label="hide" align="center">
              <template slot-scope="scope">
                <el-tag
                  closable
                  type="danger"
                  effect="dark"
                  size="medium"
                  style="font-size:15px"
                  v-if="scope.row.terminal2"
                  @close="delectSymbol(scope.row.terminal2)"
                  @click="inputSymbolByClick(scope.row.terminal2)"
                >{{scope.row.terminal2}}</el-tag>
                <el-input
                  class="input-new-symbol"
                  v-else-if="symbolInputVisible.terminal2"
                  v-model="tagInputSymbol"
                  ref="terminal2"
                  size="medium"
                  @keyup.enter.native="addTerminal('terminal2')"
                  @blur="addTerminal('terminal2')"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="mini"
                  @click="showInput('terminal2')"
                >+New</el-button>
              </template>
            </el-table-column>
            <el-table-column class="terminalColumn" label="hide" align="center">
              <template slot-scope="scope">
                <el-tag
                  closable
                  type="danger"
                  effect="dark"
                  size="medium"
                  style="font-size:15px"
                  v-if="scope.row.terminal3"
                  @close="delectSymbol(scope.row.terminal3)"
                  @click="inputSymbolByClick(scope.row.terminal3)"
                >{{scope.row.terminal3}}</el-tag>
                <el-input
                  class="input-new-symbol"
                  v-else-if="symbolInputVisible.terminal3"
                  v-model="tagInputSymbol"
                  ref="terminal3"
                  size="medium"
                  @keyup.enter.native="addTerminal('terminal3')"
                  @blur="addTerminal('terminal3')"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="mini"
                  @click="showInput('terminal3')"
                >+New</el-button>
              </template>
            </el-table-column>
            <el-table-column class="terminalColumn" label="hide" align="center">
              <template slot-scope="scope">
                <el-tag
                  closable
                  type="danger"
                  effect="dark"
                  size="medium"
                  style="font-size:15px"
                  v-if="scope.row.terminal4"
                  @close="delectSymbol(scope.row.terminal4)"
                  @click="inputSymbolByClick(scope.row.terminal4)"
                >{{scope.row.terminal4}}</el-tag>
                <el-input
                  class="input-new-symbol"
                  v-else-if="symbolInputVisible.terminal4"
                  v-model="tagInputSymbol"
                  ref="terminal4"
                  size="medium"
                  @keyup.enter.native="addTerminal('terminal4')"
                  @blur="addTerminal('terminal4')"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="mini"
                  @click="showInput('terminal4')"
                >+New</el-button>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="非终止符号" class="nonterminal" align="center">
            <el-table-column class="nonterminalColumn" label="hide" align="center">
              <template slot-scope="scope">
                <el-tag
                  closable
                  type
                  effect="dark"
                  size="medium"
                  style="font-size:15px"
                  v-if="scope.row.nonterminal0"
                  @close="delectSymbol(scope.row.nonterminal0)"
                  @click="inputSymbolByClick(scope.row.nonterminal0)"
                >{{scope.row.nonterminal0}}</el-tag>
                <el-input
                  class="input-new-symbol"
                  v-else-if="symbolInputVisible.nonterminal0"
                  v-model="tagInputSymbol"
                  ref="nonterminal0"
                  size="medium"
                  @keyup.enter.native="addNonterminal('nonterminal0')"
                  @blur="addNonterminal('nonterminal0')"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="mini"
                  @click="showInput('nonterminal0')"
                >+New</el-button>
              </template>
            </el-table-column>
            <el-table-column class="nonterminalColumn" label="hide" align="center">
              <template slot-scope="scope">
                <el-tag
                  closable
                  type
                  effect="dark"
                  size="medium"
                  style="font-size:15px"
                  v-if="scope.row.nonterminal1"
                  @close="delectSymbol(scope.row.nonterminal1)"
                  @click="inputSymbolByClick(scope.row.nonterminal1)"
                >{{scope.row.nonterminal1}}</el-tag>
                <el-input
                  class="input-new-symbol"
                  v-else-if="symbolInputVisible.nonterminal1"
                  v-model="tagInputSymbol"
                  ref="nonterminal1"
                  size="medium"
                  @keyup.enter.native="addNonterminal('nonterminal1')"
                  @blur="addNonterminal('nonterminal1')"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="mini"
                  @click="showInput('nonterminal1')"
                >+New</el-button>
              </template>
            </el-table-column>
            <el-table-column class="nonterminalColumn" label="hide" align="center">
              <template slot-scope="scope">
                <el-tag
                  closable
                  type
                  effect="dark"
                  size="medium"
                  style="font-size:15px"
                  v-if="scope.row.nonterminal2"
                  @close="delectSymbol(scope.row.nonterminal2)"
                  @click="inputSymbolByClick(scope.row.nonterminal2)"
                >{{scope.row.nonterminal2}}</el-tag>
                <el-input
                  class="input-new-symbol"
                  v-else-if="symbolInputVisible.nonterminal2"
                  v-model="tagInputSymbol"
                  ref="nonterminal2"
                  size="medium"
                  @keyup.enter.native="addNonterminal('nonterminal2')"
                  @blur="addNonterminal('nonterminal2')"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="mini"
                  @click="showInput('nonterminal2')"
                >+New</el-button>
              </template>
            </el-table-column>
            <el-table-column class="nonterminalColumn" label="hide" align="center">
              <template slot-scope="scope">
                <el-tag
                  closable
                  type
                  effect="dark"
                  size="medium"
                  style="font-size:15px"
                  v-if="scope.row.nonterminal3"
                  @close="delectSymbol(scope.row.nonterminal3)"
                  @click="inputSymbolByClick(scope.row.nonterminal3)"
                >{{scope.row.nonterminal3}}</el-tag>
                <el-input
                  class="input-new-symbol"
                  v-else-if="symbolInputVisible.nonterminal3"
                  v-model="tagInputSymbol"
                  ref="nonterminal3"
                  size="medium"
                  @keyup.enter.native="addNonterminal('nonterminal3')"
                  @blur="addNonterminal('nonterminal3')"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="mini"
                  @click="showInput('nonterminal3')"
                >+New</el-button>
              </template>
            </el-table-column>
            <el-table-column class="nonterminalColumn" label="hide" align="center">
              <template slot-scope="scope">
                <el-tag
                  closable
                  type
                  effect="dark"
                  size="medium"
                  style="font-size:15px"
                  v-if="scope.row.nonterminal4"
                  @close="delectSymbol(scope.row.nonterminal4)"
                  @click="inputSymbolByClick(scope.row.nonterminal4)"
                >{{scope.row.nonterminal4}}</el-tag>
                <el-input
                  class="input-new-symbol"
                  v-else-if="symbolInputVisible.nonterminal4"
                  v-model="tagInputSymbol"
                  ref="nonterminal4"
                  size="medium"
                  @keyup.enter.native="addNonterminal('nonterminal4')"
                  @blur="addNonterminal('nonterminal4')"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="mini"
                  @click="showInput('nonterminal4')"
                >+New</el-button>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="特殊符号" align="center">
            <el-table-column>
              <el-tag
                type="info"
                effect="dark"
                size="medium"
                style="font-size:20px"
                @click="inputSymbolByClick('ε')"
              >ε</el-tag>
              <el-tag
                type="info"
                effect="dark"
                size="medium"
                style="font-size:20px"
                @click="inputSymbolByClick('->')"
              >-></el-tag>
              <el-tag
                type="info"
                effect="dark"
                size="medium"
                style="font-size:20px"
                @click="inputSymbolByClick('|')"
              >|</el-tag>
            </el-table-column>
          </el-table-column>
        </el-table>
        <el-row class="bottom">
          <el-input placeholder="请输入自定义文法符号" v-model="symbol" clearable class="symbol"></el-input>
          <el-button round size="medium" @click="addTerminal" class="addSymbolButton">添加终止符号</el-button>
          <el-button round size="medium" @click="addNonterminal" class="addSymbolButton">添加非终止符号</el-button>
        </el-row>
      </div>
      <div class="right">
        <el-form
          ref="ruleForm"
          :rules="rulesCFG"
          :model="ruleForm"
          label-width="0px"
          class="production"
        >
          <el-form-item prop="CFG">
            <el-input
              placeholder="请输入文法规则: 例子： A -> a b c 将产生式中的符号用空格隔开"
              type="textarea"
              v-model="ruleForm.CFG"
              :autosize="{minRows:5}"
              spellcheck="false"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button round size="medium" @click="generateGrammar">完成</el-button>
        <el-button round size="medium" @click="showGrammar">查看当前文法</el-button>
      </div>
    </div>
    <div class="currentGrammar" v-if="showCurrentGrammar">
      <el-table
        :data="currentGrammar"
        class="grammarTable"
        border
        :span-method="grammarTableRowSpan"
        :header-cell-style="combineHeadCells"
      >
        <el-table-column label="当前文法" align="center">
          <el-table-column label="hide" align="center">
            <template slot-scope="scope">
              <el-tag style="font-size: 20px">{{scope.row.name}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="hide" align="center">
            <template slot-scope="scope">
              <el-tag style="font-size: 20px">{{scope.row.data}}</el-tag>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import GGFUI from "~/classes/algorithms/generate-grammar-from-user-input";
import smithTag from "~/components/smith-tag";
import Grammar from "~/classes/grammar";
export default {
  components: {
    smithTag
  },
  data() {
    var validateCFG = (rule, value, callback) => {
      let productions = value.split(/\n/);
      let empty = true;
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
      symbol: "",
      tagInputSymbol: "",
      formalProductions: Array.of(),
      grammar: new Grammar(),
      showCurrentGrammar: false,
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
      }
    };
  },
  methods: {
    inputSymbolByClick(symbol) {
      this.ruleForm.CFG += symbol + " ";
      this.$refs.ruleForm.$children[0].$children[1].$refs.textarea.focus();
    },
    symbolTableRowSpan({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 10) {
        if (rowIndex === 0) {
          return {
            rowspan: this.tableData.length,
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
    showGrammar() {
      if (this.getProductions()) {
        this.grammar = new GGFUI(this.formalProductions);
        this.showCurrentGrammar = true;
      }
    },
    grammarTableRowSpan({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex === 0) {
          return {
            rowspan: 1,
            colspan: 1
          };
        }
        if (rowIndex === 1) {
          return {
            rowspan: 1,
            colspan: 1
          };
        }
        if (rowIndex === 2) {
          return {
            rowspan: 1,
            colspan: 1
          };
        }
        if (rowIndex === 3) {
          return {
            rowspan: this.grammar.getProductions().length,
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
    generateGrammar() {
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
          this.$eventbus.$emit("FinishInputGrammar", grammar);
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
    },
    handleSelect(item) {
      console.log(item);
      this.tip = item.symbol;
    }
  },
  computed: {
    currentGrammar() {
      let rows = Array.of();
      if (this.grammar.getProductions().length !== 0) {
        let row0 = {
          name: "开始符号",
          data: this.grammar.getStartSign().getString()
        };
        rows.push(row0);
        let row1 = {
          name: "非终止符号",
          data: ""
        };
        let nonterminals = this.grammar.getNonterminals();
        if (nonterminals.length !== 0) {
          for (const nonterminal of nonterminals) {
            row1.data += nonterminal.getString() + ", ";
          }
          row1.data = row1.data.slice(0, -2);
        }
        rows.push(row1);
        let row2 = {
          name: "终止符号",
          data: ""
        };
        let terminals = this.grammar.getTerminals();
        if (terminals.length !== 0) {
          for (const terminal of terminals) {
            row2.data += terminal.getString() + ", ";
          }
          row2.data = row2.data.slice(0, -2);
        }
        rows.push(row2);
        for (const production of this.grammar.getProductions()) {
          let rowP = {
            name: "产生式",
            data: production.getString()
          };
          rows.push(rowP);
        }
      }
      console.log(rows);
      return rows;
    },
    tableData() {
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
      return temp;
    }
  },
  watch: {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
.inputAndGrammar {
  display: flex;
  flex-direction: column;
  .userinput {
    display: flex;
    flex-direction: row;
    position: relative;
    align-items: flex-start;
    justify-content: space-around;
    .left {
      flex: 0 0 auto;
      margin-top: 20px;
      .table {
        width: 100%;
        .terminal {
          width: 50%;
          .terminalColumn {
            width: 5%;
          }
        }
        .nonterminal {
          width: 50%;
          .nonterminalColumn {
            width: 5%;
          }
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
    .right {
      margin-top: 20px;
      width: 40%;
      margin-left: 40px;
      .production {
        width: 80%;
      }
    }
  }
  .currentGrammar {
    width: 100%;
    .grammarTable {
    }
  }
}
</style>
