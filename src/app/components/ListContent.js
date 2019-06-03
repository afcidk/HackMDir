import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

import List from '@material-ui/core/List'
import ListNoteItem from './ListNoteItem.js'
import ListDirItem from './ListDirItem.js'
import NewDirItem from './NewDirItem.js'
import { FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { Scrollbars } from 'react-custom-scrollbars'

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
    height: `${window.innerHeight - 108}px`,
    maxHeight: `${window.innerHeight - 108}px`,
    position: 'relative',
    overflow: 'auto',
    padding: '0',
    backgroundColor: 'white'
  },
  spinner: {
    display: 'flex',
    justifyContent: 'center',
    justifyItems: 'center',
    alignContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: `${window.innerHeight - 108}px`,
    backgroundColor: 'rgba(0, 0, 0, 0.18)'
  },
  header: {
    padding: '0'
  }
})

const row = ({ index, style, data }) => {
  const { updatedList, selectedList, selectItem, unSelectItem } = data
  return (
    <div style={style}>
      <MemoListNoteItem key={`note-${index}`} title={updatedList[index].title} href={updatedList[index].href} displayCheckbox={Object.keys(selectedList).length > 0} checked={!!selectedList[updatedList[index].href.substr(18)]} selectItemEvent={selectItem} unSelectItemEvent={unSelectItem} />
    </div>
  )
}

class ListContent extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      changingTab: false,
      newDirName: ''
    }

    this.listRef = React.createRef()

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
    // this.handleAddList = this.handleAddList.bind(this)
  }

  componentWillMount () {
    this.fetchData(this.props.tab.current)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.tab.current === nextProps.tab.current) {
      return
    }
    this.fetchData(nextProps.tab.current)
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
    const enterDelay = result.length > 0 ? 100 : 0
    const leaveDealy = this.props.tab.prev === 'Directory' ? (this.props.dirlist.length > 0 ? 100 : 0)
      : (this.props.list.length > 0 ? 100 : 0)
    setTimeout(function () {
      setTimeout(function () {
        if (this.props.tab.current === 'Directory') {
          this.props.setItems([])
          this.props.setDir(result)
          this.props.setDirOpen(new Array(this.props.dirlist.length).fill(false))
        } else {
          this.props.setItems(result)
          this.props.setDir([])
        }
        this.setState({
          changingTab: false
        })
      }.bind(this), enterDelay)
    }.bind(this), leaveDealy)
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

  handleScroll ({ target }) {
    const { scrollTop } = target
    this.listRef.current.scrollTo(scrollTop)
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
      <div className={this.props.classes.root}>
        <Slide
          in={!this.state.changingTab}
          direction='right'
          mountOnEnter
          unmountOnExit
          timeout={100}>
          <List className={this.props.classes.root}>
            <Scrollbars
              onScroll={this.handleScroll}
              autoHide
              autoHideTimeout={1000}
              autoHideDuration={500}>
              <ListSubheader className={this.props.classes.header} key='operation-container'>
                <Collapse in={Object.keys(selectedList).length > 0} mountOnEnter unmountOnExit style={{ transformOrigin: '0 0 0' }} timeout={100}>
                  <OperationContent tab={this.props.tab} list={updatedList} selectedList={selectedList} deleteItemsEvent={deleteItems} setSelectedEvent={setSelected} />
                </Collapse>
              </ListSubheader>
              {this.props.tab.current === 'Directory' ? (
                <div>
                  <div style={{ display: this.props.newdir ? 'block' : 'none' }}>
                    <NewDirItem handleSubmit={this.handleSubmit} handleChange={this.handleChange} />
                  </div>
                  <ListDirItem dir={dirlist} setDir={setDir} dirlistopen={dirlistopen} setDirOpen={setDirOpen} setNewDir={setNewDir} newdir={this.props.newdir} displayCheckbox={Object.keys(selectedList).length > 0} selectItemEvent={selectItem} unSelectItemEvent={unSelectItem} />
                </div>
              ) : (
                <AutoSizer>
                  {
                    ({ height, width }) => {
                      return (
                        <React.Fragment>
                          <FixedSizeList
                            height={height}
                            width={width - 12}
                            ref={this.listRef}
                            itemCount={updatedList.length}
                            itemData={{
                              updatedList,
                              selectedList,
                              selectItem,
                              unSelectItem
                            }}
                            style={{ overflow: false }}
                            itemSize={48}>
                            {row}
                          </FixedSizeList>
                        </React.Fragment>
                      )
                    }
                  }
                </AutoSizer>
              )
              }
            </Scrollbars>
          </List>
        </Slide>
      </div>
    )
  }
}

ListContent.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ListContent)
