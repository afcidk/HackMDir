import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { sortableContainer, sortableElement } from 'react-sortable-hoc'
import arrayMove from 'array-move'

import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import Grid from '@material-ui/core/Grid'

import DragHandle from '@material-ui/icons/DragHandle'

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

function getCursorPosition (e) {
  var posx = 0
  var posy = 0
  if (!e) e = window.event
  if (e.pageX || e.pageY) {
    posx =
      e.pageX - document.documentElement.scrollLeft - document.body.scrollLeft
    posy =
      e.pageY - document.documentElement.scrollTop - document.body.scrollTop
  } else if (e.clientX || e.clientY) {
    posx = e.clientX
    posy = e.clientY
  }
  return [posx, posy]
}

const NoteItem = sortableElement(
  ({
    noteName,
    sortIndex,
    state,
    style,
    props,
    checkBoxonMouseOver,
    checkBoxonMouseLeave
  }) => (
    <ListItem>
      <Grid
        container
        spacing={16}
        justify='flex-start'
        alignContent='center'
        alignItems='center'
      >
        <Grid item xs={2}>
          <ListItemIcon>
            <DragHandle />
          </ListItemIcon>
        </Grid>
        <Grid item xs={8}>
          <ListItemText primary={`${noteName} - #${sortIndex}`} classes={{ primary: `${style.text} ${props.checked ? style.checkedStyle : null}` }} />
        </Grid>
        <Grid item xs={2}>
          <Checkbox
            style={{ opacity: state.displayCheckbox ? 1 : 0, color: '#4285f4' }}
            className={style.checkbox}
            onMouseOver={checkBoxonMouseOver}
            onMouseLeave={checkBoxonMouseLeave}
          />
        </Grid>
      </Grid>
    </ListItem>
  )
)

const NoteList = sortableContainer(
  ({ state, style, props, checkBoxonMouseOver, checkBoxonMouseLeave }) => {
    return (
      <ul>
        {props.value.notes.map((value, index) => (
          <NoteItem
            key={`item-${index}`}
            index={index}
            sortIndex={index}
            noteName={value.title}
            state={state}
            style={style}
            props={props}
            checkBoxonMouseOver={checkBoxonMouseOver}
            checkBoxonMouseLeave={checkBoxonMouseLeave}
          />
        ))}
      </ul>
    )
  }
)

class NoteContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      displayCheckbox: props.displayCheckbox,
      items: ['note 1'],
      dirId: -1
    }

    this.checkBoxonMouseOver = this.checkBoxonMouseOver.bind(this)
    this.checkBoxonMouseLeave = this.checkBoxonMouseLeave.bind(this)
    this.onSortEnd = this.onSortEnd.bind(this)
  }

  checkBoxonMouseOver () {
    this.setState({ displayCheckbox: true })
  };

  checkBoxonMouseLeave () {
    this.setState({ displayCheckbox: this.props.displayCheckbox })
  };

  onSortEnd (oldIndex, newIndex) {
    if (getCursorPosition()[0] > 320) {
      console.log('Remove', this.state.items[oldIndex])
      // Directory.moveNote(title, href, src = {dirId: this.props.dirId, noteId: oldIndex})
    } else {
      // Directory.moveNote(title, href, dst = {dirId: this.props.dirId, noteId: newIndex}, src = {dirId: this.props.dirId, noteId: oldIndex})
    }
    this.setState(({ items }) => ({
      items: arrayMove(items, oldIndex, newIndex)
    }))
  };
  render () {
    return (
      <NoteList
        distance={1}
        style={this.props.classes}
        props={this.props}
        onSortEnd={this.onSortEnd}
        state={this.state}
        checkBoxonMouseOver={this.checkBoxonMouseOver}
        checkBoxonMouseLeave={this.checkBoxonMouseLeave}
      />
    )
  }
}

export default withStyles(styles)(NoteContainer)
