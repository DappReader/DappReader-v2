<template>
  <div v-if="avatar" class="avatar-content">
    <div v-if="avatar.indexOf('https://') > -1" class="avatar-item">
      <img :src="avatar" alt="">
    </div>
    <div v-else-if="avatar == 'blockie'" class="avatar-item">
      <img :src="getBlockie()" alt="">
    </div>
    <div v-else-if="avatar == 'jazzicon'" class="avatar-item" >
      <Jazzicon :diameter="width" :address="address" />
    </div>
    <div v-else-if="avatar.indexOf('design') > -1" class="avatar-item">
      <img :src="designImg(avatar)" alt="">
    </div>
    <div v-else class="avatar-item">
      <Jazzicon :diameter="width" :address="address" />
    </div>
  </div>
</template>
<script>
import makeBlockie from 'ethereum-blockies-base64'
import Jazzicon from 'vue3-jazzicon/src/components'
export default {
  components: {
    Jazzicon,
  },
  props: ['width', 'avatar', 'address'],
  setup(props) {
    const getBlockie = () => {
      return makeBlockie(props.address)
    }
    const designImg = (avatar) => {
      let index = avatar.split('-')[1]
      return new URL(`../assets/images/avatar/${index}.png`, import.meta.url).href
    }
    return {
      designImg,
      getBlockie
    }
  },
}
</script>
<style lang="scss" scoped>
.avatar-content {
  width: 100%;
  height: 100%;
  .avatar-item {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
  }
}
</style>