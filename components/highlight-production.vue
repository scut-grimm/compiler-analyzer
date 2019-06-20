<template>
  <div class="highlight-production">
    <h3>{{title}}</h3>
    <div
      class="production"
      v-for="(production,index) in orderedProductions"
      :key="index"
      :style="'color: ' + getColor(production) + ';'"
    >{{production.getString()}}</div>
  </div>
</template>
<script>
import DisjointSet from "~/classes/disjoint-set";
const colors = ["#f44336","#ab47bc","#7986cb","#81d4fa","#b2dfdb","#827717","#ff8f00","#e64a19","#757575","#e53935","#9c27b0","#5c6bc0","#4fc3f7","#80cbc4","#dcedc8","#fffde7","#ff6f00","#d84315","#616161","#d32f2f","#8e24aa","#3f51b5","#29b6f6","#4db6ac","#c5e1a5","#fff9c4","#fff3e0","#bf360c","#424242","#c62828","#7b1fa2","#3949ab","#03a9f4","#26a69a","#aed581","#fff59d","#ffe0b2","#efebe9","#212121","#b71c1c","#6a1b9a","#303f9f","#039be5","#009688","#9ccc65","#fff176","#ffcc80","#d7ccc8","#eceff1","#fce4ec","#4a148c","#283593","#0288d1","#00897b","#8bc34a","#ffee58","#ffb74d","#bcaaa4","#cfd8dc","#f8bbd0","#ede7f6","#1a237e","#0277bd","#00796b","#7cb342","#ffeb3b","#ffa726","#a1887f","#b0bec5","#f48fb1","#d1c4e9","#e3f2fd","#01579b","#00695c","#689f38","#fdd835","#ff9800","#8d6e63","#90a4ae","#f06292","#b39ddb","#bbdefb","#e0f7fa","#004d40","#558b2f","#fbc02d","#fb8c00","#795548","#78909c","#ec407a","#9575cd","#90caf9","#b2ebf2","#e8f5e9","#33691e","#f9a825","#f57c00","#6d4c41","#607d8b","#e91e63","#7e57c2","#64b5f6","#80deea","#c8e6c9","#f9fbe7","#f57f17","#ef6c00","#5d4037","#546e7a","#d81b60","#673ab7","#42a5f5","#4dd0e1","#a5d6a7","#f0f4c3","#fff8e1","#e65100","#4e342e","#455a64","#c2185b","#5e35b1","#2196f3","#26c6da","#81c784","#e6ee9c","#ffecb3","#fbe9e7","#3e2723","#37474f","#ad1457","#512da8","#1e88e5","#00bcd4","#66bb6a","#dce775","#ffe082","#ffccbc","#fafafa","#263238"]
export default {
  props: ["productions", "disjointSet" ,"title"],
  data() {
    return {};
  },
  methods: {
    getColor(production){
      if(!this.disjointSet){
        return ''
      }
      let index = this.disjointSet.get(production)
      return colors[index]
    }
  },
  computed: {
    orderedProductions(){
      if(!this.disjointSet){
        return this.productions
      }
      return this.productions.sort((a,b) => {
        return this.disjointSet.get(a) - this.disjointSet.get(b)
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.highlight-production {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;

  .title {
    font-size: 28px;
  }
  .production {
    border-radius: 5px;
    font-size: 30px;
    padding: 5px 10px;
    margin: 2px;
    &:hover {
      background-color: rgb(178, 212, 247);
      color: white!important;
      cursor: pointer;
    }
    &.active {
      background-color: rgb(102, 174, 247);
    }
  }
}
</style>
