import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import CircularProgress from '@material-ui/core/CircularProgress'

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

class ConfirmModal extends React.Component {
  // the render function
  render () {
    return (
      <Dialog open={this.props.show} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
        <DialogContent>
          <DialogTitle id='alert-dialog-title' className={this.props.classes.header}>
            {this.props.title}
          </DialogTitle>
          <DialogContentText id='alert-dialog-description' className={this.props.classes.content}>
            {this.props.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.disagreeEvent}> 取消 </Button>
          <Button onClick={this.props.agreeEvent}>
            {this.props.loading ? <CircularProgress size={14} /> : '確定'}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

ConfirmModal.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ConfirmModal)
