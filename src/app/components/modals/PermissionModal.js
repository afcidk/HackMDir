import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContentText from '@material-ui/core/DialogContentText'
import Divider from '@material-ui/core/Divider'
import CircularProgress from '@material-ui/core/CircularProgress'
import LockIcon from '@material-ui/icons/Lock'

const styles = theme => ({
  header: {
    padding: '24px 0',
    '& h2': {
      textAlign: 'left',
      fontSize: '18px'
    }
  },
  content: {
    fontSize: '14px',
    textAlign: 'left'
  },
  label: {
    fontSize: '14px',
    color: 'black',
    textAlign: 'left'
  }
})

class PermissionModal extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      read: 1,
      write: 1
    }
    this.handleRead = this.handleRead.bind(this)
    this.handleWrite = this.handleWrite.bind(this)
  }

  handleRead (event, value) {
    this.setState({ read: value })
  }

  handleWrite (event, value) {
    this.setState({ write: value })
  }

  // the render function
  render () {
    const permissionType = ['Owner', 'Signed-in', 'Guest']
    return (
      <Dialog maxWidth='xs' fullWidth open={this.props.show} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
        <DialogContent>
          <DialogTitle id='alert-dialog-title' className={this.props.classes.header}>
            <Grid container justify='flex-start' alignContent='center' alignItems='center'>
              <Grid item xs={2}>
                <LockIcon />
              </Grid>
              <Grid item xs={10}>
                Permission
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContentText id='alert-dialog-description' className={this.props.classes.content}>
            Please set the current {this.props.number} notes of permission.
          </DialogContentText>
          <Divider style={{ margin: '16px 0' }} />
          <Grid container justify='center'>
            <Grid item container justify='center' xs={12}>
              <Grid item xs={4}>
                <label className={this.props.classes.label}> Read </label>
              </Grid>
              <Grid item>
                <ToggleButtonGroup value={this.state.read} exclusive onChange={this.handleRead}>
                  {
                    [1, 2, 3].map(index => (
                      <ToggleButton key={`read-permission-${index}`} value={index}>
                        {permissionType[index - 1]}
                      </ToggleButton>
                    ))
                  }
                </ToggleButtonGroup>
              </Grid>
            </Grid>
            <Grid item container justify='center' xs={12}>
              <Grid item xs={4}>
                <label className={this.props.classes.label}> Write </label>
              </Grid>
              <Grid item>
                <ToggleButtonGroup value={this.state.write} exclusive onChange={this.handleWrite}>
                  {
                    [1, 2, 3].map(index => (
                      <ToggleButton key={`write-permission-${index}`} value={index} disabled={this.state.read < index} >
                        {permissionType[index - 1]}
                      </ToggleButton>
                    ))
                  }
                </ToggleButtonGroup>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.disagreeEvent}> 取消 </Button>
          <Button onClick={() => this.props.agreeEvent(this.state)}>
            {this.props.loading ? <CircularProgress size={14} /> : '確定'}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

PermissionModal.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(PermissionModal)
