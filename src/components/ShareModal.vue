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
    <div v-if="!token" class="modal-content">
      <n-spin :show="loading">
        <div class="hint">Permission selection</div>
        <div :class="['item', itemIndex == 1 ? 'item-activate' : '', 'flex-center']" @click="() => itemIndex = 1">
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="25" cy="25" r="25" fill="#858D99" fill-opacity="0.15"/>
            <path d="M19.167 34.333C19.167 32.4 21.7787 30.833 25.0003 30.833C28.222 30.833 30.8337 32.4 30.8337 34.333" stroke="white" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M32 27.6245C34.0602 28.1646 35.5 29.3981 35.5 30.8333" stroke="white" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18 27.6245C15.9398 28.1646 14.5 29.3981 14.5 30.8333" stroke="white" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M25 27.333C26.933 27.333 28.5 25.766 28.5 23.833C28.5 21.9 26.933 20.333 25 20.333C23.067 20.333 21.5 21.9 21.5 23.833C21.5 25.766 23.067 27.333 25 27.333Z" stroke="white" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M31.9997 22.9418C32.7157 22.3009 33.1663 21.3696 33.1663 20.333C33.1663 18.4 31.5993 16.833 29.6663 16.833C28.7699 16.833 27.9522 17.17 27.333 17.7242" stroke="white" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M17.9997 22.9418C17.2836 22.3009 16.833 21.3696 16.833 20.333C16.833 18.4 18.4 16.833 20.333 16.833C21.2294 16.833 22.0471 17.17 22.6663 17.7242" stroke="white" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div class="item-info">
            <p class="item-title">Global</p>
            <p class="item-desc">Everyone can view the current contract</p>
          </div>
        </div>
        <div :class="['item', itemIndex == 2 ? 'item-activate' : '']" @click="() => itemIndex = 2">
          <div class="flex-center">
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="25" cy="25" r="25" fill="#858D99" fill-opacity="0.15"/>
              <rect x="16.833" y="21.5" width="16.3333" height="14" rx="2.33333" stroke="#858D99" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M20.333 19.1667C20.333 16.5893 22.4223 14.5 24.9997 14.5V14.5C27.577 14.5 29.6663 16.5893 29.6663 19.1667V21.5H20.333V19.1667Z" stroke="#858D99" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="25.0003" cy="27.3333" r="2.33333" fill="#858D99"/>
              <path d="M25 27.3335V30.8335" stroke="#858D99" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div class="item-info">
              <p class="item-title">Use Password</p>
              <p class="item-desc">Anyone with the password can view the current contract</p>
            </div>
          </div>
          <div v-if="itemIndex == 2" class="input">
            <input type="text" v-model="password" placeholder="Please enter your password">
          </div>
        </div>
        <div :class="['item', itemIndex == 0 ? 'item-activate' : '']" @click="() => itemIndex = 0">
          <div class="flex-center">
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="25" cy="25" r="25" fill="#858D99" fill-opacity="0.15"/>
              <path d="M19.1667 34.3335C19.1667 32.4005 21.7784 30.8335 25 30.8335C28.2217 30.8335 30.8334 32.4005 30.8334 34.3335" stroke="#858D99" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M32 27.6245C34.0602 28.1646 35.5 29.3981 35.5 30.8333" stroke="#858D99" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M18 27.6245C15.9398 28.1646 14.5 29.3981 14.5 30.8333" stroke="#858D99" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M25 27.3335C26.933 27.3335 28.5 25.7665 28.5 23.8335C28.5 21.9005 26.933 20.3335 25 20.3335C23.067 20.3335 21.5 21.9005 21.5 23.8335C21.5 25.7665 23.067 27.3335 25 27.3335Z" stroke="#858D99" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M32 22.9423C32.716 22.3014 33.1666 21.3701 33.1666 20.3335C33.1666 18.4005 31.5996 16.8335 29.6666 16.8335C28.7702 16.8335 27.9525 17.1705 27.3333 17.7247" stroke="#858D99" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M18 22.9423C17.2839 22.3014 16.8333 21.3701 16.8333 20.3335C16.8333 18.4005 18.4003 16.8335 20.3333 16.8335C21.2297 16.8335 22.0474 17.1705 22.6666 17.7247" stroke="#858D99" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div class="item-info">
              <p class="item-title">Team</p>
              <p class="item-desc">Select the team members who can see this contract</p>
            </div>
          </div>
          <div v-if="itemIndex == 0" class="team">
            <p v-if="!teamList.length" class="item-desc">There are no team members yet. Please add.</p>
            <div v-else class="team-list">
              <div class="team-item flex-center-sb" v-for="item in teamList" :key="item.nickname">
                <div class="flex-center">
                  <div class="avatar">
                    <Avatar :avatar="item.avatar" :address="item.address" :width="32" />
                  </div>
                  <div class="info">
                    <div class="name">{{item.nickname}}</div>
                    <div class="address">{{item.address}}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="add-team-btn flex-center-center" @click="showAddTeam">
              <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 10H15.5" stroke="#375CFF" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10.5 15L10.5 5" stroke="#375CFF" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Add team members</div>
          </div>
        </div>
        <div class="btn-w">
          <div :class="['share-btn', 'flex-center-center', ((itemIndex == 0 && teamList.length) || itemIndex == 1 || (itemIndex == 2 && password)) ? 'btn-activate' : '']" @click="share">
            <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 16.75C16.2426 16.75 17.25 15.7426 17.25 14.5C17.25 13.2574 16.2426 12.25 15 12.25C13.7574 12.25 12.75 13.2574 12.75 14.5C12.75 15.7426 13.7574 16.75 15 16.75Z" stroke="white" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8.25 11.125L12.75 13.375" stroke="white" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 12.25C7.24264 12.25 8.25 11.2426 8.25 10C8.25 8.75736 7.24264 7.75 6 7.75C4.75736 7.75 3.75 8.75736 3.75 10C3.75 11.2426 4.75736 12.25 6 12.25Z" stroke="white" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12.75 6.625L8.25 8.875" stroke="white" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15 7.75C16.2426 7.75 17.25 6.74264 17.25 5.5C17.25 4.25736 16.2426 3.25 15 3.25C13.7574 3.25 12.75 4.25736 12.75 5.5C12.75 6.74264 13.7574 7.75 15 7.75Z" stroke="white" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p>Share</p>
          </div>
        </div>
      </n-spin>
    </div>
    <div v-else class="modal-success">
      <div class="status flex-end-center">
        <img src="@/assets/images/flower.svg" alt="" class="flower">
        <img src="@/assets/images/success.svg" alt="" class="success">
      </div>
      <div class="success-status">Share success</div>
      <div class="success-sub-status">Share your contract link</div>
      <div class="input flex-center" @click="copy(link)">
        <input class="link flex-center" v-model="link" disabled ref="input">
        <div class="copy-btn flex-center-center">Copy link</div>
      </div>
    </div>
    <AddTeamModal ref="addTeamModal" @add="addTeamFun" />
  </n-modal>
