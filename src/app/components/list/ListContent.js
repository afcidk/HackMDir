
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

import OperationContainer from '../../containers/OperationContainer.js'
import Collapse from '@material-ui/core/Collapse'

import API from '../../../api/api.js'
import Directory from '../../../api/directory.js'
import ListSubheader from '@material-ui/core/ListSubheader'
import CustomSnackbar from '../CustomSnackbar.js'
import { withSnackbar } from 'notistack'

const styles = theme => ({
  root: {
    width: '320px',
    height: 'calc(100vh - 108px)',
    maxHeight: 'calc(100vh - 108px)',
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
    height: `calc(100vh - 108px)`,
    backgroundColor: 'rgba(0, 0, 0, 0.18)'
  },
  header: {
    padding: '0'
  }
})

const row = ({ index, style, data }) => {
  const { list, selectNote, unSelectNote } = data
  return (
    <div style={style}>
      <ListNoteItem key={`note-${index}`} selectable title={list.filteredNotes[index].title} href={list.filteredNotes[index].href} displayCheckbox={Object.keys(list.selectedNotes).length > 0} checked={!!list.selectedNotes[list.filteredNotes[index].href.substr(18)]} selectNoteEvent={selectNote} unSelectNoteEvent={unSelectNote} />
    </div>
  )
}

class ListContent extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      changingTab: false,
      currentTab: props.tab.current,
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
    const dirNumber = Object.keys(this.props.dir.dirs).filter(target => target.toLocaleLowerCase().indexOf(this.props.dir.searchKey) !== -1).length
    const delay = this.props.tab.current === 'Directory' ? (dirNumber > 0 ? 200 : 0)
      : (this.props.list.filteredNotes.length > 0 ? 200 : 0)
    setTimeout(function () {
      if (tab === 'Directory') {
        // init dir state
        this.props.setDir({ current: result, prev: {} })
        this.props.setNotes([])
      } else {
        // init note state
        this.props.setNotes(result)
        this.props.setDir({ current: [], prev: {} })
      }
      this.setState({
        currentTab: tab,
        changingTab: false
      })
    }.bind(this), delay)
  }

  handleChange (event) {
    this.setState({ newDirName: event.target.value })
  }

  handleSubmit (event) {
    event.preventDefault()
    const status = Directory.newDir(this.state.newDirName.toString())
    if (status) {
      const result = API.getData('directory')
      this.props.setDir({ current: result, prev: this.props.dir.dirs })
      this.props.newDir(this.state.newDirName)
      this.props.setNewDir(false)
    } else {
      this.props.enqueueSnackbar('', {
        children: (key) => (
          <CustomSnackbar id={key} message='You are not allowed to create a directory repeatedly, please enter another name!' />
        )
      })
    }
  }

  handleScroll ({ target }) {
    const { scrollTop } = target
    this.listRef.current.scrollTo(scrollTop)
  }

  // the render function
  render () {
    console.log('ListContent render')
    console.log(this.props)
    // destructuring assignment
    const {
      list, selectNote, unSelectNote,
      dir, setNewDir, setDir, setDirOpen, setDirCheck, setDirNoteCheck,
      deleteDir, renameDir, setIsRenaming, search
    } = this.props
    let filteredDir
    console.log('searching', search)
    if (search) {
      let dirKeys = Object.keys(dir.dirs)
      let matchingKeys = dirKeys.filter((key) => {
        return key.toString().toLocaleLowerCase().indexOf(search) !== -1
      })
      filteredDir = matchingKeys.reduce((obj, key) => {
        obj[key] = dir.dirs[key]
        return obj
      }, {})
      console.log(filteredDir)
    } else {
      filteredDir = dir.dirs
    }

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
              {this.state.currentTab === 'Directory' ? (
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
                    dir={filteredDir} setDirCheck={setDirCheck} setDirNoteCheck={setDirNoteCheck} setDirOpen={setDirOpen} setIsRenaming={setIsRenaming}
                    displayCheckbox={Object.keys(list.selectedNotes).length > 0}
                    selectNoteEvent={selectNote} unSelectNoteEvent={unSelectNote} selectedNotes={list.selectedNotes} renameDir={renameDir} />
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

export default withStyles(styles)(withSnackbar(ListContent))
