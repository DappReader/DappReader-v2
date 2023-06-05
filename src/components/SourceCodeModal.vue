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

    const showSourceCode = ref(false)
    const activeName = ref('')
    const activeIndex = ref(-1)
    const showLoading = ref(false)
    const sourcesList = ref([])
    const placement = ref("left");
    const type = ref("card");

    const show = async (contract) => {
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
.n-tabs.n-tabs--left .n-tab-pane {
  padding: 0 !important;
  overflow-x: auto !important;
}
</style>
