<template>
  <div class="content flex-start">
    <div class="logo">
      <img src="@/assets/images/logo.svg" alt="">
    </div>
    <div class="add flex-center-sb">
      <div class="add-contract flex-center" @click="showCreateContract">
        <img src="@/assets/images/add_file.svg" alt="">
        <span>add contract</span>
      </div>
      <div class="add-flie" @click="showAddFolder">
        <img src="@/assets/images/add_folder.svg" alt="">
      </div>
    </div>
    <div class="input-group flex-center">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z" stroke="#858D99" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12.75 12.75L15.75 15.75" stroke="#858D99" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <input class="form-input" v-model="searchValue" placeholder="search contract" />
    </div>
    <div class="contract-title flex-center-sb">contract
      <div class="flex-center" @click="setIsFilter" :style="{color: isFilter == 'filter' ? '#4063FF' : '#858D99', cursor: 'pointer'}">
        sort by chain
        <svg t="1681896782615" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2813" width="18" height="18"><path d="M428.194 453.735V730.85h-60V473.591L232.996 291.696c-18.687-29.315-10.337-67.025 18.071-85.134a61 61 0 0 1 32.79-9.562h390.689c33.689 0 61 27.31 61 61a61 61 0 0 1-7.727 29.714l-121.618 185.26v354.83h-60V455.027l129.33-196.853c0.01-0.484-130.549-0.876-391.675-1.174-0.605 0.262 47.508 65.84 144.338 196.735zM660.333 478h110c16.568 0 30 13.431 30 30 0 16.569-13.432 30-30 30h-110c-16.569 0-30-13.431-30-30 0-16.569 13.431-30 30-30z m0 115h110c16.568 0 30 13.431 30 30 0 16.569-13.432 30-30 30h-110c-16.569 0-30-13.431-30-30 0-16.569 13.431-30 30-30z m0 105h110c16.568 0 30 13.431 30 30 0 16.569-13.432 30-30 30h-110c-16.569 0-30-13.431-30-30 0-16.569 13.431-30 30-30z" :fill="isFilter == 'filter' ? '#4063FF' : '#858D99'" p-id="2814"></path></svg>
      </div>
    </div>
    <div 
      class="contract" 
      group-name="cols"
    >
      <div class="folder-list" @mousedown="mousedown" @mouseup="mouseup">
        <div v-for="(item, index) in getMenuList()" :key="index" :class="['folder-item', item.open ? 'folder-item-activated' : '']" @contextmenu.prevent="folderContextmenu(index)" @mouseover="mouseover(index)" @mouseout="mouseout">
          <div class="flex-center folder-item-main" style="height: 30px" @click="openFolder(item)">
            <img v-if="item.open" src="@/assets/images/folder_open.svg" alt="">
            <img v-else src="@/assets/images/folder.svg" alt="">
            <span>{{item.name}}<span>({{item.son.length}})</span></span>
            <img src="@/assets/images/arrow.svg" alt="" class="arrow" >
            <div v-if="folderContextmenuIndex == index && isFilter == 'none' && !searchValue" class="right-menu">
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
          <Container class="folder-file" v-show="item.open" group-name="col-items" @drop="(e) => onDrop(index, e)">
            <Draggable class="file-item-w" v-for="(file, i) in item.son" :key="file.id" @contextmenu.prevent.stop="fileContextmenu(file.id)">
              <div :class="['file-item', 'flex-center', activeId == file.id ? 'file-item-activated' : '']" @click="openFile(file)">
                <svg width="16" height="18" class="file-arrow" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 0V5.2C9 6.88016 9 7.72024 9.32698 8.36197C9.6146 8.92646 10.0735 9.3854 10.638 9.67302C11.2798 10 12.1198 10 13.8 10H16" stroke-width="1.5"/>
                </svg>
                <svg width="18" height="18" class="file-icon" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.5 15.75H4.5C4.08579 15.75 3.75 15.4142 3.75 15L3.75 3C3.75 2.58579 4.08579 2.25 4.5 2.25L10.1723 2.25C10.3812 2.25 10.5807 2.33715 10.7226 2.49044L14.0503 6.08435C14.1787 6.22298 14.25 6.40496 14.25 6.5939L14.25 15C14.25 15.4142 13.9142 15.75 13.5 15.75Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M14.25 6.75L10.5 6.75C10.0858 6.75 9.75 6.41421 9.75 6L9.75 2.25" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p class="file-name flex-center">{{file.name}} <span :style="{background: getColor(file.chain.chainId)}">{{getChainName(file.chain)}}</span></p>
              </div>
              <div class="right-menu" v-if="file.id == fileContextmenuId && isFilter == 'none' && !searchValue">
                <div class="right-menu-item flex-center" @click="fileStickyTop(i, index)"><img src="@/assets/images/top.svg" alt="">Sticky Top</div>
                <div class="right-menu-item flex-center" v-if="!file.isImport" @click="edit(file, i, index)"><img src="@/assets/images/edit.svg" alt="">Edit</div>
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
            </Draggable>
          </Container>
        </div>
      </div>
      <div class="file-list" @mousedown="mousedown" @mouseup="mouseup">
        <Container orientation="vertical" @drop="(e) => onDrop(-1, e)" group-name="col-items">
          <Draggable v-for="(file, index) in getContractList()" :key="file.id" class="file-item-w list-group-item" @contextmenu.prevent.stop="fileContextmenu(file.id)">
            <div :class="['file-item', 'flex-center', activeId == file.id ? 'file-item-activated' : '']" @click="openFile(file)">
              <svg width="18" height="18" class="file-icon" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 15.75H4.5C4.08579 15.75 3.75 15.4142 3.75 15L3.75 3C3.75 2.58579 4.08579 2.25 4.5 2.25L10.1723 2.25C10.3812 2.25 10.5807 2.33715 10.7226 2.49044L14.0503 6.08435C14.1787 6.22298 14.25 6.40496 14.25 6.5939L14.25 15C14.25 15.4142 13.9142 15.75 13.5 15.75Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14.25 6.75L10.5 6.75C10.0858 6.75 9.75 6.41421 9.75 6L9.75 2.25" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <p class="file-name flex-center">{{file.name}} <span :style="{background: getColor(file.chain.chainId)}">{{getChainName(file.chain)}}</span></p>
            </div>
            <div class="right-menu" v-if="file.id == fileContextmenuId && isFilter == 'none' && !searchValue">
              <div class="right-menu-item flex-center" @click="fileStickyTop(index)"><img src="@/assets/images/top.svg" alt="">Sticky Top</div>
              <div class="right-menu-item flex-center" v-if="!file.isImport" @click="edit(file, index)"><img src="@/assets/images/edit.svg" alt="">Edit</div>
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
          </Draggable>
        </Container>
      </div>
    </div>
    <div class="group flex-center-center">
      <n-image
        width="200"
        object-fit="cover"
        :src="imgUrl"
        :preview-src="previewSrc"
      />
    </div>
    <div class="icon-list flex-center">
      <div class="github">
        <a href="https://github.com/DappReader/DappReader-v2" target="_blank" rel="noopener noreferrer">
          <svg t="1681979538137" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2618" width="18" height="18"><path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9 23.5 23.2 38.1 55.4 38.1 91v112.5c0.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z" p-id="2619" fill="#ffffff"></path></svg>
        </a>
      </div>
      <div class="twitter">
        <a href="https://twitter.com/dappreader" target="_blank" rel="noopener noreferrer" class="flex-center">
          <svg t="1681979732323" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3694" width="18" height="18"><path d="M1023.807 194.821c-37.698 16.261-78.594 27.943-120.871 32.459 43.547-25.956 76.665-66.847 92.268-115.568-40.29 24.028-85.76 41.555-133.157 50.649-38.304-40.955-92.864-66.248-153.267-66.248-116.297 0-209.824 94.191-209.824 209.76 0 16.262 1.987 32.518 5.18 48.121-174.108-9.037-329.361-92.205-432.648-219.578-18.186 31.138-28.608 66.908-28.608 105.933 0 72.75 37.038 137.01 93.527 174.708-34.383-1.322-66.907-11.077-94.851-26.616v2.588c0 101.899 72.086 186.395 168.264 205.907-17.527 4.517-36.376 7.104-55.225 7.104-13.61 0-26.621-1.265-39.567-3.252 26.621 83.173 103.945 143.577 196.149 145.564-72.149 56.488-162.425 89.612-260.527 89.612-17.525 0-33.787-0.6-50.649-2.528 92.926 59.74 203.316 94.191 322.258 94.191 385.856 0 597.002-319.607 597.002-596.943 0-9.153 0-18.184-0.606-27.339 40.833-29.872 76.549-66.969 105.152-108.524z" fill="#ffffff" p-id="3695"></path></svg>
          @dappreader
        </a>
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
import group from '../assets/images/group.png'
import groupQrCode from '../assets/images/groupQRCode.png'
import { Container, Draggable } from "vue3-smooth-dnd"
import { chains, chainNickNames } from '../libs/chains'
export default {
  name: '',
  components: {
    AddFolder,
    CreateContract,
    Container,
    Draggable
  },
  setup() {
    let timeout = null
    let isMousedown = false
    let moveData = null
    let dropIndex = -2
    let dropAddIndex = -2
    const store = useStore()
    const isFilter = ref(localStorage.getItem('isFilter') || 'none')
    const addFolder = ref(null)
    const createContract = ref(null)
    const fileContextmenuId = ref('')
    const searchValue = ref('')
    const openName = ref('')
    const folderContextmenuIndex = ref(-1)
    const openFolderIndex = ref(-1)
    const activeId = computed(() => {
      return store.state.activeId
    })
    const menuList = computed(() => {
      return store.state.menuList
    })
    const contractList = computed(() => {
      return store.state.contractList || []
    })
    const openFolder = (item) => {
      item.open = !item.open
      if (item.name == openName.value) {
        openName.value = ''
      } else {
        openName.value = item.name
      }
      openFolderIndex.value = -1
    }
    const setIsFilter = () => {
      openName.value = ''
      isFilter.value = isFilter.value == 'none' ? 'filter' : 'none'
      localStorage.setItem('isFilter', isFilter.value)
    }
    const showAddFolder = () => {
      addFolder.value.show()
    }
    const showCreateContract = (index) => {
      if (index >= 0) {
        openFolderIndex.value = index
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
    const edit = (contract, index, folderIndex) => {
      console.log(contract)
      let { abi, address, chain, createAt, id, name, token, authorAddress, versionNumber = 1, userList } = contract
      let chainId = chain.chainId
      abi = JSON.stringify(abi)
      let formData = {abi, address, chainId, createAt, id, name, token, authorAddress, versionNumber, userList}
      createContract.value.formData = formData
      if (folderIndex >= 0) {
        createContract.value.setFolderIndex(folderIndex)
      }
      createContract.value.show()
    }
    const delFile = async (index, folderIndex) => {
      let id
      let results = await getLs('results') || {}
      if (folderIndex >= 0) {
        let menuList = await getLs('menuList') || []
        let folderTtem = menuList[folderIndex]
        id = folderTtem.son[index].id
        folderTtem.son.splice(index, 1)
        menuList[folderIndex] = folderTtem
        openFolderIndex.value = folderIndex
        setMenuList(menuList)
      } else {
        let contractList = await getLs('contractList') || []
        id = contractList[index].id
        contractList.splice(index, 1)
        setContractList(contractList)
        hiddenRightMenu()
      }
      if (id == activeId.value) {
        setLs('activeId', '').then(() => {
          store.commit('setActiveId', '')
        })
      }
      if (results[id]) {
        delete results[id]
        setLs('results', JSON.parse(JSON.stringify(results))).then(res => {
          console.log(res)
          store.commit("setResults", res)
        })
      }
    }
    const delFolder = async (index) => {
      let menuList = await getLs('menuList') || []
      let results = await getLs('results') || {}
      let folderTtem = menuList[index]
      folderTtem.son.forEach(e => {
        if (e.id == activeId.value) {
          setLs('activeId', '').then(() => {
            store.commit('setActiveId', '')
          })
        }
        if (results[e.id]) {
          delete results[e.id]
        }
      })
      setLs('results', JSON.parse(JSON.stringify(results))).then(res => {
        console.log(res)
        store.commit("setResults", res)
      })
      menuList.splice(index, 1)
      setMenuList(menuList)
      hiddenRightMenu()
    }
    const openFile = async (file) => {
      setLs('activeId', file.id).then(rep => {
        store.commit('setActiveId', rep)
      })
    }
    const onDrop = (index, dragResult) => {
      console.log(index, dragResult)
      let menuListData = menuList.value
      let contractListData = contractList.value
      const { removedIndex, addedIndex } = dragResult
      if (removedIndex !== null || addedIndex !== null) {
        if (index == -1) {
          if (addedIndex !== null) {
            dropAddIndex = addedIndex
            dropIndex = index
          }
          if (removedIndex !== null) {
            moveData = contractListData.splice(removedIndex, 1)[0]
          }
          if (moveData && dropAddIndex > -1) {
            if (dropIndex == -1) {
              contractListData.splice(dropAddIndex, 0, moveData)
            } else {
              menuListData[dropIndex].son.splice(dropAddIndex, 0, moveData)
              setMenuList(menuListData)
            }
            moveData = null
            dropAddIndex = -2
            dropIndex = -2
          }
          setContractList(contractListData)
        } else {
          if (addedIndex !== null) {
            dropAddIndex = addedIndex
            dropIndex = index
          }
          if (removedIndex !== null) {
            moveData = menuListData[index].son.splice(removedIndex, 1)[0]
          }
          if (moveData && dropAddIndex > -1) {
            if (dropIndex == -1) {
              contractListData.splice(dropAddIndex, 0, moveData)
              setContractList(contractListData)
            } else {
              menuListData[dropIndex].son.splice(dropAddIndex, 0, moveData)
            }
            moveData = null
            dropAddIndex = -2
            dropIndex = -2
          }
          setMenuList(menuListData)
        }
      }
    }
    const mousedown = () => {
      isMousedown = true
    }
    const mouseup = () => {
      isMousedown = false
    }
    const mouseover = (index) => {
      if (isMousedown) {
        timeout = setTimeout(() => {
          menuList.value[index].open = true
        }, 400)
      }
    }
    const mouseout = () => {
      clearTimeout(timeout)
    }
    const getMenuList = () => {
      if ((!contractList.value.length && !menuList.value.length) || searchValue.value) {
        return []
      }
      let list = menuList.value
      console.log(list)
      if (isFilter.value == 'filter') {
        let arr = []
        list.forEach(e => {
          let son = e.son
          if (son.length > 0) {
            arr.push(...son)
          }
        })
        arr.push(...contractList.value)
        let newArr = []
        console.log(arr)
        arr.forEach(e => {
          let chain = e.chain
          let name = chain?.name || chain?.chainName || '未知'
          try {
            name = getChainName(chain)
          } catch (error) {
            console.error(error)
          }
          let index = newArr.findIndex(el => el.name == name)
          if (index > -1) {
            newArr[index].son.push(e)
          } else {
            newArr.push({
              name,
              open: openName.value == name ? true : false,
              son: [e]
            })
          }
        })
        list = newArr
      }
      return list
    }
    const getContractList = () => {
      let list = contractList.value
      if (isFilter.value == 'filter') {
        list = []
      }
      if (searchValue.value) {
        console.log(searchValue.value)
        let arr = []
        menuList.value.forEach(e => {
          let son = e.son
          if (son.length > 0) {
            arr.push(...son)
          }
        })
        arr.push(...contractList.value)
        // filter name 包含 searchValue.value
        let newArr = []
        arr.forEach(e => {
          let name = e.name
          if (name.indexOf(searchValue.value) > -1) {
            newArr.push(e)
          }
        })
        list = newArr
      }
      return list
    }
    const getColor = (chainId) => {
      let color = '#2C2D34'
      let chain = chains.find(e => e.chainId == chainId)
      if (chain && chain.explorers && chain.explorers[0]?.color) {
        color = chain.explorers[0]?.color
      }
      return color
    }
    const getChainName = (chain) => {
      let id = chain.chainId
      let name = chains.filter(e => e.chainId == id)[0]?.name
      chainNickNames.forEach(e => {
        let arr = e.split(',')
        if (arr[0] == name) {
          name = arr[1]
        }
      })
      return name
    }
    watch(menuList, (val) => {
      if (val && openFolderIndex.value >= 0) {
        menuList.value[openFolderIndex.value].open = true
      }
    })
    return {
      searchValue,
      openName,
      isFilter,
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
      openFile,
      imgUrl: ref(group),
      previewSrc: ref(groupQrCode),
      onDrop,
      mousedown,
      mouseup,
      mouseover,
      mouseout,
      getColor,
      getMenuList,
      getContractList,
      setIsFilter,
      openFolder,
      getChainName
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  width: 248px;
  height: 100vh;
  background: #23242A;
  padding: 24px 0 10px 0;
  box-sizing: border-box;
  border-right: 1px solid rgba(133, 141, 153, 0.1);
  flex-direction: column;
  position: relative;
  .logo {
    padding: 0 20px;
    box-sizing: border-box;
    img {
      width: 142px;
      height: auto;
    }
  }
  .switch {
    margin-top: 28px;
    width: 200px;
    height: 40px;
    background: #17171A;
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
        border: 1px solid #17171A;
        color: #FFFFFF;
      }
    }
  }
  .add {
    font-size: 0;
    margin-top: 16px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
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
  .contract-title {
    width: 100%;
    margin-top: 20px;
    font-weight: 500;
    font-size: 12px;
    line-height: 18px;
    text-transform: capitalize;
    color: #858D99;
    padding: 0 20px;
    box-sizing: border-box;
    svg {
      user-select: none;
      cursor: pointer;
    }
  }
  .contract {
    flex: 1;
    width: 100%;
    padding-top: 10px;
    box-sizing: border-box;
    overflow-y: auto;
    position: relative;
    overflow-x: hidden;
    padding-bottom: 24px;
    &::-webkit-scrollbar {
      display: none;
    }
    .folder-list {
      .folder-item {
        cursor: pointer;
        min-height: 30px;
        .folder-item-main {
          position: relative;
          padding: 0 20px;
          box-sizing: border-box;
          width: 100%;
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
          // padding: 0 12px;
          box-sizing: border-box;
        }
        &.folder-item-activated {
          .arrow {
            transform: rotate(180deg);
          }
        }
      }
      .file-item {
        // padding: 0;
      }
    }
    .file-item-w {
      position: relative;
    }
    .file-item {
      height: 30px;
      cursor: pointer;
      padding: 0 20px;
      box-sizing: border-box;
      // margin-left: -12px;
      width: 100%;
      
      svg {
        flex: 0 0 18px;
      }
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
      .file-name {
        font-weight: 400;
        font-size: 12px;
        line-height: 18px;
        color: #FFFFFF;
        margin: 0 !important;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        span {
          margin-left: 4px;
          font-weight: 400;
          font-size: 12px;
          line-height: 16px;
          color: #FFFFFF;
          padding: 4px 5px;
          box-sizing: border-box;
          background: #2C2D34;
          border-radius: 6px;
          transform: scale(0.7);
          display: inline-block;
          transform-origin: 0 50% 0;
          flex: 0;
        }
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
        .file-name {
          color: #4063FF;
          font-family: 'Montserrat-Medium';
        }
      }
    }
    .right-menu {
      position: absolute;
      width: 198px;
      background: rgba(27, 26, 34, 0.9);
      border: 1px solid rgba(133, 141, 153, 0.1);
      box-shadow: 0px 12px 30px rgba(10, 10, 12, 0.3);
      backdrop-filter: blur(10px);
      border-radius: 6px;
      top: 38px;
      left: 20px;
      right: 0;
      padding: 4px 0;
      box-sizing: border-box;
      z-index: 999;
      .right-menu-item {
        cursor: pointer;
        width: 192px;
        height: 30px;
        margin: auto;
        padding: 12px;
        box-sizing: border-box;
        font-family: 'Montserrat-Medium';
        font-size: 12px;
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
.group {
  width: 100%;
  padding-top: 12px;
  border-top: 1px solid rgba(133, 141, 153, 0.15);
  z-index: 99;
  img {
    width: 200px;
    height: auto;
    border-radius: 6px;
  }
}
.input-group {
  overflow: hidden;
  padding-right: 1px;
  background: #1C1C20;
  border: 1px solid rgba(133, 141, 153, 0.15);
  border-radius: 10px;
  padding: 0 12px;
  box-sizing: border-box;
  margin: auto;
  margin-top: 16px;
  width: 200px;
  height: 38px;
  svg {
    flex: 0 0 18px;
  }
  .form-input {
    margin-top: 0;
    height: 34px;
    flex: 1;
    border-radius: 0;
    outline: none;
    font-size: 14px;
    padding: 0 0 0 12px;
    color: #FFFFFF;
    width: 158px;
    box-sizing: border-box;
    background: none !important;
    border: none !important;
  }
}
.icon-list {
  width: 100%;
  margin-top: 12px;
  padding: 0 20px;
  box-sizing: border-box;
  font-size: 12px;
  color: #FFFFFF;
  .icon {
    font-size: 24px;
    height: 24px;
    margin-right: 4px;
  }
  .twitter {
    margin-left: 12px;
  }
}
</style>
<style>
.smooth-dnd-container.vertical > .smooth-dnd-draggable-wrapper {
  overflow: visible !important;
}
</style>