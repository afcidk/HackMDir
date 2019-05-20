import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

import List from '@material-ui/core/List'
import ListNoteItem from './ListNoteItem.js'
import ListDirItem from './ListDirItem.js'

const styles = theme => ({
  root: {
    maxHeight: '610px',
    position: 'relative',
    overflow: 'auto'
  }
})

class ListContainer extends React.Component {
  // the render function
  render () {
    return (
      <List className={this.props.classes.root}>
        {this.props.items.map(target => (
          this.props.tab === 'Directory' ? <ListDirItem key={target.title} /> : <ListNoteItem key={target.title} title={target.title} href={target.href} />
        ))}
      </List>
    )
  }
}

ListContainer.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ListContainer)
