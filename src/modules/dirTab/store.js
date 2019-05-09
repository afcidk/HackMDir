const state = {
  display: false,
  dirs: {
    test: [{
      title: 'test',
      href: 'www.facebook.com'
    }],
    test2: [{
      title: 'test',
      href: 'www.facebook.com'
    }]
  },
  delay: null,
  tempRemoved: {}
}

const getters = {
  getDisplayRoot: function () {
    return state.displayRoot
  },
  getDirs: function () {
    return state.dirs
  },
  getDelay: function () {
    return state.delay
  },
  getTempRemoved: function () {
    return state.tempRemoved
  }
}

const mutations = {
  setDisplay: function (data) {
    state.display = data
  },
  setDelay: function (data) {
    state.delay = data
  },
  setDirs: function (data) {
    state.dirs = Object.assign({}, data)
  },
  newDir: function (name) {
    state.dirs[name] = []
  },
  addNoteToDir: function (dirname, note) {
    if (!state.dirs[dirname]) {
      throw new Error('dir not found')
    }
    if (state.dirs[dirname].findIndex(target => target.href === note.href) !== -1) {
      throw new Error('note is already exist in the dir')
    }
    state.dirs[dirname].push(note)
  },
  addTempRemoved: function (dirname, index) {
    if (!state.tempRemoved[dirname]) {
      state.tempRemoved[dirname] = []
    }
    state.tempRemoved[dirname].push(index)
  },
  removeTempRemoved: function (dirname, index) {
    const targetIndex = state.tempRemoved[dirname].findIndex(target => target === index)
    state.tempRemoved[dirname].splice(targetIndex, 1)
  },
  remove: function () {
    Object.keys(state.tempRemoved).forEach(key => {
      state.tempRemoved[key].forEach(index => {
        console.log(index)
        state.dirs[key].splice(index, 1)
      })
      // remove the dir if the dir is empty
      if (state.dirs[key].length === 0) {
        delete state.dirs[key]
      }
    })
    state.tempRemoved = {}
  }
}

module.exports = {
  state: state,
  getters: getters,
  mutations: mutations
}
