import { connect } from 'react-redux'
import MainMenu from '../components/MainMenu.js'
import { setTab, setPrevTab } from '../redux/actions/Tab.js'
import { setNewDir } from '../redux/actions/NewDir.js'
import { searchNotes } from '../redux/actions/List.js'
import { setSearchText } from '../redux/actions/Dir.js'
// import { searchNotes } from '../redux/actions/Search.js'
import { setSearch } from '../redux/actions/Search.js'

const mapStateToProps = (state) => {
  return {
    tab: state.Tab,
    newdir: state.NewDir,
    search: state.Search,
    list: state.List,
    dir: state.Dir
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setTab: (target) => dispatch(setTab(target)),
    setPrevTab: (target) => dispatch(setPrevTab(target)),
    setNewDir: (target) => dispatch(setNewDir(target)),
    searchNotes: (target) => dispatch(searchNotes(target)),
    setSearchText: (target) => dispatch(setSearchText(target)),
    setSearch: (target) => dispatch(setSearch(target))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu)
