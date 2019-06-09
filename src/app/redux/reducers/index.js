import { combineReducers } from 'redux'
import List from './List.js'
// import SelectedList from './SelectedList.js'
import Tab from './Tab.js'
import NewDir from './NewDir.js'
import Dir from './Dir.js'
import Search from './Search.js'

export default combineReducers({
  List,
  // SelectedList,
  Tab,
  NewDir,
  Dir,
  Search
})
