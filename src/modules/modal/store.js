const state = {
  displayInput: false
}

const getters = {
  getfisplayInput: function () {
    return state.displayInput
  }
}

const mutations = {
  setDisplayInput: function (data) {
    state.displayInput = data
  }
}

module.exports = {
  state: state,
  getters: getters,
  mutations: mutations
}
