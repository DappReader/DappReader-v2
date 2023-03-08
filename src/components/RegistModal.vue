<template>
  <div v-if="showModal" class="regist flex-center-center">
    <n-spin :show="syncing" style="color: #FFF">
      <div class="regist-content">
        <img src="@/assets/images/regist_bg.png" alt="" class="bg">
        <div class="main">
          <div class="hd flex-start">
            <div class="title">Regist</div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" @click="closeModal">
              <path d="M20 20L4 4" stroke="#858D99" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M20 4L4 20" stroke="#858D99" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="desc">Register for a DR account and enjoy free smart contract sharing, team collaboration, and personalized blockchain browsing. Let's build a more open and collaborative blockchain community together with DR!</div>
          <div class="user-info">
            <div class="user-item user-avatar">
              <div class="item-hd flex-center">
                <div class="item-title">Select An Avatar</div>
              </div>
              <div class="item-bd">
                {{user.avatar}}
                <div class="avatar-list flex-center">
                  <div v-if="nftAvatar" :class="['avatar-item', user.avatar.indexOf('https://') > -1 ? 'avatar-item-activated' : '', 'flex-center-center']" @click="user.avatar = nftAvatar.image">
                    <img :src="nftAvatar.image" alt="">
                  </div>
                  <div :class="['avatar-item', user.avatar == 'blockie' ? 'avatar-item-activated' : '', 'flex-center-center']" @click="user.avatar = 'blockie'">
                    <img :src="getBlockie()" alt="">
                  </div>
                  <div :class="['avatar-item', user.avatar == 'jazzicon' ? 'avatar-item-activated' : '', 'flex-center-center']" @click="user.avatar = 'jazzicon'">
                    <Jazzicon :diameter="48" :address="user.address" />
                  </div>
                  <div :class="['avatar-item', user.avatar.indexOf('design') > -1 ? 'avatar-item-activated' : '', 'flex-center-center']" @click="() => user.avatar = `design-${designIndex}`">
                    <img :src="designImg" alt="">
                  </div>
                  <div v-if="nftList.length" class="select-btn flex-center-center" @click="showSelectNft = true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M2.90332 6.78613L11.9998 1.5105L21.101 6.78345V17.2372L12.0166 22.4904L2.90332 17.2404V6.78613ZM5.88057 7.84664C5.88057 7.91848 6.81238 10.9296 7.21669 12.2328L7.22709 6.82673L8.37959 6.19434V18.0671L7.56359 17.5972L5.88057 11.2885V16.6288L4.92192 16.0781V8.38723L5.88057 7.84664ZM9.35876 18.5764L10.4399 19.2902V12.6609H14.4686V11.3247H10.4399V6.0924L12.0031 5.20507L14.7235 6.78605L15.3457 5.81699L12.0031 3.85872L9.35876 5.4397V18.5764ZM16.7224 17.6482V8.03043L15.2844 7.09208L15.8758 6.20475L19.3946 8.42819V9.69281L17.9158 8.68313V16.9853L16.7224 17.6482Z" fill="white"/>
                    </svg>
                    Select from NFT
                  </div>
                </div>
              </div>
            </div>
            <div class="user-item">
              <div class="item-hd flex-center">
                <div class="item-title">Nick Name</div>
              </div>
              <div class="item-bd">
                <input type="text" class="item-input flex-center" v-model="user.nickname">
              </div>
            </div>
            <div class="user-item">
              <div class="item-hd flex-center">
                <div class="item-title">Wallet Address</div>
                <div class="item-desc">Please register with your usual address</div>
              </div>
              <div class="item-bd">
                <input type="text" class="item-input flex-center" v-model="user.address" disabled>
              </div>
            </div>
          </div>
          <div class="btn flex-center-center" @click="regist">Sign and Regist</div>
        </div>
      </div>
    </n-spin>
    <SelectNftModal v-if="showSelectNft" :nftList="nftList" @selectNft="selectNft" @close="showSelectNft = false" />
  </div>
