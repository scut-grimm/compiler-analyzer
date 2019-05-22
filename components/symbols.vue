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
      <el-input
        type="textarea"
        autosize
        placeholder="输入文法产生式"
        v-model="userInputProductions"
        class="production"
      >
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
      </el-input>
      <el-button round size="medium" @click="getProductions">完成</el-button>
    </div>
    <div class="left">
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
    </div>
  </div>
</template>
<script>
import Sign from "~/classes/sign";
import GGFUI from "~/classes/algorithms/generate-grammar-from-user-input";
export default {
  data() {
    return {
      terminals: [
        new Sign("(", "Terminal"),
        new Sign(")", "Terminal"),
        new Sign("+", "Terminal"),
        new Sign("-", "Terminal"),
        new Sign("*", "Terminal"),
        new Sign("a", "Terminal"),
        new Sign("b", "Terminal"),
        new Sign("c", "Terminal")
      ],
      nonterminals: [
        new Sign("A", "Nonterminal"),
        new Sign("B", "Nonterminal"),
        new Sign("C", "Nonterminal"),
        new Sign("D", "Nonterminal"),
        new Sign("E", "Nonterminal")
      ],
      symbol: "",
      userInputProductions: "",
      formalProductions: Array.of(),
      tip: ""
    };
  },
  methods: {
    addTerminal() {
      let newTerminal = new Sign(this.symbol, "Terminal");
      for (let i of this.terminals) {
        if (i.getString() === newTerminal.getString()) {
          this.$message("终止符号已存在");
          return;
        }
      }
      for (let i of this.nonterminals) {
        if (i.getString() === newTerminal.getString()) {
          this.$message("该符号是一个已存在的非终止符号");
          return;
        }
      }
      this.terminals.push(newTerminal);
    },
    addNonterminal() {
      let newNonterminal = new Sign(this.symbol, "Nonterminal");
      for (let i of this.nonterminals) {
        if (i.getString() === newNonterminal.getString()) {
          this.$message("非终止符号已存在");
          return;
        }
      }
      for (let i of this.terminals) {
        if (i.getString() === newNonterminal.getString()) {
          this.$message("该符号是一个已存在的终止符号");
          return;
        }
      }
      this.nonterminals.push(newNonterminal);
    },
    getProductions() {
      let productions = Array.of();
      productions = this.userInputProductions.split(/\n/);
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
      this.generateGrammar();
    },
    charToSign(val) {
      for (let i of this.terminals) {
        if (val === i.getString()) {
          return i;
        }
      }
      for (let i of this.nonterminals) {
        if (val === i.getString()) {
          return i;
        }
      }
      if (val === "ε") {
        return new Sign("ε", "Empty");
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
        if (val === i.getString()) {
          return true;
        }
      }
      for (let i of this.nonterminals) {
        if (val === i.getString()) {
          return true;
        }
      }
      return false;
    },
    headIsNonterminal(val) {
      if (val === "") {
        return;
      }
      for (let i of this.nonterminals) {
        if (val === i.getString()) {
          return;
        }
      }
      this.$message("符号" + val + "不是非终止字符，不可以放在产生式头部");
    },
    delectSymbol(val) {
      this.terminals = this.terminals.filter(e => e.getString() !== val);
      this.nonterminals = this.nonterminals.filter(e => e.getString() !== val);
    },
    generateGrammar() {
      let grammar = new GGFUI(this.formalProductions);
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
    },
    querySearch(queryString, cb) {
      let signs = [...this.terminals, ...this.nonterminals];
      signs = signs.map(e => {
        let temp = {};
        temp.symbol = e.getString();
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
      terminals = terminals.map(e => e.getString());
      nonterminals = nonterminals.map(e => e.getString());
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
  watch: {
    userInputProductions: function() {
      let productions;
      productions = this.userInputProductions.split(/\n/);
      productions = productions.map(e => e.replace(/\s+/g, ""));
      productions = productions.map(e => e.split(/->|\|/));
      for (let production of productions) {
        for (let i = 0; i < production.length; i++) {
          if (i === 0) {
            let head = production[i];
            this.headIsNonterminal(head);
          } else {
            let body = production[i];
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
              this.$message(
                "字符 " +
                  errorSymbol +
                  " 不合法，请将该符号添加到符号表或重新输入"
              );
            }
          }
        }
      }
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.userinput {
  display: flex;
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
