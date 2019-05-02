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
  }
}

const getters = {
  getDisplayRoot: function () {
    return state.displayRoot
  },
  getDirs: function () {
    return state.dirs
  }
}

const mutations = {
  setDisplay: function (data) {
    state.display = data
  },
  setDirs: function (data) {
    state.dirs = Object.assign({}, data)
  },
  newDir: function (name) {
    state.dirs[name] = []
  },
  removeDir: function (dirname) {
    if (!state.dirs[dirname]) {
      throw new Error('dir do not exist')
    }
    delete state.dirs[dirname]
  },
  addNoteToDir: function (dirname, note) {
    if (!state.dirs[dirname]) {
      throw new Error('dir not found')
    }
    if (state.dirs[dirname].findIndex(target => target.id === note.id) !== -1) {
      throw new Error('note is already exist in the dir')
    }
    state.dirs[dirname].push(note)
  },
  removeNoteFromDir: function (dirname, index) {
    if (state.dirs[dirname].length === 0) {
      throw new Error('dir is empty')
    }
    state.dirs[dirname].splice(index, 1)
  }
}

module.exports = {
  state: state,
  getters: getters,
  mutations: mutations
}
