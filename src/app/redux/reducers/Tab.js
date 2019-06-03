export default (state = { current: 'Recent', prev: '' }, action) => {
  const tabTypes = ['Recent', 'Personal', 'Directory']
  switch (action.type) {
    case 'SET_TAB':
      if (!tabTypes.includes(action.payload)) {
        return state
      }
      state.current = action.payload
      return Object.assign({}, state)
    case 'SET_PREV_TAB':
      if (!tabTypes.includes(action.payload)) {
        return state
      }
      state.prev = action.payload
      return Object.assign({}, state)
    default:
      return state
  }
}
