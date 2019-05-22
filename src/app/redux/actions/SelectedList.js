export const selectItem = target => ({
  type: 'SELECT_ITEM',
  payload: target
})

export const unSelectItem = target => ({
  type: 'UN_SELECT_ITEM',
  payload: target
})

export const setSelected = target => ({
  type: 'SET_SELECTED',
  payload: target
})
