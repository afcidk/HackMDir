export default (state = [], action) => {
  switch (action.type) {
    case 'SET_DIR':
      return action.payload.slice()
    case 'DELETE_DIR':
      const hrefs = action.payload.map(target => target.href)
      return state.filter(target => !hrefs.includes(target.href))
    default:
      return state
  }
}
