/**
 *
 * state: {
 *  'dirID': {
 *    title: string
 *    notes: [{ title: string, href: string }...]
 *    check: {
 *      dir: boolean,
 *      notes: [boolean]
 *    }
 *    open: boolean
 *  }
 * }
 */

 // { dirID: string, status: boolean }
export const setIsRenaming = target => ({
  type: 'SET_ISRENAMING',
  payload: target
})

export const setDir = target => ({
  type: 'SET_DIR',
  payload: target
})

// { prev: string, new: string }
export const renameDir = target => ({
  type: 'RENAME_DIR',
  payload: target
})

// dirID: string
export const newDir = target => ({
  type: 'NEW_DIR',
  payload: target
})

// dirID: string
export const deleteDir = target => ({
  type: 'DELETE_DIR',
  payload: target
})

// { dirID: string, href: string }
export const deleteDirNote = target => ({
  type: 'DELETE_DIR_NOTE',
  payload: target
})

// { dirID: string, status: boolean }
export const setDirOpen = target => ({
  type: 'SET_DIR_OPEN',
  payload: target
})

// { dirID: string, note: string, status: boolean }
export const setDirNoteCheck = target => ({
  type: 'SET_DIR_NOTE_CHECK',
  payload: target
})

// { dirID: string  status: boolean  }
export const setDirCheck = target => ({
  type: 'SET_DIR_CHECK',
  payload: target
})