</template>

<script>
import { ref, watch, computed } from 'vue'
import { useStore } from 'vuex'
import { useIsActivating } from '../hooks/useIsActivating'
import { useUtils } from '../hooks/useUtils'
import { publishContract } from '../http/abi'
import { useMessage } from 'naive-ui'
import AddTeamModal from '@/components/AddTeamModal.vue'
import Avatar from "@/components/Avatar.vue"

export default {  
  name: 'ShareModal',
  props: ['contract'],
  components: {AddTeamModal, Avatar},
  setup(props) {
    const store = useStore()
    const { setData, copy } = useUtils()
    const message = useMessage()
    const { getProvider } = useIsActivating()
    const showModal = ref(false)
    const loading = ref(false)
    const input = ref(null)
    const addTeamModal = ref(null)
    const itemIndex = ref(-1)
    const password = ref('')
    const teamList= ref([])
    const token = ref(props.contract && props.contract.token || '')
    const title = ref(`Contract ${props.contract && props.contract.name || ''} sharing`)
    const link = ref('')
    const provider = computed(() => {
      return store.state.provider
    })
    const address = computed(() => {
      return store.state.address
    })
    const userInfo = computed(() => {
      return store.state.userInfo
    })
    const share = async () => {
      if (!provider.value) {
        getProvider()
        return
      }
      if (!userInfo.value.nickname) {
        store.commit('login')
        return
      }
      if ((itemIndex.value == 0 && teamList.value.length) || itemIndex.value == 1 || (itemIndex.value == 2 && password.value)) {
        try {
          loading.value = true
          let contract = props.contract
          let openSourceType = itemIndex.value == 0 ? 'Team' : itemIndex.value == 1 ? 'Global' : itemIndex.value == 2 ? 'Limited' : ''
          let data = {
            password: password.value,
            openSourceType: openSourceType,
            contract_info: {
              contract_address: contract.address,
              contract_abi: JSON.stringify(contract.abi),
              name: contract.name,
              chain_info: {
                chainName: contract.chain.chainName || contract.chain.name,
                chainId: contract.chain.chainId,
              },
              description: contract.remark
            }
          }
          if (itemIndex.value == 0) {
            let addressList = teamList.value.map(e => e.address)
            data.address_list = addressList
          }
          publishContract(data).then(res => {
            loading.value = false
            if (res.code == 0) {
              token.value = `${res.token}`
              title.value = 'Share Contract'
              contract.token = res.token
              contract.authorAddress = address.value
              setData(contract)
            } else {
              message.error(res.msg)
            }
          }).catch(() => {
            loading.value = false
            store.commit('login')
          })
        } catch (error) {
          console.log(error)
          message.error(error)
          loading.value = false
        }
      } else {
        return
      }
    }
    const addTeamFun = (e) => {
      teamList.value.push(e)
      teamList.value = [...new Set(teamList.value)]
    }
    const showAddTeam = () => {
      addTeamModal.value.show()
    }
    const afterLeave = () => {
      itemIndex.value = -1
      password.value = ''
    }
    watch(() => token.value, () => {
      let origin = window.location.origin
      link.value = `${origin}/${token.value}`
    }, {immediate: true})
    watch(() => props.contract, () => {
      let t = props.contract && props.contract.token || ''
      if (t && t.indexOf('dappreader.com')) {
        let tArr = t.split('/')
        token.value = tArr[tArr.length - 1]
      }  else {
        token.value = t
      }
      title.value = `Contract ${props.contract && props.contract.name || ''} sharing`
    }, {immediate: true})
    return {
      link,
      teamList,
      password,
      showModal,
      itemIndex,
      loading,
      addTeamModal,
      title,
      token,
      input,
      share,
      copy,
      afterLeave,
      showAddTeam,
      addTeamFun
    }
  }
}
</script>

