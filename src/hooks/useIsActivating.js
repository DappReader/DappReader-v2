
import { useStore } from 'vuex'
import { connectWallet } from '../libs/connectWallet'
import {chains} from '../libs/chains'

import { ethers } from 'ethers'
export const useIsActivating = () => {
  const store = useStore()
  let provider = null
  const getProvider = async(init) => {
    try {
      provider = await connectWallet(init)
      store.commit('setProvider', provider)
      getWallet()
      getNetwork()
    } catch (error) {
      console.error(error) 
    }
  }

  const getNetwork = async() => {
    if (!provider) return
    let network = await provider.getNetwork()
    let networkData = chains.filter(e => network.chainId == e.chainId)[0]
    network.name = networkData.name
    store.commit('setNetwork', network)
  }

  const getWallet = async() => {
    if (!provider) return
    let accounts = await provider.listAccounts()
    if (accounts.length) {
      let address = accounts[0]
      store.commit('setAddress', address)
      try {
        provider.getBalance(address).then(res => {
          let balance = res
          let balanceInEth = ethers.utils.formatEther(balance)
          store.commit('setBalance', balanceInEth)
        })
      } catch (error) {
        console.error(error)
      }
    }
  }

  return {
    getProvider,
    getWallet,
    getNetwork
  }
}
