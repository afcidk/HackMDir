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

import { SortableContainer, SortableElement } from 'react-sortable-hoc'
// import arrayMove from 'array-move'

import ListDirNoteItem from './ListDirNoteItem.js'
import DragAndDrop from './DragAndDrop.js'
import Directory from '../../api/directory.js'
import API from '../../api/api.js'
import { Input } from '@material-ui/core'

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
    dirName,
    sortIndex,
    handleClick,
    handleDirPress,
    handleDirRelease,
    style,
    props,
    state,
    handleCheckboxClick
  }) => {
    console.log(props.dir)
    return (
      <List
        style={{ backgroundColor: props.dir[dirName].check.dir ? 'rgba(221, 215, 253)' : null }}
        className={style.root}
      >
        <Grid container justify='flex-start' alignContent='center' alignItems='center'>
          <Grid item xs={12}>
            <ListItem
              button
              className={props.classes.dirStyle}
              onMouseDown={() => {
                handleDirPress(dirName)
              }}
              onMouseUp={() => {
                handleDirRelease()
                if (state.isShortClick === true) {
                  handleClick(dirName)
                }
              }}
            >
              <ListItemIcon>
                <FolderIcon className={props.dir[dirName].check.dir ? style.checkedStyle : null} />
              </ListItemIcon>
              <ListItemIcon>
                {props.dir[dirName].open ? <ExpandLess className={props.dir[dirName].check.dir ? style.checkedStyle : null} style={{ color: 'black' }} /> : <ChevronRight className={props.dir[dirName].check.dir ? style.checkedStyle : null} style={{ color: 'black' }} />}
              </ListItemIcon>
              {props.dir[dirName].isRenaming
                ? <Input
                  autoFocus
                  placeholder='Enter a new name'
                  inputProps={{
                    'aria-label': 'Description',
                    style: {
                      fontSize: '14px'
                    }
                  }}
                  onBlur={() => {
                    if (event.target.value === '') {

                    } else {
                      if (Directory.renameDir(sortIndex, event.target.value)) {
                        const dirNameConfig = { prev: dirName, new: event.target.value }
                        props.renameDir(dirNameConfig)
                        Directory.renameDir(sortIndex, event.target.value)
                      } else {
                        // alert('A same directory name exists. Please enter an unique name!')
                      }
                    }
                  }}
                />
                : <ListItemText inset primary={dirName} classes={{ primary: `${style.text} ${props.dir[dirName].check.dir ? style.checkedStyle : null}` }} />
              }

              <Checkbox
                style={{ color: '#4285f4' }}
                className={props.displayCheckbox ? `${style.forceDisplay} ${style.checkbox} test` : `${style.checkbox}`}
                onClick={(e) => {
                  handleCheckboxClick(e, dirName)
                }}
                checked={props.dir[dirName].check.dir}
              />
            </ListItem>
          </Grid>
          <Grid item xs={12}>
            <Collapse in={props.dir[dirName].open} timeout={100} mountOnEnter unmountOnExit>
              <List component='div' disablePadding>
                <ListItem className={style.li} >
                  <ListDirNoteItem
                    value={value}
                    dirId={sortIndex} setDir={props.setDir}
                    dir={props.dir} setDirNoteCheck={props.setDirNoteCheck}
                    selectNoteEvent={props.selectNoteEvent} unSelectNoteEvent={props.unSelectNoteEvent} selectedNotes={props.selectedNotes}
                    dirContent={props.dir[dirName]}
                    displayCheckbox={props.displayCheckbox} />
                </ListItem>
              </List>
            </Collapse>
          </Grid>
        </Grid>
      </List>
    )
  }
)

const DirList = SortableContainer(
  ({
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
        {Object.values(props.dir).sort((a, b) => a.loc - b.loc).map((value, index) => {
          return (
            <DragAndDrop handleDrop={handleDrop} dirId={index} key={`dir-item-${value.title}-${index}`}>
              <DirItem
                key={`item-${index}`}
                index={index}
                value={value}
                dirName={value.title}
                sortIndex={index}
                state={state}
                handleClick={handleClick}
                handleDirPress={handleDirPress}
                handleDirRelease={handleDirRelease}
                props={props}
                style={style}
                handleCheckboxClick={handleCheckboxClick}
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

  handleDirPress (dirName) {
    this.state.isShortClick = true
    this.state.dirPressTimer = setTimeout(() => {
      console.log('long press activated!')
      this.state.isShortClick = false
      this.props.setIsRenaming({ dirID: dirName, status: true })
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
      />
    )
  }
}

export default withStyles(styles)(ListDirItem)
