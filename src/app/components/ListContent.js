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

import OperationContainer from '../containers/OperationContainer.js'
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
  const { list, selectNote, unSelectNote } = data
  console.log(list)
  return (
    <div style={style}>
      <MemoListNoteItem key={`note-${index}`} selectable title={list.filteredNotes[index].title} href={list.filteredNotes[index].href} displayCheckbox={Object.keys(list.selectedNotes).length > 0} checked={!!list.selectedNotes[list.filteredNotes[index].href.substr(18)]} selectNoteEvent={selectNote} unSelectNoteEvent={unSelectNote} />
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
    // init the list redux state first
    props.initList([])

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
    this.props.setSelectedNotes({})
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
    const leaveDealy = this.props.tab.prev === 'Directory' ? (Object.keys(this.props.dir).length > 0 ? 100 : 0)
      : (this.props.list.length > 0 ? 100 : 0)
    setTimeout(function () {
      setTimeout(function () {
        if (this.props.tab.current === 'Directory') {
          this.props.setNotes([])
          // init dir state
          this.props.setDir({ current: result, prev: {} })
        } else {
          this.props.setNotes(result)
          this.props.setDir({ current: [], prev: {} })
        }
        this.setState({
          changingTab: false
        })
      }.bind(this), enterDelay)
    }.bind(this), leaveDealy)
  }

  handleChange (event) {
    this.setState({ newDirName: event.target.value })
  }

  handleSubmit (event) {
    event.preventDefault()
    const status = Directory.newDir(this.state.newDirName.toString())
    if (status) {
      const result = API.getData('directory')
      this.props.setDir({ current: result, prev: this.props.dir })
      this.props.newDir(this.state.newDirName)
      this.props.setNewDir(false)
    }
  }

  handleScroll ({ target }) {
    const { scrollTop } = target
    this.listRef.current.scrollTo(scrollTop)
  }

  // the render function
  render () {
    console.log('ListContent render')
    console.log(this.props.list)
    // destructuring assignment
    const {
      list, selectNote, unSelectNote,
      dir, setNewDir, setDir, setDirOpen, setDirCheck, setDirNoteCheck,
      deleteDir
    } = this.props
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
                <Collapse in={Object.keys(list.selectedNotes).length > 0} mountOnEnter unmountOnExit style={{ transformOrigin: '0 0 0' }} timeout={100}>
                  <OperationContainer tab={this.props.tab} />
                </Collapse>
              </ListSubheader>
              {this.props.tab.current === 'Directory' ? (
                <div>
                  <Collapse
                    in={this.props.newdir}
                    timeout={100}
                    mountOnEnter
                    unmountOnExit>
                    <NewDirItem handleSubmit={this.handleSubmit} handleChange={this.handleChange} />
                  </Collapse>
                  <ListDirItem
                    setDir={setDir} newdir={this.props.newdir} setNewDir={setNewDir} deleteDir={deleteDir}
                    dir={dir} setDirCheck={setDirCheck} setDirNoteCheck={setDirNoteCheck} setDirOpen={setDirOpen}
                    displayCheckbox={Object.keys(list.selectedNotes).length > 0}
                    selectNoteEvent={selectNote} unSelectNoteEvent={unSelectNote} selectedNotes={list.selectedNotes} />
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
                            itemCount={list.filteredNotes.length}
                            itemData={{
                              list,
                              selectNote,
                              unSelectNote
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
