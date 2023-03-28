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
    isShowLogin: false,
    userInfo: {},
    defaultChains: [],
    results: {}
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
    setActiveId(state, value) {
      state.activeId = value
    },
    setUserInfo(state, value) {
      state.userInfo = value
    },
    setDefaultChains(state, value) {
      state.defaultChains = value
    },
    setResults(state, value) {
      state.results = value
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
