<template>
  <div class="content">
    <div class="logo">
      <img src="@/assets/images/logo.svg" alt="">
    </div>
    <!-- <div class="switch flex-center-center">
      <div class="switch-item switch-item-activated flex-center-center">My Contract</div>
      <div class="switch-item flex-center-center">Contract Hub</div>
    </div> -->
    <div class="add flex-center-sb">
      <div class="add-contract flex-center" @click="showCreateContract">
        <img src="@/assets/images/add_file.svg" alt="">
        <span>add contract</span>
      </div>
      <div class="add-flie" @click="showAddFolder">
        <img src="@/assets/images/add_folder.svg" alt="">
      </div>
    </div>
    <div class="contract">
      <div class="contract-title">contract</div>
      <div class="folder-list">
        <div v-for="(item, index) in menuList" :key="index" :class="['folder-item', item.open ? 'folder-item-activated' : '']" @contextmenu.prevent="folderContextmenu(index)">
          <div class="flex-center folder-item-main" style="height: 30px" @click="() => {item.open = !item.open;openFolderIndex = -1}">
            <img v-if="item.open" src="@/assets/images/folder_open.svg" alt="">
            <img v-else src="@/assets/images/folder.svg" alt="">
            <span>{{item.name}}<span>({{item.son.length}})</span></span>
            <img src="@/assets/images/arrow.svg" alt="" class="arrow" >
            <div v-if="folderContextmenuIndex == index" class="right-menu">
              <div class="right-menu-item flex-center" @click="folderStickyTop(index)"><img src="@/assets/images/top.svg" alt="">Sticky Top</div>
              <div class="right-menu-item flex-center" @click.stop="showCreateContract(index)"><img src="@/assets/images/add.svg" alt="">Add Contract</div>
              <div class="right-menu-item flex-center" @click.stop="showRename(index, item.name)"><img src="@/assets/images/edit.svg" alt="">Rename</div>
              <n-popconfirm :show-icon="false"
                class="right-menu-popconfirm"
                negative-text="Cancel"
                positive-text="Ok"
                @positive-click="delFolder(index)"
              >
                <template #trigger>
                  <div class="right-menu-item flex-center" @click.stop>
                    <img src="@/assets/images/del.svg" alt="">Delete Folder
                  </div>
                </template>
                <p class="popconfirm-msg">This operation will permanently delete the contract information, do you want to continue?</p>
              </n-popconfirm>
              <!-- <div class="right-menu-item flex-center" @click="delFolder(index)">
                <img src="@/assets/images/del.svg" alt="">Delete Folder
              </div> -->
            </div>
          </div>
          <div class="folder-file" v-show="item.open">
            <div class="file-item-w" v-for="(file, i) in item.son" :key="file.id" @contextmenu.prevent.stop="fileContextmenu(file.id)">
              <div :class="['file-item', 'flex-center', activeId == file.id ? 'file-item-activated' : '']" @click.stop="openFile(file)">
                <svg width="16" height="18" class="file-arrow" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 0V5.2C9 6.88016 9 7.72024 9.32698 8.36197C9.6146 8.92646 10.0735 9.3854 10.638 9.67302C11.2798 10 12.1198 10 13.8 10H16" stroke-width="1.5"/>
                </svg>
                <svg width="18" height="18" class="file-icon" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.5 15.75H4.5C4.08579 15.75 3.75 15.4142 3.75 15L3.75 3C3.75 2.58579 4.08579 2.25 4.5 2.25L10.1723 2.25C10.3812 2.25 10.5807 2.33715 10.7226 2.49044L14.0503 6.08435C14.1787 6.22298 14.25 6.40496 14.25 6.5939L14.25 15C14.25 15.4142 13.9142 15.75 13.5 15.75Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M14.25 6.75L10.5 6.75C10.0858 6.75 9.75 6.41421 9.75 6L9.75 2.25" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>{{file.name}}</span>
              </div>
              <div class="right-menu" v-if="file.id == fileContextmenuId">
                <div class="right-menu-item flex-center" @click="fileStickyTop(i, index)"><img src="@/assets/images/top.svg" alt="">Sticky Top</div>
                <div class="right-menu-item flex-center" @click="edit(file, i, index)"><img src="@/assets/images/edit.svg" alt="">Edit</div>
                <n-popconfirm :show-icon="false"
                  class="right-menu-popconfirm"
                  negative-text="Cancel"
                  positive-text="Ok"
                  @positive-click="delFile(i, index)"
                >
                  <template #trigger>
                    <div class="right-menu-item flex-center" @click.stop><img src="@/assets/images/del.svg" alt="">Delete</div>
                  </template>
                  <p class="popconfirm-msg">This operation will permanently delete the contract information, do you want to continue?</p>
                </n-popconfirm>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="file-list">
        <div v-for="(file, index) in contractList" :key="file.id" class="file-item-w" @contextmenu.prevent="fileContextmenu(file.id)">
          <div :class="['file-item', 'flex-center', activeId == file.id ? 'file-item-activated' : '']" @click.stop="openFile(file)">
            <svg width="18" height="18" class="file-icon" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.5 15.75H4.5C4.08579 15.75 3.75 15.4142 3.75 15L3.75 3C3.75 2.58579 4.08579 2.25 4.5 2.25L10.1723 2.25C10.3812 2.25 10.5807 2.33715 10.7226 2.49044L14.0503 6.08435C14.1787 6.22298 14.25 6.40496 14.25 6.5939L14.25 15C14.25 15.4142 13.9142 15.75 13.5 15.75Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M14.25 6.75L10.5 6.75C10.0858 6.75 9.75 6.41421 9.75 6L9.75 2.25" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>{{file.name}}</span>
          </div>
          <div class="right-menu" v-if="file.id == fileContextmenuId">
            <div class="right-menu-item flex-center" @click="fileStickyTop(index)"><img src="@/assets/images/top.svg" alt="">Sticky Top</div>
            <div class="right-menu-item flex-center" @click="edit(file, index)"><img src="@/assets/images/edit.svg" alt="">Edit</div>
            <n-popconfirm :show-icon="false"
              class="right-menu-popconfirm"
              negative-text="Cancel"
              positive-text="Ok"
              @positive-click="delFile(index)"
            >
              <template #trigger>
                <div class="right-menu-item flex-center" @click.stop><img src="@/assets/images/del.svg" alt="">Delete</div>
              </template>
              <p class="popconfirm-msg">This operation will permanently delete the contract information, do you want to continue?</p>
            </n-popconfirm>
          </div>
        </div>
      </div>
    </div>
    <AddFolder ref="addFolder" />
    <CreateContract ref="createContract" />
  </div>
