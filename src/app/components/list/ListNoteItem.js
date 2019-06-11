import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import DescriptionIcon from '@material-ui/icons/Description'
import DragHandleIcon from '@material-ui/icons/DragHandle'
import Checkbox from '@material-ui/core/Checkbox'
import Grid from '@material-ui/core/Grid'

const styles = theme => ({
  root: {
    zIndex: 99999999
  },
  text: {
    display: 'inline-block',
    width: '180px',
    height: '21px',
    fontSize: '14px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  },
  checkbox: {
    width: '36px',
    height: '36px',
    transition: 'opacity 100ms ease-in-out',
    opacity: 0,
    color: '#4285f4',
    '&:hover': {
      opacity: '1'
    }
  },
  forceDisplay: {
    opacity: '1 !important'
  },
  checkedStyle: {
    color: '#4285f4',
    fill: '#4285f4'
  }
})

class ListNoteItem extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      displayCheckbox: props.displayCheckbox
    }

    this.handleCheckboxClick = this.handleCheckboxClick.bind(this)
    this.handleListClick = this.handleListClick.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.displayCheckbox !== this.state.displayCheckbox) {
      this.setState({ displayCheckbox: nextProps.displayCheckbox })
    }
  }

  handleListClick (event) {
    event.stopPropagation()
    window.open(this.props.href, '_blank')
  }

  handleCheckboxClick (event) {
    event.stopPropagation()
    if (event.target.checked) {
      this.props.selectNoteEvent({
        title: this.props.title,
        href: this.props.href
      })
    } else {
      console.log(this.props.unSelectNoteEvent)
      this.props.unSelectNoteEvent({
        title: this.props.title,
        href: this.props.href
      })
    }
  }

  // the render function
  render () {
    console.log('ListNoteItem render')
    return (
      <React.Fragment>
        <ListItem
          button
          onClick={this.handleListClick}
          className={this.props.classes.root}
          style={{ backgroundColor: this.props.checked ? 'rgba(66, 33, 244, 0.18)' : null, height: '48px' }}>
          <Grid container spacing={16} justify='flex-start' alignContent='center' alignItems='center'>
            {this.props.draggable ? (
              <Grid item xs={2}>
                <ListItemIcon>
                  <DragHandleIcon />
                </ListItemIcon>
              </Grid>) : null
            }
            <Grid item xs={2}>
              <ListItemIcon>
                <DescriptionIcon className={this.props.checked ? this.props.classes.checkedStyle : null} />
              </ListItemIcon>
            </Grid>
            <Grid item xs={8}>
              <ListItemText primary={this.props.title} classes={{ primary: `${this.props.classes.text} ${this.props.checked ? this.props.classes.checkedStyle : null}` }} />
            </Grid>
            {
              this.props.selectable ? (
                <Grid item xs={2}>
                  <Checkbox style={{ color: '#4285f4' }} className={this.state.displayCheckbox ? `${this.props.classes.forceDisplay} ${this.props.classes.checkbox} test` : `${this.props.classes.checkbox}`} onClick={this.handleCheckboxClick} checked={this.props.checked} />
                </Grid>
              ) : (
                null
              )
            }
          </Grid>
        </ListItem>
      </React.Fragment>
    )
  }
}

ListNoteItem.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ListNoteItem)
