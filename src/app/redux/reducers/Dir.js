/**
 *
 * {
 *  dirs: {
 *    'dirID': {
 *      loc: int
 *      title: string
 *      notes: [{ title: string, href: string }...]
 *      check: {
 *        dir: boolean,
 *        notes: {
 *          'noteID': true, ...
 *        }
 *      }
 *      open: boolean,
 *      isRenaming: boolean
 *   }
 *  }
 *  searchKey: string
 * }
 */

export default (state = {
  dirs: {},
  searchKey: ''
}, action) => {
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
      console.log(initTemp)
      return Object.assign({}, {
        dirs: initTemp,
        searchKey: ''
      })
    case 'NEW_DIR':
      Object.values(state).forEach(target => {
        target.loc += +(target.loc >= 0)
      })
      return {
        ...state,
        dirs: {
          ...state.dirs,
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
      }
    case 'RENAME_DIR':
      const { [action.payload.prev]: removedDirValue, ...restRenameDir } = state.dirs
      return {
        ...state,
        dirs: {
          ...restRenameDir,
          [action.payload.new]: {
            ...removedDirValue,
            title: action.payload.new,
            isRenaming: false
          }
        }
      }
    case 'DELETE_DIR':
      const { [action.payload]: removedValue, ...restDeleteDir } = state.dirs
      Object.values(restDeleteDir).forEach(target => {
        target.loc -= +(target.loc > removedValue.loc)
      })
      return {
        ...state,
        dirs: {
          ...restDeleteDir
        }
      }
    case 'DELETE_DIR_NOTE':
      const index = state.dirs[action.payload.dirID].notes.findIndex(target => target.href === action.payload.href)
      console.log([...state.dirs[action.payload.dirID].notes.slice(0, index), ...state.dirs[action.payload.dirID].notes.slice(index + 1)])
      if (state.dirs[action.payload.dirID].notes.length - 1 === 0) {
        console.log('dir empty')
        const { [action.payload.dirID]: removedDeleteDirNote, ...restDeleteDirNote } = state.dirs
        if (Object.keys(restDeleteDirNote).length > 0) {
          return {
            ...state,
            dirs: {
              ...restDeleteDirNote
            }
          }
        }
        return {
          ...state,
          dirs: {}
        }
      }
      // remove note check status
      const { [state.dirs[action.payload.dirID].notes[index].name]: removedDeleteDirNote2, ...restNotesCheck } = state.dirs[action.payload.dirID].check.notes
      return {
        ...state,
        dirs: {
          ...state.dirs,
          [action.payload.dirID]: {
            ...state.dirs[action.payload.dirID],
            notes: [...state.dirs[action.payload.dirID].notes.slice(0, index), ...state.dirs[action.payload.dirID].notes.slice(index + 1)],
            check: {
              ...state.dirs[action.payload.dirID].check,
              notes: {
                ...restNotesCheck
              }
            }
          }
        }
      }
    case 'SET_DIR_OPEN':
      return {
        ...state,
        dirs: {
          ...state.dirs,
          [action.payload.dirID]: {
            ...state.dirs[action.payload.dirID],
            open: action.payload.status
          }
        }
      }
    case 'SET_DIR_NOTE_CHECK':
      if (!action.payload.status) {
        return {
          ...state,
          dirs: {
            ...state.dirs,
            [action.payload.dirID]: {
              ...state.dirs[action.payload.dirID],
              check: {
                ...state.dirs[action.payload.dirID].check,
                notes: {
                  ...state.dirs[action.payload.dirID].check.notes,
                  [action.payload.noteID]: action.payload.status
                },
                dir: false
              }
            }
          }
        }
      }
      state.dirs[action.payload.dirID].check.notes[action.payload.noteID] = action.payload.status
      let flag = true
      const keys = Object.keys(state.dirs[action.payload.dirID].check.notes)
      for (let i = 0; i < keys.length; ++i) {
        if (!state.dirs[action.payload.dirID].check.notes[keys[i]]) {
          flag = false
          break
        }
      }
      return {
        ...state,
        dirs: {
          ...state.dirs,
          [action.payload.dirID]: {
            ...state.dirs[action.payload.dirID],
            check: {
              ...state.dirs[action.payload.dirID].check,
              notes: {
                ...state.dirs[action.payload.dirID].check.notes,
                [action.payload.noteID]: action.payload.status
              },
              dir: flag ? true : state.dirs[action.payload.dirID].check.dir
            }
          }
        }
      }
    case 'SET_DIR_CHECK':
      state.dirs[action.payload.dirID].check.dir = action.payload.status
      const dirCheckTemp = {}
      Object.keys(state.dirs[action.payload.dirID].check.notes).forEach(id => {
        dirCheckTemp[id] = action.payload.status
      })
      return {
        ...state,
        dirs: {
          ...state.dirs,
          [action.payload.dirID]: {
            ...state.dirs[action.payload.dirID],
            check: {
              ...state.dirs[action.payload.dirID].check,
              notes: Object.assign({}, dirCheckTemp),
              dir: action.payload.status
            },
            open: action.payload.status ? true : state.dirs[action.payload.dirID].check.open
          }
        }
      }
    case 'SET_ISRENAMING':
      return {
        ...state,
        dirs: {
          ...state.dirs,
          [action.payload.dirID]: {
            ...state.dirs[action.payload.dirID],
            isRenaming: action.payload.status
          }
        }
      }
    case 'SET_searchKey':
      return {
        ...state,
        searchKey: action.payload
      }
    default:
      return state
  }
}
