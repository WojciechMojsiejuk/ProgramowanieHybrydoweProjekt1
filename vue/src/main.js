import Vue from 'vue';
import App from './App.vue';
import router from "./router";
import vuetify from './plugins/vuetify';
import moment from 'moment'
import Navigation from "@/components/Navigation";
import VueCookies from 'vue-cookies'

Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('YYYY')
  }
});
Vue.config.productionTip = false;
Vue.component('menuNavigation', Navigation);
Vue.use(VueCookies)
Vue.$cookies.config('5min')

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app');
