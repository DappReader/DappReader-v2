import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/reset.scss'
import './assets/css/main.scss'
import { create, NSelect, NConfigProvider, NMessageProvider, NModal, 
  NFormItem, NInput, NPopconfirm, NTabs, NTabPane, NCollapse, 
  NCollapseItem, NPopover, NSpin, NDialogProvider, NInputGroup, NButton, NImage, NTooltip } from 'naive-ui'
import VueHighlightJS from 'vue3-highlightjs'
import 'highlight.js/styles/hybrid.css'
const naive = create({
  components: [ NSelect, NConfigProvider, NMessageProvider, 
    NModal, NFormItem, NInput, NPopconfirm, NTabs, NTabPane, NButton,
    NCollapse, NCollapseItem, NPopover, NSpin, NDialogProvider, NInputGroup, NImage, NTooltip ]
})
createApp(App).use(naive).use(store).use(router).use(VueHighlightJS).mount('#app')
