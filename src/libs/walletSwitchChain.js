import { chains } from './chains'
export const walletSwitchChain = (chainId) => {
  chainId = '0x' + (+chainId).toString(16)
  return new Promise((resolve, reject) => {
    if (window.ethereum) {
      window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      })
        .then(() => {
          console.log('网络切换成功')
          resolve()
        })
        .catch(async (e) => {
          console.log(e)
          if (e.code == 4902) {
            let chain = chains.filter(e => e.chainId == chainId)
            chain = chain[0]
            console.log({
              chainId: '0x' + (+chain.chainId).toString(16), // 目标链ID
              chainName: chain.name,
              nativeCurrency: chain.nativeCurrency,
              rpcUrls: chain.rpc, // 节点
              blockExplorerUrls: [chain.infoURL]
            })
            window.ethereum.request({
              id: 1,
              jsonrpc: "2.0",
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x' + (+chain.chainId).toString(16), // 目标链ID
                chainName: chain.name,
                nativeCurrency: chain.nativeCurrency,
                rpcUrls: chain.rpc, // 节点
              }]
            }).then(() => {
              resolve()
            }).catch(err => {
              reject(err)
            })
          } else {
            reject(e)
          }
        })
    }
  })
}
