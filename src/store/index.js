import { createStore } from 'vuex'
import { setLs } from '../service/service'
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
    results: {},
    isIframe: false
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
      setLs('menuList', value).then(() => {
        state.menuList = value
      })
    },
    setContractList(state, value) {
      setLs('contractList', value).then(() => {
        state.contractList = value
      })
    },
    setActiveId(state, value) {
      setLs('activeId', value).then(() => {
        state.activeId = value
      })
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
    setIsIframe(state, value) {
      state.isIframe = value
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
