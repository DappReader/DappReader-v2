const fetcher = (...args) => fetch(...args).then((res) => res.json())
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
  if ((chain.chainId == 1 || chain.chainId == 42 || chain.chainId == 10 || chain.chainId == 3 || chain.chainId == 5 || chain.chainId == 11155111)) {
    let apiKey = '19SE5KR1KSVTIYMRTBJ8VQ3UJGGVFKIK5W'
    let chain = item.chain
    let name = 'api'
    if (chain.chainId == 42) name = 'api-kovan' 
    else if (chain.chainId == 3) name = 'api-ropsten'
    else if (chain.chainId == 5) name = 'api-goerli'
    else if (chain.chainId == 11155111) name = 'api-sepolia'
    else if (chain.chainId == 1) name = 'api'
    else if (chain.chainId == 10) name = 'api-optimistic'
    else name = ''
    response = await fetcher(`https://${name}.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=${address}&apikey=${apiKey}`)
    
  } else if (chain.chainId == 56) {
    response = await fetcher(`https://api.bscscan.com/api?module=contract&action=getcontractcreation&contractaddresses=${address}&apikey=${apiKey}`)
  } else if (chain.chainId == 137) {
    response = await fetcher(`https://api.polygonscan.com/api?module=contract&action=getcontractcreation&contractaddresses=${address}&apikey=${apiKey}`)
  }
  if (response && response.status === '1' && response.result && response.result.length > 0) {
    const contracts = response.result
    item.contractCreator = contracts[0].contractCreator
  }
  return item
}
