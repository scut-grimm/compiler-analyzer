<template>
  <div class="grammar-layout">
    <div class="layout-left">
      <grammar-step></grammar-step>
    </div>
    <div class="layout-right">
      <nuxt/>
    </div>
  </div>
</template>
<script>
import GrammarStep from '~/components/grammar-step'
export default {
  components:{
    GrammarStep
  }
}
</script>

<style lang="scss" scoped>
.grammar-layout{
  display: flex;
  height: 100vh;
  flex-direction: row;
  .layout-left{
    height: 100%;
    width: 20%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .layout-right{
    max-height: 100%;
    overflow-y: auto;
    width: 80%;
    padding-right: 10px;
  }
}
</style>