</template>

<script>
import AddFolder from '@/components/AddFolder.vue'
import CreateContract from '@/components/CreateContract.vue'
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { getLs, setLs } from '@/service/service'
export default {
  name: '',
  components: {
    AddFolder,
    CreateContract
  },
  setup() {
    const store = useStore()
    const addFolder = ref(null)
    const createContract = ref(null)
    const fileContextmenuId = ref('')
    const folderContextmenuIndex = ref(-1)
    const openFolderIndex = ref(-1)
    const activeId = computed(() => {
      return store.state.activeId
    })
    const menuList = computed(() => {
      return store.state.menuList
    })
    const contractList = computed(() => {
      return store.state.contractList
    })
    const showAddFolder = () => {
      addFolder.value.show()
    }
    const showCreateContract = (index) => {
      console.log(createContract.value, index)
      if (index >= 0) {
        openFolderIndex.value = index
        console.log(openFolderIndex.value)
        createContract.value.setFolderIndex(index)
      }
      createContract.value.show()
      hiddenRightMenu()
    }
    const showRename = ((index, name) => {
      if (index >= 0) {
        addFolder.value.folderIndex = index
        addFolder.value.floderName = name
      }
      addFolder.value.show()
      hiddenRightMenu()
    })
    const folderContextmenu = (index) => {
      folderContextmenuIndex.value = index
    }
    const hiddenRightMenu = () => {
      folderContextmenuIndex.value = -1
      fileContextmenuId.value = ''
    }
    const fileContextmenu = (id) => {
      fileContextmenuId.value = id
    }
    const setMenuList = (menuList) => {
      setLs('menuList', JSON.parse(JSON.stringify(menuList))).then(res => {
        store.commit("setMenuList", res)
      })
    }
    const setContractList = (contractList) => {
      setLs('contractList', JSON.parse(JSON.stringify(contractList))).then(res => {
        store.commit("setContractList", res)
      })
    }
    const folderStickyTop = async (index) => {
      let menuList = await getLs('menuList') || []
      let item = menuList.splice(index, 1)
      menuList.unshift(item[0])
      setMenuList(menuList)
    }
    const fileStickyTop = async (index, folderIndex) => {
      if (folderIndex >= 0) {
        let menuList = await getLs('menuList') || []
        let folderTtem = menuList[folderIndex]
        let item = folderTtem.son.splice(index, 1)
        folderTtem.son.unshift(item[0])
        menuList[folderIndex] = folderTtem
        openFolderIndex.value = folderIndex
        setMenuList(menuList)
      } else {
        let contractList = await getLs('contractList') || []
        let item = contractList.splice(index, 1)
        contractList.unshift(item[0])
        setContractList(contractList)
      }
    }
    const edit = (contarct, index, folderIndex) => {
      let { abi, address, chain, createAt, id, name } = contarct
      let chainId = chain.chainId
      abi = JSON.stringify(abi)
      let formData = {abi, address, chainId, createAt, id, name}
      createContract.value.formData = formData
      if (folderIndex >= 0) {
        createContract.value.setFolderIndex(folderIndex)
      }
      createContract.value.show()
    }
    const delFile = async (index, folderIndex) => {
      let openSols = await getLs('openSols') || []
      if (folderIndex >= 0) {
        let menuList = await getLs('menuList') || []
        let folderTtem = menuList[folderIndex]
        let id = folderTtem.son[index].id
        openSols = openSols.filter(e => e.name != id)
        folderTtem.son.splice(index, 1)
        menuList[folderIndex] = folderTtem
        openFolderIndex.value = folderIndex
        setMenuList(menuList)
      } else {
        let contractList = await getLs('contractList') || []
        let id = contractList[index].id
        openSols = openSols.filter(e => e.name != id)
        contractList.splice(index, 1)
        setContractList(contractList)
        hiddenRightMenu()
      }
      setLs('openSols', JSON.parse(JSON.stringify(openSols))).then(res => {
        store.commit("setOpenSols", res)
        if (res.length) {
          setLs('activeId', res[0].name).then(rep => {
            store.commit('setActiveId', rep)
          })
        }
      })
    }
    const delFolder = async (index) => {
      let menuList = await getLs('menuList') || []
      menuList.splice(index, 1)
      setMenuList(menuList)
      hiddenRightMenu()
    }
    const openFile = async (file) => {
      console.log(file)
      let openSols = await getLs('openSols') || []
      if (openSols.some(e => e.name == file.id)) {
        setLs('activeId', file.id).then(rep => {
          store.commit('setActiveId', rep)
        })
      } else {
        let item = {
          name: file.id,
          title: file.name,
          content: file,
          result: []
        }
        openSols.push(item)
        setLs('openSols', JSON.parse(JSON.stringify(openSols))).then(res => {
          store.commit("setOpenSols", res)
          setLs('activeId', file.id).then(rep => {
            store.commit('setActiveId', rep)
          })
        })
      }
    }
    watch(menuList, (val) => {
      if (val && openFolderIndex.value >= 0) {
        menuList.value[openFolderIndex.value].open = true
      }
    })
    return {
      activeId,
      openFolderIndex,
      menuList,
      addFolder,
      createContract,
      folderContextmenuIndex,
      fileContextmenuId,
      contractList,
      showAddFolder,
      folderContextmenu,
      hiddenRightMenu,
      fileContextmenu,
      showCreateContract,
      showRename,
      folderStickyTop,
      fileStickyTop,
      edit,
      delFolder,
      delFile,
      openFile
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  width: 248px;
  height: 100vh;
  background: #15141B;
  padding: 24px;
  box-sizing: border-box;
  border-right: 1px solid rgba(133, 141, 153, 0.1);
  .logo {
    img {
      width: 142px;
      height: auto;
    }
  }
  .switch {
    margin-top: 28px;
    width: 200px;
    height: 40px;
    background: #0A0A0C;
    box-sizing: border-box;
    border: 1px solid rgba(133, 141, 153, 0.1);
    border-radius: 10px;
    .switch-item {
      width: 98px;
      height: 36px;
      border-radius: 8px;
      font-family: 'Montserrat-Medium';
      font-size: 12px;
      line-height: 15px;
      text-transform: capitalize;
      box-sizing: border-box;
      color: #858D99;
      cursor: pointer;
      &.switch-item-activated {
        background: rgba(133, 141, 153, 0.2);
        border: 1px solid #0A0A0C;
        color: #FFFFFF;
      }
    }
  }
  .add {
    font-size: 0;
    margin-top: 16px;
    .add-contract {
      padding: 0 16px 0 12px;
      width: 139px;
      height: 38px;
      background: #375CFF;
      border-radius: 10px;
      box-sizing: border-box;
      cursor: pointer;
      img {
        width: 18px;
        height: 18px;
      }
      span {
        margin-left: 12px;
        font-weight: 400;
        font-size: 12px;
        line-height: 15px;
        text-transform: capitalize;
        color: #FFFFFF;
      }
    }
    .add-flie {
      margin-right: 2px;
      cursor: pointer;
    }
  }
  .contract {
    margin-top: 25px;
    .contract-title {
      font-weight: 500;
      font-size: 12px;
      line-height: 18px;
      text-transform: capitalize;
      color: #858D99;
    }
    .folder-list {
      margin-top: 14px;
      .folder-item {
        cursor: pointer;
        min-height: 30px;
        .folder-item-main {
          position: relative;
          padding: 0 12px;
          box-sizing: border-box;
          &:hover {
            background: rgba(133, 141, 153, 0.1);
            border-radius: 4px;
          }
        }
        img {
          width: 18px;
          height: 18px;
          transition: all .3s;
        }
        span {
          font-size: 12px;
          line-height: 18px;
          color: #FFFFFF;
          margin: 0 12px;
          flex: 1;
          font-family: 'Montserrat-Medium';
          white-space: nowrap;
          span {
            color: #858D99;
            margin: 0;
          }
        }
        .folder-file {
          transition: all .3s;
          // overflow: hidden;
          height: auto;
          padding: 0 12px;
          box-sizing: border-box;
        }
        &.folder-item-activated {
          .arrow {
            transform: rotate(180deg);
          }
        }
      }
      .file-item {
        padding: 0;
      }
    }
    .file-item-w {
      position: relative;
    }
    .file-item {
      height: 30px;
      cursor: pointer;
      padding: 0 12px;
      box-sizing: border-box;
      &:hover {
        background: rgba(133, 141, 153, 0.1);
        border-radius: 4px;
      }
      .file-arrow {
        margin-right: 2px;
        path {
          stroke: #FFFFFF;
        }
      }
      .file-icon {
        margin-right: 12px;
        path {
          stroke: #FFFFFF;
        }
      }
      span {
        font-weight: 400;
        font-size: 12px;
        line-height: 18px;
        color: #FFFFFF;
        margin: 0 !important;
      }
      &.file-item-activated {
        .file-arrow {
          path {
            stroke: #4063FF;
          }
        }
        .file-icon {
          margin-right: 12px;
          path {
            stroke: #4063FF;
          }
        }
        span {
          color: #4063FF;
          font-family: 'Montserrat-Medium';
        }
      }
    }
    .right-menu {
      position: absolute;
      width: 200px;
      background: rgba(27, 26, 34, 0.9);
      border: 1px solid rgba(133, 141, 153, 0.1);
      box-shadow: 0px 12px 30px rgba(10, 10, 12, 0.3);
      backdrop-filter: blur(10px);
      border-radius: 6px;
      top: 38px;
      left: 0;
      right: 0;
      padding: 4px 0;
      box-sizing: border-box;
      z-index: 9;
      .right-menu-item {
        cursor: pointer;
        width: 192px;
        height: 30px;
        margin: auto;
        padding: 12px;
        box-sizing: border-box;
        font-family: 'Montserrat-Medium';
        font-size: 13px;
        line-height: 16px;
        text-transform: capitalize;
        color: #FFFFFF;
        &:hover {
          background: rgba(133, 141, 153, 0.15);
          border-radius: 4px;
        }
        img {
          margin-right: 8px;
        }
      }
    }
  }
}
.popconfirm-msg {
  width: 200px;
  line-height: 1.6;
}
</style>
