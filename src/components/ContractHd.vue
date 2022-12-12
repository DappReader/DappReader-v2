<template>
  <div class="hd">
    <div class="hd-section flex-center-sb">
      <div class="title">{{contarct.name}}</div>
      <div class="hd-btns flex-center">
        <div class="hd-btn-item flex-center-center btn" @click="copy(contarct.abi, 'abi')">
          <img src="@/assets/images/copy.svg" alt="">
          <span>Copy ABI</span>
        </div>
        <div class="hd-btn-item flex-center-center btn" @click="getSourceCode(contarct.address, contarct.chain)">
          <img src="@/assets/images/show.svg" alt="">
          <span>Source Code</span>
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
      v-model:show="sourceCode.length"
      :mask-closable="false"
      class="custom-card"
      preset="card"
      :style="{width: '70vw',maxWidth: '1000px',background: '#15141B', 'border-radius': '10px'}"
      title="Create Contract"
      :on-after-leave="afterLeave"
    >
      <div style="max-height: 80vh; overflow: auto;border-radius: 10px">
        <div v-for="item in sourceCode" :key="item.name" style="margin-bottom: 20px">
          <p style="margin-bottom: 10px">{{item.name}}</p>
          <pre v-highlightjs="item.content"><code class="javascript" style="border-radius: 10px"></code></pre>
        </div>
      </div>
      
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
import { useDialog } from "naive-ui"
import { useMessage } from 'naive-ui'
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
    const contarctData = ref(props.contarct)
    const fetcher = (...args) => fetch(...args).then((res) => res.json())
    const { toEtherscanAddress, copy } = useUtils()
    const getSourceCode = async (address, chain) => {
      console.log(chain)
      let apiKey = '19SE5KR1KSVTIYMRTBJ8VQ3UJGGVFKIK5W'
      let name = 'api'
      if (chain.chainId == 42) name = 'api-kovan' 
      else if (chain.chainId == 3) name = 'api-ropsten'
      else if (chain.chainId == 5) name = 'api-goerli'
      else if (chain.chainId == 11155111) name = 'api-sepolia'
      let data = await fetcher(`https://${name}.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=${apiKey}`)
      let result = data.result
      if (data.status == 0) {
        if (result == 'Contract source code not verified') {
          message.error('The current contract is not open source, can not be obtained through etherscan')
        } else {
          message.error(result)
        }
      } else if (data.status == 1) {
        result = result[0]
        if (result.SourceCode) {
          let source = result.SourceCode
          source = source.slice(1, -1)
          source = JSON.parse(source)
          let sources = source.sources
          let sourcesArr = []
          for (let k in sources) {
            let item = {
              name: k,
              content: sources[k].content
            }
            sourcesArr.push(item)
          }
          console.log(sourcesArr)
          sourceCode.value = sourcesArr
        } else {
          message.error('The current contract is not open source, can not be obtained through etherscan')
        }
        console.log(data.status)
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
      sourceCode,
      contarctData,
      createContract,
      del,
      shareModal,
      edit,
      copy,
      share,
      toEtherscanAddress,
      getSourceCode
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
    .hd-btns {
      // width: 754px;
      // flex: 0 0 754px;
      margin-left: 20px;
      .hd-btn-item {
        font-weight: 400;
        font-size: 13px;
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
    font-size: 13px;
    line-height: 16px;
    text-transform: capitalize;
    color: #858D99;
    margin-top: 16px;
  }
}
</style>
