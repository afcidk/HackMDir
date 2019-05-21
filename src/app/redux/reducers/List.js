export default (state = [], action) => {
  switch (action.type) {
    case 'SET_ITEMS':
      return action.payload
    case 'DELETE_ITEMS':
      const hrefs = action.payload.map(target => target.href)
      return state.filter(target => !hrefs.includes(target.href))
    default:
      return state
  }
}
