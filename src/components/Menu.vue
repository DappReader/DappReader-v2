<template>
  <div class="content flex-start menu" :style="{width: `${menuWidth}px`}">
    <div class="logo">
      <img src="../assets/images/logo.svg" alt="">
    </div>
    <div class="add flex-center-sb">
      <div class="add-contract flex-center" @click="showCreateContract">
        <img src="../assets/images/add_file.svg" alt="">
        <span>add contract</span>
      </div>
      <div class="add-flie" @click="showAddFolder">
        <img src="../assets/images/add_folder.svg" alt="">
      </div>
    </div>
    <div class="add" style="margin-top: 0">
      <div class="input-group flex-center">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z" stroke="#858D99" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12.75 12.75L15.75 15.75" stroke="#858D99" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <input class="form-input" v-model="searchValue" placeholder="search contract" />
      </div>
    </div>
    <div class="contract-title flex-center-sb">contract
      <div class="flex-center">
        <div class="flex-center icon-w icon-w-1" @click="setIsFilter" :style="{background: isFilter == 'filter' ? '#375CFF' : '#2c2d34'}">
          <svg t="1681896782615" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2813" width="18" height="18"><path d="M428.194 453.735V730.85h-60V473.591L232.996 291.696c-18.687-29.315-10.337-67.025 18.071-85.134a61 61 0 0 1 32.79-9.562h390.689c33.689 0 61 27.31 61 61a61 61 0 0 1-7.727 29.714l-121.618 185.26v354.83h-60V455.027l129.33-196.853c0.01-0.484-130.549-0.876-391.675-1.174-0.605 0.262 47.508 65.84 144.338 196.735zM660.333 478h110c16.568 0 30 13.431 30 30 0 16.569-13.432 30-30 30h-110c-16.569 0-30-13.431-30-30 0-16.569 13.431-30 30-30z m0 115h110c16.568 0 30 13.431 30 30 0 16.569-13.432 30-30 30h-110c-16.569 0-30-13.431-30-30 0-16.569 13.431-30 30-30z m0 105h110c16.568 0 30 13.431 30 30 0 16.569-13.432 30-30 30h-110c-16.569 0-30-13.431-30-30 0-16.569 13.431-30 30-30z" :fill="isFilter == 'filter' ? '#ffffff' : '#858D99'" p-id="2814"></path></svg>
          <span>sort by chain</span>
        </div>
        <div class="flex-center icon-w" @click="setIsShowName" :style="{background: isShowName == 'show' ? '#375CFF' : '#2c2d34'}">
          <svg t="1681999689846" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2166" width="18" height="18"><path d="M512 230.4c199.8848 0 373.0176 114.5344 457.344 281.5744C885.0432 679.04 711.8848 793.6 512 793.6c-199.8848 0-373.0176-114.5344-457.344-281.5744C138.9568 344.96 312.1152 230.4 512 230.4z m0 76.8a434.8928 434.8928 0 0 0-366.464 200.3456l-2.816 4.48 2.816 4.48a434.944 434.944 0 0 0 357.248 200.192L512 716.8c150.6816 0 287.488-77.2096 366.464-200.3456l2.816-4.48-2.816-4.48a434.944 434.944 0 0 0-357.248-200.192L512 307.2z m0 38.4a166.4 166.4 0 1 1 0 332.8 166.4 166.4 0 0 1 0-332.8z m0 76.8a89.6 89.6 0 1 0 0 179.2 89.6 89.6 0 0 0 0-179.2z" p-id="2167" :fill="isShowName == 'show' ? '#ffffff' : '#858D99'"></path></svg>
          <span>show chain name</span>
        </div>
      </div>
    </div>
    <div class="contract">
      <n-tree
        draggable
        block-line
        expand-on-click
        :pattern="searchValue"
        :filter="searchFilter"
        :show-irrelevant-nodes="false"
        key-field="id"
        label-field="name"
        :data="getMenuData()"
        :selected-keys="[activeId]"
        :node-props="nodeProps"
        @update:expanded-keys="updatePrefixWithExpaned"
        @drop="handleDrop"
        @update:checked-keys="handleCheckedKeysChange"
      />
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
        <a href="https://github.com/DappReader/DappReader-v2" target="_blank" rel="noopener noreferrer" class="flex-center">
          <svg t="1681979538137" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2618" width="18" height="18"><path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9 23.5 23.2 38.1 55.4 38.1 91v112.5c0.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z" p-id="2619" fill="#ffffff"></path></svg>
        </a>
      </div>
      <div class="discord">
        <a href="https://discord.gg/U3GAGeGZJE" target="_blank" rel="noopener noreferrer" class="flex-center">
          <svg t="1688196632138" class="icon" viewBox="0 0 1280 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3519" width="18" height="18"><path d="M1049.062 139.672a3 3 0 0 0-1.528-1.4A970.13 970.13 0 0 0 808.162 64.06a3.632 3.632 0 0 0-3.846 1.82 674.922 674.922 0 0 0-29.8 61.2 895.696 895.696 0 0 0-268.852 0 619.082 619.082 0 0 0-30.27-61.2 3.78 3.78 0 0 0-3.848-1.82 967.378 967.378 0 0 0-239.376 74.214 3.424 3.424 0 0 0-1.576 1.352C78.136 367.302 36.372 589.38 56.86 808.708a4.032 4.032 0 0 0 1.53 2.75 975.332 975.332 0 0 0 293.65 148.378 3.8 3.8 0 0 0 4.126-1.352A696.4 696.4 0 0 0 416.24 860.8a3.72 3.72 0 0 0-2.038-5.176 642.346 642.346 0 0 1-91.736-43.706 3.77 3.77 0 0 1-0.37-6.252 502.094 502.094 0 0 0 18.218-14.274 3.638 3.638 0 0 1 3.8-0.512c192.458 87.834 400.82 87.834 591 0a3.624 3.624 0 0 1 3.848 0.466 469.066 469.066 0 0 0 18.264 14.32 3.768 3.768 0 0 1-0.324 6.252 602.814 602.814 0 0 1-91.78 43.66 3.75 3.75 0 0 0-2 5.222 782.11 782.11 0 0 0 60.028 97.63 3.728 3.728 0 0 0 4.126 1.4A972.096 972.096 0 0 0 1221.4 811.458a3.764 3.764 0 0 0 1.53-2.704c24.528-253.566-41.064-473.824-173.868-669.082zM444.982 675.16c-57.944 0-105.688-53.174-105.688-118.478s46.818-118.482 105.688-118.482c59.33 0 106.612 53.64 105.686 118.478 0 65.308-46.82 118.482-105.686 118.482z m390.76 0c-57.942 0-105.686-53.174-105.686-118.478s46.818-118.482 105.686-118.482c59.334 0 106.614 53.64 105.688 118.478 0 65.308-46.354 118.482-105.688 118.482z" p-id="3520" fill="#ffffff"></path></svg>
        </a>
      </div>
      <div class="twitter">
        <a href="https://twitter.com/dappreader" target="_blank" rel="noopener noreferrer" class="flex-center">
          <svg t="1681979732323" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3694" width="18" height="18"><path d="M1023.807 194.821c-37.698 16.261-78.594 27.943-120.871 32.459 43.547-25.956 76.665-66.847 92.268-115.568-40.29 24.028-85.76 41.555-133.157 50.649-38.304-40.955-92.864-66.248-153.267-66.248-116.297 0-209.824 94.191-209.824 209.76 0 16.262 1.987 32.518 5.18 48.121-174.108-9.037-329.361-92.205-432.648-219.578-18.186 31.138-28.608 66.908-28.608 105.933 0 72.75 37.038 137.01 93.527 174.708-34.383-1.322-66.907-11.077-94.851-26.616v2.588c0 101.899 72.086 186.395 168.264 205.907-17.527 4.517-36.376 7.104-55.225 7.104-13.61 0-26.621-1.265-39.567-3.252 26.621 83.173 103.945 143.577 196.149 145.564-72.149 56.488-162.425 89.612-260.527 89.612-17.525 0-33.787-0.6-50.649-2.528 92.926 59.74 203.316 94.191 322.258 94.191 385.856 0 597.002-319.607 597.002-596.943 0-9.153 0-18.184-0.606-27.339 40.833-29.872 76.549-66.969 105.152-108.524z" fill="#ffffff" p-id="3695"></path></svg>
          @dappreader
        </a>
      </div>
    </div>
    <div class="line" @mousedown="handleStartResize"></div>
    <AddFolder ref="addFolder" />
    <CreateContract ref="createContract" />
  </div>
