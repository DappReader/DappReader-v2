<template>
  <n-config-provider :theme="darkTheme" :theme-overrides="darkThemeOverrides">
    <n-message-provider>
      <n-dialog-provider>
        <router-view />
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>
<script>
import { useStore } from 'vuex'
import { onMounted, computed } from 'vue'
import { useIsActivating } from './hooks/useIsActivating'
import { darkTheme } from 'naive-ui'
import { getLs } from '@/service/service'
export default {
  setup() {
    const store = useStore()
    const { getProvider } = useIsActivating()
    const provider = computed(() => {
      return store.state.provider
    })
    const network = computed(() => {
      return store.state.network
    })
    const fn = () => {
      let ethereum = window.ethereum
      ethereum.on("accountsChanged", (accounts) => {
        console.log("账号切换", accounts[0])
        if (!accounts[0]) {
          store.commit('init')
        } else {
          getProvider()
        }
      })
      ethereum.on("chainChanged", (chainId) => {
        console.log("用户切换了链", chainId)
        getProvider()
      })
    }
    const getData = async () => {
      let menuList = await getLs('menuList') || []
      let contractList = await getLs('contractList') || []
      let openSols = await getLs('openSols') || []
      let activeId = await getLs('activeId') || ''
      store.commit("setActiveId", activeId)
      store.commit("setOpenSols", openSols)
      store.commit("setMenuList", menuList)
      store.commit("setContractList", contractList)
    }
    
    onMounted(() => {
      getProvider(true)
      fn()
      getData()
    })
    return {
      provider,
      network,
      darkTheme,
      darkThemeOverrides: {
        common: {
          primaryColor: '#375CFF'
        }
      }
    }
  }
}
</script>
<style lang="scss">

</style>
