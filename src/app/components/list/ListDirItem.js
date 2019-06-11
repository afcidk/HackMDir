/* global event */
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import Checkbox from '@material-ui/core/Checkbox'
import Grid from '@material-ui/core/Grid'

import FolderIcon from '@material-ui/icons/Folder'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ChevronRight from '@material-ui/icons/ChevronRight'
import CustomSnackbar from '../CustomSnackbar.js'

import { SortableContainer, SortableElement } from 'react-sortable-hoc'
// import arrayMove from 'array-move'

import ListDirNoteItem from './ListDirNoteItem.js'
import DragAndDrop from './DragAndDrop.js'
import Directory from '../../../api/directory.js'
import API from '../../../api/api.js'
import { Input } from '@material-ui/core'
import { withSnackbar } from 'notistack'

const styles = theme => ({
  ul: {
    paddingLeft: '0px'
  },
  li: {
    padding: '0'
  },
  root: {
    width: '100%',
    maxWidth: 360,
    zIndex: '99999999',
    padding: '0'
  },
  dirStyle: {
    height: '48px'
  },
  noteListStyle: {
    width: '100%',
    padding: '0'
  },
  text: {
    display: 'inline-block',
    maxWidth: '180px',
    height: '21px',
    fontSize: '14px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    color: 'black'
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
  },
  forceDisplay: {
    opacity: '1 !important'
  }
})

const DirItem = SortableElement(
  ({
    value,
    sortIndex,
    handleClick,
    handleDirPress,
    handleDirRelease,
    handleRenameDir,
    style,
    props,
    state,
    handleCheckboxClick
  }) => {
    console.log(props.dir)
    return (
      <List
        style={{ backgroundColor: value.check.dir ? 'rgba(221, 215, 253)' : null }}
        className={style.root}
      >
        <ListItem
          button
          className={props.classes.dirStyle}
          onMouseDown={(e) => {
            handleDirPress(e, value.title)
          }}
          onMouseUp={() => {
            handleDirRelease()
            if (state.isShortClick === true) {
              handleClick(value.title)
            }
          }}
        >
          <Grid container spacing={16} justify='flex-start' alignItems='center' alignContent='center'>
            <Grid item container xs={3}>
              <Grid item xs={8} container justify='flex-start' alignItems='center' alignContent='center'>
                <ListItemIcon>
                  <FolderIcon className={value.check.dir ? style.checkedStyle : null} />
                </ListItemIcon>
              </Grid>
              <Grid item xs={4} container justify='flex-start' alignItems='center' alignContent='center'>
                <ListItemIcon>
                  {value.open ? <ExpandLess className={value.check.dir ? style.checkedStyle : null} style={{ color: 'black', fontSize: '14px' }} /> : <ChevronRight className={value.check.dir ? style.checkedStyle : null} style={{ color: 'black', fontSize: '14px' }} />}
                </ListItemIcon>
              </Grid>
            </Grid>
            <Grid item xs={7}>
              {value.isRenaming
                ? <Input
                  autoFocus
                  placeholder='Enter a new name'
                  inputProps={{
                    'aria-label': 'Description',
                    style: {
                      fontSize: '14px'
                    }
                  }}
                  onBlur={() => { handleRenameDir(event, sortIndex, value.title) }}
                />
                : <ListItemText primary={value.title} classes={{ primary: `${style.text} ${value.check.dir ? style.checkedStyle : null}` }} />
              }
            </Grid>
            <Grid xs={2} item>
              <Checkbox
                style={{ color: '#4285f4' }}
                className={props.displayCheckbox ? `${style.forceDisplay} ${style.checkbox} test` : `${style.checkbox}`}
                onClick={(e) => {
                  handleCheckboxClick(e, value.title)
                }}
                checked={value.check.dir}
              />
            </Grid>
          </Grid>
        </ListItem>
        <Collapse in={value.open} timeout={100} mountOnEnter unmountOnExit>
          <ListItem className={props.classes.noteListStyle}>
            <ListDirNoteItem
              dirId={sortIndex} setDir={props.setDir} setNewDir={props.setNewDir}
              dir={props.dir} setDirNoteCheck={props.setDirNoteCheck}
              selectNoteEvent={props.selectNoteEvent} unSelectNoteEvent={props.unSelectNoteEvent} selectedNotes={props.selectedNotes}
              dirContent={value}
              displayCheckbox={props.displayCheckbox} />
          </ListItem>
        </Collapse>
      </List>
    )
  }
)

const DirList = SortableContainer(
  ({
    dir,
    handleRenameDir,
    handleClick,
    handleDirPress,
    handleDirRelease,
    state,
    props,
    style,
    handleCheckboxClick,
    handleDrop
  }) => {
    return (
      <ul className={style.ul}>
        {Object.values(dir).sort((a, b) => a.loc - b.loc).map((value, index) => {
          return (
            <DragAndDrop handleDrop={handleDrop} dirId={index} key={`dir-item-${value.title}-${index}`}>
              <DirItem
                key={`item-${index}`}
                index={index}
                value={value}
                sortIndex={index}
                state={state}
                handleClick={handleClick}
                handleDirPress={handleDirPress}
                handleDirRelease={handleDirRelease}
                props={props}
                style={style}
                handleCheckboxClick={handleCheckboxClick}
                handleRenameDir={handleRenameDir}
                dir={dir}
              />
            </DragAndDrop>
          )
        })}
      </ul>
    )
  }
)

