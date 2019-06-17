<template>
  <div class="userinput">
    <div class="left">
      <el-table :data="tableData" class="table" border :header-cell-style="combineHeadCells">
        <el-table-column label="终止符号" class="terminal" align="center">
          <el-table-column class="terminalColumn" label="hide" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="delectSymbol(scope.row.terminal0)"
              >{{scope.row.terminal0}}</el-button>
            </template>
          </el-table-column>
          <el-table-column class="terminalColumn" label="hide" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="delectSymbol(scope.row.terminal1)"
              >{{scope.row.terminal1}}</el-button>
            </template>
          </el-table-column>
          <el-table-column class="terminalColumn" label="hide" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="delectSymbol(scope.row.terminal2)"
              >{{scope.row.terminal2}}</el-button>
            </template>
          </el-table-column>
          <el-table-column class="terminalColumn" label="hide" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="delectSymbol(scope.row.terminal3)"
              >{{scope.row.terminal3}}</el-button>
            </template>
          </el-table-column>
          <el-table-column class="terminalColumn" label="hide" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="delectSymbol(scope.row.terminal4)"
              >{{scope.row.terminal4}}</el-button>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="非终止符号" class="nonterminal" align="center">
          <el-table-column class="nonterminalColumn" label="hide" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="delectSymbol(scope.row.nonterminal0)"
              >{{scope.row.nonterminal0}}</el-button>
            </template>
          </el-table-column>
          <el-table-column class="nonterminalColumn" label="hide" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="delectSymbol(scope.row.nonterminal1)"
              >{{scope.row.nonterminal1}}</el-button>
            </template>
          </el-table-column>
          <el-table-column class="nonterminalColumn" label="hide" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="delectSymbol(scope.row.nonterminal2)"
              >{{scope.row.nonterminal2}}</el-button>
            </template>
          </el-table-column>
          <el-table-column class="nonterminalColumn" label="hide" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="delectSymbol(scope.row.nonterminal3)"
              >{{scope.row.nonterminal3}}</el-button>
            </template>
          </el-table-column>
          <el-table-column class="nonterminalColumn" label="hide" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="delectSymbol(scope.row.nonterminal4)"
              >{{scope.row.nonterminal4}}</el-button>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <el-row>
        <el-input placeholder="请输入自定义文法符号" v-model="symbol" clearable class="symbol"></el-input>
        <el-button round size="medium" @click="addTerminal">添加终止符号</el-button>
        <el-button round size="medium" @click="addNonterminal">添加非终止符号</el-button>
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
            autosize
            spellcheck="false"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button round size="medium" @click="getProductions">完成</el-button>
    </div>
  </div>
</template>
<script>
import GGFUI from "~/classes/algorithms/generate-grammar-from-user-input";
import smithTag from "~/components/smith-tag";
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
      nonterminals: ["A", "B", "C", "D", "E", "F", "T"],
      symbol: "",
      formalProductions: Array.of(),
      tip: "",
      rulesCFG: {
        CFG: [
          { max: 1200, message: "不能超过1200个字符", tirgger: "change" },
          { validator: validateCFG, trigger: "change" }
        ]
      },
      ruleForm: {
        CFG: ""
      }
    };
  },
  methods: {
    combineHeadCells({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 1) {
        return { display: "none" };
      }
    },
    addTerminal() {
      if (!this.newSymbolLegal(this.symbol)) {
        return;
      }
      this.terminals.push(this.symbol);
      this.symbol = "";
    },
    addNonterminal() {
      if (!this.newSymbolLegal(this.symbol)) {
        return;
      }
      this.nonterminals.push(this.symbol);
      this.symbol = "";
    },
    newSymbolLegal(newSymbol) {
      // 判断新添加的文法符号是否合法
      let symbol = newSymbol;
      symbol = symbol.replace(/\s+/g, ""); // 忽略符号中的空白字符
      if (symbol.length === 0) {
        this.$message("请输入非空符号");
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
        return;
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
        // console.log(this.formalProductions);
        this.generateGrammar();
      } else {
        this.$message("产生式中存在问题，请修改产生式");
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
.userinput {
  display: flex;
  flex-direction: row;
  position: relative;
  align-items: flex-start;
  justify-content: space-between;
  //top: 165px;
  .left {
    flex: 0 0 auto;
    .table {
      width: 100%;
      .terminal {
        text-align: center;
        .terminalColumn {
          width: 5%;
        }
      }
      .nonterminal {
        text-align: center;
        .nonterminalColumn {
          width: 5%;
        }
      }
    }
    .symbol {
      width: 20%;
      max-width: 20%;
    }
  }
  .right {
    flex: 1 0 auto;
    .production {
      width: 100%;
    }
  }
}
</style>
