import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

import List from '@material-ui/core/List'
import ListNoteItem from './ListNoteItem.js'
import ListDirItem from './ListDirItem.js'
import NewDirItem from './NewDirItem.js'

import Slide from '@material-ui/core/Slide'

import OperationContent from './OperationContent.js'
import Collapse from '@material-ui/core/Collapse'

import API from '../../api/api.js'
import Directory from '../../api/directory.js'
import ListSubheader from '@material-ui/core/ListSubheader'

// use memo to enhance the render performance
const MemoListNoteItem = React.memo(ListNoteItem)
// const MemoListDirItem = React.memo(ListDirItem)

const styles = theme => ({
  root: {
    width: '320px',
    height: '651px',
    maxHeight: '651px',
    position: 'relative',
    overflow: 'auto',
    padding: '0'
  },
  spinner: {
    display: 'flex',
    justifyContent: 'center',
    justifyItems: 'center',
    alignContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '651px',
    backgroundColor: 'rgba(0, 0, 0, 0.18)'
  },
  header: {
    padding: '0'
  }
})

class ListContent extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      changingTab: false,
      newDirName: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    // this.handleAddList = this.handleAddList.bind(this)
  }

  componentWillMount () {
    this.fetchData(this.props.tab)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.tab === nextProps.tab) {
      return
    }
    this.fetchData(nextProps.tab)
    // erase the selected items
    this.props.setSelected({})
  }

  fetchData (tab) {
    let result = []
    this.setState({ changingTab: true })
    if (tab === 'Recent') {
      result = API.getData('history')
    } else if (tab === 'Personal') {
      result = API.getData('personal')
    } else if (tab === 'Directory') {
      result = API.getData('directory')
    }
    // deal with the transition delay
    setTimeout(function () {
      setTimeout(function () {
        this.props.setItems(result)
        this.props.setDir(result)

        let initopenlists = []
        let count = 0
        this.props.dirlist.map(() => {
          count = count + 1
        })
        for (let i = 0; i <= count - 1; i++) {
          initopenlists.push(false)
        }
        this.props.setDirOpen(initopenlists)

        this.setState({
          changingTab: false
        })
      }.bind(this), 100)
    }.bind(this), 100)
  }

  // handleAddList (newitem) {
  //   let lists = this.state.dirs
  //   let open = this.state.open
  //   let newlists = []
  //   let newopen = []
  //   newlists.push(newitem)
  //   for (let i = 0; i <= lists.length - 1; i++) {
  //     newlists.push(lists[i])
  //   }
  //   newopen.push(false)
  //   for (let i = 0; i <= open.length - 1; i++) {
  //     newopen.push(open[i])
  //   }
  //   this.setState({
  //     dirs: newlists,
  //     open: newopen
  //   })
  // };

  handleChange (event) {
    this.setState({ newDirName: event.target.value })
  }

  handleSubmit (event) {
    // this.handleAddList(this.state.newDirName)
    Directory.newDir(this.state.newDirName.toString())
    let result = API.getData('directory')
    this.props.setDir(result)

    let openlists = []
    openlists.push(false)
    for (let i = 0; i < this.props.dirlistopen.length; i++) {
      openlists.push(this.props.dirlistopen[i])
    }
    this.props.setDirOpen(openlists)

    this.props.setNewDir(false)
    event.preventDefault()
  }

  // the render function
  render () {
    console.log('ListContent render')
    // destructuring assignment
    const { list, selectedList, selectItem, unSelectItem, deleteItems, setSelected, setNewDir, dirlist, setDir, dirlistopen, setDirOpen } = this.props
    let updatedList = list.filter((item) => {
      return item.title.toString().toLowerCase().indexOf(this.props.search.toLowerCase()) !== -1
    })
    return (
      <List className={this.props.classes.root}>
        <ListSubheader className={this.props.classes.header} key='operation-container'>
          <Collapse in={Object.keys(selectedList).length > 0} mountOnEnter unmountOnExit style={{ transformOrigin: '0 0 0' }} timeout={100}>
            <OperationContent tab={this.props.tab} list={list} selectedList={selectedList} deleteItemsEvent={deleteItems} setSelectedEvent={setSelected} />
          </Collapse>
        </ListSubheader>
        {this.props.tab === 'Directory' ? (
          <Slide
            in={!this.state.changingTab}
            direction='right'
            mountOnEnter
            unmountOnExit
            timeout={100}>
            <div>
              <div style={{ display: this.props.newdir ? 'block' : 'none' }}>
                <NewDirItem handleSubmit={this.handleSubmit} handleChange={this.handleChange} />
              </div>
              <ListDirItem dir={dirlist} setDir={setDir} dirlistopen={dirlistopen} setDirOpen={setDirOpen} setNewDir={setNewDir} newdir={this.props.newdir} displayCheckbox={Object.keys(selectedList).length > 0} selectItemEvent={selectItem} unSelectItemEvent={unSelectItem} />
            </div>
          </Slide>
        ) : (
          <Slide
            in={!this.state.changingTab}
            direction='right'
            mountOnEnter
            unmountOnExit
            timeout={100}>
            <div >
              <React.Fragment>
                {updatedList.map((target, index) => (
                  <MemoListNoteItem key={`note-${index}`} title={target.title} href={target.href} displayCheckbox={Object.keys(selectedList).length > 0} checked={selectedList[target.href.substr(18)]} selectItemEvent={selectItem} unSelectItemEvent={unSelectItem} />
                ))}
              </React.Fragment>
            </div>
          </Slide>
        )}
      </List>
    )
  }
}

ListContent.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ListContent)
