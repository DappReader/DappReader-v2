<template>
  <div class="tuple-input">
    <div v-if="inputItem.type == 'tuple'" class="wrap">
      <p class="item-name">{{ inputItem.name }}</p>
      <ParameItem v-for="(item, index) in inputItem.components" :inputItem="item" :key="index"
        @inputParameData="inputParameData($event, inputItem.name)" />
    </div>
    <div v-else-if="inputItem.type == 'tuple[]'">
      <div v-for="(e, i) in tupleLength" :key="i">
        <ParameItem v-for="(item, index) in inputItem.components" :inputItem="item" :key="index"
          @inputParameData="inputParameDataArr($event, inputItem.name, i)" />
      </div>
      <div class="fun-run-btn flex-center-center" style="margin: auto" @click="() => tupleLength += 1">Add</div>
    </div>
    <div v-else class="tuple-item">
      <n-input v-if="inputItem.type.indexOf('[]') > -1" v-model:value="parameData[inputItem.name]" type="textarea"
        size="small" :autosize="{
          minRows: 3,
          maxRows: 5
        }" class="form-input form-textarea">
        <template #prefix>
          <p class="prefix">{{ inputItem.name }}({{ inputItem.type }})</p>
        </template>
      </n-input>
      <n-input v-else class="form-input" v-model:value="parameData[inputItem.name]">
        <template #prefix>
          <p class="prefix">{{ inputItem.name }}({{ inputItem.type }})</p>
        </template>
      </n-input>
      <div v-if="inputItem.type == 'uint256' && parameData[inputItem.name] && (parameData[inputItem.name] % 1 != 0)"
        class="wei-btns flex-center">
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
    const tupleLength = ref(1)
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
    const inputParameDataArr = (val, v, i) => {
      let key = Object.keys(val)[0]
      console.log(val,v,key, i)
      if (!parameData.value[v]) {
        parameData.value[v] = []
      }
      if (!parameData.value[v][i]) {
        parameData.value[v][i] = {}
      }
      parameData.value[v][i][key] = val[key]
      console.log(parameData.value)
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
    }, { immediate: true })
    watch(() => parameData.value, (val) => {
      let type = props.inputItem.type
      let item = JSON.parse(JSON.stringify(val[props.inputItem.name]))
      if (type == 'tuple[]') {
        item = [...Object.values(item)]
        console.log('tuple', item)
      } else if (type.indexOf("[]") > -1) {
        item = item ? item.replace(/\s+/g, ",").replace(/\[|]/g, "").replace(/(\r\n)|(\n)/g, ",") : ''
        item = item.split(",")
        item = item.filter((e) => e && e.trim())
        item = item.map((e) => e.trim().replace(/\"/g, "").replace(/'/g, "")) // eslint-disable-line
        if (type.indexOf("address") > -1) {
          item = item.map((e) => ethers.utils.getAddress(e))
        } else {
          try {
            item = item.map((e) => ethers.utils.hexlify(e))
          } catch (error) {
            console.log(error)
          }
        }
      } else if (type == 'bool') {
        item = item == 'true' ? true : false
      }
      let obj = {}
      obj[props.inputItem.name] = item
      emit('inputParameData', obj)
    }, { deep: true })
    return {
      parameData,
      tupleLength,
      toWei,
      inputParameData,
      inputParameDataArr
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
  background: rgba(133, 141, 153, 0.15);
  border-radius: 10px 0 0 10px;
  padding: 0 12px;
  box-sizing: border-box;
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

.tuple-item {
  margin-bottom: 8px;
}
</style>
<style lang="scss">
.tuple-input .n-input-wrapper {
  padding-left: 0 !important;
}

.n-input__prefix {
  align-items: flex-start !important;
}</style>