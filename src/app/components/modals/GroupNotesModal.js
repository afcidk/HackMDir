import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Scrollbars } from 'react-custom-scrollbars'

import List from '@material-ui/core/List'
import ListNoteItem from '../list/ListNoteItem'
import Grid from '@material-ui/core/Grid'
import FolderIcon from '@material-ui/icons/Folder'
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
  textField: {
    fontSize: '14px',
    textAlign: 'left'
  }
})

class GroupNotesModal extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      title: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.submit = this.submit.bind(this)
  }

  handleChange (event) {
    console.log(event.target.value)
    this.setState({ title: event.target.value })
  }

  submit () {
    this.props.agreeEvent(this.state.title, this.state.items)
  }

  // the render function
  render () {
    return (
      <Dialog maxWidth='xs' fullWidth open={this.props.show} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
        <DialogContent>
          <DialogTitle id='alert-dialog-title' className={this.props.classes.header}>
            <Grid container justify='flex-start' alignContent='center' alignItems='center'>
              <Grid item xs={2}>
                <FolderIcon />
              </Grid>
              <Grid item xs={10}>
                Group
              </Grid>
            </Grid>
          </DialogTitle>
          <TextField
            id='group-directory'
            label='Directory Name'
            placeholder='Enter the name here ...'
            value={this.state.title}
            onChange={this.handleChange}
            margin='normal'
            variant='outlined'
            fullWidth
            autoFocus
            InputProps={{
              classes: {
                input: this.props.classes.textField
              }
            }}
          />
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
                  return <ListNoteItem draggable={false} selectable={false} key={`grouping-note-${index}`} title={target.title} href={target.href} />
                })
              }
            </Scrollbars>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.disagreeEvent}> Cancel </Button>
          <Button onClick={this.submit}>
            {this.props.loading ? <CircularProgress size={14} /> : 'Submit'}
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
