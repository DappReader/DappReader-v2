<template>
  <div class="nav flex-center">
    <div class="nav-l">
      <div class="input-group flex-center">
        <n-select
          class="input-group-select"
          :options="selectOptions"
          v-model:value="contractChainId"
          label-field="name"
          value-field="chainId" 
        />
        <input class="form-input" v-model="contractAddress" placeholder="input contract address" />
        <n-button class="input-group-btn" :loading="searchLoading" @click="handleClickSearch">Search</n-button>
      </div>
    </div>
    <div class="nav-r flex-center">
      <div class="flex-center-center gas-price">
        <img src="@/assets/images/gas.gif" alt="">
        <p>{{gasPrice}}</p>
      </div>
      
      <n-select
        v-if="address"
        class="select"
        v-model:value="chainId"
        filterable
        :options="chains"
        @update:value="handleUpdateValue"
        label-field="name"
        value-field="chainId"
      />
      <div v-if="address" class="wallet flex-center" @click="copy">
        <div class="balance">{{fixed(balance)}}</div>
        <div class="line"></div>
        <div class="address">{{formatAddress(address)}}</div>
        <div class="avatar flex-center">
          <Avatar 
            :size="14"
            :name="address" 
          />
        </div>
      </div>
      <div v-else class="wallet wallet-btn flex-center" @click="connectWallet">Connect Wallet</div>
    </div>
    <CreateContract ref="createContract" />
    <AddFolder ref="addFolder" />
  </div>
</template>
<script>
import { useStore } from 'vuex'
import { computed, watch, ref, toRaw } from 'vue'
import { chains } from '../libs/chains'
import { useIsActivating } from '../hooks/useIsActivating'
import { useNetwork } from '../hooks/useNetwork'
import { useMessage } from 'naive-ui'
import { ethers } from 'ethers'
import { chainsOptions } from '../libs/chainsOptions'
import Avatar from "vue-boring-avatars"
import AddFolder from '@/components/AddFolder.vue'
import CreateContract from '@/components/CreateContract.vue'
export default {
  components: {
    Avatar,
    AddFolder,
    CreateContract
  },
  setup() {
    let interval = null
    const store = useStore()
    const message = useMessage()
    const { getProvider } = useIsActivating()
    const { switchChain } = useNetwork()
    const chainId = ref(null)
    const searchLoading = ref(false)
    const addFolder = ref(null)
    const createContract = ref(null)
    const contractAddress = ref('')
    const gasPrice = ref('')
    const contractChainId = ref(1)
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
      if (!contractChainId.value || !contractAddress.value) {
        message.error('Please input contract address')
        return
      } else {
        try {
          searchLoading.value = true
          let formData = {
            address: contractAddress.value,
            chainId: contractChainId.value
          }
          const apiKey = '19SE5KR1KSVTIYMRTBJ8VQ3UJGGVFKIK5W'
          const fetcher = (...args) => fetch(...args).then((res) => res.json())
          let chain = chainsOptions.filter(e => e.chainId == contractChainId.value)[0]
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

    watch(network, (val) => {
      chainId.value = val && val.chainId || null
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
    return {
      addFolder,
      createContract,
      contractChainId,
      searchLoading,
      contractAddress,
      selectOptions,
      gasPrice,
      chains,
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
      handleClickSearch
    }
  }
}
</script>
<style lang="scss" scoped>
.nav {
  width: 100%;
  height: 60px;
  background: #15141B;
  padding-right: 32px;
  box-sizing: border-box;
  .nav-l {
    flex: 1;
    .input-group {
      width: 494px;
      overflow: hidden;
      padding-right: 1px;
      border: 1px solid rgba(133, 141, 153, 0.15);
      border-radius: 10px;
      margin-left: 32px;
      .input-group-select {
        width: 150px;
        box-sizing: border-box;
        height: 34px;
      }
      .form-input {
        margin-top: 0;
        height: 34px;
        width: 250px;
        border-radius: 0;
        outline: none;
        font-size: 14px;
        padding: 0 14px;
        color: #FFFFFF;
      }
      .input-group-btn {
        width: 90px;
        background: none;
        border: none;
        background: #375CFF;
        height: 34px;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FFFFFF;
        border-radius: 0 10px 10px 0;
        cursor: pointer;
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
      font-size: 12px;
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
        margin-left: 12px;
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
  .gas-price {
    img {
      width: 20px;
      height: 20px;
    }
    p {
      font-weight: 400;
      font-size: 14px;
      line-height: 17px;
      color: #FFFFFF;
      margin-left: 8px;
      margin-right: 16px;
    }
  }
}
</style>