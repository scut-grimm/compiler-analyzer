import Vue from 'vue'
const Eventbus = {
  install: function (_vue, options){
    _vue.prototype.$eventbus = new Vue({
      data(){
        return {

        }
      }
    })
  }
}
export default () => {
  Vue.use(Eventbus)
}

