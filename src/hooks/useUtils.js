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
    let reg = /^["|'](.*)["|']$/g
    value = value.replace(reg,"$1")
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

  const hasContrace = (address, menuList, contractList) => {
    address = address.toString()
    let contrace = null
    for (let i = 0; i < menuList.length; i++) {
      let son = menuList[i].son
      son.forEach((e) => {
        console.log(e.address)
        if (e.address == address) {
          contrace = e
        }
      })
    }
    console.log(address)
    contractList.forEach((e) => {
      if (e.address == address) {
        contrace = e
      }
    })
    return contrace
  }

  const open = (data, openSols) => {
    let item = null
    openSols.forEach((e) => {
      if (e.content.address == data.address) {
        item = e
      }
    })
    if (item) {
      setLs('activeId', item.name).then(rep => {
        store.commit('setActiveId', rep)
      })
    } else {
      item = {
        name: data.id,
        title: data.name,
        content: data,
        result: []
      }
      openSols.push(item)
      setLs('openSols', JSON.parse(JSON.stringify(openSols))).then(res => {
        store.commit("setOpenSols", res)
        setLs('activeId', data.id).then(rep => {
          store.commit('setActiveId', rep)
        })
      })
    }
  }

  const setData = async (info, folderIndex) => {
    let { id, name} = info
    let menuList = await getLs('menuList') || []
    let contractList = await getLs('contractList') || []
    let openSols = await getLs('openSols') || []
    if (id) {
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
    } else {
      let data = info
      console.log(data, data.address)
      let has = await hasContrace(data.address, menuList, contractList)
      console.log(has)
      if (has) {
        message.info('Contract already exists')
        await open(has, openSols)
        return
      }
      data.id = `${info.contract_address}${new Date().getTime()}`
      data.createAt = new Date().getTime()
      if (folderIndex && folderIndex >= 0) {
        let folderItem = menuList[folderIndex]
        let son = folderItem.son || []
        son.push(data)
        menuList[folderIndex].son = son
        setLs('menuList', JSON.parse(JSON.stringify(menuList))).then(res => {
          store.commit("setMenuList", res)
        })
      } else {
        contractList.push(data)
        setLs('contractList', JSON.parse(JSON.stringify(contractList))).then(res => {
          store.commit("setContractList", res)
        })
      }
      let item = {
        name: data.id,
        title: data.name,
        content: data,
        result: []
      }
      openSols.push(item)
      setLs('openSols', JSON.parse(JSON.stringify(openSols))).then(res => {
        store.commit("setOpenSols", res)
        setLs('activeId', data.id).then(rep => {
          store.commit('setActiveId', rep)
        })
      })
    }
  }

  return {
    toEtherscanAddress,
    copy,
    setData
  }
}
