import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import LibraryBookIcon from '@material-ui/icons/LibraryBooks'
import DeleteIcon from '@material-ui/icons/Delete'
import LockIcon from '@material-ui/icons/Lock'
import CheckboxIcon from '@material-ui/icons/CheckBox'
import FolderIcon from '@material-ui/icons/Folder'
import Tooltip from '@material-ui/core/Tooltip'
import ConfirmModal from './modals/ConfirmModal.js'
import PermissionModal from './modals/PermissionModal.js'
import BookmodeModal from './modals/BookmodeModal.js'
import GroupNotesModal from './modals/GroupNotesModal.js'
import CustomSnackbar from './CustomSnackbar.js'
import { withSnackbar } from 'notistack'

import API from '../../api/api.js'
import Directory from '../../api/directory.js'

const styles = theme => ({
  root: {
    backgroundColor: 'white',
    boxShadow: '0 9px 18px rgba(0, 0, 0, 0.18)',
    padding: '4px 20px 4px 6px',
    height: '48px'
  },
  button: {
    width: '40px',
    height: '40px',
    padding: '0'
  },
  icon: {
    fill: '#4285f4'
  },
  label: {
    color: '#4285f4',
    margin: '0'
  },
  tooltip: {
    fontSize: '10px'
  }
})

class OperationContent extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      showConfirm: false,
      showBookmode: false,
      showPermission: false,
      showGroupNote: false,
      title: '',
      message: '',
      agreeEvent: null,
      disagreeEvent: null,
      loading: false
    }
    this.bookModeOperation = this.bookModeOperation.bind(this)
    this.permissionOperation = this.permissionOperation.bind(this)
    this.deleteOperation = this.deleteOperation.bind(this)
    this.groupNoteOperation = this.groupNoteOperation.bind(this)
    this.selectAllOperation = this.selectAllOperation.bind(this)
    this.handleCloseSnakcbar = this.handleCloseSnakcbar.bind(this)
  }
  bookModeOperation () {
    this.setState({
      showBookmode: true,
      agreeEvent: async function (title, sortedNotes) {
        try {
          this.setState({ loading: true })
          const resultUrl = await API.addBookmode(title, sortedNotes)
          // delay open the result note in other tab
          const timeout = function (ms) {
            return new Promise(resolve => setTimeout(resolve, ms))
          }
          await timeout(5000)
          const formatUrl = `${resultUrl.split('?')[0]}/${encodeURIComponent(sortedNotes[0].href)}?type=book`
          window.open(formatUrl, '_target')
          this.props.setSelectedNotes({})
          this.setState({ showBookmode: false, loading: false })
          this.props.addNote({ title: title, href: resultUrl.split('?')[0] })
        } catch (error) {
          console.log(error)
          this.setState({ showBookmode: false, loading: false })
          this.props.enqueueSnackbar('', {
            children: (key) => (
              <CustomSnackbar id={key} message={error.message} />
            )
          })
        }
      }.bind(this),
      disagreeEvent: function () {
        this.setState({ showBookmode: false })
      }.bind(this)
    })
  }
  deleteOperation () {
    let text
    let title
    switch (this.props.tab.current) {
      case 'Recent':
        title = 'Remove Records.'
        text = `Notes will be removed PERMANENTLY`
        break
      case 'Personal':
        title = 'Delete Notes.'
        text = `Notes will be deleted PERMANENTLY!`
        break
      case 'Directory':
        title = 'Delete Directories/Notes.'
        text = `Directories/Notes will be deleted PERMANENTLY`
        break
    }
    this.setState({
      showConfirm: true,
      title: title,
      message: text,
      agreeEvent: async function () {
        try {
          this.setState({ loading: true })
          const noteIds = Object.keys(this.props.list.selectedNotes)
          switch (this.props.tab.current) {
            case 'Recent':
              await API.delHistoryNote(noteIds)
              break
            case 'Personal':
              await API.delNote(noteIds)
              break
            case 'Directory':
              await API.delNote(noteIds)
              const targetNotes = Object.values(this.props.list.selectedNotes)
              for (let i = 0; i < targetNotes.length; ++i) {
                const note = targetNotes[i]
                Directory.moveNote(null, null, { dirId: note.dirID, noteId: note.href.substr(18) }, null)
                const dirData = API.getData('directory')
                if (dirData[note.dirID].notes.length === 0) {
                  Directory.delDir(note.dirID)
                }
              }
              break
          }
          // direct remove the redux state if the tab is not Directory
          if (this.props.tab.current !== 'Directory') {
            this.props.deleteNotes(Object.values(this.props.list.selectedNotes))
          } else {
            // delete dir note
            const dirData = Object.values(this.props.dir)
            Object.values(this.props.list.selectedNotes).forEach(note => {
              const dir = dirData.find(target => target.loc === note.dirID)
              this.props.deleteDirNote({ dirID: dir.title, href: note.href })
            })
          }
          this.props.setSelectedNotes({})
          this.setState({ showConfirm: false, loading: false })
        } catch (error) {
          console.log(error)
          this.setState({ showConfirm: false, loading: false })
          this.props.enqueueSnackbar('', {
            children: (key) => (
              <CustomSnackbar id={key} message={error.message} />
            )
          })
        }
      }.bind(this),
      disagreeEvent: function () {
        this.setState({ showConfirm: false })
      }.bind(this)
    })
  }
  permissionOperation () {
    this.setState({
      showPermission: true,
      agreeEvent: async function (data) {
        try {
          this.setState({ loading: true })
          const noteIds = Object.values(this.props.list.selectedNotes).map(target => (target.href))
          await API.changePermission(noteIds, data.write + data.read * 10)
          this.props.setSelectedNotes([])
          this.setState({ showPermission: false, loading: false })
        } catch (error) {
          console.log(error)
          this.setState({ showPermission: false, loading: false })
          this.props.enqueueSnackbar('', {
            children: (key) => (
              <CustomSnackbar id={key} message={error.message} />
            )
          })
        }
      }.bind(this),
      disagreeEvent: function () {
        this.setState({ showPermission: false })
      }.bind(this)
    })
  }
  groupNoteOperation () {
    this.setState({
      showGroupNote: true,
      agreeEvent: async function (data) {
        try {
          this.setState({ loading: true })
          // create the dir first
          const status = Directory.newDir(data)
          console.log('status: ', status)
          if (!status) {
            throw Error('There exists same directory, please rename again!')
          }
          // move the notes to the dir
          Object.values(this.props.list.selectedNotes).forEach(target => {
            Directory.moveNote(target.title, target.href, null, { dirId: 0, noteId: 0 })
          })
          this.props.setSelectedNotes([])
          this.setState({ showGroupNote: false, loading: false })
        } catch (error) {
          console.log(error)
          this.setState({ showGroupNote: false, loading: false })
          this.props.enqueueSnackbar('', {
            children: (key) => (
              <CustomSnackbar id={key} message={error.message} />
            )
          })
        }
      }.bind(this),
      disagreeEvent: function () {
        this.setState({ showGroupNote: false })
      }.bind(this)
    })
  }
  selectAllOperation () {
    if (this.props.tab.current !== 'Directory') {
      // unselect all if it is already select all
      if (this.props.list.filteredNotes.length === Object.keys(this.props.list.selectedNotes).length) {
        this.props.setSelectedNotes({})
        return
      }
      const temp = {}
      this.props.list.filteredNotes.forEach(target => {
        temp[target.href.substr(18)] = target
      })
      this.props.setSelectedNotes(temp)
    } else {
      console.log(this.props)
      const temp = {}
      const dirs = Object.values(this.props.dir)
      let flag = false
      // check if all notes are selected
      for (let i = 0; i < dirs.length; ++i) {
        if (Object.values(dirs[i].check.notes).includes(false)) {
          flag = true
          break
        }
      }
      if (flag) {
        dirs.forEach(dir => {
          dir.notes.forEach(note => {
            // check note
            this.props.setDirNoteCheck({ dirID: dir.title, noteID: note.href.substr(18), status: true })
            // select note
            temp[note.href.substr(18)] = note
          })
        })
        this.props.setSelectedNotes(temp)
      } else {
        dirs.forEach(dir => {
          dir.notes.forEach(note => {
            // check note
            this.props.setDirNoteCheck({ dirID: dir.title, noteID: note.href.substr(18), status: false })
          })
        })
        this.props.setSelectedNotes({})
      }
    }
  }
  handleCloseSnakcbar () {
    this.setState({ showSnackBar: false })
  }
  // the render function
  render () {
    console.log('OperationContent render')
    return (
      <Grid container className={this.props.classes.root} alignContent='center' alignItems='center' >
        <ConfirmModal show={this.state.showConfirm} title={this.state.title} message={this.state.message} agreeEvent={this.state.agreeEvent} disagreeEvent={this.state.disagreeEvent} loading={this.state.loading} />
        <PermissionModal show={this.state.showPermission} number={Object.keys(this.props.list.selectedNotes).length} agreeEvent={this.state.agreeEvent} disagreeEvent={this.state.disagreeEvent} loading={this.state.loading} />
        <BookmodeModal show={this.state.showBookmode} selectedItems={this.props.list.selectedNotes} agreeEvent={this.state.agreeEvent} disagreeEvent={this.state.disagreeEvent} loading={this.state.loading} />
        <GroupNotesModal show={this.state.showGroupNote} selectedItems={this.props.list.selectedNotes} agreeEvent={this.state.agreeEvent} disagreeEvent={this.state.disagreeEvent} loading={this.state.loading} />
        <Grid item xs={2}>
          <Tooltip title='Bookmode' classes={{ tooltip: this.props.classes.tooltip }}>
            <IconButton className={this.props.classes.button} aria-label='bookmode' onClick={this.bookModeOperation}>
              <LibraryBookIcon className={this.props.classes.icon} />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item xs={2}>
          <Tooltip title='Delete' classes={{ tooltip: this.props.classes.tooltip }}>
            <IconButton className={this.props.classes.button} aria-label='delete' onClick={this.deleteOperation}>
              <DeleteIcon className={this.props.classes.icon} />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item xs={2}>
          <Tooltip title='Permission' classes={{ tooltip: this.props.classes.tooltip }}>
            <IconButton className={this.props.classes.button} aria-label='permission' onClick={this.permissionOperation}>
              <LockIcon className={this.props.classes.icon} />
            </IconButton>
          </Tooltip>
        </Grid>
        {
          this.props.tab.current !== 'Directory' ? (
            <Grid item xs={2}>
              <Tooltip title='Group note' classes={{ tooltip: this.props.classes.tooltip }}>
                <IconButton className={this.props.classes.button} aria-label='group-note' onClick={this.groupNoteOperation}>
                  <FolderIcon className={this.props.classes.icon} />
                </IconButton>
              </Tooltip>
            </Grid>
          ) : (null)
        }
        <Grid item xs={2}>
          <Tooltip title='Select all' classes={{ tooltip: this.props.classes.tooltip }}>
            <IconButton className={this.props.classes.button} aria-label='select-all' onClick={this.selectAllOperation}>
              <CheckboxIcon className={this.props.classes.icon} />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item xs={this.props.tab.current === 'Directory' ? 4 : 2} style={{ textAlign: 'right' }}>
          <label className={this.props.classes.label}> {`選擇 ${Object.keys(this.props.list.selectedNotes).length} 項`} </label>
        </Grid>
      </Grid>
    )
  }
}

OperationContent.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
}

export default withStyles(styles)(withSnackbar(OperationContent))
