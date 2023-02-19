<template>
  <div class="hd">
    <div class="hd-section flex-center-sb">
      <div class="title-w flex-center">
        <div class="title">{{contract.name}}</div>
        <div class="title-btn-item flex-center-center btn" @click="getSourceCode(contract.address, contract.chain, contract.sources)">
          <img src="@/assets/images/code.svg" alt="">
          <span>Source Code</span>
        </div>
      </div>
      <div class="hd-btns flex-center">
        <div v-if="contract.token">
          <div v-if="!contract.isImport && contract.hasUpdate" class="hd-btn-item flex-center-center btn hd-btn-item-red" @click="updateShare">
            <img src="@/assets/images/update.svg" alt="">
            <span>Uptede</span>
          </div>
          <div v-if="contract.isImport && contract.hasSync" class="hd-btn-item flex-center-center btn hd-btn-item-red" @click="() => showHint = true">
            <img src="@/assets/images/arrow_reload.svg" alt="">
            <span>Sync</span>
          </div>
        </div>
        <div class="hd-btn-item flex-center-center btn" @click="copy(contract.abi, 'abi')">
          <img src="@/assets/images/copy.svg" alt="">
          <span>Copy ABI</span>
        </div>
        <div class="hd-btn-item flex-center-center btn hd-btn-item-h" @click="toEtherscanAddress(contract.address, contract.chain)">
          <img src="@/assets/images/show.svg" alt="">
          <span>View Etherscan</span>
        </div>
        <div class="hd-btn-item flex-center-center btn hd-btn-item-h" @click="decode">
          <img src="@/assets/images/decode.svg" alt="">
          <span>Decode Input</span>
        </div>
        <div class="hd-btn-item flex-center-center btn hd-btn-item-h" @click="share">
          <img src="@/assets/images/share.svg" alt="">
          <span>Share</span>
        </div>
        <div v-if="(!contract.isImport && contract.token) || !contract.token" class="hd-btn-item flex-center-center btn hd-btn-item-h" @click="edit">
          <img src="@/assets/images/edit.svg" alt="">
          <span>Edit</span>
        </div>
        <div class="hd-btn-item flex-center-center btn hd-btn-item-h" @click="del">
          <img src="@/assets/images/trash.svg" alt="">
          <span>Delete</span>
        </div>
        
      </div>
    </div>
    <div class="desc">{{contract.remark}}</div>
    <CreateContract ref="createContract" />
    <ShareModal ref="shareModal" :contract="contractData" />
    <DecodeModal ref="decodeModal" :contract="contractData" />
    <GetContractModal ref="getContractModal" @confirm="getContractFun" />
    <n-modal
      v-model:show="showHint"
      :mask-closable="false"
      class=""
      preset="card"
      :style="{width: '500px',background: '#15141B', 'border-radius': '10px', 'min-height': '200px'}"
      title="提示"
    >
      <div>
        是否确认同步,如果同步则本地修改的内容都会被覆盖
      </div>
      <div class="ft flex-center">
        <div class="cancel btn" @click="() => showHint = false">cancel</div>
        <n-spin :show="syncing" style="color: #FFF">
          <div class="ok btn" @click="sync">
            <span>{{syncing ? 'Syncing' : 'Ok'}}</span>
          </div>
        </n-spin>
      </div>
    </n-modal>
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
          <div class="source-tabs-b">
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
            <div class="source-tabs-right flex-center-sb">
              <svg @click="domMove(1)" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.25 14.25L6 9L11.25 3.75" stroke="#858D99" stroke-width="1.6875" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg @click="domMove(2)" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.75 3.75L12 9L6.75 14.25" stroke="#858D99" stroke-width="1.6875" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
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
import { ref, watch, computed, toRaw } from 'vue'
import { useUtils } from '../hooks/useUtils'
import CreateContract from '@/components/CreateContract.vue'
import ShareModal from '@/components/ShareModal.vue'
import GetContractModal from '@/components/GetContractModal.vue'
import DecodeModal from '@/components/DecodeModal.vue'
import { useStore } from 'vuex'
import { getLs, setLs } from "@/service/service";
import { useDialog, useMessage } from "naive-ui"
import { updateContract, checkContractInfo, getContract } from '../http/abi'
import { chains } from '../libs/chains'
export default {
  props: ['contract'],
  components: {
    CreateContract,
    ShareModal,
    GetContractModal,
    DecodeModal
  },
  setup(props) {
    const store = useStore()
    const dialog = useDialog()
    const message = useMessage()
    const createContract = ref(null)
    const sourceCode = ref([])
    const shareModal = ref(null)
    const decodeModal = ref(null)
    const showHint = ref(false)
    const showSourceCode = ref(false)
    const showLoading = ref(false)
    const getContractModal = ref(null)
    const syncing = ref(false)
    const activeName = ref('')
    const activeIndex = ref(-1)
    const contractData = ref({})
    const fetcher = (...args) => fetch(...args).then((res) => res.json())
    const { toEtherscanAddress, copy, setData } = useUtils()
    
    const provider = computed(() => {
      return store.state.provider
    })
    const address = computed(() => {
      return store.state.address
    })

    const getSourceCode = async (address, chain, sources) => {
      console.log('sources', sources)
      showSourceCode.value = true
      if (sources) {
        console.log(contractData.value)
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
            let CD = props.contract
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

    const getContractFun = () => {
      let password = props.contract.password
      let token = props.contract.token
      syncing.value = true
      getContract({token, password}).then(res => {
        if (res.code == 1) {
          message.error(res.msg)
        } else {
          let contract = res.contract.contract_info
          let chainInfo = contract.chain_info
          let chainId = chainInfo.chainId
          let chain = chains.filter(e => e.chainId == chainId)[0]
          let sol = {
            id: props.contract.id,
            isImport: true,
            authorAddress: res.contract.authorAddress,
            name: contract.name,
            address: contract.contract_address,
            abi: JSON.parse(contract.contract_abi),
            chain: chain,
            remark: contract.description,
            token: res.contract.token,
            versionNumber: res.contract.version_number || 1,
            password
          }
          setData(sol)
          getContractModal.value.showModal = false
          message.success('Sync successfully')
        }
        syncing.value = false
        showHint.value = false
      }).catch(err => {
        console.log(err)
        message.error(err)
        syncing.value = false
        showHint.value = false
      })
    }
    const sync = async () => {
      syncing.value = true
      checkContractInfo({token: props.contract.token}).then(res => {
        console.log(res, props.contract)
        if (res.version_number == props.contract.versionNumber) {
          message.info('is latest version')
          showHint.value = false
          syncing.value = false
        } else {
          console.log(props.contract)
          if (res.openSourceType == 'Limited' && !props.contract.password) {
            getContractModal.value.showModal = true
          } else {
            getContractFun()
          }
        }
      })
    }
    const updateShare = async () => {
      let contract = props.contract
      if (contract.authorAddress && contract.authorAddress != address.value) {
        dialog.warning({
          title: "Notice",
          content: `To update this contract, Please switch the wallet address to "${contract.authorAddress}"`,
          positiveText: "Ok",
          maskClosable: false,
        })
        return
      }
      let msg = "Sign"
      const time = new Date().getTime()
      const sign_msg = `${msg}_${time}`
      let signature = await toRaw(provider.value).getSigner().signMessage(sign_msg)
      updateContract({
        token: contract.token,
        message: sign_msg,
        signature,
        address: address.value,
        contract_info: {
          contract_address: contract.address,
          contract_abi: JSON.stringify(contract.abi),
          name: contract.name,
          chain_info: {
            chainName: contract.chain.chainName || contract.chain.name,
            chainId: contract.chain.chainId,
          },
          description: contract.remark
        }
      }).then(res => {
        if (res.code == 0) {
          message.success('Update successfully')
          contractData.value.hasUpdate = false
          checkContractInfo({token: contractData.value.token}).then(res => {
            contractData.value.versionNumber = res.version_number
            console.log(contractData.value)
            setData(contractData.value)
          })
        } else {
          message.error(res.msg)
        }
      }).catch (error => {
        message.error(error)
      })
    }
    const edit = () => {
      let { abi, address, chain, createAt, id, name, token, authorAddress, versionNumber = 1 } = props.contract
      let chainId = ''
      if (chain && chain.chainId) chainId = chain.chainId
      abi = JSON.stringify(abi)
      let formData = {abi, address, chainId, createAt, id, name, token, authorAddress, versionNumber}
      createContract.value.show()
      createContract.value.formData = formData
    }
    const share = () => {
      shareModal.value.showModal = true
    }
    const decode = () => {
      decodeModal.value.showModal = true
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
    const domMove = (i) => {
      let el = document.querySelector('.source-tabs-w')
      let scrollLeft = el.scrollLeft
      if (i == 1) {
        if (scrollLeft > 140) {
          el.scrollLeft = scrollLeft - 140
        } else {
          el.scrollLeft = 0
        }
      } else if (i == 2) {
        el.scrollLeft = scrollLeft + 140
      }
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
          let id = props.contract.id
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
    watch(() => props.contract, () => {
      console.log(2)
      contractData.value = props.contract
      if (props.contract.isImport && props.contract.token) {
        checkContractInfo({token: props.contract.token}).then(res => {
          if (!contractData.value.authorAddress) {
            contractData.value.authorAddress = res.authorAddress
            setData(toRaw(contractData.value))
          }
          let versionNumber = props.contract.versionNumber || 1
          let resVersionNumber = res.version_number || 1
          if (resVersionNumber == versionNumber) {
            contractData.value.hasSync = false
          } else {
            contractData.value.hasSync = true
          }
        })
      }
      
    }, {immediate: true})
    return {
      decodeModal,
      syncing,
      showHint,
      address,
      getContractModal,
      showLoading,
      showSourceCode,
      activeIndex,
      activeName,
      sourceCode,
      contractData,
      createContract,
      del,
      shareModal,
      edit,
      copy,
      share,
      toEtherscanAddress,
      getSourceCode,
      update,
      domMove,
      updateShare,
      sync,
      getContractFun,
      decode
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
      background: #2C2D34;
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
      justify-content: flex-end;
      .hd-btn-item {
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
        margin-left: 12px;
        &:hover {
          background: #3D3D48 !important;
        }
        img {
          width: 20px;
          height: 20px;
        }
        span {
          margin-left: 8px;
        }
        &.hd-btn-item-red {
          background: #F43658 !important;
          &:hover {
            background: #EF5671 !important;
          }
        }
        &.hd-btn-item-h {
          max-width: 40px;
          min-width: 40px;
          overflow: hidden;
          span {
            display: none;
          }
          &:hover {
            max-width: 100%;
            span {
              display: block;
            }
          }
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
.source-tabs-b {
  position: relative;
  background: #2C2D34;
  height: 34px;
  padding-right: 60px;
  box-sizing: border-box;
}
.source-tabs-right {
  position: absolute;
  background: #2C2D34;
  width: 60px;
  position: absolute;
  height: 40px;
  right: 0;
  top: 0;
  z-index: 9;
  padding: 0 8px;
  box-sizing: border-box;
  svg {
    cursor: pointer;
  }
  &::before {
    content: '';
    width: 1px;
    height: 12px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    z-index: 2;
    background: rgba(133, 141, 153, 0.2);
  }
}
.source-tabs-w {
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
  border-radius: 10px 10px 0 0;
  box-sizing: border-box;
  background: #2C2D34;
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
        background: #2C2D34;
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
        background: linear-gradient( to bottom, #2C2D34 40%, #17171A 60%);
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
          background: #17171A;
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
.ft {
  justify-content: flex-end;
  margin-top: 20px;
  .ok {
    margin-left: 20px;
    background: #375CFF;
  }
  .cancel {
    background: rgba(133, 141, 153, 0.1);
  }
  .btn {
    padding: 5px 16px;
    box-sizing: border-box;
    border-radius: 5px;
    cursor: pointer;
  }
}
</style>
<style>
  .hljs {
    background: #17171A !important;
  }
  .custom-card .n-spin-content {
    border: 1px solid rgba(133, 141, 153, 0.1);
    border-radius: 10px;
  }
</style>
