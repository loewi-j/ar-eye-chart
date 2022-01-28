import Vue from 'vue'
import App from './App.vue'
import '@/assets/css/style.css'
import 'script-loader!createjs/builds/1.0.0/createjs.min.js';

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
