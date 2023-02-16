<template>
  <div class="content">
    <Nav />
    <div v-if="openSols && openSols.length" class="main">
      <!-- <div class="tabs-b">
        <div class="tabs-right flex-center-sb">
          <svg @click="domMove(1)" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.25 14.25L6 9L11.25 3.75" stroke="#858D99" stroke-width="1.6875" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg @click="domMove(2)" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.75 3.75L12 9L6.75 14.25" stroke="#858D99" stroke-width="1.6875" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="tabs-w">
          <div class="tbas flex-center">
            <div v-for="(item, index) in openSols" :key="item.name" :class="['tab-item', activeId == item.name ? 'tab-item-activated' : '', index == activeIndex - 1 ? 'tab-item-activated-prev' : '']" @click="update(item.name)">
              <div class="tab-item-content flex-center-sb">
                <span>{{item.title}}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" @click.stop="handleClose(item.name)">
                  <path d="M10 10L2 2" stroke="#858D99" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M10 2L2 10" stroke="#858D99" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div> -->
      
      <div class="pane" v-for="item in openSols" :key="item.name">
        <Contract v-if="activeId == item.name" :contract="item" />
      </div>
    </div>
    
    <!-- <n-tabs
      v-if="openSols && openSols.length"
      v-model:value="activeId"
      type="card"
      tab-style="width: 140px;border: none;height: 40px;"
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
    </n-tabs> -->
    <div v-else class="not-sol flex-center-center"><img src="@/assets/images/left.png" alt=""> Please select the contract on the left and execute</div>
  </div>
</template>

<script>
import Nav from '@/components/Nav.vue'
import Contract from '@/components/Contract.vue'
import { computed, ref, watch } from "vue"
import { useStore } from 'vuex'
import { setLs, getLs } from '@/service/service'
// import { useMessage } from "naive-ui"
export default {
  name: '',
  components: { Nav, Contract },
  setup() {
    const store = useStore()
    const activeIndex = ref(-1)
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
      console.log(id)
      let index = openSols.value.findIndex(e => e.name == id)
      let el = document.querySelector('.tabs-w')
      let el1 = el.querySelectorAll('.tab-item')[index]
      let scrollLeft = el1.offsetLeft
      const containWidth = el.offsetWidth
      console.log(scrollLeft, containWidth)
      let resultSpot = scrollLeft - 248 + 70 - containWidth / 2 
      activeIndex.value = index
      el.scrollTo((resultSpot + 50), 100)
      setLs('activeId', id).then(res => {
        store.commit('setActiveId', res)
      })
    }
    const domMove = (i) => {
      let el = document.querySelector('.tabs-w')
      let scrollLeft = el.scrollLeft
      if (i == 1) {
        if (scrollLeft > 140) {
          el.scrollLeft = scrollLeft - 140
        } else {
          el.scrollLeft = 0
        }
      } else if (i == 2) {
        el.scrollLeft = scrollLeft + 140
      }
    }
    watch(activeId, async () => {
      let openSols = await getLs('openSols') || []
      for (let i = 0; i < openSols.length; i++) {
        if (openSols[i].name == activeId.value) {
          activeIndex.value = i
        }
      }
    }, {immediate: true})
    return {
      activeIndex,
      openSols,
      activeId,
      handleClose,
      update,
      domMove
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  flex: 1;
  height: 100vh;
  background: #1C1C20;
  width: calc(100vw - 248px);
  .main {
    background: #1C1C20;
  }
  .tabs-b {
    position: relative;
    background: #2C2D34;
    height: 34px;
    margin-bottom: 34px;
    padding-right: 60px;
    box-sizing: border-box;
  }
  .tabs-right {
    position: absolute;
    background: #2C2D34;
    width: 60px;
    position: absolute;
    height: 34px;
    right: 0;
    z-index: 9;
    padding: 0 8px;
    box-sizing: border-box;
    svg {
      cursor: pointer;
    }
    &::before {
      content: '';
      width: 1px;
      height: 12px;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      z-index: 2;
      background: rgba(133, 141, 153, 0.2);
    }
  }
  .tabs-w {
    width: 100%;
    overflow-x: auto;
    position: relative;
    scrollbar-width: none;
    border-radius: 0px 0px 0px 0px;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .tbas {
    height: 34px;
    position: relative;
    .tab-item {
      flex: 0 0 140px;
      cursor: pointer;
      position: relative;
      svg {
        display: none;
      }
      .tab-item-content {
        position: relative;
        background: #2C2D34;
        z-index: 1;
        width: 140px;
        height: 34px;
        padding: 0 12px;
        box-sizing: border-box;
        font-family: 'Montserrat-Medium';
        font-size: 12px;
        line-height: 16px;
        color: #858D99;
      }
      &::before {
        content: '';
        width: 1px;
        height: 12px;
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        z-index: 2;
        background: rgba(133, 141, 153, 0.2);
      }
      &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 0;
        background: linear-gradient( to bottom, #2C2D34 40%, #17171A 60%);
      }
      &:hover {
        .tab-item-content {
          background: #2A2A32;
          border-radius: 10px 10px 0px 0px;
          color: #FFFFFF;
          svg {
            display: inline-block;
          }
        }
      }
      &:first-child {
        border-top-left-radius: 10px;
        overflow: hidden;
      }
      &:last-child {
        // border-top-right-radius: 10px;
        overflow: hidden;
        &::before {
          display: none;
        }
      }
      &.tab-item-activated {
        &::before {
          display: none;
        }
        .tab-item-content {
          color: #FFFFFF;
          background: #17171A;
          border-radius: 10px 10px 0px 0px;
          svg {
            display: inline-block;
          }
        }
        & + .tab-item {
          .tab-item-content {
            border-radius: 0px 0px 0px 10px;
          }
        }
      }
      &.tab-item-activated-prev {
        &::before {
          display: none;
        }
        .tab-item-content {
          border-radius: 0px 0px 10px 0px;
        }
      }
    }
  }
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
