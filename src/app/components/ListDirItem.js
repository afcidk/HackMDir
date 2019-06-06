import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import Checkbox from '@material-ui/core/Checkbox'
import Grid from '@material-ui/core/Grid'

import DragHandle from '@material-ui/icons/DragHandle'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ChevronRight from '@material-ui/icons/ChevronRight'

import { sortableContainer, sortableElement } from 'react-sortable-hoc'
// import arrayMove from 'array-move'

import ListDirNoteItem from './ListDirNoteItem.js'
import DragAndDrop from './DragAndDrop.js'
import Directory from '../../api/directory.js'
import API from '../../api/api.js'

const styles = theme => ({
  ul: {
    paddingLeft: '0px'
  },
  root: {
    width: '100%',
    maxWidth: 360,
    zIndex: '99999999'
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
    transition: 'opacity 100ms ease-in-out'
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

const DirItem = sortableElement(
  ({
    value,
    dirName,
    sortIndex,
    state,
    handleClick,
    style,
    props,
    checkBoxonMouseOver,
    checkBoxonMouseLeave,
    handleCheckboxClick
  }) => (
    <List
      component='nav'
      style={{ backgroundColor: props.checked ? 'rgba(66, 33, 244, 0.18)' : null }}
      className={style.root}
    >
      <Grid container justify='flex-start' alignContent='center' alignItems='center'>
        <Grid item xs={12}>
          <ListItem
            button
            onClick={() => {
              handleClick(sortIndex)
            }}
          >
            <ListItemIcon>
              <DragHandle className={props.checked ? style.checkedStyle : null} />
            </ListItemIcon>
            {props.dirlistopen[sortIndex] ? <ExpandLess /> : <ChevronRight />}
            <ListItemText inset primary={`${dirName} - #${sortIndex}`} classes={{ primary: `${style.text} ${props.checked ? style.checkedStyle : null}` }} />
            <Checkbox
              style={{ opacity: state.displayCheckbox ? 1 : 0, color: '#4285f4' }}
              className={state.displayCheckbox ? `${style.forceDisplay} ${style.checkbox} test` : `${style.checkbox}`}
              onMouseOver={checkBoxonMouseOver}
              onMouseLeave={checkBoxonMouseLeave}
              onClick={(e) => {
                handleCheckboxClick(e, sortIndex)
              }}
              checked={props.dirliststate[sortIndex]}
            />
          </ListItem>
        </Grid>
        <Grid item xs={12}>
          <Collapse in={props.dirlistopen[sortIndex]} timeout='auto' unmountOnExit>
            <List component='div' disablePadding>
              <ListItem>
                <ListDirNoteItem
                  value={value}
                  dirId={sortIndex} setDir={props.setDir}
                  dirliststate={props.dirliststate} dirlistclick={state.dirlistclick} setDirState={props.setDirState}
                  dirlistlen={props.dir.length}
                  selectItemEvent={props.selectItemEvent} unSelectItemEvent={props.unSelectItemEvent} selectedList={props.selectedList}
                  notes={props.dir[sortIndex].notes} />
              </ListItem>
            </List>
          </Collapse>
        </Grid>
      </Grid>
    </List>
  )
)

const DirList = sortableContainer(
  ({
    handleClick,
    state,
    props,
    style,
    checkBoxonMouseOver,
    checkBoxonMouseLeave,
    handleCheckboxClick,
    handleDrop
  }) => {
    return (
      <ul className={style.ul}>
        {props.dir.map((value, index) => {
          return (
            <DragAndDrop handleDrop={handleDrop} dirId={index}>
              <DirItem
                key={`item-${index}`}
                index={index}
                value={value}
                dirName={value.title}
                sortIndex={index}
                state={state}
                handleClick={handleClick}
                props={props}
                style={style}
                checkBoxonMouseOver={checkBoxonMouseOver}
                checkBoxonMouseLeave={checkBoxonMouseLeave}
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

    // let initdirlists = []
    // props.dir.map((value) => {
    //   initdirlists.push(value.title)
    // })

    this.state = {
      displayCheckbox: props.displayCheckbox,
      // dirs: initdirlists,
      open: props.dirlistopen,
      dirlistclick: new Array(props.dirlistlen).fill(false),
      currentMouseX: 0
    }

    this.handleClick = this.handleClick.bind(this)
    this.checkBoxonMouseOver = this.checkBoxonMouseOver.bind(this)
    this.checkBoxonMouseLeave = this.checkBoxonMouseLeave.bind(this)
    this.handleCheckboxClick = this.handleCheckboxClick.bind(this)
    this.onSortEnd = this.onSortEnd.bind(this)
    this.detectMouseMove = this.detectMouseMove.bind(this)
    this.handleDrop = this.handleDrop.bind(this)
  }

  handleClick (index) {
    const temp = this.props.dirlistopen
    temp[index] = !temp[index]
    this.props.setDirOpen(temp)
    this.setState({ open: temp })
  };

  checkBoxonMouseOver () {
    this.setState({ displayCheckbox: true })
  };

  checkBoxonMouseLeave () {
    this.setState({ displayCheckbox: this.props.displayCheckbox })
  };

  detectMouseMove (event) {
    this.setState({ currentMouseX: event.clientX })
  }

  onSortEnd (oldIndex, newIndex) {
    // remove the dir if the user drag the dir outside the whole window
    if (this.state.currentMouseX > 400) {
      Directory.delDir(oldIndex.oldIndex)
      const result = API.getData('directory')
      this.props.setDir(result)
      return
    }

    Directory.moveDir(oldIndex.newIndex, oldIndex.oldIndex)
    let result = API.getData('directory')
    this.props.setDir(result)

    let newopen = this.props.dirlistopen
    let newindexsit = newopen[oldIndex.newIndex]
    let i = 0
    newopen[oldIndex.newIndex] = newopen[oldIndex.oldIndex]
    if (oldIndex.newIndex > oldIndex.oldIndex) {
      for (i = 0; i < (oldIndex.newIndex - oldIndex.oldIndex) - 1; i++) {
        newopen[oldIndex.oldIndex + i] = newopen[oldIndex.oldIndex + 1 + i]
      }
      newopen[oldIndex.oldIndex + i] = newindexsit
    } else if (oldIndex.newIndex < oldIndex.oldIndex) {
      for (i = 0; i < (oldIndex.oldIndex - oldIndex.newIndex) - 1; i++) {
        newopen[oldIndex.oldIndex - i] = newopen[oldIndex.oldIndex - 1 - i]
      }
      newopen[oldIndex.oldIndex - i] = newindexsit
    }

    this.setState(({ dirs, open }) => ({
      // dirs: arrayMove(dirs, oldIndex.newIndex, oldIndex.oldIndex),
      open: newopen
    }))
    this.props.setDirOpen(this.state.open)
    console.log('state open ', this.state.open)
  };

  handleDrop (notes, dirId) {
    Directory.moveNote(notes.getData('name'), notes.getData('href'), null, { dirId: dirId, noteId: 0 })
    let result = API.getData('directory')
    this.props.setDir(result)
  }

  handleCheckboxClick (event, index) {
    event.stopPropagation()
    let clicklists = []
    for (let i = 0; i < this.props.dirliststate.length; i++) {
      if (i === index) {
        if (event.target.checked) {
          clicklists.push(true)
          for (let j = 0; j < this.props.dir[index].notes.length; j++) {
            this.props.selectItemEvent({
              title: this.props.dir[index].notes[j].title,
              href: this.props.dir[index].notes[j].href
            })
          }
        } else {
          clicklists.push(false)
          for (let j = 0; j < this.props.dir[index].notes.length; j++) {
            this.props.unSelectItemEvent({
              title: this.props.dir[index].notes[j].title,
              href: this.props.dir[index].notes[j].href
            })
          }
        }
      } else clicklists.push(this.props.dirliststate[i])
    }
    this.props.setDirState(clicklists)
    this.setState({ dirlistclick: clicklists })
  }

  // the render function
  render () {
    return (
      <DirList
        distance={1}
        style={this.props.classes}
        props={this.props}
        onSortEnd={this.onSortEnd}
        handleClick={this.handleClick}
        state={this.state}
        onSortMove={this.detectMouseMove}
        checkBoxonMouseOver={this.checkBoxonMouseOver}
        checkBoxonMouseLeave={this.checkBoxonMouseLeave}
        handleCheckboxClick={this.handleCheckboxClick}
        handleDrop={this.handleDrop}
      />
    )
  }
}

export default withStyles(styles)(ListDirItem)
