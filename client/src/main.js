/*
 * main.js
 * 
 * This file contains the main client-side JavaScript code.
 * It initializes the client-side application, handles user interactions,
 * and interacts with the server-side application via HTTP requests.
 */

import Vue from 'vue';
import App from './App.vue';
import Vuexy from 'vuexy';

Vue.use(Vuexy);

new Vue({
    render: h => h(App),
}).$mount('#app');