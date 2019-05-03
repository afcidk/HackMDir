const API = require('../../api/api.js')

const state = {
  display: false,
  list: [],
  listNoteId: []
}

const getters = {
  getList: function () {
    return state.list
  },
  getListNoteId: function () {
    return state.listNoteId
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
  },
  setListNoteId: function (noteId) {
    state.listNoteId.push(noteId)
  },
  removeNoteId: function (noteId) {
    var pos = state.listNoteId.indexOf(noteId)
    state.listNoteId.splice(pos, 1)
  }
}

module.exports = {
  state: state,
  getters: getters,
  mutations: mutations
}
