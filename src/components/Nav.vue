<template>
  <div class="nav flex-center">
    <div class="nav-l"></div>
    <div class="nav-r flex-center">
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
      <div v-else class="wallet wallet-btn flex-center" @click="connectWallet">connectWallet</div>
    </div>
  </div>
</template>
<script>
import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import { chains } from '../libs/chains'
import { useIsActivating } from '../hooks/useIsActivating'
import { useNetwork } from '../hooks/useNetwork'
import { useMessage } from 'naive-ui'
import Avatar from "vue-boring-avatars"
export default {
  components: {
    Avatar
  },
  setup() {
    const store = useStore()
    const message = useMessage()
    const { getProvider } = useIsActivating()
    const { switchChain } = useNetwork()
    const chainId = ref(null)
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
    watch(network, (val) => {
      chainId.value = val && val.chainId || null
    }, {immediate: true})
    return {
      chains,
      network,
      chainId,
      address,
      balance,
      formatAddress,
      fixed,
      handleUpdateValue,
      connectWallet,
      copy
    }
  }
}
</script>
<style lang="scss" scoped>
.nav {
  width: 100%;
  height: 70px;
  background: #15141B;
  padding-right: 32px;
  box-sizing: border-box;
  .nav-l {
    flex: 1;
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
}
</style>