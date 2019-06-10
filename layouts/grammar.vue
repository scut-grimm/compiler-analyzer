<template>
  <el-container class="grammar-layout">
    <el-header>
      <el-menu
  :default-active="'2'"
  class="menu"
  mode="horizontal"
  background-color="#545c64"
  text-color="#fff"
  active-text-color="#ffd04b">
  <el-menu-item>编译器文法分析</el-menu-item>
  <el-menu-item index="1">词法分析</el-menu-item>
  <el-menu-item index="2">语法分析</el-menu-item>
</el-menu>
    </el-header>
    <el-container>
      <el-aside>
        <grammar-step></grammar-step>

      </el-aside>
      <el-main class="main">
        <nuxt />
      </el-main>
    </el-container>

  </el-container>
  <!-- <div class="grammar-layout">
    <div class="layout-left">
    </div>
    <div class="layout-right">
    </div>
  </div> -->
</template>
<script>
import GrammarStep from "~/components/grammar-step";
export default {
  components: {
    GrammarStep
  }
};
</script>

<style lang="scss">
.el-header{
  padding: 0;
}
.menu{
  padding:0 20px;
}
.grammar-layout {
  height: 100vh;
  .main{
    margin-top: 20px;
  }
}
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}
</style>
