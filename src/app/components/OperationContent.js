import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import LibraryBookIcon from '@material-ui/icons/LibraryBooks'
import DeleteIcon from '@material-ui/icons/Delete'
import LockIcon from '@material-ui/icons/Lock'
import CheckboxIcon from '@material-ui/icons/CheckBox'

import API from '../../api/api.js'

const styles = theme => ({
  root: {
    backgroundColor: 'white',
    boxShadow: '0 9px 18px rgba(0, 0, 0, 0.18)',
    padding: '4px 20px 4px 6px'
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
  }
})

class OperationContainer extends React.Component {
  bookModeOperation () {

  }
  async deleteOperation () {
    console.log(this.props)
    try {
      const noteIds = this.props.selectedList.map(target => (target.href.substr(18)))
      switch (this.props.tab) {
        case 'Recent':
          await API.delHostoryNote(noteIds)
          break
        case 'Personal':
          await API.delNote(noteIds)
          break
        case 'Directory':
          break
      }
      this.props.deleteItemsEvent(this.props.selectedList)
      this.props.clearAllSelectedEvent()
    } catch (error) {
      console.log(error)
    }
  }
  permissionOperation () {

  }
  selectAlloperation () {

  }
  // the render function
  render () {
    return (
      <Grid container className={this.props.classes.root} alignContent='center' alignItems='center' >
        <Grid item xs={2}>
          <IconButton className={this.props.classes.button} aria-label='bookmode' onClick={this.bookModeOperation}>
            <LibraryBookIcon className={this.props.classes.icon} />
          </IconButton>
        </Grid>
        <Grid item xs={2}>
          <IconButton className={this.props.classes.button} aria-label='delete' onClick={this.deleteOperation.bind(this)}>
            <DeleteIcon className={this.props.classes.icon} />
          </IconButton>
        </Grid>
        <Grid item xs={2}>
          <IconButton className={this.props.classes.button} aria-label='permission' onClick={this.permissionOperation}>
            <LockIcon className={this.props.classes.icon} />
          </IconButton>
        </Grid>
        <Grid item xs={2}>
          <IconButton className={this.props.classes.button} aria-label='select-all' onClick={this.selectAllOperation}>
            <CheckboxIcon className={this.props.classes.icon} />
          </IconButton>
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
