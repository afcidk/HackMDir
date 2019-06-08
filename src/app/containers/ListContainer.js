import { connect } from 'react-redux'
import List from '../components/ListContent.js'
import { initList, setNotes, selectNote, unSelectNote, searchNotes, setSelectedNotes } from '../redux/actions/List.js'
import { setNewDir } from '../redux/actions/NewDir.js'
import { setDirCheck, setDirNoteCheck, setDirOpen, newDir, setDir, deleteDir, renameDir, setIsRenaming } from '../redux/actions/Dir.js'

const mapStateToProps = (state) => {
  return {
    list: state.List,
    // selectedNotes: state.SelectedList,
    tab: state.Tab,
    newdir: state.NewDir,
    dir: state.Dir
    // search: state.Search
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    initList: (target) => dispatch(initList(target)),
    setNotes: (target) => dispatch(setNotes(target)),
    selectNote: (target) => dispatch(selectNote(target)),
    unSelectNote: (target) => dispatch(unSelectNote(target)),
    searchNotes: (target) => dispatch(searchNotes(target)),
    setSelectedNotes: (target) => dispatch(setSelectedNotes(target)),

    setNewDir: (target) => dispatch(setNewDir(target)),
    setDir: (target) => dispatch(setDir(target)),
    deleteDir: (target) => dispatch(deleteDir(target)),
    newDir: (target) => dispatch(newDir(target)),
    setDirOpen: (target) => dispatch(setDirOpen(target)),
    setDirCheck: (target) => dispatch(setDirCheck(target)),
    setDirNoteCheck: (target) => dispatch(setDirNoteCheck(target)),
    renameDir: (target) => dispatch(renameDir(target)),
    setIsRenaming: (target) => dispatch(setIsRenaming(target))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(List)
