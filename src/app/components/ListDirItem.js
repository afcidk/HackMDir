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
import arrayMove from 'array-move'

import ListDirNoteItem from './ListDirNoteItem.js'

const styles = theme => ({
  ul: {
    paddingLeft: '0px'
  },
  root: {
    width: '100%',
    maxWidth: 360
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
            {state.open[sortIndex] ? <ExpandLess /> : <ChevronRight />}
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
        <Collapse in={state.open[sortIndex]} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <ListItem>
              <ListDirNoteItem value={value} dirId={sortIndex} />
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
    handleAddList
  }) => {
    return (
      <ul className={style.ul}>
        {/* { this.props.newdir ? <NewDirItem handleSubmit={this.handleSubmit} handleChange={this.handleChange} /> : null } */}
        {props.dir.map((value, index) => {
          // handleAddList(value.title)
          return (
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
      dirs: [],
      // open: [],
      open: props.open
      // newDirName: ''
    }

    this.handleAddList = this.handleAddList.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.checkBoxonMouseOver = this.checkBoxonMouseOver.bind(this)
    this.checkBoxonMouseLeave = this.checkBoxonMouseLeave.bind(this)
    this.onSortEnd = this.onSortEnd.bind(this)
  }

  handleAddList (newitem) {
    let lists = this.state.dirs
    let newlists = []
    newlists.push(newitem)
    for (let i = 0; i <= lists.length - 1; i++) {
      newlists.push(lists[i])
    }
    this.setState({
      dirs: newlists
    })
    console.log(this.state.dirs)
  };

  // handleChange(event) {
  //   this.setState({newDirName: event.target.value});
  // }

  // handleSubmit(event) {
  //   this.handleAddList(this.state.newDirName);
  //   console.log(this.state.newDirName)
  //   console.log(this.state.newDirName.toString())
  //   Directory.newDir(this.state.newDirName.toString());
  //   event.preventDefault();
  // }

  handleClick (index) {
    const temp = this.state.open.slice()
    temp[index] = !temp[index]
    this.setState({ open: temp })
    console.log('test', index, temp)
  };

  checkBoxonMouseOver () {
    this.setState({ displayCheckbox: true })
  };

  checkBoxonMouseLeave () {
    this.setState({ displayCheckbox: this.props.displayCheckbox })
  };

  onSortEnd (oldIndex, newIndex) {
    console.log(oldIndex, newIndex)
    // Directory.moveDir(newIndex, oldIndex)
    this.setState(({ dirs, open }) => ({
      dirs: arrayMove(dirs, oldIndex, newIndex),
      open: arrayMove(open, oldIndex, newIndex)
    }))
  };

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
    console.log(this.props.dir)
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
        handleAddList={this.handleAddList}
      />
    )
  }
}

export default withStyles(styles)(ListDirItem)
