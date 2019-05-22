export default (state = [], action) => {
  switch (action.type) {
    case 'SELECT_ITEM':
      return [
        ...state,
        action.payload
      ]
    case 'UN_SELECT_ITEM':
      const index = state.findIndex(target => target.href === action.payload.href)
      return [...state.slice(0, index), ...state.slice(index + 1)]
    case 'CLEAR_ALL_SELECTED':
      return []
    default:
      return state
  }
}
