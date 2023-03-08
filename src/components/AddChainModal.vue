<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    class="custom-card modal-style search-modal"
    preset="card"
    title="Add New Chain"
    :on-after-leave="afterLeave"
  >
    <div class="form">
      <div class="input">
        <n-input v-model:value="keyword" class="form-input" @input="input" />
      </div>
      <div class="list">
        <div class="chain-item flex-center-sb" v-for="item in list" :key="item.chainId">
          <div class="item-l">
            <div class="item-title">{{item.name}}</div>
            <div class="item-rpc">{{item.rpc[0]}}</div>
          </div>
          <div class="item-r flex-center-center" @click="addChain(item)">
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
import { ref, onBeforeMount, computed } from "vue";
import { chains } from '../libs/chains'
import { getLs, setLs } from "@/service/service";
import { useStore } from 'vuex'
// import { useMessage } from 'naive-ui'
export default {
  name: 'CreateContract',
  setup(props, {emit}) {
    const store = useStore()
    let chain = []
    const keyword = ref('')
    const list = ref([])
    const showModal = ref(false)
    const defaultChains = computed(() => {
      return store.state.defaultChains
    })
    const afterLeave = () => {
      showModal.value = false
      keyword.value = ''
    }
    const input = (e) => {
      list.value = chain.filter(el => el.name.toLocaleLowerCase().indexOf(e.toLocaleLowerCase()) > -1)
    }
    const addChain = async (item) => {
      defaultChains.value.push(item)
      await setLs('defaultChain', JSON.parse(JSON.stringify(defaultChains.value))).then(res => {
        console.log(res)
        store.commit('setDefaultChains', defaultChains.value)
      })
      emit('add', item)
    }
    onBeforeMount(async () => {
      let dc = await getLs('defaultChain') || []
      let arr = dc.map(e => e.chainId)
      chain = chains.filter(el => !arr.includes(el.chainId))
      list.value = chain
    })
    return {
      defaultChains,
      keyword,
      showModal,
      list,
      input,
      afterLeave,
      addChain
    }
  }
}
</script>

<style scoped lang="scss">

.form {
  box-sizing: border-box;
  position: relative;
  z-index: 1;
  &::after {
    content: '';
    position: absolute;
    z-index: -1;
    top: -69px;
    left: 0;
    width: 100%;
    height: 119px;
    background: #2D2E35;
    display: block;
    border-radius: 10px 10px 0 0;
  }
  .input {
    padding: 0 20px;
    box-sizing: border-box;
  }
  .list {
    height: 384px;
    overflow-y: auto;
    margin-top: 8px;
    .chain-item {
      cursor: pointer;
      height: 63px;
      padding: 0 20px;
      box-sizing: border-box;
      &:hover {
        background: rgba(133, 141, 153, 0.15);
        .item-r {
          display: flex;
        }
      }
    }
    .item-l {
      .item-title {
        font-weight: 500;
        font-size: 15px;
        line-height: 18px;
        text-transform: capitalize;
        color: #FFFFFF;
      }
      .item-rpc {
        margin-top: 6px;
        font-size: 12px;
        line-height: 16px;
        color: rgba(255, 255, 255, 0.8);
      }
    }
    .item-r {
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
</style>
