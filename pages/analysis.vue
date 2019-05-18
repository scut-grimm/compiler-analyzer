<template>
  <div class="analysis">
    <div class="left">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="matched" label="已匹配" width="180"></el-table-column>
        <el-table-column prop="symbolStack" label="符号栈" width="180"></el-table-column>
        <el-table-column prop="input" label="输入"></el-table-column>
        <el-table-column prop="action" label="动作"></el-table-column>
      </el-table>
      <div style="position: absolute; bottom: 10px;left: 10px;">
        <el-button type="success">开始</el-button>
        <el-button type="warning">上一步</el-button>
        <el-button type="primary">下一步</el-button>
        <el-button type="danger">停止</el-button>
        <el-button type="info">自动播放</el-button>
      </div>
    </div>
    <div class="right">
      <el-input type="textarea" :rows="12" placeholder="请输入要分析的语句" v></el-input>
      <el-input type="textarea" :rows="12" placeholder="预测分析表"></el-input>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    tableData() {
      return [
        {
          matched: "",
          symbolStack: "E $",
          input: "id + id * id$",
          action: ""
        },
        {
          matched: "",
          symbolStack: "T E' $",
          input: "id + id * id$",
          action: "E -> TE'"
        },
        {
          matched: "",
          symbolStack: "F T' E' $",
          input: "id + id * id$",
          action: "T -> FT'"
        },
        {
          matched: "",
          symbolStack: "id T' E' $",
          input: "id + id * id$",
          action: "F -> id"
        },
        {
          matched: "id",
          symbolStack: "T' E' $",
          input: " + id * id$",
          action: ""
        }
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
.analysis {
  display: flex;
  width: 70%;
  margin: 30px auto;
  .left {
    width: 70%;
    position: relative;
  }
  .right {
    padding-left: 20px;
    width: 30%;
    * {
      margin-bottom: 30px;
    }
  }
}
</style>
