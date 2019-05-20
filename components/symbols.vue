<template>
  <div>
    <!-- <el-table :data="tableData" border>
      <el-table-column label="终止符号">
        <el-table-column v-for="(column,index) in terminalColumns" :key="index">
          <template slot-scope="scope">
            <span v-for="(terminal,index) in column" :key="index">{{scope.row[terminal]}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="非终止符号">
        <el-table-column v-for="(column,index) in nonterminalColumns" :key="index">
          <template slot-scope="scope">
            <span v-for="(nonterminal,index) in column" :key="index">{{scope.row[nonterminal]}}</span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>-->
    <el-table>
      <el-table-column v-for="(terminal,index) in terminals" :key="index">
        <template slot-scope="scope"></template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import Sign from "~/classes/sign";
export default {
  data() {
    return {
      terminals: new Set([
        new Sign("(", "Terminal"),
        new Sign(")", "Terminal"),
        new Sign("+", "Terminal"),
        new Sign("-", "Terminal"),
        new Sign("*", "Terminal"),
        new Sign("\\", "Terminal"),
        new Sign("a", "Terminal"),
        new Sign("b", "Terminal"),
        new Sign("c", "Terminal"),
        new Sign("d", "Terminal"),
        new Sign("e", "Terminal"),
        new Sign("f", "Terminal"),
        new Sign("g", "Terminal"),
        new Sign("h", "Terminal"),
        new Sign("i", "Terminal"),
        new Sign("j", "Terminal"),
        new Sign("k", "Terminal"),
        new Sign("l", "Terminal"),
        new Sign("m", "Terminal"),
        new Sign("n", "Terminal"),
        new Sign("o", "Terminal"),
        new Sign("p", "Terminal"),
        new Sign("q", "Terminal"),
        new Sign("r", "Terminal"),
        new Sign("s", "Terminal"),
        new Sign("t", "Terminal"),
        new Sign("u", "Terminal"),
        new Sign("v", "Terminal"),
        new Sign("w", "Terminal"),
        new Sign("x", "Terminal"),
        new Sign("y", "Terminal"),
        new Sign("z", "Terminal"),
        new Sign("0", "Terminal"),
        new Sign("1", "Terminal"),
        new Sign("2", "Terminal"),
        new Sign("3", "Terminal"),
        new Sign("4", "Terminal"),
        new Sign("5", "Terminal"),
        new Sign("6", "Terminal"),
        new Sign("7", "Terminal"),
        new Sign("8", "Terminal"),
        new Sign("9", "Terminal")
      ]),
      nonterminals: new Set([
        new Sign("A", "Nonterminal"),
        new Sign("B", "Nonterminal"),
        new Sign("C", "Nonterminal"),
        new Sign("D", "Nonterminal"),
        new Sign("E", "Nonterminal"),
        new Sign("F", "Nonterminal"),
        new Sign("G", "Nonterminal"),
        new Sign("H", "Nonterminal"),
        new Sign("I", "Nonterminal"),
        new Sign("J", "Nonterminal"),
        new Sign("K", "Nonterminal"),
        new Sign("L", "Nonterminal"),
        new Sign("M", "Nonterminal"),
        new Sign("N", "Nonterminal"),
        new Sign("O", "Nonterminal"),
        new Sign("P", "Nonterminal"),
        new Sign("Q", "Nonterminal"),
        new Sign("R", "Nonterminal"),
        new Sign("S", "Nonterminal"),
        new Sign("T", "Nonterminal"),
        new Sign("U", "Nonterminal"),
        new Sign("V", "Nonterminal"),
        new Sign("W", "Nonterminal"),
        new Sign("X", "Nonterminal"),
        new Sign("Y", "Nonterminal"),
        new Sign("Z", "Nonterminal")
      ])
    };
  },
  computed: {
    tableData() {
      let temp = Array.of();
      let symbol = new Object();
      for (let i of this.terminals) {
        Object.defineProperty(symbol, i, i);
      }
      for (let i of this.nonterminals) {
        Object.defineProperty(symbol, i, i);
      }
      temp.push(symbol);
      console.log(temp);
      return temp;
    },
    terminalColumns() {
      let terminals = [...this.terminals];
      terminals = terminals.map(e => e.getString());
      let terminalNum = terminals.length;
      let columnNum = Math.floor(Math.sqrt(terminalNum));
      let rowNum = columnNum;
      let temp = Array.of();
      let index = 0;
      for (let i = 0; i < columnNum; i++) {
        let tempColumn = Array.of();
        for (let j = 0; j < rowNum; j++) {
          tempColumn.push(terminals[index++]);
        }
        temp.push(tempColumn);
      }
      let lastColumn = Array.of();
      for (; index < terminalNum; index++) {
        lastColumn.push(terminals[index]);
      }
      temp.push(lastColumn);
      console.log(temp);
      return temp;
    },
    nonterminalColumns() {
      let nonterminals = [...this.nonterminals];
      nonterminals = nonterminals.map(e => e.getString());
      let nonterminalNum = nonterminals.length;
      let columnNum = Math.floor(Math.sqrt(nonterminalNum));
      let rowNum = columnNum;
      let temp = Array.of();
      let index = 0;
      for (let i = 0; i < columnNum; i++) {
        let tempColumn = Array.of();
        for (let j = 0; j < rowNum; j++) {
          tempColumn.push(nonterminals[index++]);
        }
        temp.push(tempColumn);
      }
      let lastColumn = Array.of();
      for (; index < nonterminalNum; index++) {
        lastColumn.push(nonterminals[index]);
      }
      temp.push(lastColumn);
      console.log(temp);
      return temp;
    }
  }
};
</script>
<style>
</style>
