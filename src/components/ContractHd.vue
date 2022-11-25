<template>
  <div class="hd">
    <div class="hd-section flex-center-sb">
      <div class="title">{{contarct.name}}</div>
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
export default {
  props: ['contarct'],
  components: {
    CreateContract,
    ShareModal
  },
  setup(props) {
    const store = useStore()
    const dialog = useDialog()
    const createContract = ref(null)
    const shareModal = ref(null)
    const contarctData = ref(props.contarct)
    const { toEtherscanAddress, copy } = useUtils()
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
      contarctData,
      createContract,
      del,
      shareModal,
      edit,
      copy,
      share,
      toEtherscanAddress
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
      width: 754px;
      flex: 0 0 754px;
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