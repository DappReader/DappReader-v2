<template>
  <div class="content">
    <div class="input-group flex-center">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z" stroke="#858D99" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12.75 12.75L15.75 15.75" stroke="#858D99" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <input class="form-input" v-model="keyword" placeholder="Input Wallet Address of Team Member" @input="inputFun" @keyup.enter="handleClickSearch"  />
      <svg v-show="keyword && !isSearching" @click="clear" class="clear" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M16.5 9C16.5 13.1421 13.1421 16.5 9 16.5C4.85786 16.5 1.5 13.1421 1.5 9C1.5 4.85786 4.85786 1.5 9 1.5C13.1421 1.5 16.5 4.85786 16.5 9ZM5.46967 5.46967C5.76256 5.17678 6.23744 5.17678 6.53033 5.46967L9.00001 7.93935L11.4697 5.46967C11.7626 5.17678 12.2375 5.17678 12.5303 5.46967C12.8232 5.76256 12.8232 6.23744 12.5303 6.53033L10.0607 9.00001L12.5303 11.4697C12.8232 11.7625 12.8232 12.2374 12.5303 12.5303C12.2374 12.8232 11.7625 12.8232 11.4697 12.5303L9.00001 10.0607L6.53033 12.5303C6.23744 12.8232 5.76256 12.8232 5.46967 12.5303C5.17678 12.2375 5.17678 11.7626 5.46967 11.4697L7.93935 9.00001L5.46967 6.53033C5.17678 6.23744 5.17678 5.76256 5.46967 5.46967Z" fill="#858D99"/>
      </svg>
      <svg v-if="isSearching" t="1678691045922" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2839" width="18" height="18"><path d="M192 512a32 32 0 0 1 64 0 256 256 0 1 0 256-256 32 32 0 0 1 0-64c176.736 0 320 143.264 320 320s-143.264 320-320 320S192 688.736 192 512z" fill="#858D99" p-id="2840"></path></svg>
    </div>
    <div v-if="list && list.length" class="list">
      <div class="item flex-center-sb" v-for="item in list" :key="item.nickname" @click="add(item)">
        <div class="flex-center" style="width: 100%">
          <div class="avatar">
            <Avatar :avatar="item.avatar" :address="item.address" :width="32" />
          </div>
          <div class="info">
            <div class="name">{{item.nickname}}</div>
            <div class="address">{{item.address}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>
<script>
import Avatar from "@/components/Avatar.vue"
import {ref} from 'vue'
export default {
  props: ['list', 'isSearching'],
  components: {Avatar},
  setup(props, {emit}) {
    const keyword = ref('')
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
    const add = (item) => {
      emit('add', item)
    }
    const handleClickSearch = () => {
      emit('search', keyword.value)
    }

    const inputFun = debounce(() => {
      handleClickSearch()
    }, 500)

    const clear = () => {
      keyword.value = ''
      handleClickSearch()
    }
    return {
      keyword,
      add,
      handleClickSearch,
      inputFun,
      clear
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  position: relative;
}
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
  .icon {
    animation: animation 1s linear infinite;
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
  .clear {
    cursor: pointer;
  }
}
.list {
  position: absolute;
  top: 58px;
  left: 0;
  right: 0;
  max-height: 300px;
  overflow-y: auto;
  background: #2D2E35;
  border: 1px solid rgba(133, 141, 153, 0.15);
  box-shadow: 0px 12px 30px rgba(10, 10, 12, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 5px;
  box-sizing: border-box;
  .item {
    box-sizing: border-box;
    padding: 0 20px;
    height: 44px;
    cursor: pointer;
    border-radius: 6px;
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
      flex: 1;
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
@keyframes animation{
  0%{
    transform: rotate(0deg)
  }
  100%{
    transform: rotate(360deg)
  }
}
</style>