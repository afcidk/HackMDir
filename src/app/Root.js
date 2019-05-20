import React from 'react'
// import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import OperationContainer from './components/OperationContainer.js'
import ListContainer from './components/ListContainer.js'

import API from '../api/api.js'

class Root extends React.Component {
  // constructor
  constructor (props) {
    super(props)
    // state declaration
    this.state = {
      currentTab: 'Recent',
      items: []
    }
    // fetch the history in constructor
    API.getHistory().then(result => {
      this.setState({ items: result })
    })
  }

  // the render function
  render () {
    return (
      <Grid
        container
        direction='column'
        justify='center'
        alignContent='flex-start'
        alignItems='flex-start'
        spacing={0}>
        <OperationContainer
          item
          tab={this.state.currentTab} />
        <ListContainer
          item
          items={this.state.items}
          tab={this.state.currentTab} />
      </Grid>
    )
  }
}

export default Root
