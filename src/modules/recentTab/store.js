const API = require('../../api/api.js')

const state = {
  display: false,
  list: [],
  tempRemoved: []
}

const getters = {
  getList: function () {
    return state.list
  },
  getTempRemoved: function () {
    return state.tempRemoved
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
    console.log(newList)
    if (!Array.isArray(newList)) {
      return
    }
    state.list = newList.slice()
  },
  addTempRemoved: function (noteId) {
    state.tempRemoved.push(noteId)
  },
  removeTempRemoved: function (noteId) {
    const pos = state.tempRemoved.indexOf(noteId)
    state.tempRemoved.splice(pos, 1)
  }
}

module.exports = {
  state: state,
  getters: getters,
  mutations: mutations
}
