import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/reset.scss'
import './assets/css/main.scss'
import { create, NSelect, NConfigProvider, NMessageProvider, NModal, 
  NFormItem, NInput, NPopconfirm, NTabs, NTabPane, NCollapse, 
  NCollapseItem, NPopover, NSpin, NDialogProvider } from 'naive-ui'
const naive = create({
  components: [ NSelect, NConfigProvider, NMessageProvider, 
    NModal, NFormItem, NInput, NPopconfirm, NTabs, NTabPane, 
    NCollapse, NCollapseItem, NPopover, NSpin, NDialogProvider ]
})
createApp(App).use(naive).use(store).use(router).mount('#app')
