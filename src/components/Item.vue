<template>
  <div class="item flex-center-sb" v-if="item &&item.address">
    <div class="flex-center">
      <div class="avatar">
        <Avatar :avatar="item.avatar" :address="item.address" :width="32" />
      </div>
      <div class="info">
        <div class="name">{{item.nickname}}</div>
        <div class="address">{{item.address}}</div>
      </div>
    </div>
    <div class="del" @click="del(item)">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.667 9.1665V14.1665" stroke="#B9B9BC" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8.33301 9.1665V14.1665" stroke="#B9B9BC" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M5 5.8335V15.8335C5 16.754 5.74619 17.5002 6.66667 17.5002H13.3333C14.2538 17.5002 15 16.754 15 15.8335V5.8335" stroke="#B9B9BC" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M3.33301 5.8335H16.6663" stroke="#B9B9BC" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M5.83301 5.83333L7.49967 2.5H12.4997L14.1663 5.83333" stroke="#B9B9BC" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  </div>
</template>
<script>
import Avatar from "@/components/Avatar.vue"
export default {
  props: ['item'],
  components: {Avatar},
  setup(props, {emit}) {
    const del = (item) => {
      emit('del', item)
    }
    return {
      del
    }
  },
}
</script>
<style lang="scss" scoped>
.item {
  box-sizing: border-box;
  padding: 0 20px;
  height: 50px;
  cursor: pointer;
  &:hover {
    background: rgba(133, 141, 153, 0.15);
    .del {
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
  .del {
    display: none;
    cursor: pointer;
    svg {
      margin-right: 2px;
    }
    &:hover {
      svg {
        path {
          stroke: #F76781;
        }
      }
    }
  }
}
</style>