<template>
  <div class="hd">
    <div class="hd-section flex-center-sb">
      <div class="title-w flex-center">
        <div class="title">{{contarct.name}}</div>
        <div class="title-btn-item flex-center-center btn" @click="getSourceCode(contarct.address, contarct.chain, contarct.sources)">
          <img src="@/assets/images/show.svg" alt="">
          <span>Source Code</span>
        </div>
      </div>
      
      <div class="hd-btns flex-center">
        <div class="hd-btn-item flex-center-center btn" @click="copy(contarct.abi, 'abi')">
          <img src="@/assets/images/copy.svg" alt="">
          <span>Copy ABI</span>
        </div>
        <div class="hd-btn-item flex-center-center btn" @click="toEtherscanAddress(contarct.address, contarct.chain)">
          <img src="@/assets/images/show.svg" alt="">
          <span>View Etherscan</span>
        </div>
        <div class="hd-btn-item flex-center-center btn" @click="share">
          <img src="@/assets/images/share.svg" alt="">
          <span>Share</span>
        </div>
        <div class="hd-btn-item flex-center-center btn" @click="del">
          <img src="@/assets/images/trash.svg" alt="">
          <span>Delete</span>
        </div>
        <div class="hd-btn-item flex-center-center btn" @click="edit">
          <img src="@/assets/images/edit.svg" alt="">
          <span>Edit</span>
        </div>
        <div class="hd-btn-item flex-center-center btn">
          <img src="@/assets/images/arrow_reload.svg" alt="">
          <span>Switch Network</span>
        </div>
      </div>
    </div>
    <div class="desc">{{contarct.remark}}</div>
    <CreateContract ref="createContract" />
    <ShareModal ref="shareModal" :contract="contarctData" />
      <n-modal
        v-model:show="showSourceCode"
        :mask-closable="false"
        class="custom-card"
        preset="card"
        :style="{width: '70vw',maxWidth: '1408px',background: '#15141B', 'border-radius': '10px', 'min-height': '200px'}"
        title="View Source Code"
      >
        <n-spin :show="showLoading">
          <div style="max-height: 80vh; overflow: auto;border-radius: 10px;position: relative;">
            <div v-if="sourceCode.length && sourceCode.length > 1" class="source-tabs-w">
              <div class="source-tbas flex-center">
                <div v-for="(item, index) in sourceCode" :key="item.name" :class="['source-tab-item', activeName == item.name ? 'source-tab-item-activated' : '', index == activeIndex - 1 ? 'source-tab-item-activated-prev' : '']" @click="update(item.name, index)">
                    <n-tooltip trigger="hover">
                      <template #trigger>
                        <div class="source-tab-item-content flex-center-sb">
                          <span>{{item.name}}</span>
                        </div>
                      </template>
                      {{item.name}}
                    </n-tooltip>
                </div>
              </div>
            </div>
            <div v-for="item in sourceCode" :key="item.name">
              <div class="source-pane" v-if="activeName == item.name">
                <pre v-highlightjs="item.content"><code class="javascript" style="border-radius: 0 0 10px 10px;"></code></pre>
              </div>
            </div>
          </div>
        </n-spin>
      </n-modal>
  </div>
