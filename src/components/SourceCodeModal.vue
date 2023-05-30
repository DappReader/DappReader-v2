<template>
  <n-modal v-model:show="showSourceCode" :mask-closable="false" class="custom-card modal-style" preset="card"
    :style="{ width: '90vw', 'min-height': '200px', height: '90vh' }" title="View Source Code">
    <div class="code-content">
      <n-tabs
        :type="type"
        animated
        :placement="placement"
        style="height: 100%;"
      >
      <n-tab-pane v-for="(item, index) in sourcesList" :key="index" :name="item.name" :tab="item.name" display-directive="show">
        <Codemirror
          v-model="item.content"
          :disabled="true"
          :extensions="extensions"
          style="height: 100%;"
        />
      </n-tab-pane>
      </n-tabs>
    </div>
  </n-modal>
</template>
<script>
import { ref } from 'vue'
import { useUtils } from '../hooks/useUtils'
import { useMessage } from 'naive-ui'
import { Codemirror } from 'vue-codemirror'
// import { oneDark } from '@codemirror/theme-one-dark'
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { solidity } from '@replit/codemirror-lang-solidity';
export default {
  components: {
    Codemirror
  },
  setup() {
    const extensions = [solidity, vscodeDark]
    const { setData } = useUtils()
    const message = useMessage()

    const showSourceCode = ref(false)
    const activeName = ref('')
    const activeIndex = ref(-1)
    const showLoading = ref(false)
    const sourcesList = ref([])
    const placement = ref("left");
    const type = ref("card");

    const fetcher = (...args) => fetch(...args).then((res) => res.json())

    const show = async (contract) => {
      let address = contract.address
      let chain = contract.chain
      let sources = contract.sources || null
      showSourceCode.value = true
      if (!(chain.chainId == 1 || chain.chainId == 42 || chain.chainId == 3 || chain.chainId == 5 || chain.chainId == 11155111)) {
        sources = null
        let CD = contract
        CD.sources = null
        setData(CD)
      }
      if (sources) {
        sources.forEach(e => {
          e.name = e.name.split('/').pop()
        })
        activeName.value = sources[0].name
        activeIndex.value = 0
        sourcesList.value = sources
      } else {
        showLoading.value = true
        let apiKey = '19SE5KR1KSVTIYMRTBJ8VQ3UJGGVFKIK5W'
        let name = 'api'
        if (chain.chainId == 42) name = 'api-kovan' 
        else if (chain.chainId == 3) name = 'api-ropsten'
        else if (chain.chainId == 5) name = 'api-goerli'
        else if (chain.chainId == 11155111) name = 'api-sepolia'
        else name = ''
        if (!name) {
          showLoading.value = false
          showSourceCode.value = false
          message.error('The current chain is not supported')
          return
        }
        let data = await fetcher(`https://${name}.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=${apiKey}`)
        let result = data.result
        if (data.status == 0) {
          showLoading.value = false
          showSourceCode.value = false
          if (result == 'Contract source code not verified') {
            message.error('The current contract is not open source, can not be obtained through etherscan')
          } else {
            message.error(result)
          }
        } else if (data.status == 1) {
          result = result[0]
          if (result.SourceCode) {
            let source = result.SourceCode
            console.log(source[0])
            let sourcesArr = []
            if (source[0] == '{') {
              source = source.slice(1, -1)
              source = JSON.parse(source)
              let sources = source.sources
              for (let k in sources) {
                let name = k.split('/').pop()
                let item = {
                  name: name,
                  content: sources[k].content
                }
                sourcesArr.push(item)
              }
            } else {
              let item = {
                name: 'sol.sol',
                content: source
              }
              sourcesArr.push(item)
            }
            console.log(sourcesArr)
            activeName.value = sourcesArr[0].name
            activeIndex.value = 0
            let CD = contract
            CD.sources = sourcesArr
            sourcesList.value = sourcesArr
            setData(CD)
            showLoading.value = false
          } else {
            showLoading.value = false
            showSourceCode.value = false
            message.error('The current contract is not open source, can not be obtained through etherscan')
          }
        }
      }
    }
    return {
      code: `console.log('Hello, world!')`,
      placement,
      type,
      extensions,
      activeName,
      showLoading,
      activeIndex,
      sourcesList,
      showSourceCode,
      show
    }
  }
}
</script>

