<template>
  <div class="home flex-start" @click="hiddenRightMenu">
    <Menu ref="menuDom" />
    <Main />
  </div>
</template>

<script>
import Menu from '../components/Menu.vue'
import Main from '../components/Main.vue'
import { ref } from 'vue'
export default {
  name: 'Home',
  components: {
    Menu,
    Main
  },
  setup() {
    const menuDom = ref(null)
    const hiddenRightMenu = () => {
      menuDom.value.hiddenRightMenu()
    }
    return {
      menuDom,
      hiddenRightMenu
    }
  }
}
</script>
