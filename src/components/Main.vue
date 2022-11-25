<template>
  <div class="content">
    <Nav />
    <n-tabs
      v-if="openSols && openSols.length"
      v-model:value="activeId"
      type="card"
      tab-style="min-width: 100px;border: none;height: 40px"
      @close="handleClose"
      style="height: calc(100vh - 30px);margin-top: -40px;width: 100%"
      @update:value="update"
    >
      <n-tab-pane
        v-for="item in openSols"
        :closable="item.name == activeId"
        :key="item.name"
        :name="item.name"
        :tab="item.title"
      >
        <Contract :contract="item" />
      </n-tab-pane>
    </n-tabs>
    <div v-else class="not-sol flex-center-center"><img src="@/assets/images/left.png" alt=""> Please select the contract on the left and execute</div>
  </div>
</template>

<script>
import Nav from '@/components/Nav.vue'
import Contract from '@/components/Contract.vue'
import { computed } from "vue"
import { useStore } from 'vuex'
import { setLs, getLs } from '@/service/service'
// import { useMessage } from "naive-ui"
export default {
  name: '',
  components: { Nav, Contract },
  setup() {
    const store = useStore()
    // const message = useMessage()
    const openSols = computed(() => {
      console.log(store.state.openSols)
      return store.state.openSols
    })
    const activeId = computed(() => {
      return store.state.activeId
    })
    const handleClose = async (id) => {
      console.log(id)
      let openSols = await getLs('openSols') || []
      let index = openSols.findIndex(e => e.name == id)
      openSols.splice(index, 1)
      if (openSols.length) {
        update(openSols[0].name)
      }
      setLs('openSols', openSols).then(res => {
        store.commit("setOpenSols", res)
      })
    }
    const update = (id) => {
      console.log(1)
      let index = openSols.value.findIndex(e => e.name == id)
      let el = document.querySelector('.v-x-scroll')
      let el1 = el.querySelectorAll('.n-tabs-tab-wrapper')[index]
      let offsetWidth = el1.offsetWidth
      let scrollLeft = el1.offsetLeft
      const containWidth = el.offsetWidth
      let resultSpot = scrollLeft + offsetWidth / 2 - containWidth / 2 
      el.scrollTo((resultSpot + 50), 100)
      setLs('activeId', id).then(res => {
        store.commit('setActiveId', res)
      })
    }
    return {
      openSols,
      activeId,
      handleClose,
      update
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  flex: 1;
  height: 100vh;
  background: #0D0D0E;
  width: calc(100vw - 248px);
  .not-sol {
    height: calc(100vh - 70px);
    width: 100%;
    font-size: 12px;
    line-height: 18px;
    text-transform: capitalize;
    color: #858D99;
    img {
      width: 32px;
      margin-right: 8px;
      height: auto;
    }
  }
}
</style>
