export default (state = false, action) => {
  switch (action.type) {
    case 'SET_NEWDIR':
      return action.payload
    default:
      return state
  }
}
