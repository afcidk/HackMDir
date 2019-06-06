export default (state = [], action) => {
  switch (action.type) {
    case 'SET_DIRSTATE':
      return action.payload.slice()
    default:
      return state
  }
}
