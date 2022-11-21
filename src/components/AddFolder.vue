<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    class="custom-card"
    preset="card"
    :style="{width: '600px',background: '#15141B', 'border-radius': '10px'}"
    title="New Folder"
    :on-after-leave="afterLeave"
  >
    <div class="form">
      <n-form-item label="Folder Name *" :rule="rule">
        <n-input v-model:value="floderName" class="form-input" />
      </n-form-item>
      <div class="form-btns flex-center-center">
        <div :class="['btn-item', floderName ? 'btn-item-activated' : '', 'flex-center-center']" @click="create">Create</div>
      </div>
    </div>
  </n-modal>
</template>

<script>
import { ref } from "vue";
import { useStore } from 'vuex'
import { getLs, setLs } from "@/service/service";
export default {
  name: 'AddFolder',
  setup() {
    const store = useStore()
    const floderName = ref('')
    const showModal = ref(false)
    const rule = {
        trigger: ["input", "blur"],
        validator() {
          if (!floderName.value) {
            return new Error('Please input the folder name')
          }
        }
      }
    const show = () => {
      showModal.value = true
    }
    const create = async () => {
      if (!floderName.value) return
      let menuList = await getLs('menuList') || []
      let data = {
        son: [],
        name: floderName.value
      }
      menuList.push(data)
      setLs('menuList', JSON.parse(JSON.stringify(menuList))).then(res => {
        store.commit("setMenuList", res)
        showModal.value = false
      })
    }
    const afterLeave = () => {
      floderName.value = ''
    }
    return {
      showModal,
      floderName,
      rule,
      create,
      show,
      afterLeave
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  padding: 0;
}
</style>
