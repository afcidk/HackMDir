const API = require('../../api/api.js')

const state = {
  display: false,
  list: []
}

const getters = {
  getList: function () {
    return state.list
  }
}

const mutations = {
  setDisplay: function (data) {
    state.display = data
    // auto refresh the state list when the display is true
    if (data) {
      API.getHistory().then(res => {
        state.list = res.slice()
      })
    }
  },
  setList: function (newList) {
    if (!Array.isArray(newList)) {
      return
    }
    state.list = newList.slice()
  }
}

module.exports = {
  state: state,
  getters: getters,
  mutations: mutations
}
