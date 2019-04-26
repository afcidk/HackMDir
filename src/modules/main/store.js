const state = {
  isLogin: false,
  displayRoot: false,
  type: 'recent',
  list: []
}

const getters = {
  getLoginStatus: function () {
    return state.isLogin
  },
  getDisplayRoot: function () {
    return state.displayRoot
  },
  getList: function () {
    return state.list
  },
  getType: function () {
    return state.type
  }
}

const mutations = {
  setLoginStatus: function (status) {
    state.isLogin = status
  },
  setDisplay: function (open) {
    state.displayRoot = open
  },
  setType: function (newType) {
    state.type = newType
  },
  setList: function (newList) {
    if (!Array.isArray(newList)) {
      return
    }
    state.list = newList.slice()
    state.list.sort((a, b) => a.time < b.time ? 1 : -1)
  }
}

module.exports = {
  state: state,
  getters: getters,
  mutations: mutations
}
