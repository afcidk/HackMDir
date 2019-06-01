export default (state = {}, action) => {
  switch (action.type) {
    case 'SELECT_ITEM':
      const temp = {}
      temp[action.payload.href.substr(18)] = action.payload
      return Object.assign({}, state, temp)
    case 'UN_SELECT_ITEM':
      const { [action.payload.href.substr(18)]: removedValue, ...rest } = state
      return rest
    case 'SET_SELECTED':
      return Object.assign({}, action.payload)
    default:
      return state
  }
}
