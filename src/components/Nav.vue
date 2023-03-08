<template>
  <div class="nav flex-center">
    <div class="nav-l">
      <div v-if="address" class="input-group flex-center">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z" stroke="#858D99" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12.75 12.75L15.75 15.75" stroke="#858D99" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <input class="form-input" v-model="contractAddress" placeholder="search contract address" @input="inputFun" @keyup.enter="handleClickSearch"  />
      </div>
    </div>
    <div class="nav-r flex-center">
      <div v-if="address" class="wallet flex-center-sb chain-w">
        <div class="flex-center">
          <img :src="chain && icons[chain.chainId] ? `https://icons.llamao.fi/icons/chains/rsz_${icons[chain.chainId]}.jpg` : 'https://chainlist.org/unknown-logo.png'" alt="" class="icon">
          <div class="address">{{chain && chain.name}}</div>
        </div>
        
        <div class="flex-center-center gas-price">
          <img src="@/assets/images/gas.gif" alt="">
          <p>{{gasPrice}}</p>
        </div>
        <div class="block"></div>
        <div class="chain-list" v-if="defaultChains && defaultChains.length">
          <div v-for="item in defaultChains" :key="item.chainId" @click="switchChain(item.chainId)" :class="['chain-item', 'flex-center-sb', chainId == item.chainId ? 'chain-item-active' : '']">
            <div class="flex-center" style="width: 100%">
              <img :src="icons[item.chainId] ? `https://icons.llamao.fi/icons/chains/rsz_${icons[item.chainId]}.jpg` : 'https://chainlist.org/unknown-logo.png'" alt="" class="icon">
              <div class="chain-name">{{item.name}}</div>
            </div>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M13.7491 5.65717C14.042 5.95006 14.042 6.42494 13.7491 6.71783L8.12408 12.3428C7.83119 12.6357 7.35631 12.6357 7.06342 12.3428L4.25092 9.53033C3.95803 9.23744 3.95803 8.76256 4.25092 8.46967C4.54381 8.17678 5.01869 8.17678 5.31158 8.46967L7.59375 10.7518L12.6884 5.65717C12.9813 5.36428 13.4562 5.36428 13.7491 5.65717Z" fill="#375CFF"/>
            </svg>
          </div>
          <div class="add-btn flex-center-center" @click="showAdd">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 8H12" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 12L8 4" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Add New Chain</span>
          </div>
        </div>
      </div>
      <div class="wallet flex-center" v-if="address" @click="copy">
        <div class="address">{{formatAddress(address)}}</div>
        <div class="nickname">{{fixed(balance)}}</div>
      </div>
      <div v-else class="wallet wallet-btn flex-center" @click="connectWallet">Connect Wallet</div>
      <div v-if="userInfo.address" class="user-info" @click="editUser">
        <div class="user-avatar">
          <Avatar :width="34" :avatar="userInfo.avatar" :address="userInfo.address" />
        </div>
      </div>
      <div v-else class="user-info" @click="checkUserRegistFun">
        <div class="user-avatar">
          <img src="@/assets/images/user.svg" alt="">
        </div>
      </div>
    </div>
    <CreateContract ref="createContract" />
    <AddFolder ref="addFolder" />
    <RegistModal ref="registModal" @regist="registFun" />
    <LoginModal ref="loginModal" @login="loginFun" @regist="showRegistFun" />
    <AddChainModal ref="addChainModal" @add="addChain" />
    <EditModal ref="editModal" @edit="editUserInfo" />
  </div>
