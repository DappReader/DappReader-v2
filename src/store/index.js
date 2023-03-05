import { createStore } from 'vuex'
export default createStore({
  state: {
    provider: null,
    address: '',
    network: null,
    balance: 0,
    activeId: '',
    menuList: [],
    contractList: [],
    openSols: [],
    isShowLogin: false,
    userInfo: {},
    defaultChains: []
  },
  mutations: {
    setAddress(state, value) {
      state.address = value
    },
    setProvider(state, value) {
      state.provider = value
    },
    setNetwork(state, value) {
      state.network = value
    },
    setBalance(state, value) {
      state.balance = value
    },
    setMenuList(state, value) {
      state.menuList = value
    },
    setContractList(state, value) {
      state.contractList = value
    },
    setOpenSols(state, value) {
      state.openSols = value
    },
    setActiveId(state, value) {
      state.activeId = value
    },
    setUserInfo(state, value) {
      state.userInfo = value
    },
    setDefaultChains(state, value) {
      state.defaultChains = value
    },
    init(state) {
      state.provider = null
      state.wallet = null
      state.network = null
      state.isShowLogin = false
    },
    hiddenLogin(state) {
      state.isShowLogin = false
    },
    login(state) {
      state.isShowLogin = true
    }
  },
  actions: {
  },
  modules: {
  }
})