</template>

<script lang="jsx">
import AddFolder from '../components/AddFolder.vue'
import CreateContract from '../components/CreateContract.vue'
import { ref, computed, h } from 'vue'
import { useStore } from 'vuex'
import { getLs, setLs } from '../service/service'
import group from '../assets/images/group.png'
import groupQrCode from '../assets/images/groupQRCode.png'
import { chains, chainNickNames, chainColors } from '../libs/chains'
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'
import { useDialog } from 'naive-ui'
import topIcon from '../assets/images/top.svg'
import addIcon from '../assets/images/add.svg'
import editIcon from '../assets/images/edit.svg'
import delIcon from '../assets/images/del.svg'
import folderIcon from '../assets/images/folder.svg'
import fileIcon from '../assets/images/file.svg'
import folderOpenIcon from '../assets/images/folder_open.svg'
import arrowIcon from '../assets/images/arrow.svg'
function throttle (fn, delay = 300) {
  let timer = null
  return function (...args) {
    if(timer == null){
      timer = setTimeout(() => {
        fn.call(this, ...args)
        clearTimeout(timer)
        timer = null
      }, delay);
    }
  }
}
export default {
  name: '',
  components: {
    AddFolder,
    CreateContract,
  },
  setup() {
    const store = useStore()
    const dialog = useDialog()
    const menuWidth = ref(248)
    const isFilter = ref(localStorage.getItem('isFilter') || 'none')
    const isShowName = ref(localStorage.getItem('isShowName') || 'show')
    const expandedKeys = ref([])
    const addFolder = ref(null)
    const createContract = ref(null)
    const searchValue = ref('')
    const activeId = computed(() => {
      return store.state.activeId
    })
    const menuList = computed(() => {
      return store.state.menuList
    })
    const contractList = computed(() => {
      return store.state.contractList || []
    })
    const searchFilter = (pattern, treeOption) => {
      let r = false
      if (pattern) {
        r = (treeOption.name.toLowerCase().indexOf(pattern.toLowerCase()) > -1) || (treeOption.address.toLowerCase().indexOf(pattern.toLowerCase()) > -1)
      }
      return r
    }
    const setIsFilter = () => {
      isFilter.value = isFilter.value == 'none' ? 'filter' : 'none'
      localStorage.setItem('isFilter', isFilter.value)
    }
    const setIsShowName = () => {
      isShowName.value = isShowName.value == 'none' ? 'show' : 'none'
      localStorage.setItem('isShowName', isShowName.value)
    }
    const showAddFolder = () => {
      addFolder.value.show()
    }
    const showCreateContract = (index) => {
      if (index >= 0) {
        createContract.value.setFolderIndex(index)
      }
      createContract.value.show()
    }
    const showRename = ((index, name) => {
      if (index >= 0) {
        addFolder.value.folderIndex = index
        addFolder.value.floderName = name
      }
      addFolder.value.show()
    })

    const onFileContextMenu = (e, item, i, index) => {
      e.preventDefault();
      let list = [{
        label: "Delete",
        icon: h('img', {
          src: delIcon,
          style: {
            width: '18px',
            height: '18px',
            marginRight: '8px'
          }
        }),
        onClick: () => {
          dialog.warning({
            title: 'warning',
            content: 'This operation will permanently delete the contract information, do you want to continue?',
            positiveText: 'Ok',
            negativeText: 'Cancel',
            onPositiveClick: () => {
              delFile(item)
            }
          })
        }
      }]
      if (!item.isImport) {
        list.unshift({
          label: "Edit", 
          icon: h('img', {
            src: addIcon,
            style: {
              width: '18px',
              height: '18px',
              marginRight: '8px'
            }
          }),
          onClick: () => {
            edit(item)
          }
        })
      }
      if (isFilter.value != 'filter' && !searchValue.value) {
        list.unshift({ 
          label: "Sticky Top", 
          icon: h('img', {
            src: topIcon,
            style: {
              width: '18px',
              height: '18px',
            }
          }),
          onClick: () => {
            fileStickyTop(i, index)
          }
        })
      }
      ContextMenu.showContextMenu({
        x: e.x,
        y: e.y,
        items: list
      })
    }

    const onContextMenu = (e, index, item) => {
      e.preventDefault();
      if (isFilter.value == 'filter' || searchValue.value) {
        return
      }
      ContextMenu.showContextMenu({
        x: e.x,
        y: e.y,
        items: [{ 
          label: "Sticky Top", 
          icon: h('img', {
            src: topIcon,
            style: {
              width: '18px',
              height: '18px',
              marginRight: '8px'
            }
          }),
          onClick: () => {
            folderStickyTop(index)
          }
        }, { 
          label: "Add Contract", 
          icon: h('img', {
            src: addIcon,
            style: {
              width: '18px',
              height: '18px',
              marginRight: '8px'
            }
          }),
          onClick: () => {
            showCreateContract(index)
          }
        }, {
          label: "Rename",
          icon: h('img', {
            src: editIcon,
            style: {
              width: '18px',
              height: '18px',
              marginRight: '8px'
            }
          }),
          onClick: () => {
            showRename(index, item.name)
          }
        }, {
          label: "Delete Folder",
          icon: h('img', {
            src: delIcon,
            style: {
              width: '18px',
              height: '18px',
              marginRight: '8px'
            }
          }),
          onClick: () => {
            let d = dialog.warning({
              title: 'warning',
              content: `This operation will permanently delete the folder${item.son.length ? `(with ${item.son.length} contracts)` : ''} information, do you want to continue?`,
              positiveText: 'Ok',
              negativeText: 'Cancel',
              action: () => (<div className="flex-center-center" style="font-size:12px;">
                <div className="flex-center-center" style="cursor: pointer;" onClick={() => d.destroy()}>Cancel</div>
                <div className="flex-center-center" style="background:#f2c97d;height:28px;padding: 0 12px;box-sizing: border-box;border-radius:4px;margin-left:12px;color:#000;cursor: pointer;" onClick={() => {delFolder(index, 'folder');d.destroy()}}>Keep contracts</div>
                <div className="flex-center-center" style="background:#e88080;height:28px;padding: 0 12px;box-sizing: border-box;border-radius:4px;margin-left:12px;cursor: pointer;" onClick={() => {delFolder(index);d.destroy()}}>Delete with contracts</div>
              </div>),
            })
          }
        }]
      })
    }
    const folderStickyTop = async (index) => {
      let menuList = await getLs('menuList') || []
      let item = menuList.splice(index, 1)
      menuList.unshift(item[0])
      store.commit("setMenuList", menuList)
    }
    const fileStickyTop = async (index, folderIndex) => {
      if (folderIndex >= 0) {
        let menuList = await getLs('menuList') || []
        let folderTtem = menuList[folderIndex]
        let item = folderTtem.son.splice(index, 1)
        folderTtem.son.unshift(item[0])
        menuList[folderIndex] = folderTtem
        store.commit("setMenuList", menuList)
      } else {
        let contractList = await getLs('contractList') || []
        let item = contractList.splice(index, 1)
        contractList.unshift(item[0])
        store.commit("setContractList", contractList)
      }
    }
    const edit = (contract) => {
      let chainId = contract.chain.chainId
      let data = JSON.parse(JSON.stringify(contract))
      data.chainId = chainId
      data.abi = JSON.stringify(contract.abi)
      let formData = data
      createContract.value.formData = formData
      createContract.value.show()
    }
    const delFile = async ({id}) => {
      if (!id) return
      let results = await getLs('results') || {}
      let menuList = await getLs('menuList') || []
      let contractList = await getLs('contractList') || []
      let folderIndex = menuList.findIndex(e => e.son.findIndex(e => e.id == id) >= 0)
      if (folderIndex >= 0) {
        let folderTtem = menuList[folderIndex]
        let index = folderTtem.son.findIndex(e => e.id == id)
        folderTtem.son.splice(index, 1)
        menuList[folderIndex] = folderTtem
        store.commit("setMenuList", menuList)
      } else {
        let index = contractList.findIndex(e => e.id == id)
        contractList.splice(index, 1)
        store.commit("setContractList", contractList)
      }
      if (id == activeId.value) {
        store.commit('setActiveId', '')
      }
      if (results[id]) {
        delete results[id]
        setLs('results', JSON.parse(JSON.stringify(results))).then(res => {
          store.commit("setResults", res)
        })
      }
    }
    const delFolder = async (index, type) => {
      let menuList = await getLs('menuList') || []
      let results = await getLs('results') || {}
      let contractList = await getLs('contractList') || []
      if (type == 'folder') {
        let folderTtem = menuList[index]
        contractList.push(...folderTtem.son)
        store.commit("setContractList", contractList)
      } else {
        let folderTtem = menuList[index]
        folderTtem.son.forEach(e => {
          if (e.id == activeId.value) {
            store.commit('setActiveId', '')
          }
          if (results[e.id]) {
            delete results[e.id]
          }
        })
        setLs('results', JSON.parse(JSON.stringify(results))).then(res => {
          console.log(res)
          store.commit("setResults", res)
        })
      }
      menuList.splice(index, 1)
      store.commit("setMenuList", menuList)
    }
    const getColor = (chainId) => {
      let color = '#2C2D34'
      if (chainColors[chainId]) {
        color = chainColors[chainId]
      }
      return color
    }
    const getChainName = (chain) => {
      let id = chain.chainId
      let name = 'unknow'
      try {
        name = chains.filter(e => e.chainId == id)[0]?.name
        if (id == 56) {
          name = 'BSC'
        }
        if (id == 97) {
          name = 'BSC Testnet'
        }
      } catch (error) {
        console.error(error)
      }
      chainNickNames.forEach(e => {
        let arr = e.split(',')
        if (arr[0] == name) {
          name = arr[1]
        }
      })
      return name
    }
    const getMenuData = () => {
      let ml = JSON.parse(JSON.stringify(menuList.value))
      let cl = JSON.parse(JSON.stringify(contractList.value))
      let list = []
      cl.forEach(e => {
        e.prefix = () => h('img', {
          src: fileIcon,
          style: {
            width: '18px',
            height: '18px',
            marginRight: '4px'
          }
        })
        if (isShowName.value == 'show') {
          let chain = e.chain
          let name = chain?.name || chain?.chainName || 'unknow'
          try {
            name = getChainName(chain)
          } catch (error) {
            console.error(error)
          }
          e.suffix = () => h('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '12px',
              height: '18px',
              padding: '0 4px',
              borderRadius: '6px',
              transform: 'scale(0.7)',
              background: getColor(chain.chainId),
              transformOrigin: '100% 50% 0',
              whiteSpace: 'nowrap'
            }
          }, name)
        }
      })
      ml.forEach(e => {
        e.id = e.name
        e.prefix = () => h('img', {
          src: expandedKeys.value.indexOf(e.name) >= 0 ? folderOpenIcon : folderIcon,
          style: {
            width: '18px',
            height: '18px',
            marginRight: '4px'
          }
        });
        e.suffix = () => h('img', {
          src: arrowIcon,
          style: {
            width: '18px',
            height: '18px',
            transform: expandedKeys.value.indexOf(e.name) >= 0 ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'all 0.3s',
          }
        })

        e.son.forEach(e => {
          e.prefix = () => h('img', {
            src: fileIcon,
            style: {
              width: '18px',
              height: '18px',
              marginRight: '4px'
            }
          })
          if (isShowName.value == 'show') {
            let chain = e.chain
            let name = chain?.name || chain?.chainName || 'unknow'
            try {
              name = getChainName(chain)
            } catch (error) {
              console.error(error)
            }
            e.suffix = () => h('div', {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontSize: '12px',
                height: '18px',
                padding: '0 4px',
                borderRadius: '6px',
                transform: 'scale(0.7)',
                background: getColor(chain.chainId),
                transformOrigin: '100% 50% 0',
                whiteSpace: 'nowrap'
              }
            }, name)
          }
        })
        e.children = e.son
      })
      if (isFilter.value == 'filter') {
        let arr = []
        ml.forEach(e => {
          let son = e.son
          if (son.length > 0) {
            arr.push(...son)
          }
        })
        arr.push(...cl)
        let newArr = []
        console.log(arr)
        arr.forEach(e => {
          let chain = e.chain
          let name = chain?.name || chain?.chainName || 'unknow'
          try {
            name = getChainName(chain)
          } catch (error) {
            console.error(error)
          }
          let index = newArr.findIndex(el => el.name == name)
          console.log(index)
          if (index > -1) {
            newArr[index].children.push(e)
            newArr[index].son.push(e)
          } else {
            let item = {
              id: name,
              name,
              son: [e],
              children: [e],
              prefix: () => h('img', {
                src: expandedKeys.value.indexOf(name) >= 0 ? folderOpenIcon : folderIcon,
                style: {
                  width: '18px',
                  height: '18px',
                  marginRight: '4px'
                }
              }),
              suffix: () => h('img', {
                src: arrowIcon,
                style: {
                  width: '18px',
                  height: '18px',
                  transform: expandedKeys.value.indexOf(name) >= 0 ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'all 0.3s',
                }
              })
            }
            newArr.push(item)
          }
        })
        console.log(newArr)
        list = newArr
      } else {
        list.push(...ml, ...cl)
      }
      return list
    }
    const updatePrefixWithExpaned = (keys) => {
      expandedKeys.value = keys
    }
    const nodeProps = ({ option }) => {
      return {
        onClick() {
          let id = option.id
          console.log(id, option.son)
          if (!option.son) {
            store.commit('setActiveId', id)
          }
        },
        onContextmenu(e) {
          e.preventDefault()
          if (option.son) {
            let folderIndex = menuList.value.findIndex(e => e.name == option.name)
            onContextMenu(e, folderIndex, option)
          } else {
            let index = contractList.value.findIndex(e => e.id == option.id)
            let folderIndex = -1
            if (index == -1) {
              folderIndex = menuList.value.findIndex(e => e.son.findIndex(e => e.id == option.id) != -1)
              index = menuList.value[folderIndex].son.findIndex(e => e.id == option.id)
            }
            onFileContextMenu(e, option, index, folderIndex)
          }
        }
      }
    }
    const handleCheckedKeysChange = (checkedKeys) => {
      console.log('checkedKeys', checkedKeys)
    }
    const handleDrop = ({ node, dragNode, dropPosition }) => {
      console.log(node, dragNode, dropPosition)
      let dragNodeType = dragNode.children ? 'folder' : 'file'
      let nodeType = node.children ? 'folder' : 'file'
      let nodeName = node.name
      let dragNodeName = dragNode.name
      let ml = JSON.parse(JSON.stringify(menuList.value))
      let cl = JSON.parse(JSON.stringify(contractList.value))
      if (dragNodeType == 'folder' && nodeType == 'file' && dropPosition == 'after') {
        let index = ml.findIndex(e => e.name == dragNodeName)
        console.log(index, dragNodeName)
        ml.push(ml.splice(index, 1)[0])
        store.commit('setMenuList', ml)
      } else if (dragNodeType == 'folder' && nodeType == 'folder') {
        if (dropPosition == 'after') {
          let index = ml.findIndex(e => e.name == dragNodeName)
          let addIndex = ml.findIndex(e => e.name == nodeName)
          ml.splice(addIndex + 1, 0, ml.splice(index, 1)[0])
        } else if (dropPosition == 'before') {
          let index = ml.findIndex(e => e.name == dragNodeName)
          let addIndex = ml.findIndex(e => e.name == nodeName)
          ml.splice(addIndex, 0, ml.splice(index, 1)[0])
        } else if (dropPosition == 'inside') {
          return
        }
        store.commit('setMenuList', ml)
      } else if (dragNodeType == 'file' && nodeType == 'folder') {
        let mlIndex = -1
        let contractIndex = cl.findIndex(e => e.id == dragNode.id)
        if (contractIndex == -1) {
          ml.forEach((e, i) => {
            let index = e.son.findIndex(e => e.id == dragNode.id)
            if (index != -1) {
              contractIndex = index
              mlIndex = i
            }
          })
        }
        if (dropPosition == 'inside') {
          let folderIndex = ml.findIndex(e => e.name == nodeName)
          if (mlIndex == -1) {
            ml[folderIndex].son.unshift(cl.splice(contractIndex, 1)[0])
          } else {
            ml[folderIndex].son.unshift(ml[mlIndex].son.splice(contractIndex, 1)[0])
          }
        } else {
          if (mlIndex == -1) {
            cl.unshift(cl.splice(contractIndex, 1)[0])
          } else {
            cl.unshift(ml[mlIndex].son.splice(contractIndex, 1)[0])
          }
        }
        store.commit('setMenuList', ml)
        store.commit('setContractList', cl)
      } else if (dragNodeType == 'file' && nodeType == 'file') {
        let dIndex = cl.findIndex(e => e.id == dragNode.id)
        let addIndex = cl.findIndex(e => e.id == node.id)
        let mlIndex = -1
        let addMlIndex = -1
        if (dIndex == -1) {
          ml.forEach((e, i) => {
            let index = e.son.findIndex(e => e.id == dragNode.id)
            if (index != -1) {
              dIndex = index
              mlIndex = i
            }
          })
        }
        if (addIndex == -1) {
          ml.forEach((e, i) => {
            let index = e.son.findIndex(e => e.id == node.id)
            if (index != -1) {
              addIndex = index
              addMlIndex = i
            }
          })
        }
        if (dropPosition == 'after') {
          if (mlIndex == -1 && addMlIndex == -1) {
            cl.splice(addIndex + 1, 0, cl.splice(dIndex, 1)[0])
          } else if (mlIndex == -1 && addMlIndex > -1) {
            ml[addMlIndex].son.splice(addIndex + 1, 0, cl.splice(dIndex, 1)[0])
          } else if (mlIndex > -1 && addMlIndex == -1) {
            cl.splice(addIndex + 1, 0, ml[mlIndex].son.splice(dIndex, 1)[0])
          } else if (mlIndex > -1 && addMlIndex > -1) {
            ml[addMlIndex].son.splice(addIndex + 1, 0, ml[mlIndex].son.splice(dIndex, 1)[0])
          }
        } else if (dropPosition == 'before') {
          if (mlIndex == -1 && addMlIndex == -1) {
            cl.splice(addIndex, 0, cl.splice(dIndex, 1)[0])
          } else if (mlIndex == -1 && addMlIndex > -1) {
            ml[addMlIndex].son.splice(addIndex, 0, cl.splice(dIndex, 1)[0])
          } else if (mlIndex > -1 && addMlIndex == -1) {
            cl.splice(addIndex, 0, ml[mlIndex].son.splice(dIndex, 1)[0])
          } else if (mlIndex > -1 && addMlIndex > -1) {
            ml[addMlIndex].son.splice(addIndex, 0, ml[mlIndex].son.splice(dIndex, 1)[0])
          }
        }
        store.commit('setContractList', cl)
        store.commit('setMenuList', ml)
      } else {
        return
      }
    }
    const handleResize = (e) => {
      let endX = e.clientX
      menuWidth.value = endX
      if (menuWidth.value < 210) {
        menuWidth.value = 210
      } else if (menuWidth.value > 400) {
        menuWidth.value = 400
      }
    }
    const handleMousemove = throttle(handleResize, 100)
    const handleStartResize = () => {
      document.body.style.userSelect = 'none'
      document.addEventListener('mousemove', handleMousemove)
      document.addEventListener('mouseup', handleEndResize)
    }
    const handleEndResize = () => {
      document.body.style.userSelect = 'auto'
      document.removeEventListener('mousemove', handleMousemove)
      document.removeEventListener('mouseup', handleEndResize)
    }
    return {
      menuWidth,
      expandedKeys,
      isShowName,
      searchValue,
      isFilter,
      activeId,
      menuList,
      addFolder,
      createContract,
      contractList,
      showAddFolder,
      showCreateContract,
      showRename,
      imgUrl: ref(group),
      previewSrc: ref(groupQrCode),
      setIsFilter,
      setIsShowName,
      getMenuData,
      nodeProps,
      updatePrefixWithExpaned,
      handleCheckedKeysChange,
      handleDrop,
      getColor,
      getChainName,
      handleStartResize,
      searchFilter
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  height: 100vh;
  background: #23242A;
  padding: 24px 0 10px 0;
  box-sizing: border-box;
  border-right: 1px solid rgba(133, 141, 153, 0.1);
  flex-direction: column;
  position: relative;
  .line {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 8px;
    cursor: col-resize;
  }
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
    .icon-w {
      height: 22px;
      overflow: hidden;
      background: #2c2d34;
      border-radius: 6px;
      padding: 0 2px;
      box-sizing: border-box;
      transition: all .3s;
      cursor: pointer;
      & ~ .icon-w {
        margin-left: 6px;
      }
      svg {
        user-select: none;
        cursor: pointer;
        width: 18px;
        height: 18px;
        flex: 0 0 18px;
      }
      span {
        width: 0;
        overflow: hidden;
        transition: all .3s;
        font-size: 12px;
        transform: scale(.8);
        white-space: nowrap;
        transform-origin: 12px 50%;
      }
      &:hover {
        color: #FFFFFF;
        background: #375CFF;
        svg {
          path {
            fill: #FFFFFF;
          }
        }
        span {
          width: 100px;
          color: #FFFFFF;
          overflow: visible;
        }
      }
      &.icon-w-1 {
        &:hover {
          span {
            width: 70px;
            overflow: visible;
          }
        }
      }
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
          z-index: 2;
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
          padding-top: 30px;
          margin-top: -30px;
          height: auto;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
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
        background: rgba(54, 92, 255, .7);
        // .file-arrow {
        //   path {
        //     stroke: #4063FF;
        //   }
        // }
        // .file-icon {
        //   margin-right: 12px;
        //   path {
        //     stroke: #4063FF;
        //   }
        // }
        // .file-name {
        //   color: #4063FF;
        //   font-family: 'Montserrat-Medium';
        // }
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
  width: 100%;
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
  .github, .discord {
    margin-right: 12px;
    .icon {
      margin-right: 0;
    }
  }
}
</style>
<style>
.smooth-dnd-container.vertical > .smooth-dnd-draggable-wrapper {
  overflow: visible !important;
}
.mx-context-menu {
  width: 198px;
  background: rgba(27, 26, 34, 0.9);
  border: 1px solid rgba(133, 141, 153, 0.1);
  box-shadow: 0px 12px 30px rgba(10, 10, 12, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 6px;
  box-sizing: border-box;
}
.mx-context-menu-item {
  cursor: pointer;
  width: 192px;
  height: 30px;
  margin: auto;
  padding: 0 12px;
  box-sizing: border-box;
  font-family: 'Montserrat-Medium';
  font-size: 12px;
  line-height: 16px;
  text-transform: capitalize;
  color: #FFFFFF;
}
.mx-context-menu-item:hover {
  background: rgba(133, 141, 153, 0.1);
  border-radius: 4px;
  color: #FFFFFF;
}

/* .mx-context-menu-item .mx-icon-placeholder.preserve-width {
  display: none;
} */

.menu .n-tree-node-content {
  padding-right: 20px !important;
  padding-left: 20px !important;
  box-sizing: border-box;
}

.menu .n-tree-node-content .n-tree-node-content__text {
  font-size: 12px;
  line-height: 18px;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu .n-tree.n-tree--block-line .n-tree-node:not(.n-tree-node--disabled).n-tree-node--selected {
  background: rgba(54,92,255,.7) !important;
}

.menu .n-tree .n-tree-node-wrapper {
  padding: 0 !important;
}

.menu .n-tree .n-tree-node {
  height: 30px;
}

.menu .n-tree .n-tree-node-switcher {
  display: none !important;
}

</style>