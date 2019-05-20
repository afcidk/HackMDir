import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import DescriptionIcon from '@material-ui/icons/Description'

const styles = theme => ({
  text: {
    display: 'inline-block',
    maxWidth: '204px',
    height: '21px',
    fontSize: '14px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  }
})

class ListNoteItem extends React.Component {
  handleClick (event) {
    window.open(this.props.href, '_blank')
  }

  // the render function
  render () {
    return (
      <ListItem
        button
        onClick={this.handleClick.bind(this)}>
        <ListItemIcon>
          <DescriptionIcon />
        </ListItemIcon>
        <ListItemText primary={this.props.title} classes={{ primary: this.props.classes.text }} />
      </ListItem>
    )
  }
}

ListNoteItem.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ListNoteItem)
