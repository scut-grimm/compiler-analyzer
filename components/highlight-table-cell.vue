<template>
  <div>
    <el-tag
      v-if="hasItem"
      v-for="item in items"
      :key="item.label"
      :type="item.type"
      effect="dark"
      size="medium"
    >{{item.label}}</el-tag>
  </div>
</template>
<script>
export default {
  props: ["string", "highlightSymbol"], // string 是字符串，highlightSymbol 是字符串中要高亮的字符。string 是用空格隔开的，例如“a id b”
  data() {
    return { hasItem: false };
  },
  computed: {
    items() {
      let items = [];
      let string = this.string;
      let symbols = string.match(/\S+/g);
      if (symbols !== null) {
        for (let symbol of symbols) {
          let item = { type: "", label: "" };
          if (symbol === this.highlightSymbol) {
            item.type = "danger";
            item.label = symbol;
            items.push(item);
            continue;
          }
          item.type = "";
          item.label = symbol;
          items.push(item);
        }
      }
      if (items.length === 0) {
        this.hasItem = false;
      } else {
        this.hasItem = true;
      }
      return items;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

