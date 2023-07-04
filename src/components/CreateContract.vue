<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    class="custom-card modal-style"
    preset="card"
    title="Create Contract"
    :on-after-leave="afterLeave"
    style="width: 650px"
  >
    <div class="form">
      <n-form-item show-require-mark label="Contract Name">
        <n-input v-model:value="formData.name" class="form-input" />
      </n-form-item>
      <n-form-item show-require-mark label="Contract Chain" >
        <n-select
          style="width: 100%"
          class="form-select"
          placeholder="Please select network"
          v-model:value="formData.chainId"
          filterable
          :options="selectOptions"
          @update:value="handleUpdateValue"
          label-field="name"
          value-field="chainId"
          @search="handleSearch"
        >
          <template #action>
            <div class="add-btn flex-center-center" @click="showAdd">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 8H12" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 12L8 4" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Add New Chain</span>
            </div>
          </template>
        </n-select>
      </n-form-item>
      <n-form-item show-require-mark label="Contract Address" >
        <n-input v-model:value="formData.address" class="form-input" />
      </n-form-item>
      <n-alert v-if="formData.isProxy" title="Proxy Contract" :type="formData.isGetSources ? formData.sources ? 'success' : 'error' : 'info'" style="margin-bottom:16px">
        Proxy Address: {{ formData.proxyAddress }}
        <p v-if="formData.isGetSources && formData.sources">ABI has been pulled from Etherscan</p>
        <p v-if="formData.isGetSources && !formData.sources">Contract source code not verified</p>
      </n-alert>
      <n-form-item show-require-mark label="Import ABI" >
        <n-input type="textarea"
            v-if="showAbi || formData.abi"
            size="small"
            :autosize="{
              minRows: 3,
              maxRows: 5
            }" 
            v-model:value="formData.abi"
            class="form-input form-textarea"
          />
        <div v-else class="import-abi flex-center-sb">
          <label>
            <div class="import-item flex-center-center">
              <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path class="fill" fill-rule="evenodd" clip-rule="evenodd" d="M14.5303 12.9697C14.2374 12.6768 13.7626 12.6768 13.4697 12.9697L10.4697 15.9697C10.1768 16.2626 10.1768 16.7374 10.4697 17.0303C10.7626 17.3232 11.2374 17.3232 11.5303 17.0303L13.25 15.3107V20.5C13.25 20.9142 13.5858 21.25 14 21.25C14.4142 21.25 14.75 20.9142 14.75 20.5V15.3107L16.4697 17.0303C16.7626 17.3232 17.2374 17.3232 17.5303 17.0303C17.8232 16.7374 17.8232 16.2626 17.5303 15.9697L14.5303 12.9697Z" fill="white"/>
                <path class="fill" fill-rule="evenodd" clip-rule="evenodd" d="M6.75 6.5C6.75 5.80965 7.30965 5.25 8 5.25H16.25V7.5C16.25 9.01878 17.4812 10.25 19 10.25H21.25V22.5C21.25 23.1904 20.6904 23.75 20 23.75H8C7.30964 23.75 6.75 23.1904 6.75 22.5V6.5ZM22.7464 9.5741C22.7488 9.54972 22.75 9.525 22.75 9.5C22.75 9.41901 22.7372 9.34102 22.7134 9.26795C22.621 8.70719 22.3563 8.18479 21.9504 7.77649L18.7548 4.56138C18.3354 4.13937 17.7932 3.86746 17.2119 3.78035C17.1447 3.7606 17.0736 3.75 17 3.75C16.9773 3.75 16.9548 3.75101 16.9326 3.75299C16.89 3.751 16.8472 3.75 16.8044 3.75H8C6.48122 3.75 5.25 4.98122 5.25 6.5V22.5C5.25 24.0188 6.48122 25.25 8 25.25H20C21.5188 25.25 22.75 24.0188 22.75 22.5V9.71511C22.75 9.66797 22.7488 9.62095 22.7464 9.5741ZM17.75 5.67823L20.8032 8.75H19C18.3096 8.75 17.75 8.19036 17.75 7.5V5.67823Z" fill="white"/>
              </svg>
              <p>Upload ABI Files</p>
            </div>
            <input type="file" v-show="false" @change="uploadFile">
          </label>
          
          <div class="import-item flex-center-center"  @click="() => showAbi = true">
            <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path class="stroke" d="M15.1667 25L4.66667 25C4.02234 25 3.5 24.4777 3.5 23.8333L3.5 8.66667C3.5 8.02234 4.02233 7.5 4.66667 7.5L11.1834 7.5C11.4928 7.5 11.7896 7.62292 12.0084 7.84171L15.9916 11.825C16.2104 12.0437 16.3333 12.3405 16.3333 12.6499V23.8333C16.3333 24.4777 15.811 25 15.1667 25Z" stroke="#858D99" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path class="stroke" d="M11.667 7.5L11.667 5.16667C11.667 4.52233 12.1893 4 12.8337 4L19.3504 4C19.6598 4 19.9566 4.12292 20.1754 4.34171L24.1586 8.32496C24.3774 8.54375 24.5003 8.8405 24.5003 9.14992V20.3333C24.5003 20.9777 23.978 21.5 23.3337 21.5L16.3337 21.5" stroke="#858D99" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path class="stroke" d="M16.3333 13.3333L11.6667 13.3333C11.0223 13.3333 10.5 12.811 10.5 12.1667L10.5 7.5" stroke="#858D99" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path class="stroke" d="M24.5003 9.83333L19.8337 9.83333C19.1893 9.83333 18.667 9.311 18.667 8.66667L18.667 4" stroke="#858D99" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p>Paste ABI Text</p>
          </div>
          <n-spin :show="showSpin">
            <div :class="['import-item', 'flex-center-center', isDisabled ? 'disabled' : '']" @click="getContractInfoFun">
              <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path class="stroke" d="M20.9997 25H6.99968C6.35534 25 5.83301 24.4777 5.83301 23.8333L5.83301 5.16667C5.83301 4.52234 6.35534 4 6.99967 4L15.8233 4C16.1483 4 16.4585 4.13556 16.6793 4.37402L21.8557 9.96454C22.0554 10.1802 22.1663 10.4633 22.1663 10.7572L22.1663 23.8333C22.1663 24.4777 21.644 25 20.9997 25Z" stroke="#858D99" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path class="fill" d="M16.8633 15.1364C16.5704 14.8435 16.0956 14.8435 15.8027 15.1364C15.5098 15.4293 15.5098 15.9042 15.8027 16.1971L16.8633 15.1364ZM18.6663 18.0001L19.1967 18.5304C19.4896 18.2375 19.4896 17.7626 19.1967 17.4698L18.6663 18.0001ZM15.8027 19.8031C15.5098 20.096 15.5098 20.5709 15.8027 20.8637C16.0956 21.1566 16.5704 21.1566 16.8633 20.8637L15.8027 19.8031ZM15.8027 16.1971L18.136 18.5304L19.1967 17.4698L16.8633 15.1364L15.8027 16.1971ZM18.136 17.4698L15.8027 19.8031L16.8633 20.8637L19.1967 18.5304L18.136 17.4698Z" fill="#858D99"/>
                <path class="fill" d="M11.136 20.8637C11.4289 21.1566 11.9038 21.1566 12.1967 20.8637C12.4896 20.5709 12.4896 20.096 12.1967 19.8031L11.136 20.8637ZM9.33301 18.0001L8.80268 17.4698C8.66203 17.6104 8.58301 17.8012 8.58301 18.0001C8.58301 18.199 8.66203 18.3898 8.80268 18.5304L9.33301 18.0001ZM12.1967 16.1971C12.4896 15.9042 12.4896 15.4293 12.1967 15.1364C11.9038 14.8435 11.4289 14.8435 11.136 15.1364L12.1967 16.1971ZM12.1967 19.8031L9.86334 17.4698L8.80268 18.5304L11.136 20.8637L12.1967 19.8031ZM9.86334 18.5304L12.1967 16.1971L11.136 15.1364L8.80268 17.4698L9.86334 18.5304Z" fill="#858D99"/>
                <path class="stroke" d="M22.167 11L16.3337 11C15.6893 11 15.167 10.4777 15.167 9.83333L15.167 4" stroke="#858D99" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <p>From Etherscan</p>
            </div>
          </n-spin>
          <div :class="['import-item', 'flex-center-center']" @click="showAbiModal = true">
            <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path class="stroke" d="M20.9997 25H6.99968C6.35534 25 5.83301 24.4777 5.83301 23.8333L5.83301 5.16667C5.83301 4.52234 6.35534 4 6.99967 4L15.8233 4C16.1483 4 16.4585 4.13556 16.6793 4.37402L21.8557 9.96454C22.0554 10.1802 22.1663 10.4633 22.1663 10.7572L22.1663 23.8333C22.1663 24.4777 21.644 25 20.9997 25Z" stroke="#858D99" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path class="fill" d="M16.8633 15.1364C16.5704 14.8435 16.0956 14.8435 15.8027 15.1364C15.5098 15.4293 15.5098 15.9042 15.8027 16.1971L16.8633 15.1364ZM18.6663 18.0001L19.1967 18.5304C19.4896 18.2375 19.4896 17.7626 19.1967 17.4698L18.6663 18.0001ZM15.8027 19.8031C15.5098 20.096 15.5098 20.5709 15.8027 20.8637C16.0956 21.1566 16.5704 21.1566 16.8633 20.8637L15.8027 19.8031ZM15.8027 16.1971L18.136 18.5304L19.1967 17.4698L16.8633 15.1364L15.8027 16.1971ZM18.136 17.4698L15.8027 19.8031L16.8633 20.8637L19.1967 18.5304L18.136 17.4698Z" fill="#858D99"/>
              <path class="fill" d="M11.136 20.8637C11.4289 21.1566 11.9038 21.1566 12.1967 20.8637C12.4896 20.5709 12.4896 20.096 12.1967 19.8031L11.136 20.8637ZM9.33301 18.0001L8.80268 17.4698C8.66203 17.6104 8.58301 17.8012 8.58301 18.0001C8.58301 18.199 8.66203 18.3898 8.80268 18.5304L9.33301 18.0001ZM12.1967 16.1971C12.4896 15.9042 12.4896 15.4293 12.1967 15.1364C11.9038 14.8435 11.4289 14.8435 11.136 15.1364L12.1967 16.1971ZM12.1967 19.8031L9.86334 17.4698L8.80268 18.5304L11.136 20.8637L12.1967 19.8031ZM9.86334 18.5304L12.1967 16.1971L11.136 15.1364L8.80268 17.4698L9.86334 18.5304Z" fill="#858D99"/>
              <path class="stroke" d="M22.167 11L16.3337 11C15.6893 11 15.167 10.4777 15.167 9.83333L15.167 4" stroke="#858D99" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p>General Contract</p>
          </div>
        </div>
      </n-form-item>
      <n-form-item label="Remark">
        <n-input type="textarea"
          size="small"
          :autosize="{
            minRows: 3,
            maxRows: 5
          }" 
          v-model:value="formData.remark"
          class="form-input form-textarea"
        />
      </n-form-item>
      <div class="form-btns flex-center-center">
        <div :class="['btn-item', (!formData.name || !formData.chainId || !formData.address || !formData.abi) ? '' : 'btn-item-activated', 'flex-center-center']" @click="create">{{formData.id ? 'Save' : 'Create'}}</div>
      </div>
    </div>
    <AddChainModal ref="addChainModal" @add="addChain" />
  </n-modal>
  <n-modal 
    v-model:show="showAbiModal"
    :mask-closable="false"
    class="custom-card modal-style"
    preset="card"
    title="Select General Contract"
  >
    <div :class="['contract-type', generalIndex == 1 ? 'contract-type-a' : '']" @click="generalIndex = 1">ERC 20</div>
    <div :class="['contract-type', generalIndex == 2 ? 'contract-type-a' : '']" @click="generalIndex = 2">ERC 721</div>
    <div :class="['contract-type', generalIndex == 3 ? 'contract-type-a' : '']" @click="generalIndex = 3">ERC 721a</div>
    <div class="contract-btn" @click="setGeneralContract">OK</div>
  </n-modal>
