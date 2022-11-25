<template>
  <div class="info flex-center">
    <div class="info-item">
      <div class="info-item-key">Chain</div>
      <div class="info-item-value">{{contarct.chain.name || contarct.chain.chainName}}</div>
    </div>
    <div class="info-line"></div>
    <div class="info-item">
      <div class="info-item-key">creation time</div>
      <div class="info-item-value">{{contarct.createAt ? createAt(contarct.createAt) : '--'}}</div>
    </div>
    <div class="info-line"></div>
    <div class="info-item info-copy" @click="copy(contarct.address)">
      <div class="info-item-key">contract address</div>
      <div class="info-item-value flex-center"><span>{{address(contarct.address)}}</span> <img src="@/assets/images/copy.svg" alt=""></div>
    </div>
    <div class="info-line"></div>
    <div class="info-item">
      <div class="info-item-key">contract balance</div>
      <div class="info-item-value flex-center"><span>{{balance}}</span></div>
    </div>
  </div>
</template>
<script>
import { computed, watch, ref, toRaw } from 'vue'
import { useStore } from 'vuex'
import { ethers } from 'ethers'
import { useUtils } from '../hooks/useUtils'
import { formatDate, formatAddress } from '../libs/utils'
export default {
  props: ['contarct'],
  setup(props) {
    const store = useStore()
    const balance = ref(0)
    const { copy } = useUtils()
    const provider = computed(() => {
      return store.state.provider
    })
    const createAt = computed(() => {
      return (date) => {
        return formatDate('YYYY-mm-dd', date)
      }
    })
    const address = computed(() => {
      return (value) => {
        return formatAddress(value)
      }
    })
    watch(props.contarct, async (val) => {
      if (val && provider.value) {
        let balanceEth = await toRaw(provider.value).getBalance(val.address)
        let balanceInEth = await ethers.utils.formatEther(balanceEth)
        balance.value = balanceInEth
      } else {
        balance.value = 0
      }
    }, {immediate: true})
    return {
      balance,
      createAt,
      address,
      copy
    }
  }
}
</script>
<style lang="scss" scoped>
.info {
  margin-top: 40px;
  .info-item {
    width: 160px;
    &.info-copy {
      cursor: pointer;
    }
    .info-item-key {
      font-weight: 400;
      font-size: 12px;
      line-height: 15px;
      text-transform: capitalize;
      color: #858D99;
    }
    .info-item-value {
      font-size: 16px;
      line-height: 20px;
      text-transform: capitalize;
      color: #FFFFFF;
      margin-top: 10px;
      font-family: Montserrat-Medium;
      img {
        margin-left: 12px;
        width: 20px;
        height: 20px;
      }
    }
  }
  .info-line {
    height: 20px;
    width: 1px;
    background: rgba(133, 141, 153, 0.15);
    margin: 0 24px;
  }
}
</style>