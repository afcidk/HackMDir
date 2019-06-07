import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Input from '@material-ui/core/Input'

const styles = theme => ({
  newDir: {
    boxShadow: '0 9px 18px rgba(0, 0, 0, 0.18)',
    padding: '4px 20px 4px 6px',
    height: '48px'
  },
  input: {
    fontSize: '16px'
  },
  button: {
    backgroundColor: '#4285f4',
    color: 'white',
    fontSize: '12px'
  }
})

class NewDirItem extends React.PureComponent {
  // the render function
  render () {
    return (
      <Grid component='form' container justify='flex-start' alignContent='center' alignItems='center' onSubmit={this.props.handleSubmit} className={this.props.classes.newDir}>
        <Grid item xs={1} />
        <Grid item xs={7}>
          <Input
            fullWidth
            autoFocus
            placeholder='New Dir'
            inputProps={{
              'aria-label': 'Description',
              style: {
                fontSize: '14px'
              }
            }}
            onChange={this.props.handleChange}
          />
        </Grid>
        <Grid item xs={1} />
        <Grid item xs={3}>
          <Button variant='contained' color='primary' className={this.props.classes.button} onClick={this.props.handleSubmit} type='submit'>
            Add
          </Button>
        </Grid>
        <Grid item xs={1} />
      </Grid>
    )
  }
}

export default withStyles(styles)(NewDirItem)
