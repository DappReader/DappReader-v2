import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/reset.scss'
import './assets/css/main.scss'
import * as fundebug from "fundebug-javascript";
import FundebugVue from "fundebug-vue";
fundebug.apikey = "948f50789ff7b2290e4aa9bae8b78ec10ef9de1b90131f1ab01901ca002611b2"
import { create, NSelect, NConfigProvider, NMessageProvider, NModal, NDropdown, NDivider,
  NFormItem, NInput, NPopconfirm, NTabs, NTabPane, NCollapse, NTree, NDatePicker, NDialog,
  NCollapseItem, NPopover, NSpin, NDialogProvider, NInputGroup, NButton, NImage, NTooltip,
  NAlert, NNotificationProvider } from 'naive-ui'
import VueHighlightJS from 'vue3-highlightjs'
import 'highlight.js/styles/hybrid.css'
require('fundebug-revideo');
const naive = create({
  components: [ NSelect, NConfigProvider, NMessageProvider, NTree, NDropdown, NDivider,
    NModal, NFormItem, NInput, NPopconfirm, NTabs, NTabPane, NButton, NDatePicker, NDialog,
    NCollapse, NCollapseItem, NPopover, NSpin, NDialogProvider, NInputGroup, NImage, NTooltip,
    NAlert, NNotificationProvider ]
})
createApp(App).use(new FundebugVue(fundebug)).use(naive).use(store).use(router).use(VueHighlightJS).mount('#app')