<style scoped lang="scss">
.modal-content {
  // border-top: 1px solid rgba(133, 141, 153, 0.2);
  // padding-top: 32px;
  box-sizing: border-box;
  .hint {
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    color: #858D99;
    margin-bottom: 32px;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .item {
    padding: 16px 20px;
    width: 100%;
    box-sizing: border-box;
    cursor: pointer;
    svg {
      path {
        stroke: #858D99;
      }
      rect {
        stroke: #858D99;
      }
      circle {
        fill: #858D99;
      }
    }
    &.item-activate {
      background: #fff;
      border: none;
      .item-info {
        .item-title {
          color: #15141B;
        }
        .item-desc {
          color: #15141B;
        }
      }
      svg {
        path {
          stroke: #fff;
        }
        rect {
          stroke: #fff;
        }
        circle {
          fill: #375CFF;
          fill-opacity: 1;
        }
      }
      &:hover {
        background: #fff;
        border: none;
        .item-info {
          .item-title {
            color: #15141B;
          }
          .item-desc {
            color: #15141B;
          }
        }
        svg {
          path {
            stroke: #fff;
          }
          rect {
            stroke: #fff;
          }
          circle {
            fill: #375CFF;
            fill-opacity: 1;
          }
        }
      }
    }
    &:hover {
      background: rgba(133, 141, 153, 0.15);
      border: 1px solid rgba(133, 141, 153, 0.15);
      svg {
        path {
          stroke: #FFFFFF;
        }
        rect {
          stroke: #FFFFFF;
        }
        circle {
          fill: #FFFFFF;
        }
      }
    }
    .item-info {
      margin-left: 16px;
      .item-title {
        font-size: 16px;
        line-height: 20px;
        color: #FFFFFF;
        font-family: Montserrat-Bold;
      }
      .item-desc {
        margin-top: 8px;
        font-size: 12px;
        line-height: 20px;
        color: #858D99;
      }
    }
  }
  .input {
    margin-top: 16px;
    box-sizing: border-box;
    input {
      height: 50px;
      background: #FFFFFF;
      border-radius: 10px;
      color: #15141B;
      border: 1px solid rgba(133, 141, 153, 0.25);
      padding: 0 16px;
      box-sizing: border-box;
      width: 100%;
      outline: none;
      &:focus {
        border: 1px solid #375CFF;
      }
    }
  }
  .team {
    margin-top: 16px;
    .item-desc {
      font-weight: 400;
      font-size: 12px;
      line-height: 20px;
      text-transform: capitalize;
      color: #858D99;
    }
    .team-list {
      border: 1px solid rgba(133, 141, 153, 0.15);
      border-radius: 10px;
      padding: 8px 16px;
      box-sizing: border-box;
      max-height: 150px;
      overflow-y: auto;
      .team-item {
        height: 44px;
        .avatar {
          flex: 0 0 32px;
          height: 32px;
          margin-right: 12px;
        }
        .info {
          .name {
            font-family: Montserrat-Medium;
            font-weight: 500;
            font-size: 14px;
            line-height: 16px;
            text-transform: capitalize;
            color: #15141B;
            margin-bottom: 4px;
          }
          .address {
            font-size: 10px;
            line-height: 12px;
            text-transform: capitalize;
            color: #15141B;
          }
        }
      }
    }
    .add-team-btn {
      height: 50px;
      margin-top: 16px;
      border: 1px solid #375CFF;
      border-radius: 10px;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      text-transform: capitalize;
      color: #375CFF;
      svg {
        margin-right: 4px;        
      }
    }
  }
  .btn-w {
    padding: 0 20px;
    box-sizing: border-box;
    margin-top: 20px;
  }
  .share-btn {
    height: 50px;
    background: rgba(133, 141, 153, 0.1);
    border-radius: 10px;
    font-size: 16px;
    line-height: 22px;
    text-transform: capitalize;
    color: #858D99;
    cursor: no-drop;
    svg {
      margin-right: 8px;
      path {
        stroke: #858D99;
      }
    }
    &.btn-activate {
      background: #375CFF;
      color: #FFFFFF;
      cursor: pointer;
      svg {
        path {
          stroke: #FFFFFF;
        }
      }
    }
  }
}
.modal-success {
  margin-top: 36px;
  padding: 0 20px;
  box-sizing: border-box;
  .status {
    height: 80px;
    position: relative;
    .flower {
      position: absolute;
      width: 243px;
      height: auto;
      left: 137px;
      top: 0;
    }
    .success {
      margin-bottom: -10px;
    }
  }
  .success-status {
    font-weight: 600;
    font-size: 24px;
    line-height: 34px;
    text-transform: capitalize;
    color: #FFFFFF;
    font-family: 'Montserrat-Medium';
    text-align: center;
    margin-top: 20px;
  }
  .success-sub-status {
    font-size: 16px;
    line-height: 20px;
    color: #858D99;
    margin-top: 8px;
    text-align: center;
  }
  .input {
    margin-top: 32px;
    padding: 5px 5px 5px 16px;
    height: 50px;
    background: #17171A;
    box-sizing: border-box;
    border: 1px solid rgba(47, 52, 61, 0.4);
    border-radius: 5px;
    cursor: pointer;
    .link {
      flex: 1;
      font-weight: 400;
      font-size: 15px;
      line-height: 20px;
      color: #FFFFFF;
      background: none;
      border: none;
      outline: none;
    }
    .copy-btn {
      width: 98px;
      height: 40px;
      background: #375CFF;
      border-radius: 4px;
      margin-left: 10px;
    }
  }
}
</style>
