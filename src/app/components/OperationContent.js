import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import LibraryBookIcon from '@material-ui/icons/LibraryBooks'
import DeleteIcon from '@material-ui/icons/Delete'
import LockIcon from '@material-ui/icons/Lock'
import CheckboxIcon from '@material-ui/icons/CheckBox'
import Tooltip from '@material-ui/core/Tooltip'
import ConfirmModal from './ConfirmModal.js'

import API from '../../api/api.js'

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

class OperationContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showConfirm: false,
      title: '',
      message: '',
      agreeEvent: null,
      disagreeEvent: null,
      loading: false
    }
  }
  bookModeOperation () {
    this.setState({
      showConfirm: true,
      title: '建立 Bookmode',
      message: `您確定要將目前 ${this.props.selectedList.length} 項筆記合成一個 Bookmode 發布出去嗎？`,
      agreeEvent: function () {
      },
      disagreeEvent: function () {
        this.setState({ showConfirm: false })
      }.bind(this)
    })
  }
  deleteOperation () {
    let text
    let title
    switch (this.props.tab) {
      case 'Recent':
        title = '移除 Recent 中的紀錄'
        text = `您確定要將目前 ${this.props.selectedList.length} 項筆記移除嗎？`
        break
      case 'Personal':
        title = '刪除 Personal 中的筆記'
        text = `您確定要將目前 ${this.props.selectedList.length} 項筆記刪除嗎？`
        break
      case 'Directory':
        title = '刪除 Directory 中的資料夾/筆記'
        text = `您確定要將目前 ${this.props.selectedList.length} 項資料夾/筆記刪除嗎？`
        break
    }
    this.setState({
      showConfirm: true,
      title: title,
      message: text,
      agreeEvent: async function () {
        try {
          this.setState({ loading: true })
          const noteIds = this.props.selectedList.map(target => (target.href.substr(18)))
          switch (this.props.tab) {
            case 'Recent':
              await API.delHistoryNote(noteIds)
              break
            case 'Personal':
              await API.delNote(noteIds)
              break
            case 'Directory':
              break
          }
          this.props.deleteItemsEvent(this.props.selectedList)
          this.props.setSelectedEvent([])
          this.setState({ showConfirm: false, loading: false })
        } catch (error) {
          console.log(error)
          this.setState({ showConfirm: false, loading: false })
        }
      }.bind(this),
      disagreeEvent: function () {
        this.setState({ showConfirm: false })
      }.bind(this)
    })
  }
  permissionOperation () {

  }
  selectAllOperation () {
    // unselect all if it is already select all
    if (this.props.list.length === this.props.selectedList.length) {
      this.props.setSelectedEvent([])
      return
    }
    this.props.setSelectedEvent(this.props.list)
  }
  // the render function
  render () {
    return (
      <Grid container className={this.props.classes.root} alignContent='center' alignItems='center' >
        <ConfirmModal show={this.state.showConfirm} title={this.state.title} message={this.state.message} agreeEvent={this.state.agreeEvent} disagreeEvent={this.state.disagreeEvent} loading={this.state.loading} />
        <Grid item xs={2}>
          <Tooltip title='Bookmode' classes={{ tooltip: this.props.classes.tooltip }}>
            <IconButton className={this.props.classes.button} aria-label='bookmode' onClick={this.bookModeOperation.bind(this)}>
              <LibraryBookIcon className={this.props.classes.icon} />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item xs={2}>
          <Tooltip title='Delete' classes={{ tooltip: this.props.classes.tooltip }}>
            <IconButton className={this.props.classes.button} aria-label='delete' onClick={this.deleteOperation.bind(this)}>
              <DeleteIcon className={this.props.classes.icon} />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item xs={2}>
          <Tooltip title='Permission' classes={{ tooltip: this.props.classes.tooltip }}>
            <IconButton className={this.props.classes.button} aria-label='permission' onClick={this.permissionOperation.bind(this)}>
              <LockIcon className={this.props.classes.icon} />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item xs={2}>
          <Tooltip title='Select all' classes={{ tooltip: this.props.classes.tooltip }}>
            <IconButton className={this.props.classes.button} aria-label='select-all' onClick={this.selectAllOperation.bind(this)}>
              <CheckboxIcon className={this.props.classes.icon} />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item xs={4} style={{ textAlign: 'right' }}>
          <label className={this.props.classes.label}> {`選擇 ${this.props.selectedList.length} 項`} </label>
        </Grid>
      </Grid>
    )
  }
}

OperationContainer.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(OperationContainer)
