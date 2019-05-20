import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'

const styles = theme => ({
  root: {
    backgroundColor: '#4285f4',
    width: '100%',
    margin: 0,
    minHeight: '149px'
  }
})

class OperationContainer extends React.Component {
  // constructor
  constructor (props) {
    super(props)
    // state declaration
    this.state = {
      tabs: ['Recent', 'Personal', 'Directory'],
      selectedTab: ''
    }
    // function desclaration
    this.handleChange = event => {
      this.setState({ selectedTab: event.target.value })
    }
  }

  // the render function
  render () {
    return (
      <Grid
        container
        direction='row'
        justify='center'
        alignContent='flex-start'
        alignItems='flex-start'
        spacing={8}
        className={this.props.classes.root}>
        <IconButton
          item
          color='inherit'
          size='small'
          aria-label='arrow-back'>
          <ArrowBackIcon />
        </IconButton>
        <form item>
          <FormControl>
            <InputLabel
              shrink
              htmlFor='tab-label-placeholder'>
              Tab
            </InputLabel>
            <Select
              value={this.props.tab}
              onChange={this.handleChange}
              displayEmpty
              input={<Input name='tab' id='tab-label-placeholder' />}
              name='tab'>
              {[0, 1, 2].map(index => (
                <MenuItem
                  value={this.state.tabs[index]}
                  key={this.state.tabs[index]}>
                  {this.state.tabs[index]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </form>

      </Grid>
    )
  }
}

OperationContainer.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(OperationContainer)
