<template>
  <div class="modal flex-center-center">
    <div class="content">
      <div class="hd flex-start">
        <div class="title">Select from NFT</div>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" @click="close">
          <path d="M20 20L4 4" stroke="#858D99" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M20 4L4 20" stroke="#858D99" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="img-list flex-center-sb">
        <div :class="['img-item', nftIndex == index ? 'img-item-active' : '']" v-for="(item, index) in list" :key="index" @click="nftIndex = index">
          <img :src="item.image" alt="">
        </div>
        <div class="img-item-blok"></div>
        <div class="img-item-blok"></div>
      </div>
      <div :class="['btn', nftIndex > -1 ? 'btn-activated' : '', 'flex-center-center']" @click="selectNft">Select</div>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
export default {
  name: 'SelectNft',
  props: ['nftList'],
  setup(props, {emit}) {
    const list = ref(props.nftList)
    const nftIndex = ref(-1)
    const selectNft = () => {
      let item = list.value[nftIndex.value]
      emit('selectNft', item)
    }
    const close = () => {
      emit('close')
    }
    return {
      list,
      nftIndex,
      close,
      selectNft
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
  z-index: 3002;
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
    .img-list {
      margin-top: 4px;
      flex-wrap: wrap;
      max-height: 400px;
      overflow-y: scroll;
      .img-item {
        width: 113px;
        height: 113px;
        overflow: hidden;
        margin-top: 16px;
        cursor: pointer;
        border-radius: 6px;
        box-sizing: border-box;
        overflow: hidden;
        &.img-item-active {
          border: 2px solid #375CFF;
        }
        &:hover {
          img {
            transform: scale(1.1);
          }
        }
        img {
          transition: all .3s;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .img-item-blok {
        width: 113px;
        height: 0;
        visibility: hidden;
      }
    }
    .btn {
      width: 100%;
      height: 50px;
      background: rgba(133, 141, 153, 0.1);
      border-radius: 10px;
      margin-top: 20px;
      font-size: 16px;
      line-height: 22px;
      text-transform: capitalize;
      cursor: pointer;
      color: #858D99;
      &.btn-activated {
        background: #375CFF;
        color: #FFFFFF;
      }
    }
  }
}
</style>