import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import LibraryBookIcon from '@material-ui/icons/LibraryBooks'
import DeleteIcon from '@material-ui/icons/Delete'
import LockIcon from '@material-ui/icons/Lock'
import CheckboxIcon from '@material-ui/icons/CheckBox'
import CloseIcon from '@material-ui/icons/Close'
import FolderIcon from '@material-ui/icons/Folder'
import Tooltip from '@material-ui/core/Tooltip'
import ConfirmModal from './ConfirmModal.js'
import PermissionModal from './PermissionModal.js'
import BookmodeModal from './BookmodeModal.js'
import GroupNotesModal from './GroupNotesModal.js'
import Snackbar from '@material-ui/core/Snackbar'

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
      showSnackBar: false,
      errorMessage: '',
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
          // open the result note in other tab
          window.open(resultUrl, '_target')
          this.props.setSelectedNotes({})
          this.setState({ showBookmode: false, loading: false })
        } catch (error) {
          console.log(error)
          this.setState({ showBookmode: false, loading: false, errorMessage: error.message, showSnackBar: true })
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
        title = '移除 Recent 中的紀錄'
        text = `您確定要將目前 ${Object.keys(this.props.list.selectedNotes).length} 項筆記移除嗎？`
        break
      case 'Personal':
        title = '刪除 Personal 中的筆記'
        text = `您確定要將目前 ${Object.keys(this.props.list.selectedNotes).length} 項筆記刪除嗎？`
        break
      case 'Directory':
        title = '刪除 Directory 中的資料夾/筆記'
        text = `您確定要將目前 ${Object.keys(this.props.list.selectedNotes).length} 項資料夾/筆記刪除嗎？`
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
              Directory.delNote(noteIds)
              break
          }
          // direct remove the redux state if the tab is not Directory
          if (this.props.tab.current !== 'Directory') {
            this.props.deleteNotes(Object.values(this.props.list.selectedNotes))
          } else {
            // delete dir note
          }
          this.props.setSelectedNotes({})
          this.setState({ showConfirm: false, loading: false })
        } catch (error) {
          console.log(error)
          this.setState({ showConfirm: false, loading: false, errorMessage: error.message, showSnackBar: true })
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
          this.setState({ showConfirm: false, loading: false, errorMessage: error.message, showSnackBar: true })
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
            throw Error('當前存在相同的資料夾名稱！請重新命名！')
          }
          // move the notes to the dir
          Object.values(this.props.list.selectedNotes).forEach(target => {
            Directory.moveNote(target.title, target.href, null, { dirId: 0, noteId: 0 })
          })
          this.props.setSelectedNotes([])
          this.setState({ showGroupNote: false, loading: false })
        } catch (error) {
          console.log(error)
          this.setState({ showGroupNote: false, loading: false, errorMessage: error.message, showSnackBar: true })
        }
      }.bind(this),
      disagreeEvent: function () {
        this.setState({ showGroupNote: false })
      }.bind(this)
    })
  }
  selectAllOperation () {
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
        <Snackbar
          autoHideDuration={6000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          key={`snack-bar-message`}
          open={this.state.showSnackBar}
          ContentProps={{
            'aria-describedby': 'message-id'
          }}
          message={<span id='message-id'>{this.state.errorMessage}</span>}
          action={[
            <IconButton
              key='close'
              aria-label='Close'
              color='inherit'
              onClick={this.handleCloseSnakcbar}
            >
              <CloseIcon />
            </IconButton>
          ]}
          onClose={this.handleCloseSnakcbar}
        />
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
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(OperationContent)
