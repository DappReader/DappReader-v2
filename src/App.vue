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
import { onMounted } from 'vue'
import { darkTheme } from 'naive-ui'
import { getLs, setLs } from './service/service'
import { demo } from './libs/demo'
import { chains, defaultChain } from './libs/chains'
import { createWeb3Modal, defaultConfig, useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers5/vue'

export default {
  setup() {
    const store = useStore()
    // 1. Get projectId at https://cloud.walletconnect.com
    const projectId = '...'
    // 2. Set chains
    const networks = chains.map(c => ({
      chainId: c.chainId,
      name: c.name,
      currency: c.nativeCurrency.symbol,
      rpcUrl: c.rpc[0],
      explorerUrl: c.explorers?.[0]?.url
    }))
    // 3. Create your application's metadata object
    const metadata = {
      name: 'Dappreader',
      description: 'Dapp reader',
      url: 'https://mywebsite.com', // url must match your domain & subdomain
      icons: ['https://avatars.mywebsite.com/']
    }
    // 4. Create Ethers config
    const ethersConfig = defaultConfig({
      /*Required*/
      metadata,
      /*Optional*/
      enableInjected: true, // true by default
    })

    // 5. Create a Web3Modal instance
    createWeb3Modal({
      ethersConfig,
      chains: networks,
      projectId,
      enableAnalytics: true, // Optional - defaults to your Cloud configuration
      enableOnramp: true // Optional - false as default
    })
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
        let { abi, address, chainId, name, remark } = demo
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
      getData()
    })

    return {
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
