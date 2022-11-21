 /* eslint-disable */ 
import { ethers } from 'ethers'
export const connectWallet = (init) => {
  let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  return new Promise(async (resolve, reject) => {
    if (window.ethereum) {
      let web3Provider = window.ethereum;
      try {
        let accounts = await web3Provider.request({ method: 'eth_accounts' }) 
        if (!init || (accounts && accounts.length)) {
          await window.ethereum.request({ method: 'eth_requestAccounts' })
          let web3 = new ethers.providers.Web3Provider(web3Provider);
          resolve(web3);
        }
        // await window.ethereum.enable();
      } catch (error) {
        console.log('连接失败', error)
        reject(error);
      }
    } else if (window.web3) {
      let web3Provider = window.web3.currentProvider;
      let web3 = new ethers.providers.Web3Provider(web3Provider);
      resolve(web3);
    } else {
      // 处理用户没有metamask的逻辑
        alert('Please install MetaMask！')
        window.open('https://metamask.io/')
      reject('')
    }
  })
}

export const contract = (contractAddress, abi, provider) => {
  return new ethers.Contract(contractAddress, abi, provider)
}

