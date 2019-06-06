import { combineReducers } from 'redux'
import List from './List.js'
import SelectedList from './SelectedList.js'
import Tab from './Tab.js'
import NewDir from './NewDir.js'
import DirList from './DirList.js'
import DirListOpen from './DirListOpen.js'
import DirState from './DirState.js'
import Search from './Search.js'

export default combineReducers({
  List,
  SelectedList,
  Tab,
  NewDir,
  DirList,
  DirListOpen,
  DirState,
  Search
})
