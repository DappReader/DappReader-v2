<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    class="custom-card modal-style"
    preset="card"
    :style="{width: '600px'}"
    :title="title"
    :on-after-leave="afterLeave"
  >
    <div class="form">
      <n-form-item show-require-mark label="Folder Name" :rule="rule">
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
    const title = ref('New Folder')
    const folderIndex = ref(-1)
    const rule = {
      trigger: ["input", "blur"],
      validator() {
        if (!floderName.value) {
          return new Error('Please input the folder name')
        } else if (floderName.value.length > 12) {
          return new Error('max 12')
        }
      }
    }
    const show = () => {
      showModal.value = true
    }
    const create = async () => {
      if (!floderName.value || floderName.value.length > 12) return
      let menuList = await getLs('menuList') || []
      if (folderIndex.value >= 0) {
        menuList[folderIndex.value].name = floderName.value
        setLs('menuList', JSON.parse(JSON.stringify(menuList))).then(res => {
          store.commit("setMenuList", res)
          showModal.value = false
        })
      } else {
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
    }
    const afterLeave = () => {
      floderName.value = ''
    }
    return {
      title,
      showModal,
      floderName,
      rule,
      folderIndex,
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
.form {
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
