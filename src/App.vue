<template>
  <n-config-provider :theme="darkTheme" :theme-overrides="darkThemeOverrides">
    <n-notification-provider placement="bottom-right">
      <n-message-provider>
        <n-dialog-provider>
          <router-view />
        </n-dialog-provider>
      </n-message-provider>
    </n-notification-provider>
  </n-config-provider>
</template>
<script>
import { useStore } from 'vuex'
import { onMounted, computed } from 'vue'
import { useIsActivating } from './hooks/useIsActivating'
import { darkTheme } from 'naive-ui'
import { getLs, setLs } from '@/service/service'
import { demo } from './libs/demo'
import { chains, defaultChain } from './libs/chains'

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
      if (!ethereum) return
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
      let inited = localStorage.inited || false
      let menuList = await getLs('menuList') || []
      let contractList = await getLs('contractList') || []
      let results = await getLs('results') || {}
      let activeId = await getLs('activeId') || ''
      let defaultChains = await getLs('defaultChain') || defaultChain
      let userInfo = localStorage.getItem('userInfo') || null
      if (userInfo) userInfo = JSON.parse(userInfo)
      if (!inited) {
        let { abi, address, chainId, name, remark} = demo
        let chain = chains.filter(e => e.chainId == chainId)[0]
        let demoData = {
          abi,
          address,
          chain,
          name,
          remark,
          id: `${address}${new Date().getTime()}`,
          createAt: new Date().getTime()
        }
        console.log(contractList)
        contractList.push(demoData)
        activeId = demoData.id
        await setLs('contractList', JSON.parse(JSON.stringify(contractList)))
        await setLs('activeId', activeId)
        localStorage.setItem('inited', 'inited')
      }

      store.commit("setResults", results)
      store.commit("setMenuList", menuList)
      store.commit("setContractList", contractList)
      store.commit("setDefaultChains", defaultChains)
      store.commit("setUserInfo", userInfo || {})
      store.commit("setActiveId", activeId)
    }
    
    onMounted(() => {
      if (window.top === window.self) {
        store.commit("setIsIframe", false)
      } else {
        store.commit("setIsIframe", true)
      }
      getProvider()
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
.jv-container .jv-code.boxed {
  overflow-y: auto;
  max-height: 500px !important;
}
</style>
