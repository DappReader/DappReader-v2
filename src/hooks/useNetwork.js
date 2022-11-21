import { walletSwitchChain } from "../libs/walletSwitchChain";
import { useIsActivating } from '../hooks/useIsActivating'

export const useNetwork = () => {
  const { getProvider } = useIsActivating()
  const switchChain = (chainId) => {
    walletSwitchChain(chainId).then(res => {
      console.log(res)
    }).catch(err => {
      console.error(err)
      getProvider()
    })
  }
  return {
    switchChain
  }
}
