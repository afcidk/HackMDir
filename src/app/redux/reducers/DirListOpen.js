export default (state = [], action) => {
  switch (action.type) {
    case 'SET_DIROPEN':
      return action.payload
    default:
      return state
  }
}
