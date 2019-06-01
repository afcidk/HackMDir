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
// import Directory from '../../api/directory.js'
import ListSubheader from '@material-ui/core/ListSubheader'

// use memo to enhance the render performance
// const MemoListNoteItem = React.memo(ListNoteItem)
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
      dirs: [],
      open: [],
      newDirName: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleAddList = this.handleAddList.bind(this)
  }
  componentDidMount () {
    this.fetchData(this.props.tab)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.tab === nextProps.tab) {
      return
    }
    this.fetchData(nextProps.tab)
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
      console.log(API.getData('directory'))
      // result = [1]
    }
    // deal with the transition delay
    setTimeout(function () {
      this.props.setItems([])
      setTimeout(function () {
        this.props.setItems(result)
        this.setState({ changingTab: false })
      }.bind(this), 100)
    }.bind(this), 100)
  }

  handleAddList (newitem) {
    let lists = this.state.dirs
    let open = this.state.open
    let newlists = []
    let newopen = []
    newlists.push(newitem)
    for (let i = 0; i <= lists.length - 1; i++) {
      newlists.push(lists[i])
    }
    newopen.push(false)
    for (let i = 0; i <= open.length - 1; i++) {
      newopen.push(open[i])
    }
    this.setState({
      dirs: newlists,
      open: newopen
    })
  };

  handleChange (event) {
    this.setState({ newDirName: event.target.value })
  }

  handleSubmit (event) {
    this.handleAddList(this.state.newDirName)
    // Directory.newDir(this.state.newDirName.toString())
    event.preventDefault()
  }

  // the render function
  render () {
    // destructuring assignment
    const { list, selectedList, selectItem, unSelectItem, deleteItems, setSelected, setNewDir } = this.props
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
              <NewDirItem handleSubmit={this.handleSubmit} handleChange={this.handleChange} style={{ display: this.props.newdir ? 'block' : 'none' }} />
              <ListDirItem dir={list} displayCheckbox={Object.keys(selectedList).length > 0} selectItemEvent={selectItem} unSelectItemEvent={unSelectItem} setNewDir={setNewDir} newdir={this.props.newdir} dirs={this.state.dirs} open={this.state.open} />
            </div>
          </Slide>
        ) : (
          updatedList.map((target, index) => (
            <Slide
              in={!this.state.changingTab}
              direction='right'
              mountOnEnter
              unmountOnExit
              timeout={100}
              key={`slide-${index}`}>
              <ListNoteItem title={target.title} href={target.href} displayCheckbox={Object.keys(selectedList).length > 0} checked={selectedList[target.href.substr(18)]} selectItemEvent={selectItem} unSelectItemEvent={unSelectItem} />
            </Slide>
          ))
        )}
      </List>
    )
  }
}

ListContent.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ListContent)
