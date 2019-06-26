<template>
  <div class="grammar">
    <el-collapse>
      <el-collapse-item>
        <template slot="title">
          <h3>查看{{title}}</h3>
          <!-- style="font-size:18px;font-family:Arial;" -->
        </template>
        <el-table
          :data="tableData"
          class="table"
          size="small"
          :span-method="grammarTableRowSpan"
          :show-header="false"
        >
          <el-table-column align="center" width="200" fixed>
            <template slot-scope="scope">
              <div style="font-size: 20px">{{scope.row.name}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template slot-scope="scope">
              <el-tag v-for="(item,index) in scope.row.data" :key="index" class="tag">{{item}}</el-tag>
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
    }
  },
  computed: {
    tableData() {
      let rows = Array.of();
      if (this.grammar.getProductions().length !== 0) {
        let row0 = {
          name: "开始符号",
          data: [this.grammar.getStartSign().getString()]
        };
        rows.push(row0);
        let row1 = {
          name: "非终止符号",
          data: []
        };
        let nonterminals = this.grammar.getNonterminals();
        if (nonterminals.length !== 0) {
          for (const nonterminal of nonterminals) {
            row1.data.push(nonterminal.getString());
          }
        }
        rows.push(row1);
        let row2 = {
          name: "终止符号",
          data: []
        };
        let terminals = this.grammar.getTerminals();
        if (terminals.length !== 0) {
          for (const terminal of terminals) {
            row2.data.push(terminal.getString());
          }
        }
        rows.push(row2);
        for (const nonterminal of this.grammar.getNonterminals()) {
          let rowP = {
            name: "产生式",
            data: []
          };
          if (this.grammar.getDerivations(nonterminal).length > 0) {
            for (const production of this.grammar.getDerivations(nonterminal)) {
              rowP.data.push(production.getString());
            }
            rows.push(rowP);
          }
        }
      }
      return rows;
    }
  }
};
</script>
<style lang="scss" scoped>
.grammar {
  .table {
    width: 100%;
    .tag {
      font-size: 20px;
      margin: 5px;
    }
  }
}
</style>
