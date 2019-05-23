<template id="tag_view">
  <div>
    <el-input
      prefix-icon="el-icon-location"
      placeholder="请输入标签，用逗号或回车隔开"
      v-model="tag_info"
      @keyup.native="do_key($event)"
    ></el-input>
    <div class="tag_box">
      <span>#</span>
      <span v-for="(tag,index) in tag_list" @click="del_tag(tag)">
        <span v-if="tag">
          <el-tag>{{tag}}</el-tag>
        </span>
        <span v-else>
          <br>#
        </span>
      </span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tag_list: [],
      tag_info: ""
    };
  },
  watch: {
    tag_list: function() {
      // 观察一个属性的变化
      this.$emit("get_tag", this.tag_list);
    }
  },
  methods: {
    make_tag: function() {
      // 回车添加标签
      if (this.tag_info) {
        this.tag_list.push(this.tag_info);
        this.tag_info = "";
      } else {
        this.tag_list.push(null);
      }
    },
    do_key: function(event) {
      // 键盘事件
      if (event.key == "Enter") {
        this.make_tag();
      } else if (event.key == "Backspace") {
        if (this.tag_info.length > 0) {
        } else if (this.tag_list.length > 0) {
          this.tag_list.pop();
        }
      }
    },
    del_tag: function(tag) {
      // 删除
      let cur_del_index = this.tag_list.indexOf(tag);
      this.tag_list.splice(cur_del_index, 1);
    }
  }
};
</script>
<style >
.tag_box span:hover {
  text-decoration: line-through;
  cursor: pointer;
}
</style>