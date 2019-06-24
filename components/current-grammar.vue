<template>
  <div class="grammar">
    <el-collapse>
      <el-collapse-item>
        <template slot="title">显示{{title}}</template>
        <el-table
          :data="tableData"
          class="table"
          border
          :span-method="grammarTableRowSpan"
          :header-cell-style="combineHeadCells"
        >
          <el-table-column align="center" :show-header="false">
            <template slot-scope="scope">
              <el-tag style="font-size: 20px">{{scope.row.name}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" :show-header="false">
            <template slot-scope="scope">
              <el-tag style="font-size: 20px">{{scope.row.data}}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
export default {
  props: ["grammar", "title"],
  methods: {
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
      if (rowIndex === 0) {
        return { display: "none" };
      }
    }
  },
  computed: {
    tableData() {
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
      return rows;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
