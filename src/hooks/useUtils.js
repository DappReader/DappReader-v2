import { useMessage } from 'naive-ui'

export const useUtils = () => {
  const message = useMessage()
  const copy = (value, type) => {
    if (type == 'abi') {
      value = value.map(e => {
        delete e.otherName
        return e
      })
      value = JSON.stringify(value)
    }
    value = JSON.stringify(value)
    if (navigator.clipboard) {
      navigator.clipboard.writeText(value)
      message.success('Copy successful')
    }
  }

  const toEtherscanAddress = (address, chain, type) => {
    let network = chain
    if (!network.chainName) network.chainName = network.name
    console.log(network)
    let name = ''
    if (network.chainName.toLowerCase() == 'ropsten') {
      name = 'ropsten.'
    } else if (network.chainName.toLowerCase() == 'kovan') {
      name = 'kovan.'
    } else if (network.chainId == 5) {
      name = 'goerli.'
    } else if (network.chainName.toLowerCase() == 'sepolia') {
      name = 'sepolia.'
    }
    let url = `https://${name}etherscan.io/address/${address}`
    if (type == 'tx') {
      url = `https://${name}etherscan.io/tx/${address}`
    }
    window.open(url)
  }
  return {
    toEtherscanAddress,
    copy
  }
}
