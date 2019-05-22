import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

const styles = theme => ({
  header: {
    padding: '24px 0',
    '& h2': {
      textAlign: 'left',
      fontSize: '18px'
    }
  },
  content: {
    fontSize: '14px'
  }
})

class BookmodeModal extends React.Component {
  // the render function
  render () {
  }
}

BookmodeModal.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(BookmodeModal)
