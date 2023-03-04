<template>
  <div class="home flex-start" @click="hiddenRightMenu">
    <Menu ref="menuDom" />
    <Main />
    <GetContractModal ref="getContractModal" @confirm="confirm" />
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUtils } from '../hooks/useUtils'
import { useMessage } from 'naive-ui'
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
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const { setData } = useUtils()
    const message = useMessage()
    const menuDom = ref(null)
    const getContractModal = ref(null)
    const userInfo = computed(() => {
      return store.state.userInfo
    })
    const hiddenRightMenu = () => {
      menuDom.value.hiddenRightMenu()
    }
    const getContractFun = (password='') => {
      let token = route.params.token
      getContract({token, password}).then(res => {
        if (res.code == 1) {
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
            password
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
            getContractModal.value.showModal = true
          } else {
            getContractFun()
          }
        }
      })
    }
    const confirm = (e) => {
      getContractFun(e)
    }
    watch(userInfo, (val) => {
      let token = route.params.token
      if (val.nickname && token) {
        checkContractInfoFun(token)
      }
    }, {immediate: true})
    return {
      menuDom,
      hiddenRightMenu,
      getContractModal,
      confirm
    }
  }
}
</script>
