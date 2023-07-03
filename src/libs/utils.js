import { ethers } from 'ethers'
import { chainsRpc } from './chains'
const fetcher = (...args) => fetch(...args).then((res) => res.json())

const admin_slot = ethers.BigNumber.from("0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103")
const impl_slot = ethers.BigNumber.from("0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc")
const eip1822_slot = ethers.BigNumber.from('0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7')

let provider = null
const get_address = async (proxy_address, solt_address) => {
  const info = await provider.getStorageAt(proxy_address , solt_address)
  const address = ethers.utils.getAddress("0x" + info.substring(26))
  return address
}
/* eslint-disable */ 
export const throttle = (fn, wait) => {
  let callback = fn
  let timerId = null
  let firstInvoke = true
  const throttled = () => {
    let context = this
    let args = arguments
    if (firstInvoke) {
      callback.apply(context, args)
      firstInvoke = false
      return
    }     
    if (timerId) {
      return
    }
    timerId = setTimeout(() => {
      clearTimeout(timerId)
      timerId = null
      callback.apply(context, args)
    }, wait)
  }
  return throttled
}

export const formatDate = (fmt, date) => {
  let ret
  date = new Date(date)
  let opt = {
    'Y+': date.getFullYear().toString(),
    'm+': (date.getMonth() + 1).toString(),
    'd+': date.getDate().toString(),
    'H+': date.getHours().toString(),
    'M+': date.getMinutes().toString(),
    'S+': date.getSeconds().toString()
  };
  for (let k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
    }
  }
  return fmt
}

export const formatAddress = (address) => {
  return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''
}

export const getCreatorAddress = async (item) => {
  let chain = item.chain
  let address = item.address
  let response = null
  if ((chain.chainId == 1 || chain.chainId == 42 || chain.chainId == 3 || chain.chainId == 5 || chain.chainId == 11155111)) {
    let apiKey = '19SE5KR1KSVTIYMRTBJ8VQ3UJGGVFKIK5W'
    let chain = item.chain
    let name = 'api'
    if (chain.chainId == 42) name = 'api-kovan' 
    else if (chain.chainId == 3) name = 'api-ropsten'
    else if (chain.chainId == 5) name = 'api-goerli'
    else if (chain.chainId == 11155111) name = 'api-sepolia'
    else if (chain.chainId == 1) name = 'api'
    else name = ''
    response = await fetcher(`https://${name}.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=${address}&apikey=${apiKey}`)
  } else if (chain.chainId == 56) {
    response = await fetcher(`https://api.bscscan.com/api?module=contract&action=getcontractcreation&contractaddresses=${address}`)
  } else if (chain.chainId == 137) {
    response = await fetcher(`https://api.polygonscan.com/api?module=contract&action=getcontractcreation&contractaddresses=${address}`)
  } else if (chain.chainId == 10) {
    response = await fetcher(`https://api-optimistic.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=${address}`)
  }
  if (response && response.status === '1' && response.result && response.result.length > 0) {
    const contracts = response.result
    item.contractCreator = contracts[0].contractCreator
  }
  return item
}

export const getContractInfo = async (item) => {
  let proxy_address = item.address
  let pa = JSON.parse(JSON.stringify(item.proxyAddress || ''))
  const chainId = item.chain.chainId
  chainsRpc.forEach(chain => {
    if (chain.chainId == chainId) {
      provider = new ethers.providers.JsonRpcProvider(chain.rpc)
    }
  })
  if (!provider) {
    return item
  }
  try {
    let res = await Promise.all([
      get_address(proxy_address, admin_slot), 
      get_address(proxy_address, impl_slot), 
      get_address(proxy_address, eip1822_slot)
    ])
    console.log(res)
    let admin_address = res[0]
    let eip1967_address = res[1]
    let eip1822_address = res[2]
    item.adminAddress = admin_address
    if (admin_address != '0x0000000000000000000000000000000000000000') {
      item.isProxy = true
    }
    if (eip1967_address != '0x0000000000000000000000000000000000000000') {
      item.proxyAddress = eip1967_address
    } else if (eip1822_address != '0x0000000000000000000000000000000000000000') {
      item.proxyAddress = eip1822_address
    }
    if (pa && pa != item.proxyAddress) {
      item.isUpdate = true
    }
    return item
  } catch (error) {
    console.log(error)
    return item
  }
}

export const getSourceCode = async (contract) => {
  let address = contract.proxyAddress || contract.address
  let chain = contract.chain
  if (!(chain.chainId == 1 || chain.chainId == 42 || chain.chainId == 3 || chain.chainId == 5 || chain.chainId == 11155111)) {
    contract.sources = null
    contract.isGetSources = true
  } else {
    let apiKey = '19SE5KR1KSVTIYMRTBJ8VQ3UJGGVFKIK5W'
    let name = 'api'
    if (chain.chainId == 42) name = 'api-kovan' 
    else if (chain.chainId == 3) name = 'api-ropsten'
    else if (chain.chainId == 5) name = 'api-goerli'
    else if (chain.chainId == 11155111) name = 'api-sepolia'
    else if (chain.chainId == 1) name = 'api'
    else name = ''
    if (!name) {
      contract.sources = null
    }
    let data = await fetcher(`https://${name}.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=${apiKey}`)
    let result = data.result
    if (data.status == 1) {
      result = result[0]
      if (result.SourceCode) {
        let source = result.SourceCode
        let sourcesArr = []
        if (source[0] == '{') {
          source = source.slice(1, -1)
          source = JSON.parse(source)
          let sources = source.sources
          for (let k in sources) {
            let name = k.split('/').pop()
            let item = {
              name: name,
              content: sources[k].content
            }
            sourcesArr.push(item)
          }
        } else {
          let item = {
            name: 'sol.sol',
            content: source
          }
          sourcesArr.push(item)
        }
        console.log(sourcesArr)
        contract.sources = sourcesArr
        contract.isGetSources = true
        contract.abi = JSON.parse(result.ABI)
        contract.isUpdate = false
      } else {
        contract.sources = null
        contract.isGetSources = true
      }
    } else {
      contract.sources = null
      contract.isGetSources = true
    }
  }
  contract.isGetSources = true
  return contract
}