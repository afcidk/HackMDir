export default (state = {}, action) => {
  switch (action.type) {
    case 'SELECT_ITEM':
      state[action.payload.href.substr(18)] = action.payload
      return Object.assign({}, state)
    case 'UN_SELECT_ITEM':
      delete state[action.payload.href.substr(18)]
      return Object.assign({}, state)
    case 'SET_SELECTED':
      return Object.assign({}, action.payload)
    default:
      return state
  }
}
