<template>
  <div class="home flex-start" @click="hiddenRightMenu">
    <Menu ref="menuDom" />
    <Main />
    <GetContractModel ref="getContractModel" @confirm="confirm" />
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUtils } from '../hooks/useUtils'
import { useMessage } from 'naive-ui'
import Menu from '../components/Menu.vue'
import Main from '../components/Main.vue'
import GetContractModel from '../components/GetContractModel.vue'
import { checkContractInfo, getContract } from '../http/abi'
import { chains } from '../libs/chains'
export default {
  name: 'Home',
  components: {
    Menu,
    Main,
    GetContractModel
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { setData } = useUtils()
    const message = useMessage()
    const menuDom = ref(null)
    const getContractModel = ref(null)
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
            name: contract.name,
            address: contract.contract_address,
            abi: JSON.parse(contract.contract_abi),
            chain: chain,
            remark: contract.description,
          }
          setData(sol)
          getContractModel.value.showModal = false
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
            getContractModel.value.showModal = true
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
      let token = route.params.token
      if (token) {
        checkContractInfoFun(token)
      }
    })
    return {
      menuDom,
      hiddenRightMenu,
      getContractModel,
      confirm
    }
  }
}
</script>
