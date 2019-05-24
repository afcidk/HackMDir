import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import DescriptionIcon from '@material-ui/icons/Description'
import Checkbox from '@material-ui/core/Checkbox'
import Grid from '@material-ui/core/Grid'

const styles = theme => ({
  text: {
    display: 'inline-block',
    maxWidth: '180px',
    height: '21px',
    fontSize: '14px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  },
  checkbox: {
    width: '36px',
    height: '36px',
    transition: 'opacity 100ms ease-in-out'
  },
  checkedStyle: {
    color: '#4285f4',
    fill: '#4285f4'
  }
})

class ListNoteItem extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      displayCheckbox: props.displayCheckbox
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.displayCheckbox !== this.state.displayCheckbox) {
      this.setState({ displayCheckbox: nextProps.displayCheckbox })
    }
  }
  // shouldComponentUpdate (nextProps, nextState) {
  //   let flag = true
  //   for (let key in nextProps) {
  //     if (nextProps[key] !== this.props[key]) {
  //       flag = false
  //     }
  //   }
  //   return flag
  // }

  handleListClick (event) {
    event.stopPropagation()
    window.open(this.props.href, '_blank')
  }

  handleCheckboxClick (event) {
    event.stopPropagation()
    if (event.target.checked) {
      this.props.selectItemEvent({
        title: this.props.title,
        href: this.props.href
      })
    } else {
      this.props.unSelectItemEvent({
        title: this.props.title,
        href: this.props.href
      })
    }
  }

  // the render function
  render () {
    return (
      <ListItem
        button
        onClick={this.handleListClick.bind(this)}
        style={{ backgroundColor: this.props.checked ? 'rgba(66, 33, 244, 0.18)' : null, height: '48px' }}>
        <Grid container spacing={16} justify='flex-start' alignContent='center' alignItems='center'>
          <Grid item xs={2}>
            <ListItemIcon>
              <DescriptionIcon className={this.props.checked ? this.props.classes.checkedStyle : null} />
            </ListItemIcon>
          </Grid>
          <Grid item xs={8}>
            <ListItemText primary={this.props.title} classes={{ primary: `${this.props.classes.text} ${this.props.checked ? this.props.classes.checkedStyle : null}` }} />
          </Grid>
          <Grid item xs={2}>
            <Checkbox style={{ opacity: this.state.displayCheckbox ? 1 : 0, color: '#4285f4' }} className={this.props.classes.checkbox} onMouseOver={e => { this.setState({ displayCheckbox: true }) }} onMouseLeave={e => { this.setState({ displayCheckbox: this.props.displayCheckbox }) }} onClick={this.handleCheckboxClick.bind(this)} checked={this.props.checked} />
          </Grid>
        </Grid>
      </ListItem>
    )
  }
}

ListNoteItem.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ListNoteItem)
