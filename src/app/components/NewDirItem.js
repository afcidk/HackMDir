import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Grid from '@material-ui/core/Grid'

import DragHandle from '@material-ui/icons/DragHandle'

const styles = theme => ({
  newDir: {
    paddingRight: '8px',
    paddingLeft: '8px',
    paddingTop: '8px',
    paddingBottom: '8px'
  },
  input: {
    borderRadius: '4px',
    borderColor: '#4285f4'
  },
  button: {
    borderRadius: '4px',
    borderColor: '#4285f4',
    margin: '4px',
    backgroundColor: '#4285f4',
    color: 'white'
  }
})

class NewDirItem extends React.Component {
  // the render function
  render () {
    return (
      <Grid container spacing={16} justify='flex-start' alignContent='center' alignItems='center'>
        <Grid item xs={12}>
          <ListItem>
            <ListItemIcon>
              <DragHandle />
            </ListItemIcon>
            <form onSubmit={this.props.handleSubmit} className={this.props.classes.newDir}>
              <input className={this.props.classes.input} type='text' onChange={this.props.handleChange} />
              <input className={this.props.classes.button} type='submit' value='Add' />
            </form>
          </ListItem>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles)(NewDirItem)
