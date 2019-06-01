import { connect } from 'react-redux'
import MainMenu from '../components/MainMenu.js'
import { setTab } from '../redux/actions/Tab.js'
import { setNewDir } from '../redux/actions/NewDir.js'
import { setSearch } from '../redux/actions/Search.js'

const mapStateToProps = (state) => {
  return {
    tab: state.Tab,
    newdir: state.NewDir,
    search: state.Search
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setTab: (target) => dispatch(setTab(target)),
    setNewDir: (target) => dispatch(setNewDir(target)),
    setSearch: (target) => dispatch(setSearch(target))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu)
