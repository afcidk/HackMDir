import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'

import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import Grid from '@material-ui/core/Grid'

import Directory from '../../../api/directory.js'
import API from '../../../api/api.js'

const styles = theme => ({
  root: {
    zIndex: '99999999',
    cursor: 'pointer',
    height: '48px',
    width: '100%'
  },
  ul: {
    padding: '0',
    width: '100%'
  },
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
    opacity: '0',
    transition: 'opacity 100ms ease-in-out',
    '&:hover': {
      opacity: '1'
    }
  },
  checkedStyle: {
    color: '#4285f4',
    fill: '#4285f4'
  },
  forceDisplay: {
    opacity: '1 !important'
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

const NoteItem = SortableElement(
  ({
    noteName,
    index,
    sortIndex,
    style,
    props,
    handleCheckboxClick,
    handleListClick
  }) => {
    return (
      <ListItem
        button
        onClick={(e) => {
          handleListClick(e, index)
        }}
        style={{ backgroundColor: props.dir[props.dirContent.title].check.notes[props.dirContent.notes[sortIndex].href.substr(18)] ? 'rgba(221, 215, 253)' : null }}
        className={style.root}
      >
        <Grid
          container
          spacing={16}
          justify='flex-start'
          alignContent='center'
          alignItems='center'
        >
          <Grid item xs={3} />
          <Grid item xs={7}>
            <ListItemText primary={noteName} classes={{ primary: `${style.text} ${props.dirContent.check.notes[props.dirContent.notes[sortIndex].href.substr(18)] ? style.checkedStyle : null}` }} />
          </Grid>
          <Grid item xs={2}>
            <Checkbox
              style={{ color: '#4285f4' }}
              className={props.displayCheckbox ? `${style.forceDisplay} ${style.checkbox} test` : `${style.checkbox}`}
              checked={props.dir[props.dirContent.title].check.notes[props.dirContent.notes[sortIndex].href.substr(18)]}
              onClick={(e) => {
                handleCheckboxClick(e, sortIndex)
              }}
            />
          </Grid>
        </Grid>
      </ListItem>
    )
  }
)

const NoteList = SortableContainer(
  ({ state, style, props, handleCheckboxClick, handleListClick }) => {
    console.log(props.dirContent.notes)
    return (
      <ul className={style.ul}>
        {props.dirContent.notes.map((note, index) => (
          <NoteItem
            key={`item-${index}`}
            index={index}
            sortIndex={index}
            noteName={note.title}
            state={state}
            style={style}
            props={props}
            handleCheckboxClick={handleCheckboxClick}
            handleListClick={handleListClick}
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
      noteindex: -1,
      dirId: -1
    }
    this.handleCheckboxClick = this.handleCheckboxClick.bind(this)
    this.onSortEnd = this.onSortEnd.bind(this)
    this.handleListClick = this.handleListClick.bind(this)
  }

  handleCheckboxClick (event, index) {
    event.stopPropagation()
    this.props.setDirNoteCheck({
      dirID: this.props.dirContent.title,
      noteID: this.props.dirContent.notes[index].href.substr(18),
      status: event.target.checked
    })
    // select item
    if (event.target.checked) {
      const temp = Object.assign({}, this.props.dirContent.notes[index], { dirID: this.props.dirContent.loc })
      this.props.selectNoteEvent(temp)
      console.log(this.props)
      this.props.setNewDir(false)
    } else {
      this.props.unSelectNoteEvent(this.props.dirContent.notes[index])
    }
  }

  handleListClick (event, index) {
    event.stopPropagation()
    window.open(this.props.dirContent.notes[index].href, '_blank')
  }

  onSortEnd ({ oldIndex, newIndex }) {
    const targetNote = this.props.dirContent.notes[oldIndex]
    if (getCursorPosition()[0] > 400) {
      Directory.moveNote(targetNote.title, targetNote.href, { dirId: this.props.dirId, noteId: oldIndex })
    } else {
      Directory.moveNote(targetNote.title, targetNote.href, { dirId: this.props.dirId, noteId: oldIndex }, { dirId: this.props.dirId, noteId: newIndex })
    }
    const result = API.getData('directory')
    this.props.setDir({ current: result, prev: this.props.dir })
  }

  render () {
    return (
      <NoteList
        distance={1}
        style={this.props.classes}
        props={this.props}
        onSortEnd={this.onSortEnd}
        state={this.state}
        handleCheckboxClick={this.handleCheckboxClick}
        handleListClick={this.handleListClick}
      />
    )
  }
}

export default withStyles(styles)(NoteContainer)
