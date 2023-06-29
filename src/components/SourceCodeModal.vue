<template>
  <n-modal v-model:show="showSourceCode" :on-after-leave="afterLeave" :mask-closable="false" class="custom-card modal-style" preset="card"
    :style="{ width: '90vw', 'min-height': '200px', height: '90vh' }" title="View Source Code">
    <div class="code-content">
      <n-tabs
        :type="type"
        animated
        :placement="placement"
        style="height: 100%;"
      >
      <n-tab-pane v-for="(item, index) in sourcesList" :key="index" :name="item.name" :tab="item.name" display-directive="show">
        <div class="flex-start" style="height: 100%;">
          <Codemirror
            v-model="item.content"
            :disabled="true"
            :extensions="extensions"
            style="height: 100%;flex: 1"
          />
          <div class="ai">
            <div v-if="!item.report">
              <div v-if="!aiLoading" class="ai-not">
                <p>This code has not been audited yet. Please click the button to start the OpenAI audit.</p>
                <div class="ai-btn flex-center-center" @click="getReportFun(index)">
                  <span>Start Audit</span>
                </div>
              </div>
              <div v-else class="ai-not">
                <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                <p>Please wait a moment, the whole process may take around 20 seconds</p>
              </div>
            </div>
            <div v-if="item.report" class="ai-report" v-html="formatReport(item.report)"></div>
          </div>
        </div>
      </n-tab-pane>
      </n-tabs>
    </div>
  </n-modal>
</template>
<script>
import { ref } from 'vue'
import { Codemirror } from 'vue-codemirror'
// import { oneDark } from '@codemirror/theme-one-dark'
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { solidity } from '@replit/codemirror-lang-solidity';
import { getReport } from '../http/abi'
import { useUtils } from '../hooks/useUtils'
import { useMessage } from 'naive-ui'
export default {
  components: {
    Codemirror
  },
  setup() {
    const message = useMessage()
    const extensions = [solidity, vscodeDark]
    const { setData } = useUtils()
    const showSourceCode = ref(false)
    const aiLoading = ref(false)
    const activeName = ref('')
    const activeIndex = ref(-1)
    const showLoading = ref(false)
    const sourcesList = ref([])
    const placement = ref("left");
    const type = ref("card");
    const contractData = ref(null)
    const show = async (contract) => {
      contractData.value = contract || null
      let sources = contract.sources || null
      showSourceCode.value = true
      if (sources) {
        sources.forEach(e => {
          e.name = e.name.split('/').pop()
        })
        activeName.value = sources[0].name
        activeIndex.value = 0
        sourcesList.value = sources
      }
    }
    const getReportFun = (index) => {
      let code = sourcesList.value[index].content
      aiLoading.value = true
      getReport({code}).then(res => {
        console.log(res)
        if (res.code == 0) {
          let data = res.report
          let sources = contractData.value.sources
          let source = sources[index]
          source.report = data
          sourcesList.value[index].report = data
          contractData.value.sources = sources
          setData(contractData.value)
          aiLoading.value = false
        } else {
          aiLoading.value = false
          message.error(res.msg)
        }
        
      }).catch(err => {
        aiLoading.value = false
        message.error(err)
      })
    }
    const formatReport = (code) => {
      // 将换行符换成<br />
      if (code) {
        code = code.replace(/\n/g, '<br />')
        // 相邻的<br />转换成一个
        code = code.replace(/(<br \/>)+/g, '<br />')
      }
      return code
    }
    const afterLeave = () => {
      showSourceCode.value = false
      activeName.value = ''
      activeIndex.value = 0
      sourcesList.value = []
    }
    return {
      code: ``,
      placement,
      type,
      extensions,
      activeName,
      showLoading,
      activeIndex,
      sourcesList,
      showSourceCode,
      aiLoading,
      show,
      getReportFun,
      formatReport,
      afterLeave
    }
  }
}
</script>

<style lang="scss" scoped>
.code-content {
  height: calc(90vh - 70px);
  background: rgb(24, 24, 24);
  box-sizing: border-box;
  .ai {
    flex: 0 0 30%;
    height: 100%;
    border-left: 1px solid #000;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 14px;
    box-sizing: border-box;
    .ai-not {
      font-size: 14px;
      color: #fff;
      text-align: center;
    }
    .ai-report {
      height: 100%;
      overflow: auto;
      line-height: 1.6;
    }
    .ai-btn {
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      color: #FFFFFF;
      padding: 0 12px;
      box-sizing: border-box;
      height: 40px;
      background: #2C2D34;
      border-radius: 10px;
      cursor: pointer;
      margin: 12px auto;
      width: 150px;
      &:hover {
        background: #0784C3 !important;
      }
    }
  }
}
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ellipsis div {
  position: absolute;
  top: 33px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #fff;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}

</style>
<style>
.n-tabs.n-tabs--left .n-tab-pane {
  padding: 0 !important;
  overflow-x: auto !important;
}
</style>