class ListDirItem extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      displayCheckbox: props.displayCheckbox,
      currentMouseX: 0,
      dirPressTimer: null,
      isShortClick: true
    }

    this.handleRenameDir = this.handleRenameDir.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleDirPress = this.handleDirPress.bind(this)
    this.handleDirRelease = this.handleDirRelease.bind(this)
    this.handleCheckboxClick = this.handleCheckboxClick.bind(this)
    this.onSortEnd = this.onSortEnd.bind(this)
    this.detectMouseMove = this.detectMouseMove.bind(this)
    this.handleDrop = this.handleDrop.bind(this)
    this.onSortStart = this.onSortStart.bind(this)
    this.shouldCancelStart = this.shouldCancelStart.bind(this)
  }

  shouldCancelStart () {
    var flag = false
    Object.keys(this.props.dir).map(key => {
      if (this.props.dir[key].isRenaming) {
        flag = true
      }
    })
    if (flag) {
      return true
    }
    return false
  }

  handleRenameDir (event, sortIndex, dirName) {
    if (event.target.value === '') {

    } else {
      if (Directory.renameDir(sortIndex, event.target.value)) {
        const dirNameConfig = { prev: dirName, new: event.target.value }
        this.props.renameDir(dirNameConfig)
        Directory.renameDir(sortIndex, event.target.value)
      } else {
        this.props.enqueueSnackbar('', {
          children: (key) => (
            <CustomSnackbar id={key} message='You are not allowed to rename a directory repeatedly, please rename again!' />
          )
        })
      }
    }
  }

  handleDirPress (event, dirName) {
    if (event.which === 3 || event.button === 2) {
      return
    }
    this.state.isShortClick = true
    let isChecked = false
    this.state.dirPressTimer = setTimeout(() => {
      console.log('long press activated!')
      Object.keys(this.props.dir).map(key => {
        if (Object.values(this.props.dir[key].check.notes).includes(true) || this.props.dir[key].check.dir === true) { isChecked = true }
      })
      this.state.isShortClick = false
      if (!isChecked) {
        this.props.setIsRenaming({ dirID: dirName, status: true })
      }
    }, 1000)
  }
  handleDirRelease () {
    clearTimeout(this.state.dirPressTimer)
    Object.keys(this.props.dir).map(key => {
      console.log(this.props.dir[key].isRenaming)
    })
  }

  handleClick (dirname) {
    this.props.setDirOpen({ dirID: dirname, status: !this.props.dir[dirname].open })
  }

  detectMouseMove (event) {
    this.setState({ currentMouseX: event.clientX })
  }

  onSortStart () {
    clearTimeout(this.state.dirPressTimer)
  }

  onSortEnd ({ oldIndex, newIndex }) {
    // remove the dir if the user drag the dir outside the whole window
    if (this.state.currentMouseX > 400) {
      Directory.delDir(oldIndex)
      const targetDirName = Object.values(this.props.dir).find(target => target.loc === oldIndex).title
      this.props.deleteDir(targetDirName)
      return
    }

    Directory.moveDir(newIndex, oldIndex)
    const result = API.getData('directory')
    this.props.setDir({ current: result, prev: this.props.dir })
  }

  handleDrop (notes, dirId) {
    Directory.moveNote(notes.getData('title'), notes.getData('href'), null, { dirId: dirId, noteId: 0 })
    const result = API.getData('directory')
    this.props.setDir({ current: result, prev: this.props.dir })
  }

  handleCheckboxClick (event, dirname) {
    event.stopPropagation()
    this.props.setDirCheck({
      dirID: dirname,
      status: event.target.checked
    })
    this.props.dir[dirname].notes.forEach(note => {
      if (event.target.checked) {
        this.props.selectNoteEvent(note)
        this.props.setNewDir(false)
      } else {
        this.props.unSelectNoteEvent(note)
      }
    })
  }

  // the render function
  render () {
    return (
      <DirList
        distance={1}
        style={this.props.classes}
        props={this.props}
        onSortEnd={this.onSortEnd}
        onSortStart={this.onSortStart}
        handleClick={this.handleClick}
        handleDirPress={this.handleDirPress}
        handleDirRelease={this.handleDirRelease}
        state={this.state}
        onSortMove={this.detectMouseMove}
        handleCheckboxClick={this.handleCheckboxClick}
        handleDrop={this.handleDrop}
        shouldCancelStart={this.shouldCancelStart}
        handleRenameDir={this.handleRenameDir}
        dir={this.props.dir}
      />
    )
  }
}

export default withStyles(styles)(withSnackbar(ListDirItem))
