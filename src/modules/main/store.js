const state = {
  isLogin: false,
  displayRoot: false,
  type: 'recent',
  list: [],
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
  permissionRead: null,
  permissionWrite: null
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
  },
  getDirs: function () {
    return state.dirs
  },
  getPermissionRead: function () {
    return state.permissionRead
  },
  getPermissionWrite: function () {
    return state.permissionWrite
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
  },
  newDir: function (name) {
    state.dirs[name] = []
  },
  removeDir: function (name) {
    state.dirs[name] = null
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
  },
  setPermissionRead: function (type) {
    state.permissionRead = type
  },
  setPermissionWrite: function (type) {
    state.permissionWrite = type
  }
}

module.exports = {
  state: state,
  getters: getters,
  mutations: mutations
}