<style lang="scss" scoped>
.code-content {
  height: calc(90vh - 70px);
  background: rgb(24, 24, 24);
  box-sizing: border-box;
}
</style>
<style>
/**
    Name: IntelliJ IDEA darcula theme
    From IntelliJ IDEA by JetBrains
 */

.cm-s-darcula  { font-family: Consolas, Menlo, Monaco, 'Lucida Console', 'Liberation Mono', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Courier New', monospace, serif;}
.cm-s-darcula.CodeMirror { background: #2B2B2B; color: #A9B7C6; }

.cm-s-darcula span.cm-meta { color: #BBB529; }
.cm-s-darcula span.cm-number { color: #6897BB; }
.cm-s-darcula span.cm-keyword { color: #CC7832; line-height: 1em; font-weight: bold; }
.cm-s-darcula span.cm-def { color: #A9B7C6; font-style: italic; }
.cm-s-darcula span.cm-variable { color: #A9B7C6; }
.cm-s-darcula span.cm-variable-2 { color: #A9B7C6; }
.cm-s-darcula span.cm-variable-3 { color: #9876AA; }
.cm-s-darcula span.cm-type { color: #AABBCC; font-weight: bold; }
.cm-s-darcula span.cm-property { color: #FFC66D; }
.cm-s-darcula span.cm-operator { color: #A9B7C6; }
.cm-s-darcula span.cm-string { color: #6A8759; }
.cm-s-darcula span.cm-string-2 { color: #6A8759; }
.cm-s-darcula span.cm-comment { color: #61A151; font-style: italic; }
.cm-s-darcula span.cm-link { color: #CC7832; }
.cm-s-darcula span.cm-atom { color: #CC7832; }
.cm-s-darcula span.cm-error { color: #BC3F3C; }
.cm-s-darcula span.cm-tag { color: #629755; font-weight: bold; font-style: italic; text-decoration: underline; }
.cm-s-darcula span.cm-attribute { color: #6897bb; }
.cm-s-darcula span.cm-qualifier { color: #6A8759; }
.cm-s-darcula span.cm-bracket { color: #A9B7C6; }
.cm-s-darcula span.cm-builtin { color: #FF9E59; }
.cm-s-darcula span.cm-special { color: #FF9E59; }
.cm-s-darcula span.cm-matchhighlight { color: #FFFFFF; background-color: rgba(50, 89, 48, .7); font-weight: normal;}
.cm-s-darcula span.cm-searching { color: #FFFFFF; background-color: rgba(61, 115, 59, .7); font-weight: normal;}

.cm-s-darcula .CodeMirror-cursor { border-left: 1px solid #A9B7C6; }
.cm-s-darcula .CodeMirror-activeline-background { background: #323232; }
.cm-s-darcula .CodeMirror-gutters { background: #313335; border-right: 1px solid #313335; }
.cm-s-darcula .CodeMirror-guttermarker { color: #FFEE80; }
.cm-s-darcula .CodeMirror-guttermarker-subtle { color: #D0D0D0; }
.cm-s-darcula .CodeMirrir-linenumber { color: #606366; }
.cm-s-darcula .CodeMirror-matchingbracket { background-color: #3B514D; color: #FFEF28 !important; font-weight: bold; }

.cm-s-darcula div.CodeMirror-selected { background: #214283; }

.CodeMirror-hints.darcula {
  font-family: Menlo, Monaco, Consolas, 'Courier New', monospace;
  color: #9C9E9E;
  background-color: #3B3E3F !important;
}

.CodeMirror-hints.darcula .CodeMirror-hint-active {
  background-color: #494D4E !important;
  color: #9C9E9E !important;
}
</style>