
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import MainMenuContainer from './containers/MainMenuContainer.js'
import ListContainer from './containers/ListContainer.js'
import Slide from '@material-ui/core/Slide'

const styles = theme => ({
  root: {
    boxShadow: '0 9px 18px rgba(0, 0, 0, 0.36)'
  }
})

class Root extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      display: false
    }
  }
  componentWillMount () {
    window.__HMDIR = new Proxy(window.__HMDIR, {
      set: function (target, prop, value) {
        if (prop === 'display') {
          console.log('test')
          this.setState({ display: value })
          if (value) {
            window.__HMDIR.root.setAttribute('data-display', 'true')
          } else {
            window.__HMDIR.root.setAttribute('data-display', 'false')
            const mousemoveHandler = function (event) {
              clearTimeout(window.__HMDIR.mousemoving)
              window.__HMDIR.mousemoving = setTimeout(function () {
                if (event.clientX < 300 && event.clientY > 60) {
                  window.__HMDIR.display = true
                  window.__HMDIR.root.focus()
                  document.removeEventListener('mousemove', mousemoveHandler)
                }
              }, 100)
            }
            setTimeout(function () {
              document.addEventListener('mousemove', mousemoveHandler)
            }, 100)
          }
        }
        target[prop] = value
        return true
      }.bind(this)
    })
  }
  // the render function
  render () {
    return (
      <Slide
        in={this.state.display}
        timeout={100}
        direction='right'>
        <Grid
          container
          direction='column'
          justify='center'
          alignContent='flex-start'
          alignItems='flex-start'
          spacing={0}
          className={this.props.classes.root}>
          <MainMenuContainer />
          <ListContainer />
        </Grid>
      </Slide>
    )
  }
}

Root.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Root)
