import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Scrollbars } from 'react-custom-scrollbars'

import List from '@material-ui/core/List'
import ListNoteItem from './ListNoteItem'
import CircularProgress from '@material-ui/core/CircularProgress'

import { TextField } from '@material-ui/core'

const styles = theme => ({
  header: {
    padding: '24px 0',
    '& h2': {
      textAlign: 'left',
      fontSize: '18px'
    }
  },
  content: {
    fontSize: '14px'
  }
})

class GroupNotesModal extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      title: ''
    }

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (event) {
    this.setState({ title: event.target.value })
  }

  // the render function
  render () {
    return (
      <Dialog open={this.props.show} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
        <DialogContent>
          <DialogTitle id='alert-dialog-title' className={this.props.classes.header}>
            合併筆記
          </DialogTitle>
          <TextField
            id='group-notes-name'
            label='title'
            value={this.state.title}
            onChange={this.handleChange}
            margin='normal'
          />
          <DialogContentText id='alert-dialog-description' className={this.props.classes.content}>
            接下來將對以下 {Object.keys(this.props.selectedItems).length} 項筆記合併到一個資料夾中
          </DialogContentText>
          <List className={this.props.classes.list}>
            <Scrollbars
              autoHeight
              autoHeightMin={48}
              autoHeightMax={144}
              autoHide
              autoHideTimeout={1000}
              autoHideDuration={500}>
              {
                Object.values(this.props.selectedItems).map((target, index) => {
                  return <ListNoteItem selectable={false} key={`grouping-note-${index}`} title={target.title} href={target.href} />
                })
              }
            </Scrollbars>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.disagreeEvent}> 取消 </Button>
          <Button onClick={() => { this.props.agreeEvent(this.state.title, this.state.items) }}>
            {this.props.loading ? <CircularProgress size={14} /> : '確定'}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

GroupNotesModal.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(GroupNotesModal)
