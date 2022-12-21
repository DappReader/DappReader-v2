<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    class="custom-card"
    preset="card"
    :style="{width: '564px',background: '#15141B', 'border-radius': '10px', padding: '8px'}"
    title="Current Network Error"
  >
    <div class="modal-content">
      <div class="hint">The chain connected to the current wallet is different from that of this contract. Please switch the chain</div>
      <div class="btns">
        <div class="btn btn-activate flex-center-center" @click="switchChain">Switch to {{chain.name}} and run the function</div>
        <div class="btn-line flex-center-center">or</div>
        <div class="btn flex-center-center">Change the current chain to Ethereum Mainnet and run the function</div>
      </div>
    </div>
  </n-modal>
</template>
<script>
import { ref } from 'vue'
export default {
  props: {
    chain: Object
  },
  setup(props, {emit}) {
    const showModal = ref(false)
    const switchChain = () => {
      emit('switchChain')
    }
    return {
      showModal,
      switchChain
    }
  }
}
</script>
<style lang="scss" scoped>
.modal-content {
  margin-top: -8px;
  .hint {
    font-weight: 400;
    font-size: 12px;
    line-height: 24px;
    color: #858D99;
  }
  .btns {
    margin-top: 32px;
    .btn {
      cursor: pointer;
      height: 45px;
      background: rgba(133, 141, 153, 0.15);
      border-radius: 10px;
      font-weight: 400;
      font-size: 12px;
      line-height: 17px;
      color: #FFFFFF;
      &.btn-activate {
        background: #375CFF;
      }
    }
    .btn-line {
      height: 20px;
      margin: 16px 0;
      position: relative;
      &::after {
        content: '';
        height: 1px;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 220px;
        background: rgba(133, 141, 153, 0.2);
        margin: auto;
      }
      &::before {
        content: '';
        height: 1px;
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        width: 220px;
        background: rgba(133, 141, 153, 0.2);
        margin: auto;
      }
    }
  }
}
</style>