<template>
  <div class="home flex-start" @click="hiddenRightMenu">
    <Menu ref="menuDom" />
    <Main />
    <GetContractModal ref="getContractModal" @confirm="confirm" />
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUtils } from '../hooks/useUtils'
import { useMessage } from 'naive-ui'
import { useIsActivating } from '../hooks/useIsActivating'
import Menu from '../components/Menu.vue'
import Main from '../components/Main.vue'
import GetContractModal from '../components/GetContractModal.vue'
import { checkContractInfo, getContract } from '../http/abi'
import { chains } from '../libs/chains'
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
    const message = useMessage()
    const menuDom = ref(null)
    const getContractModal = ref(null)
    const userInfo = computed(() => {
      return store.state.userInfo
    })
    const address = computed(() => {
      return store.state.address
    })
    const hiddenRightMenu = () => {
      menuDom.value.hiddenRightMenu()
    }
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
            if (userInfo.value && userInfo.value.nickname) {
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
      menuDom,
      hiddenRightMenu,
      getContractModal,
      confirm
    }
  }
}
</script>
