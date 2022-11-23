import { useMessage } from 'naive-ui'
import { getLs, setLs } from "@/service/service"
import { useStore } from 'vuex'

export const useUtils = () => {
  const store = useStore()
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

  const setData = async (info) => {
    let { id, name} = info
    let menuList = await getLs('menuList') || []
    let contractList = await getLs('contractList') || []
    let openSols = await getLs('openSols') || []
    for (let i = 0; i < menuList.length; i++) {
      let son = menuList[i].son
      son.forEach((e, index) => {
        if (e.id == id) {
          son[index] = info
        }
      })
      menuList[i].son = son
    }
    contractList.forEach((e, index) => {
      if (e.id == id) {
        contractList[index] = info
      }
    })
    openSols.forEach((e, index) => {
      if (e.name == id) {
        openSols[index].content = info
        openSols[index].title = name
      }
    })
    setLs('openSols', JSON.parse(JSON.stringify(openSols))).then(res => {
      console.log(res)
      store.commit("setOpenSols", res)
    })
    setLs('contractList', JSON.parse(JSON.stringify(contractList))).then(res => {
      console.log(res)
      store.commit("setContractList", res)
    })
    setLs('menuList', JSON.parse(JSON.stringify(menuList))).then(res => {
      console.log(res)
      store.commit("setMenuList", res)
    })
  }

  return {
    toEtherscanAddress,
    copy,
    setData
  }
}
