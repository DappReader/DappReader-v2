<template>
  <div class="home flex-start">
    <Menu ref="menuDom" v-if="!isIframe" />
    <Main />
    <GetContractModal ref="getContractModal" @confirm="confirm" />
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUtils } from '../hooks/useUtils'
import { useMessage } from 'naive-ui'
import { useIsActivating } from '../hooks/useIsActivating'
import Menu from '../components/Menu.vue'
import Main from '../components/Main.vue'
import GetContractModal from '../components/GetContractModal.vue'
import { checkContractInfo, getContract } from '../http/abi'
import { chains } from '../libs/chains'
import { useNotification } from "naive-ui"
export default {
  name: 'Home',
  components: {
    Menu,
    Main,
    GetContractModal
  },
  setup() {
    let check = false
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const { setData } = useUtils()
    const { getProvider } = useIsActivating()
    const notification = useNotification();
    const message = useMessage()
    const menuDom = ref(null)
    const getContractModal = ref(null)
    const userInfo = computed(() => {
      return store.state.userInfo
    })
    const address = computed(() => {
      return store.state.address
    })
    const isIframe = computed(() => {
      return store.state.isIframe
    })
    const getContractFun = (password='') => {
      let token = route.params.token
      getContract({token, password}).then(res => {
        if (res.code == 1) {
          router.replace('/')
          message.error(res.msg)
        } else {
          let contract = res.contract.contract_info
          let chainInfo = contract.chain_info
          let chainId = chainInfo.chainId
          let chain = chains.filter(e => e.chainId == chainId)[0]
          let sol = {
            isImport: true,
            authorAddress: res.contract.authorAddress,
            name: contract.name,
            address: contract.contract_address,
            abi: JSON.parse(contract.contract_abi),
            chain: chain,
            remark: contract.description,
            token: res.contract.token,
            versionNumber: res.contract.version_number || 1,
            password,
            userList: res.contract.user_list || []
          }
          setData(sol)
          getContractModal.value.showModal = false
          router.replace('/')
        }
      }).catch(err => {
        console.log(err)
        message.error(err)
      })
    }

    const checkContractInfoFun = (token) => {
      checkContractInfo({token}).then(res => {
        console.log(res)
        if (res.code == 0) {
          if (res.openSourceType == 'Limited') {
            console.log(1)
            getContractModal.value.showModal = true
          } else if (res.openSourceType == 'Team') {
            let token = localStorage.getItem('token') || ''
            if (userInfo.value && userInfo.value.nickname && token) {
              getContractFun()
            } else {
              if (!address.value) {
                getProvider()
                check = true
              } else {
                store.commit('login')
              }
            }
          } else {
            getContractFun()
          }
        }
      })
    }
    const confirm = (e) => {
      getContractFun(e)
    }
    onMounted(() => {
      let isNotify = localStorage.getItem('isNotify') || ''
      if (!isNotify) {
        notification.info({
          content: "Let's play together",
          meta: () => <p style={{lineHeight: 1.4}}>Our Discord channel is now open! Welcome everyone to join and build together! <a style={{color: '#0784C3'}} href='https://discord.gg/sJNpCehep' target="_blank">https://discord.gg/sJNpCehep</a></p>,
          keepAliveOnHover: true,
          onClose: () => {
            localStorage.setItem('isNotify', true)
          }
        })
      }
    })
    watch(userInfo, () => {
      let token = route.params.token
      if (token) {
        checkContractInfoFun(token)
      }
    })
    watch(address, () => {
      let token = route.params.token
      if (token && check) {
        check = false
        checkContractInfoFun(token)
      }
    })
    return {
      isIframe,
      menuDom,
      getContractModal,
      confirm
    }
  }
}
</script>
