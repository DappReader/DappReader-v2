<template>
  <div class="tuple-input">
    <div v-if="inputItem.type == 'tuple'" class="wrap">
      <p class="item-name">{{ inputItem.name }}</p>
      <ParameItem v-for="(item, index) in inputItem.components" :parame="parameData[inputItem.name]" :inputItem="item" :key="index"
        @inputParameData="inputParameData($event, inputItem.name)" />
    </div>
    <div v-else-if="inputItem.type == 'tuple[]'">
      <div v-for="(e, i) in parameData[inputItem.name]" :key="i" class="tuple-w">
        <div class="del" v-if="parameData[inputItem.name].length > 1" @click="delInput($event, inputItem.name, i)"> <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-4b749e44=""><path d="M11.6 4.40002H4.39999V12.8C4.39999 13.1314 4.66862 13.4 4.99999 13.4H11C11.3314 13.4 11.6 13.1314 11.6 12.8V4.40002Z" stroke="#858D99" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" data-v-4b749e44=""></path><path d="M3.20001 4.40002H12.8" stroke="#858D99" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" data-v-4b749e44=""></path><path d="M9.80001 2.59998H6.20001C5.86864 2.59998 5.60001 2.8686 5.60001 3.19998V4.39998H10.4V3.19998C10.4 2.8686 10.1314 2.59998 9.80001 2.59998Z" stroke="#858D99" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" data-v-4b749e44=""></path></svg></div>
        <n-divider dashed></n-divider>
        <ParameItem v-for="(item, index) in inputItem.components" :parame="e" :inputItem="item" :key="index"
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
    },
    parame: {
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
    watch(() => props.parame, (val) => {
      console.log(val)
      if (val) {
        parameData.value = JSON.parse(JSON.stringify(val))
      }
    }, { immediate: true })
    watch(() => parameData.value, (val) => {
      console.log(val, props.inputItem)
      let type = props.inputItem.type
      let item = JSON.parse(JSON.stringify(val[props.inputItem.name]))
      if (type == 'tuple[]') {
        item = [...Object.values(item)]
        console.log('tuple', item)
      } else if (type.indexOf("[]") > -1) {
        try {
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
        } catch (error) {
          console.log(error)
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
  height: 100%;
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
.tuple-w {
  position: relative;
  .del {
    position: absolute;
    right: -8px;
    top: 4px;
    width: 18px;
    height: 18px;
    cursor: pointer;
    z-index: 9;
    svg {
      width: 18px;
      height: 18px;
      &:hover {
        path {
          stroke: #fff;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.tuple-input .n-input-wrapper {
  padding-left: 0 !important;
}

.n-input__prefix {
  align-items: flex-start !important;
}</style>