</template>
<script>
import { useStore } from 'vuex'
import { computed, watch, ref, toRaw } from 'vue'
import { chains, icons } from '../libs/chains'
import { useIsActivating } from '../hooks/useIsActivating'
import { useNetwork } from '../hooks/useNetwork'
import { useMessage } from 'naive-ui'
import { ethers } from 'ethers'
import { chainsOptions } from '../libs/chainsOptions'
import Avatar from "@/components/Avatar.vue"
import AddFolder from '@/components/AddFolder.vue'
import CreateContract from '@/components/CreateContract.vue'
import RegistModal from '@/components/RegistModal.vue'
import LoginModal from '@/components/LoginModal.vue'
import AddChainModal from '@/components/AddChainModal'
import EditModal from '@/components/EditModal'
import { checkUserRegist, login, regist, getNftList, getUserInfo, updateUserInfo } from '../http/abi'
export default {
  components: {
    Avatar,
    AddFolder,
    CreateContract,
    RegistModal,
    LoginModal,
    AddChainModal,
    EditModal
  },
  setup() {
    let interval = null
    const store = useStore()
    const message = useMessage()
    const { getProvider } = useIsActivating()
    const { switchChain } = useNetwork()
    const chainId = ref(null)
    const addChainModal = ref(null)
    const editModal = ref(null)
    const chain = ref({})
    const nftList = ref([])
    const searchLoading = ref(false)
    const addFolder = ref(null)
    const createContract = ref(null)
    const loginModal = ref(null)
    const registModal = ref(null)
    const contractAddress = ref('')
    const gasPrice = ref('')
    const selectOptions = ref(chainsOptions)
    const formatAddress = computed(() => {
      return (address) => {
        return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''
      }
    })
    const fixed = computed(() => {
      return (value) => {
        return value ? (+value).toFixed(2) : ''
      }
    })
    const defaultChains = computed(() => {
      return store.state.defaultChains
    })
    const provider = computed(() => {
      return store.state.provider
    })
    const network = computed(() => {
      return store.state.network
    })
    const address = computed(() => {
      return store.state.address
    })
    const balance = computed(() => {
      return store.state.balance
    })
    const userInfo = computed(() => {
      return store.state.userInfo
    })
    const isShowLogin = computed(() => {
      return store.state.isShowLogin
    })
    const handleUpdateValue = (e) => {
      switchChain(e)
    }
    const connectWallet = () => {
      getProvider()
    }
    const copy = () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(address.value)
        message.success('Copy successful')
      }
    }
    const getGas = async () => {
      let GP = await toRaw(provider.value).getGasPrice()
      gasPrice.value = (ethers.utils.formatUnits(GP, "gwei") * 1).toFixed(2)
    }

    const handleClickSearch = async () => {
      if (!contractAddress.value) {
        message.error('Please input contract address')
        return
      } else {
        try {
          searchLoading.value = true
          let formData = {
            address: contractAddress.value,
            chainId: chainId.value
          }
          const apiKey = '19SE5KR1KSVTIYMRTBJ8VQ3UJGGVFKIK5W'
          const fetcher = (...args) => fetch(...args).then((res) => res.json())
          let chain = chainsOptions.filter(e => e.chainId == chainId.value)[0]
          let endpointURL = chain.endpointURL   
          let abiData = await fetcher(`${endpointURL}/api?module=contract&action=getabi&address=${contractAddress.value}&apikey=${apiKey}`)
          let result = abiData.result
          if (abiData.status == 0) {
            if (result == 'Contract source code not verified') {
              message.error('The current contract is not open source, can not be obtained through etherscan')
            } else {
              message.error(result)
            }
          } else if (abiData.status == 1) {
            formData.abi = result
          }
          createContract.value.show()
          createContract.value.formData = formData
          contractAddress.value = ''
          searchLoading.value = false
        } catch (error) {
          message.error(error)
          searchLoading.value = false
        }
      }
      // searchLoading.value = true
      // createContract.value.show()
      // createContract.value.formData = formData
    }

    const inputFun = () => {
      if (contractAddress.value.length == 42) {
        handleClickSearch()
      }
    }

    const showRegistFun = () => {
      registModal.value.show(address.value)
    }

    const getUserInfoFun = () => {
      getUserInfo({q: address.value}).then(res => {
        if (res.code == 0) {
          localStorage.setItem('userInfo', JSON.stringify(res.user_list[0]))
          store.commit('setUserInfo', res.user_list[0])
        }
      })
    }

    const loginFun = async () => {
      try {
        let msg = "Login"
        const time = new Date().getTime()
        const messageData = `${msg}_${time}`
        let signature = await toRaw(provider.value).getSigner().signMessage(messageData)
        login({message: messageData, signature, address: address.value}).then(res => {
          console.log(res)
          if (res.code == 0) {
            localStorage.setItem('token', res.access_token)
            loginModal.value.hide()
            getUserInfoFun()
          } else {
            message.error(res.msg)
          }
        })
      } catch (error) {
        console.log(error)
      }
    }

    const registFun = async ({avatar, nickname}) => {
      try {
        let msg = "Regist"
        const time = new Date().getTime()
        const messageData = `${msg}_${time}`
        let signature = await toRaw(provider.value).getSigner().signMessage(messageData)
        regist({message: messageData, signature, avatar, nickname, address: address.value}).then(res => {
          console.log(res)
          if (res.code == 0) {
            localStorage.setItem('token', res.token)
            loginModal.value.hide()
            registModal.value.closeModal()
            getUserInfoFun()
          } else {
            message.error(res.msg)
            registModal.value.syncing = false
          }
        })
      } catch (error) {
        registModal.value.syncing = false
      }
    }

    const getNftListFun = (address) => {
      console.log(address)
      getNftList({address: '0xbbA51F0b09d5852eFfa609E9223ba7F5d7407945'}).then(res => {
        console.log(res)
        registModal.value.nftList = res
        editModal.value.nftList = res
        nftList.value = res
      })
    }

    const checkUserRegistFun = () => {
      if (!address.value) {
        connectWallet()
        return
      }
      checkUserRegist({address: address.value}).then(res => {
        console.log(res)
        if (res.code == 0) {
          if (res.is_registed) {
            loginFun()
          } else {
            getNftListFun(address.value)
            registModal.value.show(address.value)
          }
        }
      })
    }

    const showAdd = () => {
      addChainModal.value.showModal = true
    }

    const addChain = (e) => {
      addChainModal.value.afterLeave()
      switchChain(e.chainId)
    }

    const editUser = () => {
      console.log(userInfo.value)
      let user = JSON.parse(JSON.stringify(toRaw(userInfo.value)))
      editModal.value.show(user)
      if (nftList.value.length == 0) {
        getNftListFun(user.address)
      } else {
        editModal.value.nftList = nftList.value
      }
    }

    const editUserInfo = ({avatar, nickname, addr}) => {
      updateUserInfo({nickname, avatar}).then(res => {
        console.log(res)
        if (res.code == 0) {
          getUserInfoFun(addr)
        } else {
          message.error(res.msg)
        }
        editModal.value.closeModal()
      })
    }

    watch(network, (val) => {
      chainId.value = val && val.chainId || null
      chain.value = chains.filter(e => e.chainId == chainId.value)[0]
      if (interval) clearInterval(interval)
      if (provider.value) {
        getGas()
      }
      interval = setInterval(() => {
        if (provider.value) {
          getGas()
        }
      }, 5000)
    }, {immediate: true})
    watch(isShowLogin, (val) => {
      if (val) {
        loginModal.value.show()
      }
    }, {immediate: true})
    return {
      chain,
      userInfo,
      editModal,
      defaultChains,
      addChainModal,
      loginModal,
      registModal,
      addFolder,
      createContract,
      searchLoading,
      contractAddress,
      selectOptions,
      gasPrice,
      chains,
      icons,
      network,
      chainId,
      address,
      balance,
      formatAddress,
      fixed,
      handleUpdateValue,
      connectWallet,
      copy,
      getGas,
      handleClickSearch,
      inputFun,
      registFun,
      showRegistFun,
      loginFun,
      checkUserRegistFun,
      showAdd,
      addChain,
      switchChain,
      editUser,
      editUserInfo
    }
  }
}
</script>
<style lang="scss" scoped>
.nav {
  width: 100%;
  height: 60px;
  background: #23242A;
  padding-right: 24px;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(133, 141, 153, 0.1);
  .nav-l {
    flex: 1;
    .input-group {
      margin-left: 24px;
      max-width: 480px;
      overflow: hidden;
      padding-right: 1px;
      background: #1C1C20;
      border: 1px solid rgba(133, 141, 153, 0.15);
      border-radius: 10px;
      padding: 0 12px;
      box-sizing: border-box;
      margin-right: 16px;
      svg {
        flex: 0 0 18px;
      }
      .form-input {
        margin-top: 0;
        height: 34px;
        flex: 1;
        border-radius: 0;
        outline: none;
        font-size: 14px;
        padding: 0 0 0 12px;
        color: #FFFFFF;
        width: 158px;
        box-sizing: border-box;
        background: none !important;
        border: none !important;
      }
    }
  }
  .nav-r {
    position: relative;
    z-index: 9;
    .select {
      width: 260px;
      border: 1px solid rgba(133, 141, 153, 0.15);
      border-radius: 10px;
      background: transparent;
      height: 34px;
    }
    .wallet {
      margin-left: 16px;
      padding: 0 12px;
      border: 1px solid rgba(133, 141, 153, 0.15);
      border-radius: 10px;
      font-family: 'Montserrat-Medium';
      font-size: 13px;
      line-height: 18px;
      color: #FFFFFF;
      height: 34px;
      cursor: pointer;
      &.wallet-btn {
        &:hover {
          background: rgba(133, 141, 153, 0.3);
        }
      }
      .line {
        height: 12px;
        width: 1px;
        margin: 0 12px;
        background: #FFFFFF;
      }
      .avatar {
        margin-right: 6px;
        width: 14px;
        height: 14px;
      }
      .address {
        margin-right: 12px;
      }
      .icon {
        width: 20px;
        height: 20px;
        border-radius: 10px;
        margin-right: 6px;
      }
      .gas-price {
        img {
          width: 18px;
          height: 18px;
        }
        p {
          font-weight: 400;
          font-size: 13px;
          line-height: 17px;
          color: #FFFFFF;
          margin-left: 8px;
        }
      }
      &.chain-w {
        position: relative;
        min-width: 200px;
        &:hover {
          .chain-list {
            display: block;
          }
        }
        .block {
          position: absolute;
          top: 34px;
          left: 0;
          right: 0;
          height: 10px;
          font-size: 0;
        }
        .chain-list {
          display: none;
          position: absolute;
          top: 42px;
          left: 0;
          right: 0;
          max-height: 350px;
          overflow-y: auto;
          background: rgba(21, 20, 27, 0.9);
          border: 1px solid rgba(133, 141, 153, 0.15);
          box-shadow: 0px 12px 30px rgba(10, 10, 12, 0.3);
          backdrop-filter: blur(10px);
          border-radius: 10px;
          padding: 5px;
          box-sizing: border-box;
          .chain-item {
            padding: 0 12px;
            height: 34px;
            border-radius: 6px;
            box-sizing: border-box;
            font-size: 13px;
            line-height: 18px;
            text-transform: capitalize;
            color: #FFFFFF;
            .chain-name {
              flex: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            &:hover {
              background: rgba(133, 141, 153, 0.15);
            }
            &.chain-item-active {
              background: rgba(55, 92, 255, 0.15);
              color: #375CFF;
              svg {
                display: inline-block;
              }
            }
            img {
              width: 18px;
              height: 18px;
              border-radius: 10px;
              margin-right: 6px;
            }
            svg {
              display: none;
            }
          }
          .add-btn {
            background: rgba(133, 141, 153, 0.3);
            border-radius: 6px;
            height: 34px;
            cursor: pointer;
            &:hover {
              background: #375CFF;
            }
            span {
              font-weight: 400;
              font-size: 15px;
              line-height: 18px;
              text-transform: capitalize;
              color: #FFFFFF;
            }
          }
        }
      }
    }
    .user-info {
      .user-avatar {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        margin-left: 16px;
        cursor: pointer;
      }
    }
  }
}
</style>
<style lang="scss">
.nav {
  .n-base-selection {
    --n-border-hover: none !important;
    // --n-border-active: none !important;
    // --n-border-focus: none !important;
    --n-box-shadow-active: none !important;
    --n-box-shadow-focus: none !important;
    &:not(.n-base-selection--disabled).n-base-selection--active {
      .n-base-selection-label {
        background-color: rgba(0, 0, 0, 0);
      }
    }
    .n-base-selection-label {
      background-color: rgba(0, 0, 0, 0);
    }
  }
}
</style>