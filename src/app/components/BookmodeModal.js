import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import Grid from '@material-ui/core/Grid'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import DescriptionIcon from '@material-ui/icons/Description'
import CircularProgress from '@material-ui/core/CircularProgress'

import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import arrayMove from 'array-move'
import { TextField } from '@material-ui/core'

const SortableItem = SortableElement(({ title }) => {
  return (
    <React.Fragment>
      <ListItem style={{ zIndex: 999999 }}>
        <Grid container spacing={16} justify='flex-start' alignContent='center' alignItems='center'>
          <Grid item xs={2}>
            <ListItemIcon>
              <DescriptionIcon />
            </ListItemIcon>
          </Grid>
          <Grid item xs={8}>
            <ListItemText primary={title} />
          </Grid>
        </Grid>
      </ListItem>
    </React.Fragment>

  )
})

const SortableList = SortableContainer(({ items }) => {
  return (
    <List>
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
  content: {
    fontSize: '14px'
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
      <Dialog open={this.props.show} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
        <DialogContent>
          <DialogTitle id='alert-dialog-title' className={this.props.classes.header}>
            建立 Bookmode
          </DialogTitle>
          <TextField
            id='bookmode-name'
            label='title'
            value={this.state.title}
            onChange={this.handelChange}
            margin='normal'
          />
          <DialogContentText id='alert-dialog-description' className={this.props.classes.content}>
            請針對你所選擇的 {Object.keys(this.props.selectedItems).length} 項筆記進行排序
          </DialogContentText>
          <SortableList items={this.state.items} onSortEnd={this.onSortEnd} lockAxis='y' />
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

BookmodeModal.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(BookmodeModal)
