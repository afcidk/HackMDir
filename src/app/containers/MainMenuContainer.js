import { connect } from 'react-redux'
import MainMenu from '../components/MainMenu.js'
import { setTab } from '../redux/actions/Tab.js'

const mapStateToProps = (state) => {
  return {
    tab: state.Tab
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setTab: (target) => dispatch(setTab(target))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu)