</template>
<script>
import { ref } from 'vue'
import { useUtils } from '../hooks/useUtils'
import CreateContract from '@/components/CreateContract.vue'
import ShareModal from '@/components/ShareModal.vue'
import { useStore } from 'vuex'
import { getLs, setLs } from "@/service/service";
import { useDialog, useMessage } from "naive-ui"
export default {
  props: ['contarct'],
  components: {
    CreateContract,
    ShareModal
  },
  setup(props) {
    const store = useStore()
    const dialog = useDialog()
    const message = useMessage()
    const createContract = ref(null)
    const sourceCode = ref([])
    const shareModal = ref(null)
    const showSourceCode = ref(false)
    const showLoading = ref(false)
    const activeName = ref('')
    const activeIndex = ref(-1)
    const contarctData = ref(props.contarct)
    const fetcher = (...args) => fetch(...args).then((res) => res.json())
    const { toEtherscanAddress, copy, setData } = useUtils()
    const getSourceCode = async (address, chain, sources) => {
      console.log('sources', sources)
      showSourceCode.value = true
      if (sources) {
        console.log(contarctData.value)
        sourceCode.value = sources
        activeName.value = sources[0].name
        activeIndex.value = 0
      } else {
        showLoading.value = true
        let apiKey = '19SE5KR1KSVTIYMRTBJ8VQ3UJGGVFKIK5W'
        let name = 'api'
        if (chain.chainId == 42) name = 'api-kovan' 
        else if (chain.chainId == 3) name = 'api-ropsten'
        else if (chain.chainId == 5) name = 'api-goerli'
        else if (chain.chainId == 11155111) name = 'api-sepolia'
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
                let item = {
                  name: k,
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
            sourceCode.value = sourcesArr
            activeName.value = sourcesArr[0].name
            activeIndex.value = 0
            let CD = props.contarct
            CD.sources = sourcesArr
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
    const edit = () => {
      let { abi, address, chain, createAt, id, name } = props.contarct
      let chainId = chain.chainId
      abi = JSON.stringify(abi)
      let formData = {abi, address, chainId, createAt, id, name}
      createContract.value.show()
      createContract.value.formData = formData
    }
    const share = () => {
      shareModal.value.showModal = true
    }
    const update = (name, index) => {
      let el = document.querySelector('.source-tabs-w')
      let el1 = el.querySelectorAll('.source-tab-item')[index]
      let scrollLeft = el1.offsetLeft
      const containWidth = el.offsetWidth
      console.log(scrollLeft, containWidth)
      let resultSpot = scrollLeft - 160 - containWidth / 2 
      activeName.value = name
      activeIndex.value = index
      el.scrollTo((resultSpot + 50), 100)
    }
    const del = () => {
      dialog.warning({
        title: "Notice",
        content: "This operation will permanently delete the contract information, do you want to continue？",
        positiveText: "Ok",
        negativeText: "Cancel",
        maskClosable: false,
        onPositiveClick: async () => {
          let menuList = await getLs('menuList') || []
          let contractList = await getLs('contractList') || []
          let openSols = await getLs('openSols') || []
          let id = props.contarct.id
          for (let i = 0; i < menuList.length; i++) {
            let son = menuList[i].son
            son.forEach((e, index) => {
              if (e.id == id) {
                son.splice(index, 1)
              }
            })
            menuList[i].son = son
          }
          contractList.forEach((e, index) => {
            if (e.id == id) {
              contractList.splice(index, 1)
            }
          })
          openSols.forEach((e, index) => {
            if (e.name == id) {
              openSols.splice(index, 1)
            }
          })
          setLs('openSols', JSON.parse(JSON.stringify(openSols))).then(res => {
            console.log(res)
            store.commit("setOpenSols", res)
            if (res.length) {
              setLs('activeId', res[0].name).then(res => {
                store.commit('setActiveId', res)
              })
            }
          })
          setLs('contractList', JSON.parse(JSON.stringify(contractList))).then(res => {
            console.log(res)
            store.commit("setContractList", res)
          })
          setLs('menuList', JSON.parse(JSON.stringify(menuList))).then(res => {
            console.log(res)
            store.commit("setMenuList", res)
          })
        }
      })
    }
    return {
      showLoading,
      showSourceCode,
      activeIndex,
      activeName,
      sourceCode,
      contarctData,
      createContract,
      del,
      shareModal,
      edit,
      copy,
      share,
      toEtherscanAddress,
      getSourceCode,
      update
    }
  }
}
</script>
<style lang="scss" scoped>
.hd {
  .hd-section {
    .title {
      font-family: Montserrat-Bold;
      font-size: 30px;
      line-height: 40px;
      color: #FFFFFF;
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .title-btn-item {
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      color: #FFFFFF;
      padding: 0 12px;
      box-sizing: border-box;
      height: 40px;
      background: #1F1E27;
      border-radius: 10px;
      cursor: pointer;
      margin-left: 12px;
      &:hover {
        background: #302E38 !important;
      }
      img {
        width: 20px;
        height: 20px;
        margin-right: 8px;
      }
    }
    .hd-btns {
      // width: 754px;
      // flex: 0 0 754px;
      // margin-left: 20px;
      .hd-btn-item {
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
        color: #FFFFFF;
        padding: 0 12px;
        box-sizing: border-box;
        height: 40px;
        background: #1F1E27;
        border-radius: 10px;
        cursor: pointer;
        margin-left: 12px;
        &:hover {
          background: #302E38 !important;
        }
        img {
          width: 20px;
          height: 20px;
          margin-right: 8px;
        }

      }
    }
  }
  .desc {
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    text-transform: capitalize;
    color: #858D99;
    margin-top: 16px;
  }
}
.source-tabs-w {
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
  border-radius: 10px 10px 0 0;
  box-sizing: border-box;
  background: #1F1E27;
  &::-webkit-scrollbar {
    display: none;
  }
  .source-tbas {
    height: 40px;
    .source-tab-item {
      flex: 0 0 140px;
      cursor: pointer;
      position: relative;
      svg {
        display: none;
      }
      .source-tab-item-content {
        position: relative;
        background: #1F1E27;
        z-index: 1;
        width: 140px;
        height: 40px;
        padding: 0 12px;
        box-sizing: border-box;
        font-family: 'Montserrat-Medium';
        font-size: 12px;
        line-height: 16px;
        color: #858D99;
        span {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      &::before {
        content: '';
        width: 1px;
        height: 12px;
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        z-index: 2;
        background: rgba(133, 141, 153, 0.2);
      }
      &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 0;
        background: linear-gradient( to bottom, #1F1E27 40%, #0D0D0E 60%);
      }
      &:hover {
        .source-tab-item-content {
          background: #2A2A32;
          border-radius: 10px 10px 0px 0px;
          color: #FFFFFF;
          svg {
            display: inline-block;
          }
        }
      }
      &:first-child {
        border-top-left-radius: 10px;
        overflow: hidden;
      }
      &:last-child {
        border-top-right-radius: 10px;
        overflow: hidden;
        &::before {
          display: none;
        }
      }
      &.source-tab-item-activated {
        &::before {
          display: none;
        }
        .source-tab-item-content {
          color: #FFFFFF;
          background: #0D0D0E;
          border-radius: 10px 10px 0px 0px;
          svg {
            display: inline-block;
          }
        }
        & + .source-tab-item {
          .source-tab-item-content {
            border-radius: 0px 0px 0px 10px;
          }
        }
      }
      &.source-tab-item-activated-prev {
        &::before {
          display: none;
        }
        .source-tab-item-content {
          border-radius: 0px 0px 10px 0px;
        }
      }
    }
  }
}
.source-pane {
  height: calc(80vh - 40px);
  overflow: auto;
  border-radius: 0 0 10px 10px;
}
</style>
<style>
  .hljs {
    background: #0D0D0E !important;
  }
  .custom-card .n-spin-content {
    border: 1px solid rgba(133, 141, 153, 0.1);
    border-radius: 10px;
  }
</style>
