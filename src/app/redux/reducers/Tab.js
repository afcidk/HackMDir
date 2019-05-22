export default (state = 'Recent', action) => {
  const tabTypes = ['Recent', 'Personal', 'Directory']
  switch (action.type) {
    case 'SET_TAB':
      if (!tabTypes.includes(action.payload)) {
        return state
      }
      return action.payload
    default:
      return state
  }
}