</template>

<script>
import { ref, onBeforeMount, watch } from "vue";
import { useStore } from 'vuex'
import { chains, defaultChain } from '../libs/chains'
import { getLs, setLs } from "@/service/service";
import { useMessage } from 'naive-ui'
import AddChainModal from '@/components/AddChainModal'
import { erc20Abi, erc721Abi, erc721aAbi } from '@/libs/abi'
import { getContractInfo, getSourceCode } from '../libs/utils'
export default {
  name: 'CreateContract',
  components: {AddChainModal},
  setup() {
    let defaultChains = []
    const store = useStore()
    const message = useMessage()
    const formData = ref({})
    const selectOptions = ref([])
    const addChainModal = ref(null)
    const showModal = ref(false)
    const showAbiModal = ref(false)
    const generalIndex = ref(1)
    const showAbi = ref(false)
    const showSpin = ref(false)
    const isDisabled = ref(false)
    const folderIndex = ref(-1)
    const show = () => {
      showModal.value = true
    }
    const setFolderIndex = (index) => {
      folderIndex.value = index
      console.log(folderIndex.value)
    }
    const setGeneralContract = () => {
      if (generalIndex.value == 1) {
        formData.value.abi = JSON.stringify(erc20Abi)
      } else if (generalIndex.value == 2) {
        formData.value.abi = JSON.stringify(erc721Abi)
      } else if (generalIndex.value == 3) {
        formData.value.abi = JSON.stringify(erc721aAbi)
      }
      showAbiModal.value = false
      generalIndex.value = 1
    }
    const create = async () => {
      if (!formData.value.name || !formData.value.chainId || !formData.value.address || !formData.value.abi) return
      let {abi, address, chainId, name, remark, id = ''} = formData.value
      let chain = chains.filter(e => e.chainId == chainId)[0]
      formData.value.chain = chain
      let info = JSON.parse(JSON.stringify(formData.value))
      info.abi = JSON.parse(abi)
      let menuList = await getLs('menuList') || []
      let contractList = await getLs('contractList') || []
      if (formData.value.id) {
        for (let i = 0; i < menuList.length; i++) {
          let son = menuList[i].son
          son.forEach((e, index) => {
            if (e.id == id) {
              if (name == e.name && remark == e.remark && chainId == e.chain.chainId && address == e.address && JSON.stringify(abi) == JSON.stringify(e.abi) && !e.isImport) {
                info.hasUpdate = false
              } else {
                info.hasUpdate = true
              }
              son[index] = info
            }
          })
          menuList[i].son = son
        }
        contractList.forEach((e, index) => {
          if (e.id == id) {
            if (name == e.name && remark == e.remark && (chainId == e.chain && e.chain.chainId || '') && address == e.address && (abi &&JSON.stringify(abi) || '') == (e.abi && JSON.stringify(e.abi) || '') && !e.isImport) {
              info.hasUpdate = false
            } else {
              info.hasUpdate = true
            }
            contractList[index] = info
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
        showModal.value = false
      } else {
        let data = JSON.parse(JSON.stringify(info))
        data.id = `${address}${new Date().getTime()}`
        data.createAt = new Date().getTime()
        if (folderIndex.value >= 0) {
          let folderItem = menuList[folderIndex.value]
          let son = folderItem.son || []
          son.push(data)
          menuList[folderIndex.value].son = son
          let res = await setLs('menuList', JSON.parse(JSON.stringify(menuList)))
          store.commit("setMenuList", res)
          showModal.value = false
        } else {
          contractList.push(data)
          let res = await setLs('contractList', JSON.parse(JSON.stringify(contractList)))
          store.commit("setContractList", res)
          showModal.value = false
        }
        setLs('activeId', data.id).then(rep => {
          store.commit('setActiveId', rep)
        })
      }
    }
    const uploadFile = (e) => {
      console.log(e)
      let file = e.target.files[0]
      let reader = new FileReader()
      reader.readAsText(file, "UTF-8")
      reader.onload = (evt) => {
        let fileString = evt.target.result
        formData.value.abi = fileString
      }
    }
    const handleSearch = (query) => {
      if (query) {
        console.log(query)
        selectOptions.value = []
        selectOptions.value = chains.filter(e => e.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
      } else {
        selectOptions.value = defaultChains
      }
      
    }
    const handleUpdateValue = async () => {
      console.log(formData.value)
      let chainId = formData.value.chainId
      let isExist = defaultChains.filter(e => e.chainId == chainId).length > 0
      if (!isExist) {
        defaultChains.push(chains.filter(e => e.chainId == chainId)[0])
        selectOptions.value = defaultChains
        await setLs('defaultChain', JSON.parse(JSON.stringify(defaultChains))).then(res => {
          console.log(res)
          store.commit('setDefaultChains', res)
        })
      }
      if (formData.value.address && formData.value.address.length == 42) {
        getContractInfoFun()
      }
    }
    const bindInput = () => {
      if (formData.value.chainId && formData.value.address && (formData.value.address.length == 42)) {
        getContractInfoFun()
      }
    }
    const getContractInfoFun = async () => {
      if (isDisabled.value) return
      showSpin.value = true
      let data = {
        address: formData.value.address,
        chain: {chainId: formData.value.chainId}
      }
      try {
        let res = await getContractInfo(data)
        if (res.isProxy) {
          formData.value.isProxy = true
          formData.value.proxyAddress = res.proxyAddress || ''
        }
        importAbiFromEtherscan()
      } catch (error) {
        importAbiFromEtherscan()
      }
    }
    const importAbiFromEtherscan = async() => {
      if (!formData.value.address) {
        message.error('Please input contract address')
      } else if (!formData.value.chainId) {
        message.error('Please input contract chain')
      } else {
        try {
          let data = {
            address: formData.value.address,
            chain: {chainId: formData.value.chainId},
            proxyAddress: formData.value.proxyAddress
          }
          let r = await getSourceCode(data)
          formData.value.abi = r.abi ? JSON.stringify(r.abi) : null
          formData.value.sources = r.sources || null
          formData.value.isGetSources = r.isGetSources
          formData.value.verified = r.verified
          showSpin.value = false
          if (!formData.value.abi) isDisabled.value = true
        } catch (error) {
          showSpin.value = false
          message.error(error)
        }
      }
    }
    const afterLeave = () => {
      formData.value = {}
      showAbi.value = false
      folderIndex.value = -1
      showSpin.value = false
      isDisabled.value = false
    }
    const showAdd = () => {
      addChainModal.value.showModal = true
    }
    const addChain = async (e) => {
      console.log(e)
      selectOptions.value.push(e)
      addChainModal.value.afterLeave()
      formData.value.chainId = e.chainId
    }
    onBeforeMount(async () => {
      let dc = await getLs('defaultChain') || []
      if (!dc.length) {
        selectOptions.value = defaultChain
        await setLs('defaultChain', JSON.parse(JSON.stringify(defaultChain)))
      } else {
        selectOptions.value = dc
      }
      defaultChains = selectOptions.value
    })
    watch(() => formData.value.address, (val) => {
      if (val && val.length == 42 && !formData.value.abi) {
        bindInput()
      }
    })
    return {
      generalIndex,
      showAbiModal,
      addChainModal,
      isDisabled,
      selectOptions,
      chains,
      showModal,
      formData,
      showAbi,
      folderIndex,
      showSpin,
      uploadFile,
      handleUpdateValue,
      create,
      show,
      afterLeave,
      getContractInfoFun,
      setFolderIndex,
      bindInput,
      addChain,
      showAdd,
      handleSearch,
      setGeneralContract
    }
  }
}
</script>

<style scoped lang="scss">
.import-abi {
  width: 100%;
  margin-top: 2px;
  .import-item {
    padding: 0 18px;
    box-sizing: border-box;
    flex: 0 0 146px;
    width: 146px;
    height: 80px;
    background: #17171A;
    border: 1px solid rgba(133, 141, 153, 0.1);
    border-radius: 10px;
    flex-direction: column;
    cursor: pointer;
    &.disabled {
      position: relative;
      &::after {
        border-radius: 10px;
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: rgba(133, 141, 153, 0.1);
        cursor: no-drop;
      }
      &:hover {
        svg {
          .stroke {
            stroke: #858D99;
          }
          .fill {
            fill: #858D99;
          }
        }
        p {
          color: #858D99;
        }
      }
    }
    &:hover {
      svg {
        .stroke {
          stroke: #FFFFFF;
        }
        .fill {
          fill: #FFFFFF;
        }
      }
      p {
        color: #FFFFFF;
      }
    }
    svg {
      .stroke {
        stroke: #858D99;
      }
      .fill {
        fill: #858D99;
      }
    }
    p {
      margin-top: 7px;
      font-weight: 400;
      font-size: 12px;
      line-height: 20px;
      text-transform: capitalize;
      color: #858D99;;
    }
  }
}
.form {
  padding: 0 20px;
  box-sizing: border-box;
}
.add-btn {
  background: rgba(133, 141, 153, 0.3);
  border-radius: 6px;
  height: 34px;
  cursor: pointer;
  span {
    font-weight: 400;
    font-size: 15px;
    line-height: 18px;
    text-transform: capitalize;
    color: #FFFFFF;
  }
}
.contract-type {
  box-sizing: border-box;
  width: calc(100% - 40px);
  margin: auto;
  height: 40px;
  background: #17171A;
  border: 1px solid rgba(133, 141, 153, 0.1);
  border-radius: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &-a {
    background: #FFFFFF;
    border: 1px solid #FFFFFF;
    color: #17171A;
  }
}
.contract-btn {
  box-sizing: border-box;
  width: calc(100% - 40px);
  margin: auto;
  height: 40px;
  background: #375CFF;
  border: 1px solid rgba(133, 141, 153, 0.1);
  border-radius: 10px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #FFFFFF;
}
</style>
