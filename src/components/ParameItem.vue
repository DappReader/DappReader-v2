<template>
  <div>
    <div v-if="inputItem.type == 'tuple'" class="wrap">
      <p class="item-name">{{inputItem.name}}</p>
      <ParameItem v-for="(item, index) in inputItem.components" :inputItem="item" :key="index" @inputParameData="inputParameData($event, inputItem.name)" />
    </div>
    <div v-else>
      <n-input
        v-if="inputItem.type == 'bytes32[]'"
        v-model:value="parameData[inputItem.name]"
        type="textarea"
        size="small"
        :autosize="{
          minRows: 3,
          maxRows: 5
        }" 
        class="form-input form-textarea"
      >
        <template #prefix>
          <p class="prefix">{{inputItem.name}}({{inputItem.type}}): </p>
        </template>
      </n-input>
      <n-input v-else class="form-input" v-model:value="parameData[inputItem.name]" >
        <template #prefix>
          <p class="prefix">{{inputItem.name}}({{inputItem.type}}): </p>
        </template>
      </n-input>
      <div v-if="inputItem.type == 'uint256' && parameData[inputItem.name] && (parameData[inputItem.name] % 1 != 0)" class="wei-btns flex-center">
        <div class="wei-btn flex-center-center" @click="toWei(inputItem.name, 18)">ToWei(10^18)</div>
        <div class="wei-btn flex-center-center" @click="toWei(inputItem.name, 9)">ToGwei(10^9)</div>
        <p>invalid number, please use digital conversion </p>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, watch } from 'vue'
import { ethers } from 'ethers'
export default {
  name: 'ParameItem',
  props: {
    inputItem: {
      type: Object
    }
  },
  setup(props, { emit }) {
    const parameData = ref({})
    const toWei = (type, decimals) => {
      try {
        parameData.value[type] = ethers.utils.parseUnits(parameData.value[type].toString(), decimals).toString()
      } catch (error) {
        // message.error(error)
      }
    }
    const inputParameData = (val, v) => {
      let key = Object.keys(val)[0]
      if (!parameData.value[v]) {
        parameData.value[v] = {}
      }
      parameData.value[v][key] = val[key]
    }
    watch(() => props.inputItem, (val) => {
      if (val.type == 'tuple') {
        parameData.value[val.name] = {}
        val.components.forEach(item => {
          parameData.value[val.name][item.name] = ''
        })
      } else {
        parameData.value[val.name] = ''
      }
    }, {immediate: true})
    watch(() => parameData.value, (val) => {
      emit('inputParameData', val)
    }, { deep: true })
    return {
      parameData,
      toWei,
      inputParameData
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  padding-left: 20px;
  box-sizing: border-box;
}
.item-name {
  font-size: 14px;
  color: rgba($color: #ffffff, $alpha: .85);
  margin: 8px 0;
}
.prefix {
  font-size: 14px;
  color: #808080;
}
.wei-btns {
  margin-top: 12px;
  .wei-btn {
    width: 100px;
    height: 31px;
    background: #22212B;
    border-radius: 5px;
    font-weight: 400;
    font-size: 12px;
    line-height: 15px;
    color: #858D99;
    margin-right: 12px;
    cursor: pointer;
    &:hover {
      background: #375CFF;
      color: #FFFFFF;
    }
  }
  p {
    color: #E88080;
    font-size: 12px;
    line-height: 15px;
  }
}
</style>