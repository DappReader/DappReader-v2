<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    class="custom-card"
    preset="card"
    :style="{width: '600px',background: '#15141B', 'border-radius': '10px'}"
    title="Download contract"
    :on-after-leave="afterLeave"
  >
    <div v-if="!token" class="modal-content">
      <n-spin :show="loading">
        <div class="input">
          <n-input v-model:value="password" placeholder="Please enter your password" class="form-input" @keydown.enter="confirm" />
        </div>
        <div :class="['share-btn', 'flex-center-center',  password ? 'btn-activate' : '']" @click="confirm">Confirm</div>
      </n-spin>
    </div>
  </n-modal>
</template>

<script>
import { ref } from 'vue'

export default {  
  name: 'ShareModal',
  props: ['contract'],
  setup(props, {emit}) {
    const password = ref('')
    const loading = ref(false)
    const showModal = ref(false)
    const confirm = () => {
      console.log(password.value)
      if (!password.value) return
      emit('confirm', password.value)
    }
    const afterLeave = () => {
      password.value = ''
    }
    return {
      password,
      showModal,
      loading,
      afterLeave,
      confirm
    }
  }
}
</script>

<style scoped lang="scss">
.modal-content {
  box-sizing: border-box;
  padding: 0 20px;
  .input {
    // margin-top: 16px;
  }
  .share-btn {
    margin-top: 32px;
    height: 50px;
    background: rgba(133, 141, 153, 0.1);
    border-radius: 10px;
    font-size: 16px;
    line-height: 22px;
    text-transform: capitalize;
    color: #858D99;
    cursor: no-drop;
    svg {
      margin-right: 8px;
      path {
        stroke: #858D99;
      }
    }
    &.btn-activate {
      background: #375CFF;
      color: #FFFFFF;
      cursor: pointer;
      svg {
        path {
          stroke: #FFFFFF;
        }
      }
    }
  }
}
</style>

<style>
  .custom-card .modal-content .n-spin-content {
    border: none;
  }
</style>