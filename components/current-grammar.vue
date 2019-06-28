<template>
  <div>
    <el-collapse>
      <el-collapse-item>
        <template slot="title">
          <h3>查看{{title}}</h3>
        </template>
        <div class="grammar">
          <el-collapse>
            <el-collapse-item>
              <template slot="title">
                <h3>符号表</h3>
              </template>
              <div style="text-align:center">
                <el-table
                  :data="symbolTable"
                  class="symbolTable"
                  size="small"
                  border
                  :header-cell-style="combineHeadCells"
                  :span-method="symbolTableRowSpan"
                >
                  <el-table-column label="终止符号" align="center">
                    <el-table-column class="terminalColumn" label="hide" align="center">
                      <template slot-scope="scope">
                        <el-tag
                          type
                          effect="dark"
                          size="medium"
                          style="font-size:15px"
                          v-if="scope.row.terminal0"
                          :disable-transitions="false"
                          class="tag"
                        >{{scope.row.terminal0}}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column class="terminalColumn" label="hide" align="center">
                      <template slot-scope="scope">
                        <el-tag
                          type
                          effect="dark"
                          size="medium"
                          style="font-size:15px"
                          class="tag"
                          v-if="scope.row.terminal1"
                          :disable-transitions="false"
                        >{{scope.row.terminal1}}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column class="terminalColumn" label="hide" align="center">
                      <template slot-scope="scope">
                        <el-tag
                          type
                          effect="dark"
                          size="medium"
                          style="font-size:15px"
                          class="tag"
                          v-if="scope.row.terminal2"
                        >{{scope.row.terminal2}}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column class="terminalColumn" label="hide" align="center">
                      <template slot-scope="scope">
                        <el-tag
                          type
                          effect="dark"
                          size="medium"
                          style="font-size:15px"
                          class="tag"
                          v-if="scope.row.terminal3"
                        >{{scope.row.terminal3}}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column class="terminalColumn" label="hide" align="center">
                      <template slot-scope="scope">
                        <el-tag
                          type
                          effect="dark"
                          size="medium"
                          style="font-size:15px"
                          class="tag"
                          v-if="scope.row.terminal4"
                        >{{scope.row.terminal4}}</el-tag>
                      </template>
                    </el-table-column>
                  </el-table-column>
                  <el-table-column label="非终止符号" align="center">
                    <el-table-column class="nonterminalColumn" label="hide" align="center">
                      <template slot-scope="scope">
                        <el-tag
                          :type="isStartSymbol(scope.row.nonterminal0)"
                          effect="dark"
                          size="medium"
                          style="font-size:15px"
                          class="tag"
                          v-if="scope.row.nonterminal0"
                        >{{scope.row.nonterminal0}}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column class="nonterminalColumn" label="hide" align="center">
                      <template slot-scope="scope">
                        <el-tag
                          :type="isStartSymbol(scope.row.nonterminal1)"
                          effect="dark"
                          size="medium"
                          style="font-size:15px"
                          class="tag"
                          v-if="scope.row.nonterminal1"
                        >{{scope.row.nonterminal1}}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column class="nonterminalColumn" label="hide" align="center">
                      <template slot-scope="scope">
                        <el-tag
                          :type="isStartSymbol(scope.row.nonterminal2)"
                          effect="dark"
                          size="medium"
                          style="font-size:15px"
                          class="tag"
                          v-if="scope.row.nonterminal2"
                        >{{scope.row.nonterminal2}}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column class="nonterminalColumn" label="hide" align="center">
                      <template slot-scope="scope">
                        <el-tag
                          :type="isStartSymbol(scope.row.nonterminal3)"
                          effect="dark"
                          size="medium"
                          style="font-size:15px"
                          class="tag"
                          v-if="scope.row.nonterminal3"
                        >{{scope.row.nonterminal3}}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column class="nonterminalColumn" label="hide" align="center">
                      <template slot-scope="scope">
                        <el-tag
                          :type="isStartSymbol(scope.row.nonterminal4)"
                          effect="dark"
                          size="medium"
                          style="font-size:15px"
                          class="tag"
                          v-if="scope.row.nonterminal4"
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
                      >ε</el-tag>
                      <el-tag
                        type="info"
                        effect="dark"
                        size="medium"
                        style="font-size:20px"
                        class="tag"
                      >-></el-tag>
                    </el-table-column>
                  </el-table-column>
                </el-table>
              </div>
            </el-collapse-item>
          </el-collapse>
          <el-collapse>
            <el-collapse-item>
              <template slot="title">
                <h3>产生式</h3>
              </template>
              <div style="text-align:center">
                <el-table
                  :data="productionTable"
                  class="productionTable"
                  size="small"
                  :show-header="false"
                >
                  <el-table-column align="center">
                    <template slot-scope="scope">
                      <el-tag
                        v-for="(item,index) in scope.row.data"
                        :key="index"
                        class="tag"
                      >{{item}}</el-tag>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
export default {
  props: ["grammar", "title"],
  methods: {
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
    combineHeadCells({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 1) {
        return { display: "none" };
      }
    },
    isStartSymbol(symbol) {
      if (symbol === this.grammar.getStartSign().getString()) {
        return "danger";
      } else {
        return "";
      }
    }
  },
  computed: {
    productionTable() {
      let rows = Array.of();
      if (this.grammar.getProductions().length !== 0) {
        for (const nonterminal of this.grammar.getNonterminals()) {
          let rowP = {
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
    },
    symbolTable() {
      let terminals = [...this.grammar.getTerminals().map(e => e.getString())];
      let nonterminals = [
        ...this.grammar.getNonterminals().map(e => e.getString())
      ];
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
  }
};
</script>
<style lang="scss" scoped>
.grammar {
  display: flex;
  flex-direction: column;
  margin-left: 30px;
  width: 90%;
  .symbolTable {
    width: 100%;
    margin: 2px;
    .tag {
      margin-top: 2px;
      margin-bottom: 2px;
      width: 50px;
      overflow-x: auto;
      overflow-y: hidden;
      &:hover {
        cursor: default;
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
  .productionTable {
    width: 100%;
    margin: 2px;
    .tag {
      font-size: 20px;
      margin: 5px;
    }
  }
}
</style>
