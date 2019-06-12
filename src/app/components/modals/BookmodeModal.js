import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import Grid from '@material-ui/core/Grid'

import List from '@material-ui/core/List'
import ListNoteItem from '../list/ListNoteItem.js'
import Scrollbars from 'react-custom-scrollbars'
import CircularProgress from '@material-ui/core/CircularProgress'
import LibraryBookIcon from '@material-ui/icons/LibraryBooks'

import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import arrayMove from 'array-move'
import { TextField } from '@material-ui/core'

const SortableItem = SortableElement(({ title, href }) => {
  return (
    <React.Fragment>
      <ListNoteItem draggable selectable={false} title={title} href={href} />
    </React.Fragment>

  )
})

const SortableList = SortableContainer(({ items }) => {
  return (
    <List>
      <Scrollbars
        autoHeight
        autoHeightMin={48}
        autoHeightMax={144}
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={500}>
        {
          items.map((target, index) => {
            return (
              <SortableItem
                key={`bookmode-note-${index}`}
                index={index}
                sortIndex={index}
                title={target.title}
                href={target.href} />
            )
          })
        }
      </Scrollbars>
    </List>
  )
})

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

class BookmodeModal extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      title: '',
      items: []
    }
    this.handelChange = this.handelChange.bind(this)
    this.onSortEnd = this.onSortEnd.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.loading) {
      return
    }
    this.setState({ items: Object.values(nextProps.selectedItems) })
  }

  onSortEnd ({ oldIndex, newIndex }) {
    this.setState({ items: arrayMove(this.state.items, oldIndex, newIndex) })
  }

  handelChange (event) {
    this.setState({ title: event.target.value })
  }

  // the render function
  render () {
    return (
      <Dialog maxWidth='xs' fullWidth open={this.props.show} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
        <DialogContent>
          <DialogTitle id='alert-dialog-title' className={this.props.classes.header}>
            <Grid container justify='flex-start' alignContent='center' alignItems='center'>
              <Grid item xs={2}>
                <LibraryBookIcon />
              </Grid>
              <Grid item xs={10}>
                Bookmode
              </Grid>
            </Grid>
          </DialogTitle>
          <TextField
            id='bookmode-name'
            label='Bookmode title'
            placeholder='Enter the name here ...'
            value={this.state.title}
            onChange={this.handelChange}
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
          <SortableList items={this.state.items} onSortEnd={this.onSortEnd} lockAxis='y' distance={1} />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.disagreeEvent}> Cancel </Button>
          <Button onClick={() => { this.props.agreeEvent(this.state.title, this.state.items) }}>
            {this.props.loading ? <CircularProgress size={14} /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

BookmodeModal.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(BookmodeModal)
