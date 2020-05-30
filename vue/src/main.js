import Vue from 'vue';
import App from './App.vue';
import router from "./router";
import vuetify from './plugins/vuetify';
import moment from 'moment'
import Navigation from "@/components/Navigation";

Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('MM/DD/YYYY hh:mm')
  }
});
Vue.config.productionTip = false;
Vue.prototype.$user = {
  name: 'Jan Kowalski',
  isAdmin: true,
}
Vue.component('menuNavigation', Navigation);

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app');
