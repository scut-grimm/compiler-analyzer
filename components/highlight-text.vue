<template>
  <p v-html="html" class="highlight-text">

  </p>
</template>
<script>
import _ from 'lodash'
export default {
  props: ['text'],
  computed:{
    html(){
      return this.text.replace(/`(.*?)`/g,'<span class="highlight-text-item">$1</span>')

    }
  }
}
</script>
<style lang="scss">
.highlight-text{
  font-size: 20px;
  padding: 5px 0;
}
.highlight-text-item{
  display: inline-block;
  background-color: rgba(64,158,255,.1);
    padding: 0 10px;
    line-height: 20px;
    font-size: 12px;
    color: #409EFF;
    border-radius: 4px;
    box-sizing: border-box;
    border: 1px solid rgba(64,158,255,.2);
    white-space: nowrap;
    font-weight: bold;
    margin: 0 5px;
}
</style>
