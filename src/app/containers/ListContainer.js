import { connect } from 'react-redux'
import List from '../components/ListContent.js'
import { setItems, deleteItems } from '../redux/actions/List.js'
import { selectItem, unSelectItem, setSelected } from '../redux/actions/SelectedList.js'
import { setNewDir } from '../redux/actions/NewDir.js'
import { setSearch } from '../redux/actions/Search.js'

const mapStateToProps = (state) => {
  return {
    list: state.List,
    selectedList: state.SelectedList,
    tab: state.Tab,
    newdir: state.NewDir
    search: state.Search
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setItems: (target) => dispatch(setItems(target)),
    deleteItems: (target) => dispatch(deleteItems(target)),
    selectItem: (target) => dispatch(selectItem(target)),
    unSelectItem: (target) => dispatch(unSelectItem(target)),
    setSelected: (target) => dispatch(setSelected(target)),
    setNewDir: (target) => dispatch(setNewDir(target)),
    setSearch: (target) => dispatch(setSearch(target))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(List)
