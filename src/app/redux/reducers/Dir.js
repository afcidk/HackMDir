/**
 *
 * state: {
 *  'dirID': {
 *    loc: int
 *    title: string
 *    notes: [{ title: string, href: string }...]
 *    check: {
 *      dir: boolean,
 *      notes: [boolean]
 *    }
 *    open: boolean,
 *    isRenaming: boolean
 *  }
 * }
 * SearchText: string
 */

export default (state = {}, action) => {
  switch (action.type) {
    case 'SET_DIR':
      const initTemp = {}
      action.payload.current.forEach((dir, index) => {
        const prevDir = action.payload.prev[dir.title]
        const noteChecks = {}
        Object.values(dir.notes).forEach(note => {
          noteChecks[note.href.substr(18)] = false
        })
        if (prevDir) {
          initTemp[dir.title] = {
            loc: index,
            title: dir.title,
            notes: dir.notes.slice(),
            check: {
              dir: prevDir.check.dir,
              notes: Object.assign({}, noteChecks, prevDir.check.notes)
            },
            open: prevDir.open,
            isRenaming: false
          }
        } else {
          initTemp[dir.title] = {
            loc: index,
            title: dir.title,
            notes: dir.notes.slice(),
            check: {
              dir: false,
              notes: {}
            },
            open: false,
            isRenaming: false
          }
          dir.notes.forEach(note => {
            initTemp[dir.title].check.notes[note.href.substr(18)] = false
          })
        }
      })
      return Object.assign({}, initTemp)
    case 'NEW_DIR':
      Object.values(state).forEach(target => {
        target.loc += +(target.loc >= 0)
      })
      return {
        ...state,
        [action.payload]: {
          loc: 0,
          title: action.payload,
          notes: [],
          check: {
            dir: false,
            notes: []
          },
          open: false,
          isRenaming: false
        }
      }
    case 'RENAME_DIR':
      const { [action.payload.prev]: removedDirValue, ...restRenameDir } = state
      return {
        ...restRenameDir,
        [action.payload.new]: {
          ...removedDirValue,
          title: action.payload.new,
          isRenaming: false
        }
      }
    case 'DELETE_DIR':
      const { [action.payload]: removedValue, ...restDeleteDir } = state
      Object.values(restDeleteDir).forEach(target => {
        target.loc -= +(target.loc > removedValue.loc)
      })
      return Object.assign({}, restDeleteDir)
    case 'DELETE_DIR_NOTE':
      const index = state[action.payload.dirID].notes.findIndex(target => target.href === action.payload.href)
      if (state[action.payload.dirID].notes.length - 1 === 0) {
        const { [action.payload]: removedDeleteDirNote, ...restDeleteDirNote } = state
        return restDeleteDirNote
      }
      const { [state[action.payload.dirID].notes[index].name]: removedDeleteDirNote2, ...restDeleteDirNote2 } = state[action.payload.dirID].check.notes
      return {
        ...state,
        [action.payload.dirID]: {
          ...state[action.payload.dirID],
          notes: {
            ...state[action.payload.dirID].notes,
            ...restDeleteDirNote2
          }
        }
      }
    case 'SET_DIR_OPEN':
      return {
        ...state,
        [action.payload.dirID]: {
          ...state[action.payload.dirID],
          open: action.payload.status
        }
      }
    case 'SET_DIR_NOTE_CHECK':
      if (!action.payload.status) {
        return {
          ...state,
          [action.payload.dirID]: {
            ...state[action.payload.dirID],
            check: {
              ...state[action.payload.dirID].check,
              notes: {
                ...state[action.payload.dirID].check.notes,
                [action.payload.noteID]: action.payload.status
              },
              dir: false
            }
          }
        }
      }
      state[action.payload.dirID].check.notes[action.payload.noteID] = action.payload.status
      let flag = true
      const keys = Object.keys(state[action.payload.dirID].check.notes)
      for (let i = 0; i < keys.length; ++i) {
        if (!state[action.payload.dirID].check.notes[keys[i]]) {
          flag = false
          break
        }
      }
      return {
        ...state,
        [action.payload.dirID]: {
          ...state[action.payload.dirID],
          check: {
            ...state[action.payload.dirID].check,
            notes: {
              ...state[action.payload.dirID].check.notes,
              [action.payload.noteID]: action.payload.status
            },
            dir: flag ? true : state[action.payload.dirID].check.dir
          }
        }
      }
    case 'SET_DIR_CHECK':
      state[action.payload.dirID].check.dir = action.payload.status
      const dirCheckTemp = {}
      Object.keys(state[action.payload.dirID].check.notes).forEach(id => {
        dirCheckTemp[id] = action.payload.status
      })
      return {
        ...state,
        [action.payload.dirID]: {
          ...state[action.payload.dirID],
          check: {
            ...state[action.payload.dirID].check,
            notes: Object.assign({}, dirCheckTemp),
            dir: action.payload.status
          },
          open: action.payload.status ? true : state[action.payload.dirID].check.open
        }
      }
    case 'SET_ISRENAMING':
      return {
        ...state,
        [action.payload.dirID]: {
          ...state[action.payload.dirID],
          isRenaming: action.payload.status
        }
      }
    case 'SET_SEARCHTEXT':
      return {
        ...state,
        searchText: action.payload
      }
    default:
      return state
  }
}
