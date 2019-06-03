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
      <Grid container spacing={16} justify='flex-start' alignContent='center' alignItems='center'>
        <Grid item xs={10}>
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
          </ListItem>
        </Grid>
        <Grid item xs={2}>
          <Checkbox
            style={{ opacity: state.displayCheckbox ? 1 : 0, color: '#4285f4' }}
            className={style.checkbox}
            onMouseOver={checkBoxonMouseOver}
            onMouseLeave={checkBoxonMouseLeave}
            onClick={() => {
              handleCheckboxClick(sortIndex)
            }}
            // checked={props.checked}
          />
        </Grid>
        <Collapse in={props.dirlistopen[sortIndex]} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <ListItem>
              <ListDirNoteItem value={value} dirId={sortIndex} setDir={props.setDir} />
            </ListItem>
          </List>
        </Collapse>
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
            <DragAndDrop handleDrop={handleDrop}>
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
      open: this.props.dirlistopen,
      files: []
    }

    this.handleClick = this.handleClick.bind(this)
    this.checkBoxonMouseOver = this.checkBoxonMouseOver.bind(this)
    this.checkBoxonMouseLeave = this.checkBoxonMouseLeave.bind(this)
    this.onSortEnd = this.onSortEnd.bind(this)
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

  onSortEnd (oldIndex, newIndex) {
    console.log(oldIndex, newIndex)

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

  handleDrop (files) {
    console.log(files)
    let fileList = this.state.files
    for (var i = 0; i < files.length; i++) {
      if (!files[i].name) return
      fileList.push(files[i].name)
    }
    this.setState({ files: fileList })
  }

  handleCheckboxClick (index) {
    console.log(index)
    // event.stopPropagation()
    // if (event.target.checked) {
    //   this.props.selectItemEvent({
    //     title: this.props.title,
    //     href: this.props.href
    //   })
    // } else {
    //   this.props.unSelectItemEvent({
    //     title: this.props.title,
    //     href: this.props.href
    //   })
    // }
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
        checkBoxonMouseOver={this.checkBoxonMouseOver}
        checkBoxonMouseLeave={this.checkBoxonMouseLeave}
        handleCheckboxClick={this.handleCheckboxClick}
        handleDrop={this.handleDrop}
      />
    )
  }
}

export default withStyles(styles)(ListDirItem)
