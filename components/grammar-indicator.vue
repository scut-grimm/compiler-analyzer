<template>
  <div class="grammar-indicator">
      <span class="title">文法产生式</span>
      <div class="grammar"
        v-for="(grammar,index) in grammar.getGrammarItems()"
        :key="index"
        :class="{'active': index === active}"
        @click="changeGrammarItem(index)"
      >
        {{grammar.getStr()}}
      </div>
  </div>
</template>
<script>
import Grammar from '~/classes/grammar'
export default {
  props: ['grammar','active'],
  data() {
    return {
    }
  },
  methods:{
    changeGrammarItem(index){
      const grammar = this.grammar.getGrammarItems()[index]
      console.log(this.grammar.getDerivations(grammar.leftSign).map(e => e.getStr()))
      this.$emit('changeGrammarItem',index)
    }
  }
}
</script>

<style lang="scss" scoped>
.grammar-indicator {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  .title{
    font-size: 28px;
  }
  .grammar{
    border-radius: 5px;
    font-size: 24px;
    padding: 5px 10px;
    margin: 2px;
    &:hover{
      background-color: rgb(178, 212, 247);
      cursor: pointer;
    }
    &.active{
      background-color: rgb(102, 174, 247);
    }
  }
}
</style>
