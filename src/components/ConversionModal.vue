<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    class="custom-card modal-style"
    preset="card"
    :style="{width: '600px'}"
    title="Digital Conversion"
    :on-after-leave="afterLeave"
  >
    <div class="form">
      <n-form-item show-require-mark label="decimals" :rule="rule">
        <n-select
          style="width: 100%"
          class="form-select"
          placeholder="Please select network"
          v-model:value="decimalsValue"
          filterable
          :options="weiList"
          @update:value="handleUpdateValue"
        />
      </n-form-item>
      <n-form-item v-if="decimalsValue == 3" show-require-mark label="Custom" >
        <n-input v-model:value="decimals" class="form-input" />
      </n-form-item>
      <div class="form-btns flex-center-center">
        <div :class="['btn-item', decimals ? 'btn-item-activated' : '', 'flex-center-center']" @click="convert">Convert</div>
      </div>
    </div>
  </n-modal>
</template>

<script>
import { ref } from "vue";
export default {
  name: 'AddFolder',
  setup(props, {emit}) {
    const decimals = ref(18)
    const decimalsValue = ref(1)
    const showModal = ref(false)
    const show = () => {
      showModal.value = true
    }
    const convert = () => {
      if (!decimals.value) return
      emit('convert', decimals.value)
    }
    const afterLeave = () => {
      decimals.value = 1
    }
    const handleUpdateValue = () => {
      console.log(decimals.value)
      if (decimalsValue.value == 1) {
        decimals.value = 18
      } else if (decimalsValue.value == 2) {
        decimals.value = 9
      } else {
        decimals.value = ''
      }
    }
    return {
      showModal,
      decimals,
      decimalsValue,
      weiList: [{value: 1, label: 'toWei(10^18)'}, {value: 2, label: 'toGwei(10^9)'}, {value: 3, label: 'Custom'}],
      convert,
      show,
      afterLeave,
      handleUpdateValue
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  padding: 0;
}
</style>
