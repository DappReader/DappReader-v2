
import { useStore } from 'vuex'
import { toRaw } from 'vue'
import { ethers } from 'ethers'

export const useIsActivating = () => {
  const store = useStore()

  const getWallet = async(provider) => {
    if (!provider) return
    let accounts = await provider.listAccounts()
    if (accounts.length) {
      try {
        provider.getBalance(address).then(res => {
          let balance = res
          let balanceInEth = ethers.utils.formatEther(balance)
          store.commit('setBalance', toRaw(balanceInEth))
        })
      } catch (error) {
        console.error(error)
      }
    }
  }

  return {
    getWallet,
  }
}
