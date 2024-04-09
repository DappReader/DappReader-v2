<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    class="custom-card modal-style"
    preset="card"
    :style="{width: '600px'}"
    title="添加团队成员"
    :on-after-leave="afterLeave"
  >
    <div class="modal-content">
      <div style="padding: 0 20px">
        <div class="input-group flex-center">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z" stroke="#858D99" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12.75 12.75L15.75 15.75" stroke="#858D99" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <input class="form-input" v-model="keyword" placeholder="Input Wallet Address of Team Member" @input="inputFun" @keyup.enter="handleClickSearch"  />
        </div>
      </div>
      
      <div v-if="list.length" class="list">
        <div class="item flex-center-sb" v-for="item in list" :key="item.nickname">
          <div class="flex-center">
            <div class="avatar">
              <Avatar :avatar="item.avatar" :address="item.address" :width="32" />
            </div>
            <div class="info">
              <div class="name">{{item.nickname}}</div>
              <div class="address">{{item.address}}</div>
            </div>
          </div>
          <div class="btn flex-center-center" @click="add(item)">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 8H12" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 12L8 4" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Add
          </div>
        </div>
      </div>
    </div>
  </n-modal>
</template>
<script>
import { ref, onBeforeMount } from 'vue'
import { getTeamFriendList, getUserInfo } from '../http/abi'
import Avatar from "../components/Avatar.vue"
export default {
  name: 'AddTeamModal',
  components: {Avatar},
  setup(props, {emit}) {
    const showModal = ref(false)
    const keyword = ref('')
    const teamFriendList = ref([])
    const list = ref([])
    const debounce = (cb, delay) => {
      let timer
      return (...args) => {
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(() => {
          cb.call(this, ...args)
        }, delay)
      }
    }
    const afterLeave = () => {
      showModal.value = false
      list.value = teamFriendList
      keyword.value = ''
    }
    const add = (item) => {
      emit('add', item)
    }
    const show = () => {
      showModal.value = true
    }
    const handleClickSearch = () => {
      if (!keyword.value) {
        list.value = teamFriendList.value
        return
      }
      getUserInfo({q: keyword.value}).then(res => {
        console.log(res)
        if (res.code == 0) {
          list.value = res.user_list
          if (res.user_list == 0 &&  keyword.value.indexOf('0x') > -1 && keyword.value.length == 42) {
            list.value = [{
              address: keyword.value,
              nickname: 'notRegistedUser',
              avatar: 'blockie'
            }]
          }
        }
      })
    }
    const inputFun = debounce(() => {
      handleClickSearch()
    }, 500)
    onBeforeMount(() => {
      getTeamFriendList().then(res => {
        console.log(res)
        if (res.code == 0) {
          teamFriendList.value = res.friend_list
          list.value = res.friend_list
        }
      })
    })
    return {
      list,
      teamFriendList,
      showModal,
      keyword,
      afterLeave,
      inputFun,
      handleClickSearch,
      add,
      show
    }
  }
}
</script>
<style lang="scss" scoped>
.modal-style {
  .modal-content {
    box-sizing: border-box;
    max-height: 356px;
    min-height: 356px;
    overflow-y: auto;
    .input-group {
      width: 100%;
      overflow: hidden;
      padding-right: 1px;
      background: #1C1C20;
      border: 1px solid rgba(133, 141, 153, 0.15);
      border-radius: 10px;
      padding: 0 12px;
      box-sizing: border-box;
      margin-right: 16px;
      svg {
        flex: 0 0 18px;
      }
      .form-input {
        box-sizing: border-box;
        margin-top: 0;
        height: 42px;
        flex: 1;
        border-radius: 0;
        outline: none;
        font-size: 14px;
        padding: 0 12px;
        color: #FFFFFF;
        width: 158px;
        box-sizing: border-box;
        background: none !important;
        border: none !important;
      }
    }
    .list {
      margin-top: 16px;
      .item {
        box-sizing: border-box;
        padding: 0 20px;
        height: 50px;
        cursor: pointer;
        &:hover {
          background: rgba(133, 141, 153, 0.15);
          .btn {
            display: flex;
          }
        }
        .avatar {
          flex: 0 0 32px;
          height: 32px;
          margin-right: 12px;
        }
        .info {
          .name {
            font-weight: 500;
            font-size: 14px;
            line-height: 16px;
            color: #FFFFFF;
            margin-bottom: 4px;
          }
          .address {
            font-size: 10px;
            line-height: 12px;
            color: rgba(255, 255, 255, 0.8);
          }
        }
        .btn {
          display: none;
          cursor: pointer;
          font-size: 12px;
          line-height: 12px;
          text-transform: capitalize;
          color: #FFFFFF;
          flex: 0 0 63px;
          width: 63px;
          height: 32px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 4px;
          box-sizing: border-box;
          svg {
            margin-right: 2px;
          }
          &:hover {
            background: #375CFF;
            border: none;
            border-radius: 4px;
          }
        }
      }
    }
  }
}
</style>