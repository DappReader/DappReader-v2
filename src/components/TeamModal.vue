<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    class="custom-card modal-style"
    preset="card"
    :style="{width: '600px'}"
    title="Team Members"
    :on-after-leave="afterLeave"
    @click="searchList = []"
  >
    <n-spin :show="loading">
      <div class="modal-content">
        <div>
          <p class="sub-title">Add team members</p>
          <SelectSearch ref="selectSearch" :isSearching="isSearching" :list="searchList" @add="add" @search="search" @click.stop />
          <p class="sub-title" style="margin-top: 20px">Team members can be managed here（{{userList.length}}）</p>
          <div class="list" v-if="userList && userList.length">
            <Item v-for="item in userList" :key="item.address" :item="item" @del="del" />
          </div>
          <div class="btn flex-center-center" @click="confirm">Confirm</div>
        </div>
      </div> 
    </n-spin>
  </n-modal>
</template>
<script>
import { ref } from 'vue'
import SelectSearch from '@/components/SelectSearch.vue'
import { getUserInfo, updateTeamInfo } from '@/http/abi'
import Item from '@/components/Item.vue'
import { useUtils } from '../hooks/useUtils'
export default {
  components: {SelectSearch, Item},
  setup() {
    const { setData } = useUtils()
    const showModal = ref(false)
    const loading = ref(false)
    const selectSearch = ref(null)
    const isSearching = ref(false)
    const userList = ref([])
    const contract = ref({})
    const searchList = ref([])
    const show = (data) => {
      console.log(data)
      contract.value = JSON.parse(JSON.stringify(data))
      userList.value = JSON.parse(JSON.stringify(data.userList || []))
      showModal.value = true
    }
    const search = (keyword) => {
      console.log(keyword)
      if (!keyword) {
        searchList.value = []
        return
      }
      isSearching.value = true
      getUserInfo({q: keyword}).then(res => {
        if (res.code == 0) {
          searchList.value = res.user_list
          if (res.user_list == 0 &&  keyword.indexOf('0x') > -1 && keyword.length == 42) {
            searchList.value = [{
              address: keyword,
              nickname: 'notRegistedUser',
              avatar: 'blockie'
            }]
          }
        }
        isSearching.value = false
      }).catch((err) => {
        console.log(err)
        isSearching.value = false
      })
    }
    const add = (item) => {
      userList.value.push(item)
      let arr = []
      userList.value.forEach(e => {
        if (!arr.some(el => el.address == e.address)) {
          arr.push(e)
        }
      })
      userList.value = JSON.parse(JSON.stringify(arr))
      selectSearch.value.clear()
    }
    const del = ({address}) => {
      userList.value = userList.value.filter(e => e.address != address)
    }
    const confirm = () => {
      let token = contract.value.token
      let address_list = userList.value.map(e => e.address)
      loading.value = true
      updateTeamInfo({token, address_list}).then(res => {
        if (res.code == 0) {
          contract.value.userList = userList.value
          setData(contract.value)
          afterLeave()
        }
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        loading.value = false
      })
    }
    const afterLeave = () => {
      showModal.value = false
      searchList.value = []
      userList.value = []
      contract.value = {}
    }
    return {
      isSearching,
      selectSearch,
      searchList,
      showModal,
      userList,
      loading,
      show,
      add,
      search,
      del,
      confirm,
      afterLeave
    }
  },
}
</script>
<style lang="scss" scoped>
.modal-style {
  .modal-content {
    box-sizing: border-box;
    overflow-y: auto;
    .sub-title {
      font-weight: 400;
      font-size: 12px;
      line-height: 20px;
      text-transform: capitalize;
      color: #858D99;
      margin-bottom: 8px;
    }
    .list {
      max-height: 260px;
      overflow-y: auto;
      border: 1px solid rgba(133, 141, 153, 0.15);
      border-radius: 10px;
    }
    .btn {
      margin-top: 20px;
      height: 50px;
      background: #375CFF;
      border-radius: 10px;
      cursor: pointer;
    }
  }
}
</style>