</template>
<script>
import { ref } from 'vue'
import makeBlockie from 'ethereum-blockies-base64'
import Jazzicon from 'vue3-jazzicon/src/components'
import SelectNftModal from '@/components/SelectNftModal.vue'
export default {
  name: 'RegistModal',
  components: {
    Jazzicon,
    SelectNftModal
  },
  setup(props, {emit}) {
    const designIndex = ref(Math.floor(Math.random() * 10))
    const showModal = ref(false)
    const showSelectNft = ref(false)
    const nftAvatar = ref(null)
    const syncing = ref(false)
    const nftList = ref([])
    const designImg = ref(require(`@/assets/images/avatar/${designIndex.value}.png`))
    const user = ref({
      nickname: '',
      address: '',
      avatar: 'blockie'
    })
    const getBlockie = () => {
      return makeBlockie(user.value.address)
    }
    const show = (address) => {
      showModal.value = true
      user.value.address = address
      user.value.nickname = address.slice(-4)
    }
    const selectNft = (nft) => {
      nftAvatar.value = nft
      user.value.avatar = nft.image
      showSelectNft.value = false
    }
    const regist = () => {
      syncing.value = true
      emit('regist', user.value)
    }
    const closeModal = () => {
      showModal.value = false
      syncing.value = false
      user.value = {
        nickname: '',
        address: '',
        avatar: 'blockie'
      }
    }
    return {
      user,
      nftList,
      syncing,
      nftAvatar,
      designIndex,
      showModal,
      designImg,
      showSelectNft,
      show,
      regist,
      selectNft,
      getBlockie,
      closeModal
    }
  }
}
</script>

<style lang="scss" scoped>
.regist {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .4);
  backdrop-filter: blur(5px);
  z-index: 3001;
  .regist-content {
    width: 540px;
    background: #23242A;
    border: 1px solid rgba(133, 141, 153, 0.1);
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px -1px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    padding: 20px;
    font-size: 0;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    .bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: auto;
      object-fit: cover;
      border-radius: 10px;
    }
    .main {
      position: relative;
      z-index: 2;
    }
    .hd {
      justify-content: space-between;
      .title {
        font-family: 'Montserrat-Bold';
        font-style: normal;
        font-size: 24px;
        line-height: 150%;
        letter-spacing: -0.01em;
        color: #FFFFFF;
      }
      svg {
        cursor: pointer;
      }
    }
    .desc {
      margin-top: 8px;
      font-weight: 400;
      font-size: 13px;
      line-height: 22px;
      text-transform: capitalize;
      color: #FFFFFF;
    }
    .user-info {
      .user-item {
        margin-top: 20px;
        &.user-avatar {
          .item-bd {
            margin-top: 16px;
          }
        }
        .item-hd {
          .item-title {
            font-weight: 400;
            font-size: 14px;
            line-height: 17px;
            text-transform: capitalize;
            color: #FFFFFF;
          }
          .item-desc {
            margin-left: 12px;
            font-size: 12px;
            line-height: 16px;
            text-transform: capitalize;
            color: #858D99;
          }
        }
        .item-bd {
          margin-top: 12px;
          .avatar-list {
            .avatar-item {
              width: 48px;
              height: 48px;
              border-radius: 48px;
              margin-right: 16px;
              cursor: pointer;
              &.avatar-item-activated {
                position: relative;
                &::after {
                  content: '';
                  position: absolute;
                  top: -4px;
                  left: -4px;
                  right: -4px;
                  bottom: -4px;
                  border-radius: 48px;
                  border: 2px solid #FFFFFF;
                }
              }
              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 48px;
              }
            }
            .select-btn {
              width: 181px;
              height: 48px;
              background: #6F4AC5;
              border-radius: 48px;
              font-size: 14px;
              line-height: 16px;
              text-transform: capitalize;
              color: #FFFFFF;
              cursor: pointer;
              svg {
                margin-right: 8px;
              }
            }
          }
          .item-input {
            border: none;
            background: none;
            width: 100%;
            height: 40px;
            background: #17171A;
            border: 1px solid rgba(133, 141, 153, 0.15);
            border-radius: 10px;
            padding: 0 18px;
            font-size: 15px;
            line-height: 20px;
            text-transform: capitalize;
            color: #FFFFFF;
            box-sizing: border-box;
            outline: none;
            &:focus {
              border: 1px solid #375CFF;
            }
            &:disabled {
              font-size: 15px;
              line-height: 20px;
              text-transform: capitalize;
              color: rgba(133, 141, 153, 0.6);
              background: #2D2E35;
            }
          }
        }
      }
    }
    .btn {
      width: 100%;
      height: 50px;
      background: #375CFF;
      border-radius: 10px;
      font-size: 16px;
      line-height: 20px;
      text-align: center;
      letter-spacing: -0.01em;
      color: #FFFFFF;
      margin-top: 20px;
      cursor: pointer;
    }
  }
}
</style>