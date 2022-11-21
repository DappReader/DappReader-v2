import { toRaw, computed } from "vue";
import { contract } from "../libs/connectWallet";
import { useStore } from 'vuex'
// import { ethers } from 'ethers'
export const useContract = (contractData) => {
  let C = null
  const store = useStore()
  const address = computed(() => {
    return store.state.address
  })

  const network = computed(() => {
    return store.state.network
  })

  const setContract = async(provider) => {
    if (contractChainId.value != network.value.chainId) return
    let user = toRaw(provider).getSigner()
    C = await contract(contractData.contractAddress, contractData.abi, user)
    console.log(C)
  }
  return {
    setContract,
    address
  }
}
