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
    openSols: []
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
    init(state) {
      state.provider = null
      state.wallet = null
      state.network = null
    }
  },
  actions: {
  },
  modules: {
  }
})
