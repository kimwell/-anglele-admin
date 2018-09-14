import Vue from 'vue'
import App from './App.vue'
import 'iview/dist/styles/iview.css';
import iView from 'iview';
import router from './router'
import store from './store/store'
import clickoutside from './directives/clickoutside'
import * as filters from './filters/index' //过滤器
import axios from './http'
import * as api from './api'
import _ from 'lodash'
import md5 from 'js-md5'

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.directive('clickoutside', clickoutside);
Vue.use(iView);


// import {
//   Modal,
//   Message,
//   Notice,
//   Spin,
//   Upload,
//   DatePicker,
//   RadioGroup,
//   Radio,
//   CheckboxGroup,
//   Checkbox,
//   Select,
//   Option,
//   Tooltip,
//   Menu
// } from 'iview';
// Vue.component(Modal.name, Modal);
// Vue.component(Upload.name, Upload);
// Vue.component(Spin.name, Spin);
// Vue.component(RadioGroup.name, RadioGroup);
// Vue.component(Radio.name, Radio);
// Vue.component(CheckboxGroup.name, CheckboxGroup);
// Vue.component(Checkbox.name, Checkbox);
// Vue.component(Tooltip.name, Tooltip);
// Vue.component('i-select', Select);
// Vue.component('i-option', Option);
// Vue.component('i-menu', Menu);
// Vue.component('DatePicker', DatePicker);
// Vue.prototype.$Modal = Modal;
// Vue.prototype.$Notice = Notice;
// Vue.prototype.$Message = Message;
// Vue.prototype.$Spin = Spin;


Vue.prototype.$md5 = md5
Vue.prototype.$api = api; //所有接口列表挂载
Vue.prototype.$http = axios;
Vue.prototype.$clearData = (data) => JSON.parse(JSON.stringify(data));
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')