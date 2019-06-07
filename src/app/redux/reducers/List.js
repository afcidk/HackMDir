/**
 * {
 *    notes: [{ title: string, href: string }...],
 *    selectedNotes: {
 *      'noteID': {
 *          title: string,
 *          href: string
 *       }
 *    },
 *    filteredNotes: [{ title: string, href: string }...]
 * }
 */

export default (state = {
  notes: [],
  selectedNotes: {},
  filteredNotes: []
}, action) => {
  switch (action.type) {
    case 'INIT_LIST':
      console.log('init list')
      return Object.assign({}, {
        notes: action.payload.slice(),
        selectedNotes: {},
        filteredNotes: action.payload.slice()
      })
    case 'SET_NOTES':
      return {
        ...state,
        notes: action.payload.slice(),
        filteredNotes: action.payload.slice()
      }
    case 'DELETE_NOTES':
      const hrefs = action.payload.map(target => target.href)
      return {
        ...state,
        notes: state.list.filter(target => !hrefs.includes(target.href)),
        filteredNotes: state.filteredNotes.filter(target => !hrefs.includes(target.href))
      }
    case 'SET_SELECTED_NOTES':
      return {
        ...state,
        selectedNotes: Object.assign({}, action.payload)
      }
    case 'SELECT_NOTE':
      return {
        ...state,
        selectedNotes: {
          ...state.selectedNotes,
          [action.payload.href.substr(18)]: action.payload
        }
      }
    case 'UNSELECT_NOTE':
      const { [action.payload.href.substr(18)]: removedUnSelectNote, ...restUnSelectNote } = state.selectedNotes
      return {
        ...state,
        selectedNotes: {
          ...restUnSelectNote
        }
      }
    case 'SEARCH_NOTES':
      return {
        ...state,
        filteredNotes: state.notes.filter(target => {
          return target.title.toLowerCase().indexOf(action.payload.toLowerCase()) !== -1
        })
      }
    default:
      return state
  }
}
