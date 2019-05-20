import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import FolderIcon from '@material-ui/icons/Folder'

class ListNoteItem extends React.Component {
  handleClick (event) {
  }

  // the render function
  render () {
    return (
      <ListItem
        button
        onClick={this.handleClick}>
        <ListItemIcon>
          <FolderIcon />
        </ListItemIcon>
        <ListItemText primary={this.props.title} />
      </ListItem>
    )
  }
}

export default ListNoteItem
