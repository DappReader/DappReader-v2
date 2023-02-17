<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    class="custom-card"
    preset="card"
    :style="{width: '700px',background: '#15141B', 'border-radius': '10px'}"
    title="Decode Input"
    :on-after-leave="afterLeave"
  >
    <div class="modal-content">
      <div class="input">
        <n-input type="textarea"
          size="small"
          :autosize="{
            minRows: 5,
            maxRows: 10
          }" 
          v-model:value="textarea"
          class="form-input form-textarea"
          placeholder="Please Input Data"
          @input="decode"
        />
      </div>
      <div v-if="functionName && decodedArgs.length" class="result-section">
        <div class="result-section-content">
          <div class="result-section-content-hd flex-center">Function Name: {{functionName}}</div>
          <div class="result-section-content-main">
            <div class="result-params">
              <div v-for="(param, index) in decodedArgs" :key="index" class="result-param flex-center">
                <div class="result-param-name">{{param.key}}</div>
                <div class="result-param-value">{{param.value}}</div>
                <img src="@/assets/images/copy.svg" alt="" @click="copy(param.value)">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </n-modal>
</template>
<script>
import { ref } from 'vue'
import { ethers } from 'ethers'
import { useMessage } from "naive-ui"
import { useUtils } from '../hooks/useUtils'
export default {  
  name: 'ShareModal',
  props: ['contract'],
  setup(props) {
    const { copy } = useUtils()
    const message = useMessage()
    const textarea = ref('')
    const functionName = ref('')
    const decodedArgs = ref([])
    const showModal = ref(false)
    const decode = () => {
      console.log(props.contract)
      try {
        let abi = props.contract.abi
        abi = abi.filter(e => e.type == 'function')
        const iface = new ethers.utils.Interface(abi)
        let args = iface.decodeFunctionData(textarea.value.slice(0,10), textarea.value)
        functionName.value = iface.getFunction(textarea.value.slice(0,10)).name
        let arr = []
        abi.forEach(e => {
          if (e.name == functionName.value) {
            let inputs = e.inputs
            for (let i = 0; i < inputs.length; i++) {
              let item = {key: inputs[i].name, value: args[i]}
              arr.push(item)
            }
          }
        })
        decodedArgs.value = arr
      } catch (error) {
        message.error('Error, Please check Input Value')
        decodedArgs.value = ''
        functionName.value = ''
      }
    }
    const afterLeave = () => {
      textarea.value = ''
      decodedArgs.value = ''
      functionName.value = ''
    }
    return {
      decodedArgs,
      functionName,
      textarea,
      showModal,
      afterLeave,
      decode,
      copy
    }
  }
}
</script>

<style scoped lang="scss">
.modal-content {
  box-sizing: border-box;
  padding: 0 20px;
}
.form-input {
  border: 1px solid rgba(133, 141, 153, 0.2);
  border-radius: 10px;
}
.result-section {
  margin-top: 18px;
  font-size: 14px;
  line-height: 18px;
  text-transform: capitalize;
  color: #FFFFFF;
  .result-section-content {
    margin-top: 12px;
    background: #2C2D34;
    border-radius: 10px;
    padding: 0 2px 2px;
    box-sizing: border-box;
    .result-section-content-hd {
      padding: 0 18px;
      height: 30px;
      img {
        margin-left: 12px;
        cursor: pointer;
      }
    }
    .result-section-content-main {
      background: #17171A;
      border-radius: 9px;
      .result-params {
        overflow: hidden;
        transition: all .3s;
      }
      .result-param {
        width: 100%;
        padding: 12px 18px;
        box-sizing: border-box;
        // height: 40px;
        border-bottom: 1px solid #2C2D34;
        font-size: 12px;
        line-height: 15px;
        text-transform: capitalize;
        color: #FFFFFF;
        &:last-child {
          border-bottom: none;
        }
        .result-param-name {
          width: 160px;
          margin-right: 10px;
        }
        .result-param-value {
          flex: 1;
          max-width: 538px;
          margin-right: 10px;
          white-space: normal;
          word-wrap: break-word;
        }
        img {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
      }
      .result-param-show {
        background: linear-gradient(180deg, rgba(10, 10, 12, 0) 0%, rgba(10, 10, 12, 0.63) 17.45%, #17171A 50%);
        border-radius: 0px 0px 10px 10px;
        width: 100%;
        height: 20px;
        cursor: pointer;
        font-size: 0px;
        img {
          width: 16px;
          height: 16px;
          margin-left: 8px;
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