<template>
  <div v-if="showModal" class="modal flex-center-center">
    <div class="content">
      <div class="hd flex-start">
        <div class="title">Notice</div>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" @click="hide">
          <path d="M20 20L4 4" stroke="#858D99" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M20 4L4 20" stroke="#858D99" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div v-if="!userInfo.address" class="sub-title">if you have an account, please select Login.</div>
      <div v-if="userInfo.address && userInfo.address.toLocaleLowerCase() != address.toLocaleLowerCase()" class="sub-title">we found that your last sign with address {{userInfo.address}}, if you want to sign in please change your wallet to {{userInfo.address}}</div>
      <div class="btn-list flex-center-center">
        <div v-if="!userInfo.address || userInfo.address.toLocaleLowerCase() == address.toLocaleLowerCase()" :class="['btn', 'flex-center-center']" @click="loginFun" style="margin-right: 16px">Sign to login</div>
        <div v-if="userInfo.address && userInfo.address.toLocaleLowerCase() != address.toLocaleLowerCase()" :class="['btn', 'flex-center-center']" @click="loginFun" style="margin-right: 16px">Change Wallet Address</div>
        <div :class="['btn', 'flex-center-center']" @click="registFun">Regist A New Account</div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
export default {
  name: 'SelectNft',
  props: ['nftList'],
  setup(props, {emit}) {
    const store = useStore()
    const showModal = ref(false)
    const userInfo = ref({})
    const address = computed(() => {
      return store.state.address
    })
    const loginFun = () => {
      emit('login')
    }
    const registFun = () => {
      emit('regist')
    }
    const hide = () => {
      showModal.value = false
      store.commit('hiddenLogin')
    }
    const show = () => {
      showModal.value = true
      let user = localStorage.getItem('userInfo') || null
      if (user) {
        userInfo.value = JSON.parse(user)
      } else {
        userInfo.value = {}
      }
      if (userInfo.value.address?.toLocaleLowerCase() == address.value.toLocaleLowerCase()) {
        emit('login')
        hide()
      }
    }
    watch(address, (val) => {
      if (userInfo.value.address?.toLocaleLowerCase() == val.toLocaleLowerCase()) {
        console.log(2)
        emit('login')
        // hide()
      }
    })
    return {
      address,
      userInfo,
      showModal,
      hide,
      show,
      loginFun,
      registFun,
    }
  }
}
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .4);
  backdrop-filter: blur(5px);
  z-index: 3000;
  .content {
    width: 540px;
    background: #23242A;
    border: 1px solid rgba(133, 141, 153, 0.1);
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px -1px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    padding: 20px;
    font-size: 0;
    box-sizing: border-box;
    position: relative;
    .hd {
      justify-content: space-between;
      .title {
        font-size: 18px;
        line-height: 24px;
        color: #FFFFFF;
      }
      svg {
        cursor: pointer;
      }
    }
    .sub-title {
      font-weight: 400;
      font-size: 13px;
      line-height: 16px;
      text-transform: capitalize;
      color: #858D99;
      margin-top: 8px;
    }

    .btn {
      width: 242px;
      height: 50px;
      background: rgba(133, 141, 153, 0.1);
      border-radius: 10px;
      margin-top: 20px;
      font-size: 16px;
      line-height: 22px;
      text-transform: capitalize;
      cursor: pointer;
      color: #858D99;
      &:hover {
        background: #375CFF;
        color: #FFFFFF;
      }
    }
  }
}
</style>