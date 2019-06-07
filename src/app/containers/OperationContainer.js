import { connect } from 'react-redux'
import OperationContent from '../components/OperationContent.js'
import { initList, setNotes, deleteNotes, setSelectedNotes, selectNote, unSelectNote, searchNotes } from '../redux/actions/List.js'
import { setNewDir } from '../redux/actions/NewDir.js'
import { setDirCheck, setDirNoteCheck, setDirOpen, newDir, setDir, deleteDir, deleteDirNote } from '../redux/actions/Dir.js'
// import { searchNotes } from '../redux/actions/Search.js'

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
    deleteNotes: (target) => dispatch(deleteNotes(target)),
    selectNote: (target) => dispatch(selectNote(target)),
    unSelectNote: (target) => dispatch(unSelectNote(target)),
    setSelectedNotes: (target) => dispatch(setSelectedNotes(target)),
    searchNotes: (target) => dispatch(searchNotes(target)),

    setNewDir: (target) => dispatch(setNewDir(target)),
    setDir: (target) => dispatch(setDir(target)),
    deleteDir: (target) => dispatch(deleteDir(target)),
    deleteDirNote: (target) => dispatch(deleteDirNote(target)),
    newDir: (target) => dispatch(newDir(target)),
    setDirOpen: (target) => dispatch(setDirOpen(target)),
    setDirCheck: (target) => dispatch(setDirCheck(target)),
    setDirNoteCheck: (target) => dispatch(setDirNoteCheck(target))

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OperationContent)
