import { connect } from 'react-redux'
import OperationContent from '../components/OperationContent.js'
import { initList, setNotes, deleteNotes, setSelectedNotes, selectNote, unSelectNote, searchNotes, addNote } from '../redux/actions/List.js'
import { setNewDir } from '../redux/actions/NewDir.js'
import { setDirCheck, setDirNoteCheck, setDirOpen, newDir, setDir, deleteDir, deleteDirNote } from '../redux/actions/Dir.js'

const mapStateToProps = (state) => {
  return {
    list: state.List,
    tab: state.Tab,
    newdir: state.NewDir,
    dir: state.Dir
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    initList: (target) => dispatch(initList(target)),
    setNotes: (target) => dispatch(setNotes(target)),
    addNote: (target) => dispatch(addNote(target)),
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
