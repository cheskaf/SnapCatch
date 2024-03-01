import Vue from 'vue';
import App from './App.vue';
import Vuexy from 'vuexy';

Vue.use(Vuexy);

new Vue({
    render: h => h(App),
}).$mount('#app');
