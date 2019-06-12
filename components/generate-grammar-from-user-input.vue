<template>
  <div class="userinput">
    <div class="right">
      <el-table :data="tableData" class="table">
        <el-table-column label="终止符号" class="terminal">
          <el-table-column class="terminalColumn">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="delectSymbol(scope.row.terminal0)"
              >{{scope.row.terminal0}}</el-button>
            </template>
          </el-table-column>
          <el-table-column class="terminalColumn">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="delectSymbol(scope.row.terminal1)"
              >{{scope.row.terminal1}}</el-button>
            </template>
          </el-table-column>
          <el-table-column class="terminalColumn">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="delectSymbol(scope.row.terminal2)"
              >{{scope.row.terminal2}}</el-button>
            </template>
          </el-table-column>
          <el-table-column class="terminalColumn">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="delectSymbol(scope.row.terminal3)"
              >{{scope.row.terminal3}}</el-button>
            </template>
          </el-table-column>
          <el-table-column class="terminalColumn">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="delectSymbol(scope.row.terminal4)"
              >{{scope.row.terminal4}}</el-button>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="非终止符号" class="nonterminal">
          <el-table-column class="nonterminalColumn">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="delectSymbol(scope.row.nonterminal0)"
              >{{scope.row.nonterminal0}}</el-button>
            </template>
          </el-table-column>
          <el-table-column class="nonterminalColumn">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="delectSymbol(scope.row.nonterminal1)"
              >{{scope.row.nonterminal1}}</el-button>
            </template>
          </el-table-column>
          <el-table-column class="nonterminalColumn">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="delectSymbol(scope.row.nonterminal2)"
              >{{scope.row.nonterminal2}}</el-button>
            </template>
          </el-table-column>
          <el-table-column class="nonterminalColumn">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="delectSymbol(scope.row.nonterminal3)"
              >{{scope.row.nonterminal3}}</el-button>
            </template>
          </el-table-column>
          <el-table-column class="nonterminalColumn">
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
    <div class="left">
      <el-form ref="ruleForm" :rules="rulesCFG" :model="ruleForm" label-width="0px">
        <el-form-item prop="CFG">
          <el-input
            placeholder="请输入文法规则: 例子： A->B|c B->a|b"
            type="textarea"
            v-model="ruleForm.CFG"
            autosize
            spellcheck="false"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button round size="medium" @click="getProductions">完成</el-button>
    </div>
    <!-- <div class="left">
      <smithTag></smithTag>
    </div>-->
    <!-- <div class="left">
      <el-autocomplete
        v-model="tip"
        :fetch-suggestions="querySearch"
        placeholder="请输入产生式"
        :trigger-on-focus="false"
        @select="handleSelect"
      >
        <template slot-scope="{item}">
          <span>{{item.symbol}}</span>
        </template>
      </el-autocomplete>
    </div>-->
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
          let production = productions[i].replace(/\s+/g, "");
          try {
            if (!this.headIsNonterminal(production[0])) {
              callback(
                new Error(
                  "符号" +
                    production[0] +
                    "不是非终止字符，不可以放在产生式头部"
                )
              );
            } else if (!(production[1] === "-" && production[2] === ">")) {
              callback(
                new Error(
                  "第" + (i + 1).toString() + "条产生式缺少'->',请按格式输入"
                )
              );
            } else {
              production = production.split(/->|\|/);
              for (let j = 1; j < production.length; j++) {
                let body = production[j];
                let start = 0;
                let end = 1;
                while (end <= body.length) {
                  let symbol = body.slice(start, end);
                  if (this.currentInputIslegal(symbol)) {
                    start = end;
                    end++;
                  } else {
                    end++;
                  }
                }
                if (start !== body.length) {
                  let errorSymbol = body.slice(start, end);
                  callback(
                    new Error(
                      "字符 " +
                        errorSymbol +
                        " 不合法，请将该符号添加到符号表或重新输入"
                    )
                  );
                }
              }
            }
          } catch (e) {
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
      terminals: ["(", ")", "+", "-", "*", "a", "b", "c"],
      nonterminals: ["A", "B", "C", "D", "E"],
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
    addTerminal() {
      let newTerminal = this.symbol;
      for (let i of this.terminals) {
        if (i === newTerminal) {
          this.$message("终止符号已存在");
          return;
        }
      }
      for (let i of this.nonterminals) {
        if (i === newTerminal) {
          this.$message("该符号是一个已存在的非终止符号");
          return;
        }
      }
      this.terminals.push(newTerminal);
      this.symbol = "";
    },
    addNonterminal() {
      let newNonterminal = this.symbol;
      for (let i of this.nonterminals) {
        if (i === newNonterminal) {
          this.$message("非终止符号已存在");
          return;
        }
      }
      for (let i of this.terminals) {
        if (i === newNonterminal) {
          this.$message("该符号是一个已存在的终止符号");
          return;
        }
      }
      this.nonterminals.push(newNonterminal);
      this.symbol = "";
    },
    getProductions() {
      if (this.ruleForm.CFG.length === 0) {
        this.$message("请输入产生式");
        return;
      }
      let productions = Array.of();
      productions = this.ruleForm.CFG.split(/\n/);
      productions = productions.map(e => e.replace(/\s+/g, ""));
      productions = productions.map(e => e.split(/->|\|/));
      productions = productions.map(e => {
        let production = Array.of();
        let head = e[0];
        production.push(this.charToSign(head));
        for (let i = 1; i < e.length; i++) {
          let bodyString = e[i];
          let bodySign = Array.of();
          let start = 0;
          let end = 1;
          while (end <= bodyString.length) {
            let symbol = bodyString.slice(start, end);
            if (this.currentInputIslegal(symbol)) {
              bodySign.push(this.charToSign(symbol));
              start = end;
              end++;
            } else {
              end++;
            }
          }
          production.push(bodySign);
        }
        return production;
      });
      this.formalProductions = [...productions];
      console.log(this.formalProductions);
      this.generateGrammar();
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
  position: relative;
  //top: 165px;
  .right {
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
  .left {
    .production {
      width: 100%;
    }
  }
}
</style>
