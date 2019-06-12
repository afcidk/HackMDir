
export const initList = target => ({
  type: 'INIT_LIST',
  payload: target
})

export const addNote = target => ({
  type: 'ADD_NOTE',
  payload: target
})

// [{ title: string, href: string }...]
export const setNotes = target => ({
  type: 'SET_NOTES',
  payload: target
})

export const deleteNotes = target => ({
  type: 'DELETE_NOTES',
  payload: target
})

export const setSelectedNotes = target => ({
  type: 'SET_SELECTED_NOTES',
  payload: target
})

export const selectNote = target => ({
  type: 'SELECT_NOTE',
  payload: target
})

export const unSelectNote = target => ({
  type: 'UNSELECT_NOTE',
  payload: target
})

export const searchNotes = target => ({
  type: 'SEARCH_NOTES',
  payload: target
})
