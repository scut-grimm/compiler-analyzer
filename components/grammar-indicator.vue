<template>
  <div class="grammar-indicator">
    <span class="title">文法产生式</span>
    <div
      class="grammar"
      v-for="(grammar,index) in grammar.getProductions()"
      :key="index"
      :class="{'active': index === active}"
      @click="changeProduction(index)"
    >{{grammar.getString()}}</div>
  </div>
</template>
<script>
import Grammar from "~/classes/grammar";
export default {
  props: ["grammar", "active"],
  data() {
    return {};
  },
  methods: {
    changeProduction(index) {
      const grammar = this.grammar.getProductions()[index];
      console.log(
        this.grammar.getDerivations(grammar.head).map(e => e.getString())
      );
      this.$emit("changeProduction", index);
    }
  }
};
</script>

<style lang="scss" scoped>
.grammar-indicator {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  .title {
    font-size: 28px;
  }
  .grammar {
    border-radius: 5px;
    font-size: 24px;
    padding: 5px 10px;
    margin: 2px;
    &:hover {
      background-color: rgb(178, 212, 247);
      cursor: pointer;
    }
    &.active {
      background-color: rgb(102, 174, 247);
    }
  }
}
</style>
