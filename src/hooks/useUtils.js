import { useMessage } from 'naive-ui'
import { getLs, setLs } from "@/service/service"
import { useStore } from 'vuex'
import { chains } from '../libs/chains'

export const useUtils = () => {
  const store = useStore()
  const message = useMessage()
  const copy = (value, type) => {
    if (type == 'abi') {
      value = JSON.parse(JSON.stringify(value))
      value = value.map(e => {
        delete e.otherName
        delete e.tempName
        return e
      })
      value = JSON.stringify(value)
    } else if (type == 'iframe') {
      value = JSON.parse(JSON.stringify(value))
    } else {
      value = JSON.stringify(value)
      let reg = /^["|'](.*)["|']$/g
      value = value.replace(reg,"$1")
    }
    if (!navigator.clipboard || window.top != window.self) {
      let textarea = document.createElement('textarea')
      document.body.appendChild(textarea)
      textarea.style.position = 'fixed'
      textarea.style.clip = 'rect(0 0 0 0)'
      textarea.style.top = '10px'
      textarea.value = value
      textarea.select()
      document.execCommand('copy', true)
      document.body.removeChild(textarea)
      message.success('Copy successful')
    } else {
      navigator.clipboard.writeText(value)
      message.success('Copy successful')
    }
      
  }

  const toEtherscanAddress = (address, chain, type) => {
    let network = chains.filter(e => e.chainId == chain.chainId)[0]
    let host = network.explorers[0]?.url
    if (host) {
      let url = `${host}/address/${address}`
      if (type == 'tx') {
        url = `${host}/tx/${address}`
      }
      window.open(url)
    }
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

  const open = (data) => {
    setLs('activeId', data.id).then(rep => {
      store.commit('setActiveId', rep)
    })
  }

  const setData = async (info, folderIndex) => {
    let {id} = info
    let menuList = await getLs('menuList') || []
    let contractList = await getLs('contractList') || []
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
      let has = await hasContrace(data.address, menuList, contractList)
      if (has) {
        // message.info('Contract already exists')
        await open(has)
        return
      }
      data.id = crypto.randomUUID()
      data.createAt = new Date().getTime()
      if (folderIndex && folderIndex >= 0) {
        let folderItem = menuList[folderIndex]
        let son = folderItem.son || []
        son.push(data)
        menuList[folderIndex].son = son
        let res = await setLs('menuList', JSON.parse(JSON.stringify(menuList)))
        store.commit("setMenuList", res)
      } else {
        contractList.push(data)
        let res = await setLs('contractList', JSON.parse(JSON.stringify(contractList)))
        store.commit("setContractList", res)
      }
      await open(data)
    }
  }

  return {
    toEtherscanAddress,
    copy,
    setData
  }
}
