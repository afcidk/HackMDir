import React from 'react'
import Grid from '@material-ui/core/Grid'
import MainMenuContainer from './containers/MainMenuContainer.js'
import ListContainer from './containers/ListContainer.js'

class Root extends React.Component {
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
        <MainMenuContainer />
        <ListContainer />
      </Grid>
    )
  }
}

export default Root
