import { useWeb3ModalProvider, useSwitchNetwork } from '@web3modal/ethers5/vue'
import { useWeb3ModalAccount } from '@web3modal/ethers5/vue'
import { ethers } from 'ethers'
import { computed } from 'vue'
import { chains } from '../libs/chains'

export const useNetwork = () => {
  const { switchNetwork: switchChain } = useSwitchNetwork()
  const { address, chainId } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()
  const provider = computed(() => walletProvider.value && new ethers.providers.Web3Provider(walletProvider.value))
  const network = computed(() => chains.find(e => chainId.value == e.chainId))

  return {
    switchChain,
    address,
    provider,
    network,
  }
}
