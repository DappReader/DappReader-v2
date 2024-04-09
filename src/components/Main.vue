<template>
  <div class="content">
    <Nav />
    <Contract v-if="activeId" />
    <div v-else class="not-sol flex-center-center"><img src="../assets/images/left.png" alt=""> Please select the contract on the left and execute</div>
  </div>
</template>

<script>
import Nav from '../components/Nav.vue'
import Contract from '../components/Contract.vue'
import { computed } from "vue"
import { useStore } from 'vuex'
// import { useMessage } from "naive-ui"
export default {
  name: '',
  components: { Nav, Contract },
  setup() {
    const store = useStore()
    const activeId = computed(() => {
      return store.state.activeId
    })

    return {
      activeId
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
