import { connect } from 'react-redux'
import MainMenu from '../components/MainMenu.js'
import { setTab } from '../redux/actions/Tab.js'
import { setSearch } from '../redux/actions/Search.js'

const mapStateToProps = (state) => {
  return {
    tab: state.Tab,
    search: state.Search
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setTab: (target) => dispatch(setTab(target)),
    setSearch: (target) => dispatch(setSearch(target))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu)
